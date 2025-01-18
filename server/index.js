const express = require("express");
const request = require("request");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5000;

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyRedirectUri = "http://localhost:3000/api/callback";

let accessToken = "";

const generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

app.get("/login", (_, res) => {
  const scope =
    "streaming user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state playlist-read-private playlist-modify-public playlist-modify-private";
  const state = generateRandomString(16);

  const authQueryParams = new URLSearchParams({
    response_type: "code",
    client_id: spotifyClientId,
    scope,
    redirect_uri: spotifyRedirectUri,
    state,
  });

  res.redirect(
    `https://accounts.spotify.com/authorize/?${authQueryParams.toString()}`
  );
});

app.get("/callback", (req, res) => {
  const code = req.query.code;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code,
      redirect_uri: spotifyRedirectUri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${spotifyClientId}:${spotifyClientSecret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      accessToken = body.access_token;
      res.redirect("/");
    } else {
      console.error("Error fetching token:", response?.statusText);
      res.status(500).send("Authentication failed");
    }
  });
});

app.get("/token", (_, res) => res.json({ access_token: accessToken }));

app.get("/refresh_token", (req, res) => {
  const refresh_token = req.query.refresh_token;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${spotifyClientId}:${spotifyClientSecret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "refresh_token",
      refresh_token,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      accessToken = body.access_token;
      refreshToken = body.refresh_token;
      res.json({ access_token: accessToken, refresh_token: refreshToken });
    } else {
      console.error("Error refreshing token:", response?.statusText);
      res.status(500).send("Failed to refresh token");
    }
  });
});

const fetchSpotifyData = async (url, req, res) => {
  try {
    const response = await fetch(url, {
      headers: { Authorization: `${req.headers.authorization}` },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

app.get("/profile", (req, res) =>
  fetchSpotifyData("https://api.spotify.com/v1/me", req, res)
);

app.get("/playlists", (req, res) =>
  fetchSpotifyData("https://api.spotify.com/v1/me/playlists?limit=50", req, res)
);

app.get("/artists/:termIndex", (req, res) => {
  const terms = ["short_term", "medium_term", "long_term"];
  const term = terms[req.params.termIndex];
  if (!term) return res.status(400).json({ error: "Invalid term index" });

  fetchSpotifyData(
    `https://api.spotify.com/v1/me/top/artists?time_range=${term}&limit=50`,
    req,
    res
  );
});

app.get("/tracks/:termIndex", (req, res) => {
  const terms = ["short_term", "medium_term", "long_term"];
  const term = terms[req.params.termIndex];
  if (!term) return res.status(400).json({ error: "Invalid term index" });

  fetchSpotifyData(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${term}&limit=50`,
    req,
    res
  );
});

app.get("/recommendations/:playlistId", async (req, res) => {
  const { playlistId } = req.params;

  try {
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: { Authorization: `${req.headers.authorization}` },
      }
    );

    if (!playlistResponse.ok) {
      throw new Error("Failed to fetch playlist");
    }

    const playlistData = await playlistResponse.json();
    const seedArtistId = playlistData.tracks.items[0]?.track?.artists[0]?.id;
    console.log(seedArtistId);
    if (!seedArtistId)
      return res.status(400).json({ error: "No seed artist found" });

    await fetchSpotifyData(
      `https://api.spotify.com/v1/recommendations?seed_artists=${seedArtistId}&limit=50`,
      req,
      res
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.get("/logout", (_, res) => {
  accessToken = "";
  res.redirect("/");
});

async function playTrack(code, uri, deviceId) {
  const data = {
    uris: [uri],
  };

  await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${code}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}

async function addTracks(playlistId, trackUris) {
  const data = {
    uris: [trackUris],
  };

  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

app.put("/play/:uri/:deviceId", async (req, res) => {
  const { uri, deviceId } = req.params;

  try {
    await playTrack(accessToken, uri, deviceId);
    res.status(200).send("Track started playing");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error playing track");
  }
});

app.post("/addTrack/:playlistId/:trackUris", async (req, res) => {
  const { playlistId, trackUris } = req.params;

  try {
    await addTracks(playlistId, trackUris);
    res.status(200).send("Track started playing");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error playing track");
  }
});

// Start the Server
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
