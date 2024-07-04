function Home() {
  return (
    <>
      <header className="text-white text-center py-5">
        <div className="container">
          <h1 className="display-4">Spotify Analytics <i className="bi bi-bar-chart accent"></i></h1>
          <p className="lead">The Ultimate Music Data Experience</p>
        </div>
      </header>

      <section className="container my-5">
        <h2 className="text-center mb-4">Why Spotify Analytics?</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body bg-dark text-light">
                <h5 className="card-title">Real-Time Insights</h5>
                <p className="card-text">
                  Stay ahead of the curve with live data feeds that update
                  faster than your favorite DJ can drop the bass.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body bg-dark text-light">
                <h5 className="card-title">Deep Dive Data</h5>
                <p className="card-text">
                  Ever wondered how many times a day people in Tokyo stream
                  lo-fi hip hop while sipping matcha lattes? Our granular
                  analytics can tell you that and much more.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body bg-dark text-light">
                <h5 className="card-title">Artist Intelligence</h5>
                <p className="card-text">
                  For artists, Spotify Analytics is like having a backstage pass
                  to their fans' hearts. Customize your setlists based on
                  real-time crowd preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Features That Sing</h2>
          <div className="row">
            <div className="col-md-6 mb-4">
              <h5>Genre Galaxy</h5>
              <p>
                Navigate the cosmos of music genres with our interactive Genre
                Galaxy. See how genres intersect, influence each other, and
                evolve over time.
              </p>
            </div>
            <div className="col-md-6 mb-4">
              <h5>Mood Mapping</h5>
              <p>
                Understand how music affects emotions with our Mood Mapping
                tool. Correlate songs with feelings and discover the ultimate
                soundtrack for any mood.
              </p>
            </div>
            <div className="col-md-6 mb-4">
              <h5>Trend Tracking</h5>
              <p>
                From viral sensations to timeless classNameics, track the rise
                and fall of musical trends. Predict what's next and stay ahead
                in the ever-changing music landscape.
              </p>
            </div>
            <div className="col-md-6 mb-4">
              <h5>Fan Demographics</h5>
              <p>
                Get to know your audience like never before. Detailed
                demographic data helps you understand who your fans are, where
                they're from, and what they love.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
