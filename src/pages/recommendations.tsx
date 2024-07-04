import { useEffect, useState } from "react";
import Swipeable from "react-swipy";
import { fetchRecommendations, playRecommended } from "../scripts/APIscript";
import Loading from "../components/loading";
import RecommentationCard from "../components/recommenationCard";
import WebPlayback from "../components/webPlayback";

const Recommendations = ({ accessToken }) => {
  const [data, setData] = useState(undefined);
  const [prev, setPrev] = useState(undefined);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    getRecommendations();
  }, [accessToken]);

  async function getRecommendations() {
    if (accessToken) {
      await fetchRecommendations(accessToken).then((data) => {
        setData(data.tracks);
      });
    }
  }

  function remove() {
    setData((prevData) => {
      setPrev(prevData[0]); // Set prev to the removed item
      return prevData.slice(1); // Remove the first item from data
    });
  }

  function addToPlaylist() {
    setPlaylist((prevPlaylist) => [...prevPlaylist, data[0]]);
  }

  function back() {
    if (prev !== undefined) {
      setData((prevData) => [prev, ...prevData]);
      setPrev(undefined); // Clear prev after setting it back to data[0]
    }
  }

  const CardDeck = () => {
    useEffect(() => {
      if (data && data[0]) {
        playRecommended(accessToken, data[0].uri);
      }
    }, []);

    return (
      <div className="recommendations">
        <div className="recommendations-wrapper">
          {data.length > 0 ? (
            <div>
              <Swipeable
                buttons={({ left, right }) => (
                  <div className="actions d-flex justify-content-between">
                    <button
                      className="btn btn-outline-danger border border-danger border-1 rounded-circle action-btn"
                      onClick={() => {
                        console.log("Back button clicked");
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
                            <g data-name="add" id="add-2">
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
                <RecommentationCard track={data[0]}></RecommentationCard>
              </Swipeable>
              {data.length > 1 && (
                <RecommentationCard
                  track={data[1]}
                  z-Index={-10}
                ></RecommentationCard>
              )}
            </div>
          ) : (
            <>
              <Loading></Loading>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {data ? (
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
