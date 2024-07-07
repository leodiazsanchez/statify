import { useEffect, useState } from "react";
import {
  fetchRecommendations,
  playTrack,
  fetchPlaylists,
  fetchPlaylist,
  fetchAvalibleGenres,
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
  const [lastDirection, setLastDirection] = useState();
  const [avalibleGenres, setAvalibleGenres] = useState(undefined);

  useEffect(() => {
    setData();
  }, []);

  async function setData() {
    if (accessToken) {
      await fetchPlaylists(accessToken).then((data) => {
        setPlaylists(data.items);
        handlePlaylist(data.items[0]);
      });

      /*await fetchAvalibleGenres(accessToken).then((data) => {
        setAvalibleGenres(data);
      });*/

      await fetchRecommendations(accessToken, artists_seed()).then((data) => {
        setTracks(data.tracks);
      });
    }
  }

  async function handlePlaylist(playlist) {
    setActivePlaylist(playlist);
    setActivePlaylistSeed(await fetchPlaylist(accessToken, playlist.id));
  }

  // Function to get a random sample from an array
  function getRandomSample<T>(array: T[], sampleSize: number): T[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, sampleSize);
  }

  function artists_seed() {
    const artists: string[] = [];

    try {
      // Assuming fetchPlaylist returns a Promise that resolves to a playlist object

      // Assuming playlist.tracks is an array of track objects
      activePlaylistSeed.tracks.items.map((item: any) => {
        // Assuming track.artists is an array of artist objects, and we want the first artist's name
        item.track.artists.map((artist) => {
          artists.push(artist.name);
        });
      });
      const artistNames = getRandomSample(artists, 6).join(", ");
      console.log(artistNames)
      return artistNames;
    } catch (error) {
      console.error("Error fetching or processing playlist:", error);
      return ""; // or handle error accordingly
    }
  }

  function remove() {
    setTracks((prevTracks) => {
      setPrev(prevTracks[0]); // Set prev to the removed item
      return prevTracks.slice(1); // Remove the first item from tracks
    });
  }

  function back() {
    if (prev !== undefined) {
      setTracks((prevTracks) => [prev, ...prevTracks]);
      setPrev(undefined); // Clear prev after setting it back to tracks[0]
    }
  }

  const swiped = (direction, nameToDelete) => {
    remove();
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    /*console.log(name + " left the screen!");*/
  };

  const CardDeck = () => {
    useEffect(() => {
      if (tracks && playlists) {
        playTrack(accessToken, tracks[0].uri, deviceId);
      }
    }, []);

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
                    {tracks.length > 1 && (
                      <TinderCard
                        className="swipe"
                        key={tracks[1].id} // Use unique key from track id
                        onSwipe={(dir) => swiped(dir, tracks[1].name)}
                        onCardLeftScreen={() => outOfFrame(tracks[1].name)}
                      >
                        <RecommentationCard
                          track={tracks[1]}
                        ></RecommentationCard>
                      </TinderCard>
                    )}
                    <TinderCard
                      className="swipe"
                      key={tracks[0].id} // Use unique key from track id
                      onSwipe={(dir) => swiped(dir, tracks[0].name)}
                      onCardLeftScreen={() => outOfFrame(tracks[0].name)}
                    >
                      <RecommentationCard
                        track={tracks[0]}
                      ></RecommentationCard>
                    </TinderCard>
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
      {(playlists) ? (
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
