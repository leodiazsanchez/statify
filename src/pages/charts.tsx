import { useEffect, useRef, useState } from "react";
import { fetchArtists } from "../scripts/APIscript";
import NavTime from "../components/navTime";
import Loading from "../components/loading";
import { useParams } from "react-router-dom";
import { Chart, ChartConfiguration } from "chart.js/auto";

function sortDictByValue(dict: Record<string, number>): Record<string, number> {
  const entries = Object.entries(dict);
  const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
  const sortedDict: Record<string, number> = {};
  sortedEntries.forEach(([key, value]) => {
    sortedDict[key] = value;
  });
  return sortedDict;
}

function Charts({ accessToken }) {
  const { page } = useParams();
  const [data, setData] = useState(undefined);
  const [lables, setLabels] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const genres = [];
  const genreCount: { [key: string]: number } = {};
  const canvasRef = useRef(null); // Create a reference for the canvas
  let sortedDict: Record<string, number>;

  const handleClick = (index) => {
    getArtists(index);
  };

  const getArtists = (index) => {
    if (accessToken) {
      fetchArtists(accessToken, index).then((data) => {
        setData(data);
        data.items.map((artist) => {
          genres.push(...artist.genres);
        });

        genres.forEach((genre) => {
          if (genreCount[genre]) {
            genreCount[genre]++;
          } else {
            genreCount[genre] = 1;
          }
        });

        sortedDict = sortDictByValue(genreCount);

        // Update chart labels and data with sortedDict
        setLabels(Object.keys(sortedDict));
        setGenreData(Object.values(sortedDict));
      });
    }
  };

  useEffect(() => {
    getArtists(0);
  }, [accessToken]);

  function random_rgba(count) {
    let colors = [];
  
    // Function to calculate Euclidean distance between two RGB colors
    function colorDistance(color1, color2) {
      let [r1, g1, b1] = color1;
      let [r2, g2, b2] = color2;
      return Math.sqrt(
        Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
      );
    }
  
    // Generate a random vibrant color
    function generateVibrantColor() {
      var o = Math.round,
        r = Math.random;
      let vibrant = () => o(128 + r() * 127); // RGB values between 128 and 255
      return [vibrant(), vibrant(), vibrant()];
    }
  
    for (let index = 0; index < count; index++) {
      let newColor;
      let maxAttempts = 10; // Limit attempts to find distinct colors
      let attempt = 0;
      do {
        newColor = generateVibrantColor();
        attempt++;
      } while (
        attempt < maxAttempts &&
        colors.some((color) => colorDistance(newColor, color) < 150) // Threshold for similarity
      );
  
      // Add the new color to the array as a string in rgba format
      colors.push(
        `rgba(${newColor[0]},${newColor[1]},${newColor[2]},${(0.7 + Math.random() * 0.3).toFixed(1)})`
      );
    }
  
    return colors;
  }
  

  const dataG = {
    labels: [...lables.slice(0, 10)],
    datasets: [
      {
        label: "Genre Distribution",
        data: [...genreData.slice(0, 10)],
        backgroundColor: [...random_rgba(10)],
        hoverOffset: 4,
      },
    ],
  };

  const config: ChartConfiguration = {
    type: "doughnut",
    data: dataG,
  };

  useEffect(() => {
    if (canvasRef.current) {
      // Check if the ref is not null
      const ctx = canvasRef.current.getContext("2d"); // Get the context of the canvas
      const myChart = new Chart(ctx, config); // Initialize the chart with the context and config

      return () => {
        myChart.destroy(); // Clean up on component unmount
      };
    }
  }, [config]);

  return (
    <>
      {data ? (
        <>
          <NavTime handleClick={handleClick}></NavTime>
          <div className="d-flex justify-content-center">
            <div style={{ width: "400px" }}>
              <canvas ref={canvasRef} id="acquisitions"></canvas>{" "}
              {/* Use ref for canvas */}
            </div>
          </div>
        </>
      ) : (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Loading />
        </div>
      )}
    </>
  );
}

export default Charts;
