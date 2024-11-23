import { useEffect, useRef, useState } from "react";
import NavTime from "../components/navTime";
import Loading from "../components/loading";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { GenreCount, sortDictByValue } from "../utils/helperFunctions";
import { Colors } from "chart.js";
import { useAxiosWithAuth } from "../utils/useAxiosWithAuth";

function Genres() {
  const [artists, setArtists] = useState<any[] | undefined>(undefined);
  const [labels, setLabels] = useState<string[]>([]);
  const [genreData, setGenreData] = useState<number[]>([]);
  const [indexAxis, setIndexAxis] = useState<"x" | "y">("x"); // Control bar orientation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const numberOfGenres = 20;
  const apiClient = useAxiosWithAuth();

  Chart.register(Colors);

  useEffect(() => {
    fetchAndProcessArtists(0);
    updateChartOrientation();

    // Update orientation on window resize
    window.addEventListener("resize", updateChartOrientation);

    return () => {
      window.removeEventListener("resize", updateChartOrientation);
    };
  }, []);

  const updateChartOrientation = () => {
    const isMobile = window.innerWidth < 1024;
    setIndexAxis(isMobile ? "y" : "x");
  };

  const fetchAndProcessArtists = async (index: number) => {
    try {
      const res = await apiClient.get(`/api/artists/${index}`);
      if (res.status !== 200) {
        throw new Error("Failed to fetch profile");
      }

      const json = await res.data;
      setArtists(json);

      const genres: string[] = json.items.flatMap((artist: any) =>
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
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const chartConfig: ChartConfiguration = {
          type: "bar", // Always use 'bar'
          data: {
            labels: labels.slice(0, numberOfGenres),
            datasets: [
              {
                label: "Genre Distribution",
                data: genreData.slice(0, numberOfGenres),
                backgroundColor: "rgba(29,185,84)",
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis,
            plugins: {
              legend: {
                labels: {
                  color: "white",
                  font: {
                    size: 16,
                    family: "Arial",
                    weight: "bold",
                  },
                },
                onClick: null, // Disable legend interaction
              },
              tooltip: {
                titleFont: {
                  size: 16,
                  weight: "bold",
                },
                bodyFont: {
                  size: 14,
                },
                backgroundColor: "black",
                borderColor: "black",
                borderWidth: 1,
              },
            },
          },
        };

        const chartInstance = new Chart(ctx, chartConfig);

        return () => {
          chartInstance.destroy();
        };
      }
    }
  }, [labels, genreData, indexAxis]);

  const handleClick = (index: number) => {
    setArtists(null);
    fetchAndProcessArtists(index);
  };

  return (
    <>
      <NavTime handleClick={handleClick} />
      {artists ? (
        <div className="col col-lg-10 calc-height-genres position-relative m-auto">
          <canvas
            ref={canvasRef}
            id="genreChart"
            className="text-capitalize d-block w-100 h-100"
          />
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Loading spinnerType="border" />
        </div>
      )}
    </>
  );
}

export default Genres;
