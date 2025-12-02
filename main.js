const UserBtn = document.getElementById("search-usr-btn");
const UserSearchInput = document.getElementById("search-usr-input");
const DataDisplay = document.getElementById("data-display");

const chessCall = async () => {
    if (UserSearchInput.value === "") {
        DataDisplay.innerHTML = "Enter a user that is registered on Chess.com.";
        setTimeout(() => (DataDisplay.innerHTML = ""), 3000);
        return;
    }

    const username = UserSearchInput.value.toLowerCase();

    // Fetch profile
    const profileRes = await fetch(`https://api.chess.com/pub/player/${username}`);
    const profile = await profileRes.json();

    // Fetch stats
    const statsRes = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
    const stats = await statsRes.json();

    // Fetch online status
    const onlineRes = await fetch(`https://api.chess.com/pub/player/${username}/is-online`);
    const onlineData = await onlineRes.json();

    // Fetch last archives
    const archiveRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
    const archiveData = await archiveRes.json();

    let lastGame = "Not available";

    if (archiveData.archives && archiveData.archives.length > 0) {
        const latestMonthURL = archiveData.archives[archiveData.archives.length - 1];
        const monthRes = await fetch(latestMonthURL);
        const monthGames = await monthRes.json();

        if (monthGames.games && monthGames.games.length > 0) {
            lastGame = monthGames.games[monthGames.games.length - 1].url;
        }
    }

    // Avatar fallback
    const avatar = profile.avatar ? profile.avatar : "default.png";

    // Extract stats safely
    const rapid = stats.chess_rapid || {};
    const blitz = stats.chess_blitz || {};
    const bullet = stats.chess_bullet || {};
    const tactics = stats.tactics || {};

    const recordRapid = rapid.record || {};
    const recordBlitz = blitz.record || {};
    const recordBullet = bullet.record || {};

    DataDisplay.innerHTML = `
        <h2>${profile.username}</h2>
        <img src="${avatar}" width="120" style="border-radius: 50%">

        <p><b>Online:</b> ${onlineData.online ? "🟢 Online" : "🔴 Offline"}</p>

        <h3>ELO Ratings</h3>
        <p>Rapid: ${rapid.last?.rating || "N/A"}</p>
        <p>Blitz: ${blitz.last?.rating || "N/A"}</p>
        <p>Bullet: ${bullet.last?.rating || "N/A"}</p>

        <h3>Records</h3>
        <p><b>Rapid:</b> ${recordRapid.win || 0}W - ${recordRapid.loss || 0}L - ${recordRapid.draw || 0}D</p>
        <p><b>Blitz:</b> ${recordBlitz.win || 0}W - ${recordBlitz.loss || 0}L - ${recordBlitz.draw || 0}D</p>
        <p><b>Bullet:</b> ${recordBullet.win || 0}W - ${recordBullet.loss || 0}L - ${recordBullet.draw || 0}D</p>

        <h3>Tactics</h3>
        <p>Highest Rating: ${tactics.highest?.rating || "N/A"}</p>
        <p>Lowest Rating: ${tactics.lowest?.rating || "N/A"}</p>

        <h3>Games</h3>
        <p>Last Game: <a href="${lastGame}" target="_blank">View Game</a></p>

        <br>
    `;
};

UserBtn.addEventListener("click", chessCall);
