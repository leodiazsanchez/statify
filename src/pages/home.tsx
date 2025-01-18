import { ReactComponent as ArtistIcon } from "../svgs/artist.svg";
import { ReactComponent as TracksIcon } from "../svgs/tracks.svg";
import { ReactComponent as GenreIcon } from "../svgs/genres.svg";

function Home() {
  return (
    <div className="container-fuild mt-md-5">
      <div className="row">
        <div className="col-12">
          <div>
            <h1 className="mb-4 text-center text-accent">
              Dive Into Your Spotify Music Insights
            </h1>
            <hr className="w-50 mx-auto"></hr>
            <p className="lead text-center">
              Learn more about your favorite artists, tracks, and genres, all in
              one place.
            </p>
          </div>
        </div>
        <div className="col-12 my-5">
          <div className="row py-4">
            <div className="col-12 col-xl-4 text-center">
              <ArtistIcon className="icon mb-3" />
              <h5 className="fw-bold text-accent">
                Follow the Artists You Love
              </h5>
              <p className="text-secondary">
                Explore a personalized ranking of your most-loved artists. See
                who's at the top of your list and dive into their Spotify page
                with a single click.
              </p>
            </div>
            <div className="col-12 col-xl-4 text-center">
              <TracksIcon className="icon mb-3" />
              <h5 className="fw-bold text-accent">Listen to Your Top Tracks</h5>
              <p className="text-secondary">
                Revisit the memories connected to your favorite songs and let
                the music transport you back. Simply click and enjoy them
                directly in your browser.
              </p>
            </div>
            <div className="col-12 col-xl-4 text-center">
              <GenreIcon className="icon mb-3" />
              <h5 className="text-accent">Visualize Your Genre Distribution</h5>
              <p className="text-secondary">
                Gain a deeper understanding of how your favorite styles stack up
                with detailed visualization of your genre distribution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
