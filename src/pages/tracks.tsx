import { useEffect, useState } from "react";
import TrackCard from "../components/trackCard";
import { fetchTracks } from "../scripts/APIscript";
import { Link } from "react-router-dom";
import Loading from "../components/loading";
import NavTime from "../components/navTime";

function Tracks({ accessToken, deviceId }) {
  const [data, setData] = useState(undefined);

  const handleClick = (index) => {
    getTracks(index);
  };

  useEffect(() => {
    getTracks(0);
  }, [accessToken]);

  function getTracks(termIndex) {
    if (accessToken) {
      fetchTracks(accessToken, termIndex).then((data) => {
        setData(data);
      });
    }
  }

  const TrackList = () => {
    return (
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-4 g-5 pb-5">
          {data.items.map((track, index = 1) => (
            <TrackCard
              key={track.id}
              token={accessToken}
              deviceId={deviceId}
              track={track}
              index={index + 1}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {data ? (
        <>
          <NavTime handleClick={handleClick}></NavTime>
          <TrackList />
        </>
      ) : (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Loading />
        </div>
      )}
    </>
  );
}

export default Tracks;
