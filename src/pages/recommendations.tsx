import { useEffect, useState } from "react";
import Loading from "../components/loading";
import RecommentationCard from "../components/recommenationCard";
import TinderCard from "react-tinder-card";

const Recommendations = () => {
  const [tracks, setTracks] = useState(undefined);
  const [prev, setPrev] = useState(undefined);
  const [playlists, setPlaylists] = useState(undefined);
  const [activePlaylist, setActivePlaylist] = useState(undefined);

  useEffect(() => {
    fetchPlaylists()
      .then(() => {
        if (playlists?.items?.length > 0) {
          const firstPlaylist = playlists.items[0];
          setActivePlaylist(firstPlaylist);
        }
      })
      .catch((e) => console.error(e));
  }, []); 

  useEffect(() => {
    if (activePlaylist) {
      fetchRecommendedTracks(activePlaylist.id);
    }
  }, [activePlaylist]);

  const fetchRecommendedTracks = async (playlistId) => {
    try {
      const res = await fetch(`/auth/recommendations/${playlistId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const json = await res.json();
      setTracks(json.recommenations);
    } catch (error) {
      console.error(error);
    }
  };

  async function handlePlaylist(playlist) {
    setActivePlaylist(playlist);
  }

  async function fetchPlaylists() {
    try {
      const res = await fetch(`/auth/playlists`);

      if (!res.ok) {
        throw new Error("Failed to fetch playlists");
      }

      const json = await res.json();
      setPlaylists(json.playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
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
      console.log(encodeURIComponent(tracks[0].uri))
      await fetch(`/auth/addTrack/${activePlaylist.id}/${tracks[0].uri}`, {
        method: "POST"
      });
      //console.log(tracks[0].id);
    }
    remove();
  }

  const outOfFrame = (name) => {};

  const CardDeck = () => {
    return (
      <div className="container-fluid">
        <div className="row flex-nowrap align-items-center">
          <div className="playlists col-auto col-md-3 col-xl-3 py-3 px-2 rounded">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white">
              <span className="fs-5 d-none d-sm-inline fw-bold">
                <i className="bi bi-collection me-2"></i> Your Playlists
              </span>
              <div className="row row-cols-1 row-cols-sm-1 row-cols-md-4 row-cols-lg-4 row-cols-xl-4 row-cols-xxl-4 g-3 my-3">
                {playlists &&
                  playlists.items.map((playlist) => (
                    <div key={playlist.id}>
                      <div
                        onClick={() => handlePlaylist(playlist)}
                        className={`card h-100 bg-transparent shadow text-white artist zoom ${
                          activePlaylist?.id === playlist.id ? "active-playlist" : ""
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
                        <RecommentationCard track={tracks[1]}></RecommentationCard>
                      </TinderCard>

                      <TinderCard
                        className="swipe"
                        key={tracks[0].id}
                        onSwipe={(dir) => swiped(dir)}
                        onCardLeftScreen={() => outOfFrame(tracks[0].name)}
                      >
                        <RecommentationCard track={tracks[0]}></RecommentationCard>
                      </TinderCard>
                    </>
                  ) : (
                    <button className="btn btn-danger">Load more</button>
                  )}
                </div>
              </div>
            ) : (
              <Loading></Loading>
            )}
          </div>
        </div>
      </div>
    );
  };

  return <CardDeck></CardDeck>;
};

export default Recommendations;
