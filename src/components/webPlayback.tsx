import { useState, useEffect } from "react";
import { useAuth } from "../providers/authProvider";
import { useDevice } from "../providers/deviceProvider";

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
  const { token } = useAuth();
  const { setDeviceId } = useDevice();

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
        setDeviceId(device_id);
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
  }, [token]);

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
      <div className="player fixed-bottom rounded col-8 col-md-6 col-lg-4 col-xl-3 col-xxl-2">
        <div className="main-wrapper d-flex align-items-center justify-content-between gap-3">
          <div className="now-playing d-flex align-items-center flex-grow-1">
            <img
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
            />
            <div className="now-playing__info d-flex flex-column justify-content-center ms-3">
              <div className="now-playing__name shorten-text">
                {current_track.name}
              </div>
              <div className="now-playing__artist shorten-text">
                {current_track.artists[0].name}
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-end">
            <div className="now-playing__controls">
              <button
                className="btn-spotify"
                onClick={() => {
                  player.togglePlay();
                }}
              >
                {is_paused ? (
                  <i className="bi bi-play-fill fs-3"></i>
                ) : (
                  <i className="bi bi-pause-fill fs-3"></i>
                )}
              </button>
            </div>
          </div>

          {/*<div className="volume-controls d-flex align-items-center justify-content-end mx-3">
            {volume == 0 ? (
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
          </div>*/}
        </div>
        <input
          className="progress-bar"
          type="range"
          min="0"
          max={duration}
          value={position}
          onChange={handleProgressChange}
        />
      </div>
    );
  }
}

export default WebPlayback;
