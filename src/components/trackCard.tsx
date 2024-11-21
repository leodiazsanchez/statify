import SkeletonCard from "./skeletonCard";
import { useDevice } from "../providers/deviceProvider";

const TrackCard = ({ track, index, isLoading }) => {
  const { deviceId } = useDevice();
  return (
    <>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <div>
          <div
            className="card h-100 bg-transparent shadow text-white artist zoom"
            onClick={async () => {
              try {
                const res = await fetch(`/api/play/${track.uri}/${deviceId}`, {
                  method: "PUT",
                });

                if (!res.ok) {
                  throw new Error(res.status.toString());
                }
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <img
              className="card-img darken artist-img"
              src={track.album.images[0].url}
              alt={track.name}
            />
            <div className="card-img-overlay">
              <div className="d-flex">
                <div className="details-container">
                  <h4 className="m-0 mb-1 shorten-text">{track.name}</h4>
                  <h5 className="m-0 shorten-text">
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </h5>
                </div>
                <div className="ranking-container">
                  <div className="ranking rounded-circle">
                    <h4 className="m-0">{"#" + index}</h4>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="album shorten-text">{track.album.name}</h5>
                <h5 className="date">
                  {track.album.release_date.substring(0, 4)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrackCard;
