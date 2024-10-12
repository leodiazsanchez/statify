import { useEffect, useState } from "react";
import TrackCard from "../components/trackCard";
import NavTime from "../components/navTime";

function Tracks() {
  const [data, setData] = useState(undefined);
  const deviceId = "";

  const handleClick = (index) => {
    setData(undefined);
    getTracks(index);
  };

  const getTracks = async (index) => {
    try {
      // Fetching from the Express server instead of directly from Spotify
      const res = await fetch(`/auth/tracks/${index}`);

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const json = await res.json(); // Parse response as JSON
      setData(json.tracks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTracks(0); // Fetch artists with default time range on initial render
  }, []);

  const TrackList = () => {
    const itemsToRender =
      data && data.items ? data.items : Array.from({ length: 50 });
    return (
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-4 g-5 pb-5">
          {itemsToRender.map((item, index) => (
            <TrackCard
              isLoading={!data}
              key={data ? item.id : index}
              track={data ? item : null}
              index={index + 1}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <NavTime handleClick={handleClick}></NavTime>
      <TrackList />
    </>
  );
}

export default Tracks;
