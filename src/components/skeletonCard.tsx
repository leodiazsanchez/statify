const SkeletonCard = () => {
  return (
    <div className="card h-100 bg-transparent shadow text-white artist placeholder ">
      <div
        style={{ height: "300px" }}
        className="card-img darken artist-img w-100"
      >
        <div></div>
      </div>
      <div className="card-img-overlay">
        <div className="text-container">
          <div className="details-container">
            <div className="m-0 mb-1 d-flex justify-content-between">
              <div>
                <p>
                  <span className="placeholder col-6"></span>
                </p>
              </div>

              <div>
                <span
                  style={{
                    height: "50px",
                    padding: "25px",
                    borderRadius: "50%",
                  }}
                  className="placeholder col-2 placeholder-lg"
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h5 className="album shorten-text placeholder-glow">
            <span className="placeholder col-5"></span>
          </h5>
          <h5 className="date placeholder-glow">
            <span className="placeholder col-3"></span>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
