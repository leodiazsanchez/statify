import { useEffect, useState, useCallback } from "react";
import ArtistCard from "../components/artistCard";
import { fetchArtists } from "../scripts/APIscript";
import { Link } from "react-router-dom";
import Loading from "../components/loading";
import NavTime from "../components/navTime";

function Artists({ accessToken }) {
  const [data, setData] = useState(undefined);
  const [activeTab, setActiveTab] = useState(0);

  const handleClick = (index) => {
    setActiveTab(index);
    getArtists(index)
  };

  const getArtists = (index) => {
    if (accessToken) {
      fetchArtists(accessToken, index).then((data) => {
        setData(data);
      });
    }
  };

  useEffect(() => {
    getArtists(0);
  }, [accessToken]);

  const ArtistList = () => {
    return (
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-4 g-5">
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
          <NavTime handleClick={handleClick}></NavTime>
          <ArtistList />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Artists;
