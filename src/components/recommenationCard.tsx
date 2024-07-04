function RecommentationCard({ track }) {
  return (
    <div className="card bg-black text-white swipeable-cards">
      <img
        className="card-img-top darken shadow"
        src={track.album.images[1].url}
        alt="Card image cap"
      />
      <div className="card-img-overlay d-flex flex-column justify-content-between mx-2 my-2">
        <div>
          <h4 className="card-title">{track.name}</h4>
          <h5 className="card-title">{track.artists[0].name}</h5>
        </div>
        <div>
          <h5 className="album">{track.album.name}</h5>
          <h5 className="date">{track.album.release_date.substring(0, 4)}</h5>
        </div>
      </div>
      <div className="bg-black fade"></div>
    </div>
  );
}

export default RecommentationCard;
