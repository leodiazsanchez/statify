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

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.get("/login", (req, res) => {
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

app.get("/profile", async (req, res) => {
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
    console.log(artists);
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
    console.log(tracks);
    res.json({ tracks: tracks });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

app.get("/logout", (req, res) => {
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
      console.log("Invalid response while fetcing token!", response.statusText);
    }
  });
});

app.get("/token", (req, res) => {
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
