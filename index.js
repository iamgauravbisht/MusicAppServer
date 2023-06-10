require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
var cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/auth", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        expires_in: data.body.expires_in,
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
      });
    })
    .catch((err) => {
      // console.log("Something went wrong!", err);
      // res.sendStatus(400);
    });
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        expires_in: data.body.expires_in,
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
      });
    })
    .catch((err) => {
      console.log("refresh", err);
      res.sendStatus(400);
    });
});
app.listen(process.env.port || 3001);
