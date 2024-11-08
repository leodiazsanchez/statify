export async function fetchAvalibleGenres(code: string): Promise<any> {
  const result = await fetch(
    `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${code}` },
    }
  );

  return await result.json();
}

/*export async function recommendationSeeds(code: string) {
  const artists = await fetchArtists(code, 2);
  const artistIds = artists.items.slice(0, 2).map((artist: any) => artist.id);
  const seed_artists = artistIds.join(",");

  const genres = artists.items
    .slice(0, 2)
    .map((artist: { genres: string[] }) => artist.genres)
    .reduce((acc, genres) => acc.concat(genres), []);
  // Remove duplicates by converting to a Set and then back to an array
  const uniqueGenres = Array.from(new Set(genres));

  // Fetch available genres
  const availableGenres = await fetchAvalibleGenres(code);

  // Filter unique genres based on available genres
  const filteredGenres = uniqueGenres.filter((genre) =>
    availableGenres.genres.includes(genre)
  );

  // Limit the number of genres to 5
  let limitedGenres = filteredGenres.slice(0, 5);

  // Check if limitedGenres is empty
  if (limitedGenres.length === 0) {
    limitedGenres = ["pop", "rap"];
  }

  // Join genres into a single comma-separated string
  const seed_genres = limitedGenres.join(",");

  const tracks = await fetchTracks(code, 1);
  const randomIndex = Math.floor(Math.random() * 20);
  const seed_track = tracks.items[randomIndex].id;

  return { seed_artists, seed_genres, seed_track };
}

export async function fetchRecommendations(
  code: string,
  seed_artists: string
): Promise<any> {
  const seed_artists = (await recommendationSeeds(code)).seed_artists;
  const seed_genres = (await recommendationSeeds(code)).seed_genres;
  const seed_track = (await recommendationSeeds(code)).seed_track;
  const result = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_artists=${seed_artists}&limit=50`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${code}` },
    }
  );

  return await result.json();
}*/

//https://api.spotify.com/v1/recommendations?seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_track}


export async function addTracks(
  code: string,
  playlist_id: string,
  uris: string
): Promise<any> {
  const data = {
    uris: uris, // Directly pass the uris array
  };

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${uris}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${code}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error adding tracks: ${errorData.error.message}`);
  }

  return response.json();
}


