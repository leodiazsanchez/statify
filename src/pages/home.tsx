import Footer from "../components/footer";
import Logo from "../logo.png";

function Home() {
  return (
    <>
      <header className="text-white text-center py-5">
        <div className="container">
          <h1 className="display-3">
            <span className="brand-font">Statify </span>
            <img
              src={Logo}
              alt="logo"
              style={{ width: "80px", height: "80px" }}
            />
          </h1>
          <p className="lead">
            The Ultimate Music Experience, Tailored to Your Vibes
          </p>
          <div className="card h-100 col-12 col-lg-5 m-auto">
            <div className="card-body bg-dark text-light">
              <h5 className="card-title">
                Sign in with your Spotify Premium Account{" "}
                <i className="bi bi-spotify text-accent"></i>
              </h5>
              <p className="card-text">
                Access music statistics and recommendations, crafted just for
                you.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="container my-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body bg-dark text-light">
                <h5 className="card-title">
                  Track Your Top Artists, Genres & Tracks{" "}
                  <i className="bi bi-stars mb-3 text-warning"></i>
                </h5>
                <p className="card-text">
                  See your top artists, genres, and tracks throughout the year.
                  Statify makes it easy to keep track of your musical journey.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body bg-dark text-light">
                <h5 className="card-title">
                  Listen to Your Favorite Music{" "}
                  <i className="bi bi-earbuds mb-3 text-light"></i>
                </h5>
                <p className="card-text">
                  Listen to your favorite tracks of the year on Statify by
                  clicking any song in the Top Tracks section.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body bg-dark text-light">
                <h5 className="card-title">
                  Personalized Music Recommendations{" "}
                  <i className="bi bi-music-player mb-3 text-info"></i>
                </h5>
                <p className="card-text">
                  Based on your own music lists, Statify offers smart
                  recommendations for new music that suits your vibe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
