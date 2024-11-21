export function randomColors(count) {
  let colors = [];

  // Predefined set of normal colors
  const baseColors = [
    [255, 0, 0], // Red
    [0, 0, 255], // Blue
    [255, 255, 0], // Yellow
    [0, 255, 0], // Green
    [255, 165, 0], // Orange
    [128, 0, 128], // Purple
    [0, 255, 255], // Cyan
    [255, 192, 203], // Pink
  ];

  // Function to calculate Euclidean distance between two RGB colors
  function colorDistance(color1, color2) {
    let [r1, g1, b1] = color1;
    let [r2, g2, b2] = color2;
    return Math.sqrt(
      Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
    );
  }

  // Slightly modify base colors to get some variation
  function modifyBaseColor(color) {
    return color.map((component) =>
      Math.min(255, Math.max(0, component + (Math.random() * 50 - 25)))
    ); // Vary by ±25
  }

  for (let index = 0; index < count; index++) {
    let newColor;
    let maxAttempts = 10; // Limit attempts to find distinct colors
    let attempt = 0;
    do {
      // Pick a random base color and modify it slightly
      const randomBaseColor =
        baseColors[Math.floor(Math.random() * baseColors.length)];
      newColor = modifyBaseColor(randomBaseColor);
      attempt++;
    } while (
      attempt < maxAttempts &&
      colors.some((color) => colorDistance(newColor, color) < 100) // Threshold for similarity
    );

    // Add the new color to the array as a string in rgba format
    colors.push(
      `rgba(${newColor[0]},${newColor[1]},${newColor[2]},${(
        0.7 +
        Math.random() * 0.3
      ).toFixed(1)})`
    );
  }

  return colors;
}

export interface GenreCount {
  [key: string]: number;
}

export function sortDictByValue(dict: GenreCount): GenreCount {
  return Object.entries(dict)
    .sort(([, a], [, b]) => b - a)
    .reduce((sortedDict, [key, value]) => {
      sortedDict[key] = value;
      return sortedDict;
    }, {} as GenreCount);
}
