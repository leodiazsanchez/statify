import { useEffect, useState } from "react";
import ArtistCard from "../components/artistCard";
import NavTime from "../components/navTime";
import { useAxiosWithAuth } from "../utils/useAxiosWithAuth";

function Artists() {
  const apiClient = useAxiosWithAuth();
  const [artists, setArtists] = useState(undefined);

  const handleClick = (index) => {
    setArtists(undefined);
    getArtists(index);
  };

  const getArtists = async (index) => {
    try {
      // Fetching from the Express server
      const res = await apiClient.get(`/api/artists/${index}`);
      setArtists(res.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  useEffect(() => {
    getArtists(0); // Fetch artists with default time range on initial render
  }, []);

  const ArtistList = () => {
    const itemsToRender =
      artists && artists.items ? artists.items : Array.from({ length: 50 });

    return (
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-4 g-5 pb-5">
          {itemsToRender.map((item, index) => (
            <ArtistCard
              isLoading={!artists} // Set isLoading based on data availability
              key={artists ? item.id : index} // Use artist.id if data is available, else use index
              artist={artists ? item : null} // Pass artist object or null
              index={index + 1} // Adjust index directly in the mapping
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <NavTime handleClick={handleClick}></NavTime>
      <ArtistList />
    </>
  );
}

export default Artists;
