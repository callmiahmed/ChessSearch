♟️ ChessSearch | a Chess.com profile search. 

User Profile Search
A single-page web application designed to quickly retrieve and display comprehensive profile, statistics, and game data for any public user on Chess.com using the official Chess.com Public API.

💡 Overview
This tool allows users to enter a Chess.com username and instantly load a rich, detailed summary of that player's activity. It aggregates data from multiple API endpoints to provide a holistic view of the player's performance, current status, and recent games.

✨ Features
The application fetches and presents the following key information about a player:

👤 Profile Information
Avatar and Username: Displays the player's profile picture and username.

Title and Country: Shows their official FIDE or Chess.com title (e.g., GM, NM) and their country.

Online Status: Indicates whether the player is currently Online or Offline (live data).

Social & Activity: Displays their follower count, the year they Joined Chess.com, and the time of their Last Seen activity.

Badges: Lists any titles or status badges associated with the account.

📊 Ratings and Records
The application retrieves the latest rating and full win/loss/draw record for the following game types:

Rapid Chess

Blitz Chess

Bullet Chess

Tactics Rating (Puzzle rating)

⚪⚫ Piece Performance
Calculates and displays the combined lifetime record (Win / Loss / Draw) aggregated from Rapid, Blitz, and Bullet games, broken down by:

White Record: Performance when playing as White.

Black Record: Performance when playing as Black.

📈 Rating Chart
A dynamic line chart powered by Chart.js that visually compares the player's current Rapid, Blitz, and Bullet ratings.

📜 Recent Games & Openings
Recent Games List: Fetches the last 15 games played from the user's latest archive and lists the opponent and the date/time the game ended.

Top Openings: Analyzes the last 30 games to determine and list the player's Top 10 Most Played Openings, along with the count of games played in each.

🗓️ Activity Heatmap
A simple heatmap visualization of the player's activity, showing the intensity (number of games played) for the past 50 active days.

🛠️ How It Works
The application is built using Vanilla JavaScript, HTML, and CSS. It relies heavily on asynchronous data fetching to pull information from the following Chess.com Public API endpoints:

/player/{username}: For basic profile details.

/player/{username}/is-online: For the real-time online status.

/player/{username}/stats: For all time-control ratings and W/L/D records.

/player/{username}/games/archives: To get a list of all game archive URLs.

{archive_url}: Fetches the actual game data from the most recent archive for game analysis.

🚀 Usage
Using the Chess.com Profile Search is straightforward:

Launch the application by opening the index.html file in your web browser.

Locate the Search Input: Find the input field designed for the username.

Enter a Username: Type the exact Chess.com username of the player you wish to search for.

Initiate Search:

Click the Search Button, OR

Press the Enter key while the input field is focused.

The application will then load and display all available profile and statistics data for that user.
