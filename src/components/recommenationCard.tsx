function RecommentationCard({ track }) {
  return (
    <div className="recommendation">
    <div
      className="card h-100 bg-transparent shadow text-white artist"
    >
      <img
        className="card-img darken artist-img"
        src={track.album.images[0].url}
        alt={track.name}
      />
      <div className="card-img-overlay">
        <div className="text-container">
          <div className="details-container">
            <h4 className="m-0 mb-1 shorten-text">{track.name}</h4>
            <h5 className="m-0 shorten-text">
              {track.artists.map((artist) => artist.name).join(", ")}
            </h5>
          </div>
        </div>
        <div>
          <h5 className="album shorten-text">{track.album.name}</h5>
          <h5 className="date">{track.album.release_date.substring(0, 4)}</h5>
        </div>
      </div>
    </div>
  </div>
  );
}

export default RecommentationCard;
