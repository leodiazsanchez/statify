import { useEffect, useState } from "react";
import TrackCard from "../components/trackCard";
import NavTime from "../components/navTime";
import { useAxiosWithAuth } from "../utils/useAxiosWithAuth";

function Tracks() {
  const [data, setData] = useState(undefined);
  const apiClient = useAxiosWithAuth();

  const handleClick = (index) => {
    setData(undefined);
    getTracks(index);
  };

  const getTracks = async (index) => {
    try {
      const res = await apiClient.get(`/api/tracks/${index}`);

      if (res.status !== 200) {
        throw new Error("Failed to fetch profile");
      }

      const json = await res.data; 
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTracks(0); 
  }, []);

  const TrackList = () => {
    const itemsToRender =
      data && data.items ? data.items : Array.from({ length: 50 });
    return (
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
    );
  };

  return (
    <div className="container">
      <NavTime handleClick={handleClick}></NavTime>
      <TrackList />
    </div>
  );
}

export default Tracks;
