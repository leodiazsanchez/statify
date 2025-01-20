# Statify 🎧📊

Statify is a personal project that leverages the Spotify Web API to provide users with an intuitive and user-friendly interface for exploring their Spotify trends and data.

## Features

- **Track Your Top Artists, Genres & Tracks**
  Explore your favorite artists, genres, and tracks from the past year.

- **Listen to Your Favorite Music**
  Listen to your favorite tracks by clicking any song in the Top Tracks section. This feature utilizes the Spotify Web Playback SDK.

## Run Locally

To set up and run the project locally, follow these steps:

1. **Install Dependencies**  
   Ensure you have Node.js installed, then run the following command to install the project dependencies:  
   ```bash
   npm install
2. **Set Environment Variables**  
  Create a `.env` file in the root directory of the project. Add the following variables to the file:

   ```env
   SPOTIFY_CLIENT_ID=<your_spotify_client_id>
   SPOTIFY_CLIENT_SECRET=<your_spotify_client_secret>
3. **Run the Application**
   ```bash
   npm run dev
- The frontend will run on port 3000.
- The backend will run on port 5000.
