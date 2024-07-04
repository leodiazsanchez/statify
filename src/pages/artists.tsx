import { useEffect, useState, useCallback } from "react";
import ArtistCard from "../components/artistCard";
import { fetchArtists } from "../scripts/APIscript";
import { Link } from "react-router-dom";
import Loading from "../components/loading";


function Artists({ accessToken }) {
  const [data, setData] = useState(undefined);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
    getArtists(index);
  };

  const getArtists = useCallback((termIndex) => {
    if (accessToken) {
      fetchArtists(accessToken, termIndex).then((data) => {
        setData(data);
      });
    }
  }, [accessToken]);

  useEffect(() => {
    getArtists(0);
  }, [accessToken, getArtists]);


  const ArtistList = () => {
    return (
      <div className="">
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-5">
          {data.items.map((artist, index = 1) => (
            <ArtistCard key={artist.id} artist={artist} index={index + 1} />
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
                to="/artists"
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
                to="/artists"
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
                to="/artists"
              >
                1 Year
              </Link>
            </li>
          </ul>
          <ArtistList />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Artists;
