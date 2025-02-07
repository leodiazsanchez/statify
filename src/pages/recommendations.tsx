import { useEffect, useState } from "react";
import Loading from "../components/loading";
import RecommendationCard from "../components/recommenationCard";
import TinderCard from "react-tinder-card";
import { useAxiosWithAuth } from "../utils/useAxiosWithAuth";
import { useDevice } from "../providers/deviceProvider";

const Recommendations = () => {
  const [tracks, setTracks] = useState([]);
  const [prevTrack, setPrevTrack] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);
  const { deviceId } = useDevice();
  const apiClient = useAxiosWithAuth();

  useEffect(() => {
    const init = async () => {
      await fetchPlaylists();
    };

    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (activePlaylist) {
        setTracks([]);
        await fetchRecommendedTracks(activePlaylist.id);
      }
    };

    init();
  }, [activePlaylist]);

  useEffect(() => {
    const init = async () => {
      if (activeTrack) {
        await playTrack();
      }
    };

    init();
  }, [activeTrack]);

  const fetchPlaylists = async () => {
    try {
      const res = await apiClient.get(`/api/playlists`);
      if (res.status !== 200) throw new Error("Failed to fetch playlists");
      const data = await res.data;
      setPlaylists(data.items);
      if (data.items.length > 0) setActivePlaylist(data.items[0]);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const playTrack = async () => {
    try {
      await apiClient.put(`/api/play/${activeTrack.uri}/${deviceId}`);
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
      setActiveTrack(data.tracks[0]);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const removeTrack = () => {
    setTracks((prevTracks) => {
      const updatedTracks = prevTracks.slice(1);
      setActiveTrack(updatedTracks[0]);
      return updatedTracks;
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

  const PlayListsGrid = () => {
    if (!playlists || playlists.length === 0) {
      return <p>No playlists available.</p>; 
    }

    return (
      <div className="row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-3 row-cols-xl-4 g-3">
        {playlists
          .filter((playlist) => playlist && playlist.id) 
          .map((playlist) => (
            <div key={playlist.id}>
              <div
                className={`card h-100 bg-transparent shadow text-white ${
                  activePlaylist?.id === playlist.id ? "active-playlist" : ""
                }`}
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                data-bs-target="#offcanvasBottom"
                onClick={() => setActivePlaylist(playlist)}
              >
                <img
                  src={playlist.images[0]?.url || "default-image.jpg"} 
                  alt={playlist.name || "Unnamed Playlist"} 
                  className="card-img playlist-image w-100 h-100 darken-pl"
                />
                <div className="card-img-overlay p-1 justify-content-end">
                  <div>
                    <h5 className="playlist shorten-text-pl">
                      {playlist.name || "Unnamed Playlist"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  const PlaylistSelector = () => (
    <div className="playlists col-xxl-3 col-lg-5 col-md-12 col-sm-12 px-2 rounded w-100">
      <div className="d-flex flex-column px-3 pt-2 text-white">
        <span className="fs-5 fw-bold">
          Playlists <i className="bi bi-collection-play"></i>
        </span>
        <div className="py-2">
          <PlayListsGrid></PlayListsGrid>
        </div>
      </div>
    </div>
  );

  const TrackCards = () => (
    <>
      {tracks.length > 0 ? (
        tracks
          .slice(0, 2)
          .reverse()
          .map((track) => (
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
    </>
  );

  const OffCanvas = () => (
    <>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-outline-light w-50"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasBottom"
          aria-controls="offcanvasBottom"
        >
          <i className="bi bi-arrow-bar-up"></i>
        </button>
      </div>

      <div
        className="offcanvas offcanvas-bottom h-75 bg-theme-dark"
        id="offcanvasBottom"
        data-bs-theme="dark"
        aria-labelledby="offcanvasBottomLabel"
      >
        <div className="offcanvas-header">
          <h5
            className="offcanvas-title text-light"
            id="offcanvasScrollingLabel"
          >
            Playlists <i className="bi bi-collection-play"></i>
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <PlayListsGrid />
        </div>
      </div>
    </>
  );

  return (
    <>
      {playlists.length > 0 ? (
        <div className="d-flex flex-column flex-lg-row calc-height-recommendations overflow-hidden">
          <div className="playlists col-xxl-4 col-lg-5 col-md-12 col-sm-12 py-3 px-2 rounded order-1 d-none d-lg-block">
            <PlaylistSelector></PlaylistSelector>
          </div>
          <div className="d-lg-none order-1">
            <OffCanvas></OffCanvas>
          </div>

          <div className="col d-flex align-items-center justify-content-center order-0 order-lg-1">
            {tracks.length > 0 ? (
              <TrackCards></TrackCards>
            ) : (
              <Loading spinnerType="grow" />
            )}
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Loading spinnerType="border" />
        </div>
      )}
    </>
  );
};

export default Recommendations;
