const $ = id => document.getElementById(id);

const UserBtn = $('search-usr-btn');
const UserSearchInput = $('search-usr-input');

const avatarEl = $('avatar');
const usernameEl = $('username');
const titleAndCountryEl = $('titleAndCountry');
const badgesEl = $('badges');
const onlineStatusEl = $('onlineStatus');
const followersEl = $('followers');
const joinedEl = $('joined');
const lastSeenEl = $('lastSeen');
const whiteRecordEl = $('whiteRecord');
const blackRecordEl = $('blackRecord');
const rapidRatingEl = $('rapidRating');
const blitzRatingEl = $('blitzRating');
const bulletRatingEl = $('bulletRating');
const tacticsRatingEl = $('tacticsRating');
const rapidRecordEl = $('rapidRecord');
const blitzRecordEl = $('blitzRecord');
const bulletRecordEl = $('bulletRecord');
const tacticsRecordEl = $('tacticsRecord');
const recentGamesEl = $('recentGames');
const openingsListEl = $('openingsList');
const heatmapEl = $('heatmap');

const defaultAvatar = "default.png";

// safe access
function safe(obj, path, fallback = "—") {
  try {
    const v = path.split('.').reduce((a, k) => a && a[k], obj);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

const fetchJson = async url => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(url);
  return r.json();
};

const fetchProfile = username => fetchJson(`https://api.chess.com/pub/player/${username}`);
const fetchStats = username => fetchJson(`https://api.chess.com/pub/player/${username}/stats`);
const fetchOnline = username => fetchJson(`https://api.chess.com/pub/player/${username}/is-online`).catch(() => ({ online: false }));
const fetchArchives = username => fetchJson(`https://api.chess.com/pub/player/${username}/games/archives`);
const fetchGamesURL = url => fetchJson(url);

let ratingChart = null;
function drawChart(labels, datasets) {
  const ctx = document.getElementById("ratingChart").getContext("2d");
  if (ratingChart) ratingChart.destroy();

  ratingChart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#fff" } } },
      scales: {
        x: { ticks: { color: "#d9cfc7" } },
        y: { ticks: { color: "#d9cfc7" } }
      }
    }
  });
}

async function loadUser(username) {
  try {
    username = username.toLowerCase().trim();
    const [profile, stats, online, archives] = await Promise.all([
      fetchProfile(username),
      fetchStats(username),
      fetchOnline(username),
      fetchArchives(username)
    ]);

    // Profile
    avatarEl.src = profile.avatar || defaultAvatar;
    usernameEl.textContent = profile.username || username;
    titleAndCountryEl.textContent =
      (profile.title ? profile.title + " · " : "") +
      (profile.country ? profile.country.split("/").pop() : "—");
    followersEl.textContent = profile.followers ?? 0;
    joinedEl.textContent = profile.joined ? new Date(profile.joined * 1000).getFullYear() : "—";
    lastSeenEl.textContent = profile.last_online ? new Date(profile.last_online * 1000).toLocaleString() : "—";
    onlineStatusEl.textContent = online.online ? "Online" : "Offline";

    // Badges
    badgesEl.innerHTML = "";
    if (profile.title) badgesEl.innerHTML += `<div class="badge">${profile.title}</div>`;
    if (profile.status) badgesEl.innerHTML += `<div class="badge">${profile.status}</div>`;

    // Ratings & records
    const categories = ["chess_rapid", "chess_blitz", "chess_bullet", "tactics"];
    const ratingEls = [rapidRatingEl, blitzRatingEl, bulletRatingEl, tacticsRatingEl];
    const recordEls = [rapidRecordEl, blitzRecordEl, bulletRecordEl, tacticsRecordEl];

    categories.forEach((cat, i) => {
      const s = stats[cat];
      ratingEls[i].textContent = safe(s, "last.rating", "—");
      recordEls[i].textContent = s
        ? `W:${safe(s, "record.win", 0)} L:${safe(s, "record.loss", 0)} D:${safe(s, "record.draw", 0)}`
        : "—";
    });

    // Piece performance
    let white = { w:0, l:0, d:0 }, black = { w:0, l:0, d:0 };
    ["chess_rapid","chess_blitz","chess_bullet"].forEach(m => {
      const r = stats[m]?.record || {};
      white.w += r.win_as_white || 0;
      white.l += r.loss_as_white || 0;
      white.d += r.draw_as_white || 0;
      black.w += r.win_as_black || 0;
      black.l += r.loss_as_black || 0;
      black.d += r.draw_as_black || 0;
    });
    whiteRecordEl.textContent = `${white.w} / ${white.l} / ${white.d}`;
    blackRecordEl.textContent = `${black.w} / ${black.l} / ${black.d}`;

    // Last archive & recent games
    const lastArchiveURL = archives.archives.at(-1);
    const archiveData = await fetchGamesURL(lastArchiveURL);
    recentGamesEl.innerHTML = "";
    archiveData.games.slice(-15).reverse().forEach(g => {
      recentGamesEl.innerHTML += `
        <div class="game-item">
          <div>${g.white.username} vs ${g.black.username}</div>
          <small>${new Date(g.end_time * 1000).toLocaleDateString()}</small>
        </div>`;
    });

    // Openings
    let openings = {};
    archiveData.games.slice(-30).forEach(g => {
      const m = g.pgn?.match(/\[Opening "(.*?)"\]/);
      if (m) openings[m[1]] = (openings[m[1]] || 0) + 1;
    });
    openingsListEl.innerHTML =
      Object.keys(openings).length
        ? Object.entries(openings)
            .sort((a,b)=>b[1]-a[1])
            .slice(0,10)
            .map(o => `<div>${o[0]} — <b>${o[1]}</b> games</div>`).join("")
        : "—";

    // Heatmap
    heatmapEl.innerHTML = "";
    const activity = {};
    archiveData.games.forEach(g => {
      const day = new Date(g.end_time * 1000).toDateString();
      activity[day] = (activity[day] || 0) + 1;
    });
    Object.entries(activity).slice(-50).forEach(([day,count])=>{
      const intensity = Math.min(count,5);
      heatmapEl.innerHTML += `<div class="heatcell" style="background:rgba(76,175,80,${intensity/5})"></div>`;
    });

    // Rating chart (using stats, not per-game ratings)
    const labels = [], blitzRatings = [], rapidRatings = [], bulletRatings = [];
    ["chess_blitz","chess_rapid","chess_bullet"].forEach((cat) => {
      const s = stats[cat]?.last?.rating || null;
      if (s !== null) labels.push(cat);
    });
    drawChart(["Blitz","Rapid","Bullet"], [
      { label:"Blitz", data:[stats.chess_blitz?.last?.rating||0], borderColor:"#4CAF50" },
      { label:"Rapid", data:[stats.chess_rapid?.last?.rating||0], borderColor:"#FF9800" },
      { label:"Bullet", data:[stats.chess_bullet?.last?.rating||0], borderColor:"#2196F3" }
    ]);

  } catch(e) {
    console.error(e);
    alert("User not found or Chess.com API error.");
  }
}

UserBtn.onclick = () => {
  const name = UserSearchInput.value.trim();
  if (name) loadUser(name);
};

UserSearchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") UserBtn.click();
});
