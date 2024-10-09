import { useEffect, useState } from "react";
import {
  fetchRecommendations,
  playTrack,
  fetchPlaylists,
  fetchPlaylist,
  addTracks,
} from "../scripts/APIscript";
import Loading from "../components/loading";
import RecommentationCard from "../components/recommenationCard";
import TinderCard from "react-tinder-card";

const Recommendations = ({ accessToken, deviceId }) => {
  const [tracks, setTracks] = useState(undefined);
  const [prev, setPrev] = useState(undefined);
  const [playlists, setPlaylists] = useState(undefined);
  const [activePlaylist, setActivePlaylist] = useState(undefined);
  const [activePlaylistSeed, setActivePlaylistSeed] = useState(undefined);

  useEffect(() => {
    setData();
  }, [accessToken]);

  useEffect(() => {
    if (tracks && playlists) {
      playTrack(accessToken, tracks[0].uri, deviceId);
    }
  }, [tracks]);

  useEffect(() => {
    if (activePlaylistSeed) {
      fetchRecommendationsData();
    }
  }, [activePlaylistSeed]);

  async function setData() {
    if (accessToken) {
      try {
        const playlistData = await fetchPlaylists(accessToken);
        setPlaylists(playlistData.items);
        await handlePlaylist(playlistData.items[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }

  async function handlePlaylist(playlist) {
    setActivePlaylist(playlist);
    const playlistSeed = await fetchPlaylist(accessToken, playlist.id);
    setActivePlaylistSeed(playlistSeed);
    setTracks(undefined);
  }

  async function fetchRecommendationsData() {
    try {
      const recommendationsData = await fetchRecommendations(
        accessToken,
        artists_seed()
      );
      setTracks(recommendationsData.tracks);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  }

  function getRandomSample(arr, sampleSize) {
    const result = new Set();
    while (result.size < sampleSize) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      result.add(arr[randomIndex]);
    }
    return Array.from(result);
  }

  function artists_seed() {
    const artists = [];

    try {
      activePlaylistSeed.tracks.items.map((item) => {
        item.track.artists.map((artist) => {
          artists.push(artist.id);
        });
      });
      const artistIds = getRandomSample(artists, 5).join(",");
      console.log(artistIds);
      return artistIds;
    } catch (error) {
      console.error("Error fetching or processing playlist:", error);
      return "";
    }
  }

  function remove() {
    setTracks((prevTracks) => {
      setPrev(prevTracks[0]);
      return prevTracks.slice(1);
    });
  }

  function back() {
    if (prev !== undefined) {
      setTracks((prevTracks) => [prev, ...prevTracks]);
      setPrev(undefined);
    }
  }

  async function swiped(direction) {
    console.log(direction);
    if (direction === "right") {
      console.log(tracks[0].id);
      await addTracks(
        accessToken,
        activePlaylist.id,
        "spotify:track:" + tracks[0].id
      );
    }
    remove();
  }

  const outOfFrame = (name) => {};

  const CardDeck = () => {

    return (
      <>
        <div className="container-fluid">
          <div className="row flex-nowrap align-items-center">
            <div className="playlists col-auto col-md-3 col-xl-3 py-3 px-2 rounded">
              <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white">
                <span className="fs-5 d-none d-sm-inline fw-bold">
                  <i className="bi bi-collection me-2"></i> Your Playlists
                </span>

                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-4 row-cols-lg-4 row-cols-xl-4 row-cols-xxl-4 g-3 my-3">
                  {playlists &&
                    playlists.map((playlist) => (
                      <div key={playlist.id}>
                        <div
                          onClick={() => handlePlaylist(playlist)}
                          className={`card h-100 bg-transparent shadow text-white artist zoom ${
                            activePlaylist?.id === playlist.id
                              ? "active-playlist"
                              : ""
                          }`}
                        >
                          <img
                            src={playlist.images[0]?.url}
                            alt={playlist.name}
                            className="card-img artist-img playlist-image w-100 h-100"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="col py-3">
              {tracks ? (
                <div className="recommendations">
                  <div className="recommendations-wrapper">
                    {tracks.length > 1 ? (
                      <>
                        <TinderCard
                          className="swipe"
                          key={tracks[1].id}
                          onSwipe={(dir) => swiped(dir)}
                          onCardLeftScreen={() => outOfFrame(tracks[1].name)}
                        >
                          <RecommentationCard
                            track={tracks[1]}
                          ></RecommentationCard>
                        </TinderCard>

                        <TinderCard
                          className="swipe"
                          key={tracks[0].id}
                          onSwipe={(dir) => swiped(dir)}
                          onCardLeftScreen={() => outOfFrame(tracks[0].name)}
                        >
                          <RecommentationCard
                            track={tracks[0]}
                          ></RecommentationCard>
                        </TinderCard>
                      </>
                    ) : (<button className="btn btn-danger"onClick={() => fetchRecommendationsData()}>Load more</button>)}
                  </div>
                </div>
              ) : (
                <Loading></Loading>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      {playlists ? (
        <>
          <CardDeck></CardDeck>
        </>
      ) : (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Recommendations;
