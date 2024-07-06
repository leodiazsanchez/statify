import { useEffect, useState } from "react";
import Swipeable from "react-swipy";
import {
  fetchRecommendations,
  playTrack,
  fetchPlaylists,
} from "../scripts/APIscript";
import Loading from "../components/loading";
import RecommentationCard from "../components/recommenationCard";
import PlaylistPanel from "../components/playlistPanel";

const Recommendations = ({ accessToken, deviceId }) => {
  const [tracks, setTracks] = useState(undefined);
  const [prev, setPrev] = useState(undefined);
  const [playlists, setPlaylists] = useState(undefined);

  useEffect(() => {
    setData();
  }, [accessToken]);

  async function setData() {
    if (accessToken) {
      await fetchRecommendations(accessToken).then((data) => {
        setTracks(data.tracks);
        console.log(tracks);
      });

      await new Promise((resolve) => setTimeout(resolve, 10000)); // 2000 milliseconds = 2 seconds

      /*await fetchPlaylists(accessToken).then((data) => {
        setPlaylists(data.items);
        console.log(playlists);
      });*/

    }
  }

  function remove() {
    setTracks((prevTracks) => {
      setPrev(prevTracks[0]); // Set prev to the removed item
      return prevTracks.slice(1); // Remove the first item from tracks
    });
  }

  function back() {
    if (prev !== undefined) {
      setTracks((prevTracks) => [prev, ...prevTracks]);
      setPrev(undefined); // Clear prev after setting it back to tracks[0]
    }
  }

  const CardDeck = () => {
    useEffect(() => {
      if (tracks && tracks[0]) {
        playTrack(accessToken, tracks[0].uri, deviceId);
      }
    }, []);

    return (
      <>
        <div className="container-fluid">
          <div className="row flex-nowrap">
            <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
              <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a
                  href="/"
                  className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                >
                  <span className="fs-5 d-none d-sm-inline">Playlists</span>
                </a>
                <ul
                  className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                  id="menu"
                >
                  {playlists &&
                    playlists.map((playlist) => (
                      <div>
                        <img src={playlist.images[0].url}></img>
                        <span>{playlist.name}</span>
                        <span>{playlist.owner.display_name}</span>
                      </div>
                    ))}
                  <li className="nav-item">
                    <a href="#" className="nav-link align-middle px-0">
                      <i className="fs-4 bi-house"></i>{" "}
                      <span className="ms-1 d-none d-sm-inline">Home</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#submenu1"
                      data-bs-toggle="collapse"
                      className="nav-link px-0 align-middle"
                    >
                      <i className="fs-4 bi-speedometer2"></i>{" "}
                      <span className="ms-1 d-none d-sm-inline">Dashboard</span>{" "}
                    </a>
                    <ul
                      className="collapse show nav flex-column ms-1"
                      id="submenu1"
                      data-bs-parent="#menu"
                    >
                      <li className="w-100">
                        <a href="#" className="nav-link px-0">
                          {" "}
                          <span className="d-none d-sm-inline">
                            Item
                          </span> 1{" "}
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link px-0">
                          {" "}
                          <span className="d-none d-sm-inline">
                            Item
                          </span> 2{" "}
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#" className="nav-link px-0 align-middle">
                      <i className="fs-4 bi-table"></i>{" "}
                      <span className="ms-1 d-none d-sm-inline">Orders</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#submenu2"
                      data-bs-toggle="collapse"
                      className="nav-link px-0 align-middle "
                    >
                      <i className="fs-4 bi-bootstrap"></i>{" "}
                      <span className="ms-1 d-none d-sm-inline">Bootstrap</span>
                    </a>
                    <ul
                      className="collapse nav flex-column ms-1"
                      id="submenu2"
                      data-bs-parent="#menu"
                    >
                      <li className="w-100">
                        <a href="#" className="nav-link px-0">
                          {" "}
                          <span className="d-none d-sm-inline">Item</span> 1
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link px-0">
                          {" "}
                          <span className="d-none d-sm-inline">Item</span> 2
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="#submenu3"
                      data-bs-toggle="collapse"
                      className="nav-link px-0 align-middle"
                    >
                      <i className="fs-4 bi-grid"></i>{" "}
                      <span className="ms-1 d-none d-sm-inline">Products</span>{" "}
                    </a>
                    <ul
                      className="collapse nav flex-column ms-1"
                      id="submenu3"
                      data-bs-parent="#menu"
                    >
                      <li className="w-100">
                        <a href="#" className="nav-link px-0">
                          {" "}
                          <span className="d-none d-sm-inline">Product</span> 1
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link px-0">
                          {" "}
                          <span className="d-none d-sm-inline">Product</span> 2
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link px-0">
                          {" "}
                          <span className="d-none d-sm-inline">Product</span> 3
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link px-0">
                          {" "}
                          <span className="d-none d-sm-inline">Product</span> 4
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#" className="nav-link px-0 align-middle">
                      <i className="fs-4 bi-people"></i>{" "}
                      <span className="ms-1 d-none d-sm-inline">Customers</span>{" "}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col py-3">
              <div className="recommendations">
                <div className="recommendations-wrapper">
                  {tracks.length > 0 ? (
                    <div>
                      <Swipeable
                        buttons={({ left, right }) => (
                          <div className="actions d-flex justify-content-between">
                            <button
                              className="btn btn-outline-danger border border-danger border-1 rounded-circle action-btn"
                              onClick={() => {
                                left();
                              }}
                            >
                              <svg
                                width="30px"
                                height="30px"
                                viewBox="0 0 1024 1024"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#000000"
                                stroke="#000000"
                                strokeWidth="0.01024"
                              >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path
                                    fill="#dc3545"
                                    d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
                                  ></path>
                                </g>
                              </svg>
                            </button>
                            <button
                              className="btn btn-outline-warning border border-warning border-1 rounded-circle action-btn"
                              onClick={back}
                            >
                              <svg
                                width="30px"
                                height="30px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#000000"
                                strokeWidth="0.00024000000000000003"
                              >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  {" "}
                                  <path
                                    d="M21.9998 17.5737L21.9998 6.42632C21.9998 4.57895 20.3991 3.41122 19.0966 4.30838L13 8.76844L13 7.12303C13 5.50658 11.5327 4.48482 10.3388 5.26983L2.92136 10.1468C1.69288 10.9545 1.69288 13.0455 2.92135 13.8532L10.3388 18.7302C11.5327 19.5152 13 18.4934 13 16.877V15.2316L19.0966 19.6916C20.3991 20.5888 21.9998 19.4211 21.9998 17.5737Z"
                                    fill="#ffc107"
                                  ></path>{" "}
                                </g>
                              </svg>
                            </button>
                            <button
                              className="btn btn-outline-success border border-success border-1 rounded-circle action-btn"
                              onClick={() => {
                                right();
                              }}
                            >
                              <svg
                                width="30px"
                                height="30px"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#000000"
                              >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  {" "}
                                  <title></title>{" "}
                                  <g id="Complete">
                                    {" "}
                                    <g tracks-name="add" id="add-2">
                                      {" "}
                                      <g>
                                        {" "}
                                        <line
                                          fill="none"
                                          stroke="#198754"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2.4"
                                          x1="12"
                                          x2="12"
                                          y1="19"
                                          y2="5"
                                        ></line>{" "}
                                        <line
                                          fill="none"
                                          stroke="#198754"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2.4"
                                          x1="5"
                                          x2="19"
                                          y1="12"
                                          y2="12"
                                        ></line>{" "}
                                      </g>{" "}
                                    </g>{" "}
                                  </g>{" "}
                                </g>
                              </svg>
                            </button>
                          </div>
                        )}
                        onAfterSwipe={remove}
                      >
                        <RecommentationCard
                          track={tracks[0]}
                        ></RecommentationCard>
                      </Swipeable>
                      {tracks.length > 1 && (
                        <RecommentationCard
                          track={tracks[1]}
                          z-Index={-10}
                        ></RecommentationCard>
                      )}
                    </div>
                  ) : (
                    <Loading></Loading>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      {tracks ? (
        <>
          <CardDeck></CardDeck>
        </>
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
};

export default Recommendations;
