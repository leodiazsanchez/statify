import { useEffect, useState } from "react";
import ArtistCard from "../components/artistCard";
import NavTime from "../components/navTime";

function Artists() {
  const [artists, setArtists] = useState(undefined);

  const handleClick = (index) => {
    setArtists(undefined);
    getArtists(index);
  };

  const getArtists = async (index) => {
    try {
      // Fetching from the Express server instead of directly from Spotify
      const res = await fetch(`/api/artists/${index}`);

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const json = await res.json(); // Parse response as JSON
      setArtists(json);
    } catch (error) {
      console.error(error);
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
