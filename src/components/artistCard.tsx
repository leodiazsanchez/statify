import { Link } from "react-router-dom";
function ArtistCard({ artist, index }) {
  return (
    <Link to={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
      <div className="card bg-transparent shadow text-white artist zoom square-card">
        <img
          className="card-img darken artist-img"
          src={artist.images[0].url}
          alt={artist.name}
        />
        <div className="card-img-overlay d-flex flex-column justify-content-between mx-2 my-2">
          <div className="d-flex justify-content-between align-items-start">
            <h4 className="m-0 shorten-text">{artist.name}</h4>
            <div className="d-flex ranking justify-content-center align-items-center rounded-circle">
              <h4 className="m-0 ">{"#" + index}</h4>
            </div>
          </div>
          <ul className="list-unstyled d-flex flex-row flex-wrap">
            {artist.genres.slice(0, 3).map((genre) => (
              <li key={genre} className="card-text">
                <span className="badge fs-6 genre rounded-pill me-2 mb-2 text-capitalize">
                  {genre}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  );
}

export default ArtistCard;
