const SkeletonCard = () => {
  return (
    <div>
      <div className="card h-100 bg-transparent shadow text-white artist zoom square-card">
        <div className="card-img darken artist-img placeholder-glow w-100"></div>
        <div className="card-img-overlay">
          <div className="d-flex">
            <div className="details-container">
              <h4 className="m-0 mb-1 placeholder-glow">
                <span className="placeholder col-8"></span>
              </h4>
              <h5 className="m-0 placeholder-glow">
                <span className="placeholder col-6"></span>
              </h5>
            </div>
            <div className="ranking-container">
              <div
                className="rounded-circle placeholder-glow"
                style={{
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="placeholder"
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                  }}
                ></span>
              </div>
            </div>
          </div>
          <div>
            <h5 className="album placeholder-glow">
              <span className="placeholder col-5"></span>
            </h5>
            <h5 className="date placeholder-glow">
              <span className="placeholder col-3"></span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
