import { useEffect, useRef, useState } from "react";
import NavTime from "../components/navTime";
import Loading from "../components/loading";
import { useParams } from "react-router-dom";
import { Chart, ChartConfiguration } from "chart.js/auto";
import {
  GenreCount,
  randomColors,
  sortDictByValue,
} from "../scripts/helperFunctions";
import { Colors } from "chart.js";

function Charts() {
  const { page } = useParams<{ page: string }>();
  const [artists, setArtists] = useState<any[] | undefined>(undefined);
  const [labels, setLabels] = useState<string[]>([]);
  const [genreData, setGenreData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  Chart.register(Colors);
  const accessToken = "";

  const fetchAndProcessArtists = async (index: number) => {
    try {
      // Fetching from the Express server instead of directly from Spotify
      const res = await fetch(`/auth/artists/${index}`);

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const json = await res.json(); // Parse response as JSON
      setArtists(json.artists);

      const genres: string[] = json.artists.items.flatMap((artist: any) =>
        artist.genres.map((genre: string) =>
          genre
            .split(" ")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        )
      );
      const genreCount: GenreCount = genres.reduce(
        (count: GenreCount, genre: string) => {
          count[genre] = (count[genre] || 0) + 1;
          return count;
        },
        {}
      );

      const sortedGenres = sortDictByValue(genreCount);
      setLabels(Object.keys(sortedGenres));
      setGenreData(Object.values(sortedGenres));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAndProcessArtists(0);
  }, [accessToken]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const chartConfig: ChartConfiguration = {
          type: "doughnut",
          data: {
            labels: labels.slice(0, 3),
            datasets: [
              {
                label: "Genre Distribution",
                data: genreData.slice(0, 3),
                hoverOffset: 4,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                labels: {
                  color: "white", // Change legend label color
                  font: {
                    size: 16,
                    family: "Arial",
                    weight: "bold",
                  },
                },
              },
              tooltip: {
                titleFont: {
                  size: 16,
                  weight: "bold",
                },
                bodyFont: {
                  size: 14,
                },
                backgroundColor: "black", // Tooltip background color
                borderColor: "black",
                borderWidth: 1,
              },
            },
          },
        };

        const chartInstance = new Chart(ctx, chartConfig);

        return () => {
          chartInstance.destroy(); // Clean up on component unmount
        };
      }
    }
  }, [labels, genreData]);

  const handleClick = (index: number) => {
    fetchAndProcessArtists(index);
  };

  return (
    <>
      {artists ? (
        <>
          <h2 className="text-center text-capitalize mt-3">{"Top " + page}</h2>
          <NavTime handleClick={handleClick} />
          <div className="d-flex justify-content-center">
            <div style={{ width: "400px" }}>
              <canvas
                ref={canvasRef}
                id="genreChart"
                className="text-capitalize"
              />
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
