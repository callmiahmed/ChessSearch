> [!WARNING]
> MOST OF THE FEATURES ARE STILL UNERDEVELOPMENT IF AN ERROR OCCURED PLEASE CREATE A PR OR CONTACT ME THE ISSUE.


***

# ♟️ Chess.com User Profile Search

A single-page web application designed to quickly retrieve and display comprehensive profile, statistics, and game data for any public user on Chess.com using the official Chess.com Public API.

---

## 💡 Project Overview

This tool allows users to enter a Chess.com username and instantly load a rich, detailed summary of that player's activity. It aggregates data from multiple API endpoints to provide a holistic view of the player's performance, current status, and recent games.

---

## ✨ Key Features

The application fetches and presents the following key information about a player:

### 👤 Profile & Status

| Detail | Description |
| :--- | :--- |
| **Avatar & Username** | Player's profile picture and username. |
| **Title & Country** | Official titles (e.g., GM, NM) and country affiliation. |
| **Online Status** | Real-time indication of **Online** or **Offline** status. |
| **Social & Activity** | Follower count, **Joined** year, and time of **Last Seen** activity. |
| **Badges** | Lists any status or title badges associated with the account. |

### 📊 Performance & Ratings

| Statistic | Data Displayed |
| :--- | :--- |
| **Ratings & Records** | Latest rating and full **Win / Loss / Draw** record for Rapid, Blitz, Bullet, and Tactics. |
| **Piece Performance** | Combined lifetime record (W/L/D) broken down by **White Record** and **Black Record**. |
| **Rating Chart** | Dynamic visual comparison of current Rapid, Blitz, and Bullet ratings using Chart.js. |

### 📜 Game Analysis

* **Recent Games List:** Shows the last **15 games played** from the latest archive, including opponent and end date.
* **Top Openings:** Analyzes the last **30 games** to list the player's **Top 10 Most Played Openings**, including game counts.
* **Activity Heatmap:** Visualizes game frequency, showing activity intensity over the past **50 active days**.

---

## 🛠️ Technical Details

The application is built using **Vanilla JavaScript**, **HTML**, and **CSS**, relying on the `fetch` API for data retrieval.

### API Endpoints Utilized

The application makes asynchronous calls to the following Chess.com Public API endpoints:

| Endpoint | Purpose |
| :--- | :--- |
| `/player/{username}` | Basic profile, status, and social details. |
| `/player/{username}/is-online` | Real-time presence check. |
| `/player/{username}/stats` | All time-control ratings and record data. |
| `/player/{username}/games/archives` | Retrieves URLs for game history archives. |
| `{archive_url}` | Fetches raw game data (PGNs) for game analysis (Openings, Heatmap). |

> **Note:** The `safe()` utility function is used to handle potentially missing data gracefully, ensuring a robust user experience.

---

## 🚀 Usage

Using the Chess.com Profile Search is straightforward:

1.  **Launch the application** by opening the `index.html` file in your web browser.
2.  **Locate the Search Input:** Find the designated input field for the username.
3.  **Enter a Username:** Type the exact Chess.com username of the player you wish to search for (e.g., `hikaru`, `GarryKasparov`).
4.  **Initiate Search:**
    * Click the **Search Button**, OR
    * Press the **Enter** key while the input field is focused.

The application will immediately fetch and display all available profile and statistics data for that user.
