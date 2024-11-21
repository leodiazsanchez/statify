import { useEffect, useState } from "react";
import Loading from "../components/loading";
import RecommendationCard from "../components/recommenationCard";
import TinderCard from "react-tinder-card";

const Recommendations = () => {
  const [tracks, setTracks] = useState([]);
  const [prevTrack, setPrevTrack] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);

  useEffect(() => {
    const init = async () => {
      await fetchPlaylists();
    };
    init();
  }, []);

  useEffect(() => {
    if (activePlaylist) {
      console.log(
        "Active playlist changed, fetching recommended tracks:",
        activePlaylist.id
      );
      fetchRecommendedTracks(activePlaylist.id);
    } else {
      console.log("No active playlist set yet.");
    }
  }, [activePlaylist]);

  const fetchPlaylists = async () => {
    try {
      const res = await fetch(`/api/playlists`);
      if (!res.ok) throw new Error("Failed to fetch playlists");
      const data = await res.json();
      setPlaylists(data.items || []);
      if (data.items.length > 0) setActivePlaylist(data.items[0]);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const fetchRecommendedTracks = async (playlistId) => {
    try {
      const res = await fetch(`/api/recommendations/${playlistId}`);
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();
      setTracks(data.tracks);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const removeTrack = () => {
    setTracks((current) => {
      setPrevTrack(current[0]);
      return current.slice(1);
    });
  };

  const restoreTrack = () => {
    if (prevTrack) {
      setTracks((current) => [prevTrack, ...current]);
      setPrevTrack(null);
    }
  };

  const handleSwipe = async (direction) => {
    if (direction === "right" && tracks[0]) {
      try {
        const trackUri = encodeURIComponent(tracks[0].uri);
        await fetch(`/api/addTrack/${activePlaylist.id}/${trackUri}`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error adding track:", error);
      }
    }
    removeTrack();
  };

  const PlaylistSelector = () => (
    <div className="playlists col-auto col-md-3 col-xl-3 py-3 px-2 rounded">
      <div className="d-flex flex-column align-items-center px-3 pt-2 text-white">
        <span className="fs-5 fw-bold">
          <i className="bi bi-collection me-2"></i> Your Playlists
        </span>
        <div className="row row-cols-4 g-3 my-3">
          {playlists.map((playlist) => (
            <div key={playlist.id}>
              <div
                className={`card h-100 bg-transparent shadow text-white ${
                  activePlaylist?.id === playlist.id ? "active-playlist" : ""
                }`}
                onClick={() => setActivePlaylist(playlist)}
              >
                <img
                  src={playlist.images[0]?.url}
                  alt={playlist.name}
                  className="card-img playlist-image w-100 h-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TrackCards = () => (
    <div className="recommendations">
      {tracks.length > 1 ? (
        tracks.slice(0, 2).map((track) => (
          <TinderCard
            className="swipe"
            key={track.id}
            onSwipe={handleSwipe}
            onCardLeftScreen={() => {}}
          >
            <RecommendationCard track={track} />
          </TinderCard>
        ))
      ) : (
        <button className="btn btn-danger">Load more</button>
      )}
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap align-items-center">
        <PlaylistSelector />
        <div className="col py-3">
          {tracks.length > 0 ? <TrackCards /> : <Loading />}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
