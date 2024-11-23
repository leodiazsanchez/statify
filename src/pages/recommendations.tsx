import { useEffect, useState } from "react";
import Loading from "../components/loading";
import RecommendationCard from "../components/recommenationCard";
import TinderCard from "react-tinder-card";
import { useAxiosWithAuth } from "../utils/useAxiosWithAuth";

const Recommendations = () => {
  const [tracks, setTracks] = useState([]);
  const [prevTrack, setPrevTrack] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const apiClient = useAxiosWithAuth();

  useEffect(() => {
    const init = async () => {
      await fetchPlaylists();
    };
    init();
  }, []);

  useEffect(() => {
    if (activePlaylist) {
      setTracks([]);
      fetchRecommendedTracks(activePlaylist.id);
    }
  }, [activePlaylist]);

  const fetchPlaylists = async () => {
    try {
      const res = await apiClient.get(`/api/playlists`);
      if (res.status !== 200) throw new Error("Failed to fetch playlists");
      const data = await res.data;
      setPlaylists(data.items || []);
      if (data.items.length > 0) setActivePlaylist(data.items[0]);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const fetchRecommendedTracks = async (playlistId) => {
    try {
      const res = await apiClient.get(`/api/recommendations/${playlistId}`);
      if (res.status !== 200)
        throw new Error("Failed to fetch recommendations");
      const data = await res.data;
      setTracks(data.tracks);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const removeTrack = () => {
    setTracks((prevTracks) => prevTracks.slice(1));
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
      <div className="d-flex flex-column px-3 pt-2 text-white">
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
    <div className="">
      {tracks.length > 0 ? (
        tracks
          .slice(0, 2)
          .reverse()
          .map((track, index) => (
            <TinderCard
              className="swipe-container"
              key={track.id}
              onSwipe={(direction) => handleSwipe(direction)}
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
    <>
      {playlists.length > 0 ? (
        <div className="container-fluid">
          <div className="row flex-nowrap align-items-center">
            <PlaylistSelector />
            <div className="col py-3">
              {tracks.length > 0 ? (
                <TrackCards />
              ) : (
                <Loading spinnerType="grow" />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Loading spinnerType="border" />
        </div>
      )}
    </>
  );
};

export default Recommendations;
