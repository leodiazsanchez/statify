const express = require("express");
const request = require("request");
const dotenv = require("dotenv");
const { access } = require("fs");

const port = 5000;

access_token = "";
refresh_token = "";

dotenv.config();

var spotify_client_id = "e5f9bfa9d40447488e4fc74d2c71d293";
var spotify_client_secret = "be7abe1d68da450a92e9bd87ce439146";

var spotify_redirect_uri = "http://localhost:3000/auth/callback";

var app = express();

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get("/login", (_, res) => {
  var scope =
    "streaming user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state playlist-read-private playlist-modify-public playlist-modify-private";
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

app.get("/profile", async (_, res) => {
  const code = access_token;

  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${code}`,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch profile" });
    }

    const profileData = await response.json();
    return res.json({ profileData: profileData });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/artists/:termIndex", async (req, res) => {
  const { termIndex } = req.params;
  const terms = ["short_term", "medium_term", "long_term"];

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${terms[termIndex]}&limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const artists = await response.json();
    res.json({ artists: artists });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

app.get("/tracks/:termIndex", async (req, res) => {
  const { termIndex } = req.params;
  const terms = ["short_term", "medium_term", "long_term"];

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${terms[termIndex]}&limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const tracks = await response.json();
    res.json({ tracks: tracks });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
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

app.post("/addTrack/:playlistId/:trackUris", async (req, _) =>{
  const { playlistId, trackUris} = req.params
  const data = {
    uris: trackUris, 
  };

  await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackUris}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
});

async function artistSeed(playlistId) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );
  const json = await response.json();
  const seed_artists = (json.tracks.items[0].track.artists[0].id)
  /*const artists = await response.json().items;
  const artistIds = artists.items.slice(0, 2).map((artist) => artist.id);
  const seed_artists = artistIds.join(",");*/
  return seed_artists;
}

app.get("/recommendations/:playlistId", async (req, res) => {
  const { playlistId } = req.params;
  try {
    console.log("playlist", playlistId)
    const seedArtists = await artistSeed(playlistId);
  
    console.log("artists", seedArtists)
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_artists=${seedArtists}&limit=50`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const obj = await response.json();
    const recommenations = obj.tracks;
    res.json({ recommenations: recommenations });
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

app.put("/play/:uri/:deviceId", async (req, res) => {
  const { uri, deviceId } = req.params;

  try {
    await playTrack(access_token, uri, deviceId);
    res.status(200).send("Track started playing");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error playing track");
  }
});

app.get("/playlists", async (_, res) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/playlists?limit=50&offset=0`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const playlists = await response.json();
    res.json({ playlists: playlists });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

app.get("/playlist:playlistId"),
  async (req, res) => {
    const { playlistId } = req.params;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${code}` },
        }
      );
      const playlist = await response.json();
      res.json({ playlists: playlist });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Something went wrong", details: error.message });
    }
  };

app.get("/logout", (_, res) => {
  access_token = "";
  res.redirect("/");
});

app.get("/callback", (req, res) => {
  var code = req.query.code;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect("/");
    } else {
      console.error("Invalid response while fetcing token!", response.statusText);
    }
  });
});

app.get("/token", (_, res) => {
  res.json({ access_token: access_token });
});

app.get("/refresh_token", function (req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
        refresh_token = body.refresh_token;
      res.send({
        access_token: access_token,
        refresh_token: refresh_token,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
