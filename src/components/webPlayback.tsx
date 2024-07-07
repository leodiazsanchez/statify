import React, { useState, useEffect } from "react";

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

  function formatTime(durationMs: number): string {
    // Convert milliseconds to total seconds
    const totalSeconds = Math.floor(durationMs / 1000);

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format the string as minutes:seconds with leading zeros for seconds
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    script.onerror = function () {
      // Prevent the default console output
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

      /*player.getVolume().then((volume) => {
        let volume_percentage = volume * 100;
        setVolume(volume_percentage);
        console.log(`The volume of the player is ${volume_percentage}%`);
      });*/
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
            <div className="now-playing__controls ">
              {/*<button
                className="btn-spotify"
                onClick={() => {
                  player.previousTrack();
                }}
              >
                <i className="bi bi-skip-backward"></i>
              </button>*/}
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
              {/*<button
                className="btn-spotify"
                onClick={() => {
                  player.nextTrack();
                }}
              >
                <i className="bi bi-skip-forward"></i>
              </button>*/}
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
          </div>
        </div>
      </div>
    );
  }
}

export default WebPlayback;
