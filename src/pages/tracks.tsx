import { useEffect, useState } from "react";
import TrackCard from "../components/trackCard";
import { fetchTracks } from "../scripts/APIscript";
import { Link } from "react-router-dom";
import Loading from "../components/loading";

function Tracks({ accessToken }) {
  const [data, setData] = useState(undefined);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
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
      <div className="">
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-5">
          {data.items.map((track, index = 1) => (
            <TrackCard key={track.id} track={track} index={index + 1} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {data ? (
        <>
          <ul className="nav nav-pills m-auto w-100 mb-4 bg-dark">
            <li className="nav-item">
              <Link
                className={`nav-link text-light me-3 border border-white ${
                  activeTab === 0 ? "primary-mid-bg" : ""
                }`}
                onClick={() => handleTabClick(0)}
                to="/tracks"
              >
                4 Weeks
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link text-light me-3 border border-white ${
                  activeTab === 1 ? "primary-mid-bg" : ""
                }`}
                onClick={() => handleTabClick(1)}
                to="/tracks"
              >
                6 Months
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link text-light border border-white ${
                  activeTab === 2 ? "primary-mid-bg" : ""
                }`}
                onClick={() => handleTabClick(2)}
                to="/tracks"
              >
                1 Year
              </Link>
            </li>
          </ul>
          <TrackList />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Tracks;
