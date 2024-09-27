import React, { useState, useEffect } from "react";
import { setTrackPlaying } from "../App";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
  duration_ms: 0,
};

function WebPlayback(props) {
  const { onDeviceIdReady } = props;
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);
  const [volume, setVolume] = useState(30);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  function formatTime(durationMs) {
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    script.onerror = function () {
      return true;
    };

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Spotify Analytics",
        getOAuthToken: (cb) => {
          cb(props.token);
        },
        volume: 0.3,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        if (onDeviceIdReady) {
          onDeviceIdReady(device_id);
        }
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
     
        });
      });

      player.connect(); 
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!is_paused) {
        setPosition((prevPosition) => prevPosition + 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [is_paused]);

  const handleVolumeChange = (e) => {
    let newVolume = e.target.value;
    setVolume(newVolume);
    player.setVolume(newVolume / 100);
  };

  const handleProgressChange = (e) => {
    const newPosition = e.target.value;
    setPosition(newPosition);
    player.seek(newPosition);
  };

  const handleSkipForward = () => {
    player.getCurrentState().then((state) => {
      if (state) {
        const newPosition = state.position + 5000;
        player.seek(newPosition).then(() => {
          setPosition(newPosition);
        });
      }
    });
  };

  const handleSkipBackward = () => {
    player.getCurrentState().then((state) => {
      if (state) {
        const newPosition = state.position - 5000;
        player.seek(newPosition).then(() => {
          setPosition(newPosition);
        });
      }
    });
  };

  if (!is_active) {
    return <></>;
  } else if (current_track) {
    return (
      <div className="player fixed-bottom">
        <div className="main-wrapper d-flex align-items-center justify-content-between">
          <div className="now-playing d-flex align-items-center">
            <img
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
            />
            <div className="now-playing__info d-flex flex-column justify-content-center mx-3">
              <div className="now-playing__name text-truncate">
                {current_track.name}
              </div>
              <div className="now-playing__artist text-truncate">
                {current_track.artists[0].name}
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-center ml-auto">
            <div className="now-playing__controls">
              <button className="btn-spotify" onClick={handleSkipBackward}>
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M13.9099 10.8301H10.8499L10.0898 13.1201H12.3799C13.2199 13.1201 13.9099 13.8001 13.9099 14.6501C13.9099 15.4901 13.2299 16.1801 12.3799 16.1801H10.0898"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.0195 4.46997L11.9995 2"
                    stroke="#1db954"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.90939 7.79974C3.79939 9.27974 3.10938 11.1097 3.10938 13.1097C3.10938 18.0197 7.08939 21.9998 11.9994 21.9998C16.9094 21.9998 20.8894 18.0197 20.8894 13.1097C20.8894 8.19974 16.9094 4.21973 11.9994 4.21973C11.3194 4.21973 10.6594 4.30978 10.0194 4.45978"
                    stroke="#1db954"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                className="btn-spotify mx-2"
                onClick={() => {
                  player.togglePlay();
                }}
              >
                {is_paused ? (
                  <i className="bi bi-play-circle-fill fs-2"></i>
                ) : (
                  <i className="bi bi-pause-circle-fill fs-2"></i>
                )}
              </button>
              <button className="btn-spotify" onClick={handleSkipForward}>
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.98 4.46997L12 2"
                    stroke="#1db954"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19.0894 7.79974C20.1994 9.27974 20.8894 11.1097 20.8894 13.1097C20.8894 18.0197 16.9094 21.9998 11.9994 21.9998C7.08939 21.9998 3.10938 18.0197 3.10938 13.1097C3.10938 8.19974 7.08939 4.21973 11.9994 4.21973C12.6794 4.21973 13.3394 4.30978 13.9794 4.45978"
                    stroke="#1db954"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    opacity="0.4"
                    d="M13.9098 10.8301H10.8498L10.0898 13.1201H12.3798C13.2198 13.1201 13.9098 13.8001 13.9098 14.6501C13.9098 15.4901 13.2298 16.1801 12.3798 16.1801H10.0898"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="progress-bar d-flex flex-row justify-content-between align-items-center mx-auto">
              <span className="me-2 fs-6">{formatTime(position)}</span>
              <input
                type="range"
                min="0"
                max={duration}
                value={position}
                onChange={handleProgressChange}
              />
              <span className="ms-2">
                {formatTime(current_track.duration_ms)}
              </span>
            </div>
          </div>

          <div className="volume-controls d-flex align-items-center justify-content-end mx-3">
            {volume === 0 ? (
              <i className="bi bi-volume-mute fs-4"></i>
            ) : volume < 50 ? (
              <i className="bi bi-volume-down fs-4"></i>
            ) : (
              <i className="bi bi-volume-up fs-4"></i>
            )}
            <input
              type="range"
              className="slider ms-2 accent"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default WebPlayback;

