const fs = require('fs');
const Papa = require('papaparse');

// Read the CSV file
const fileContent = fs.readFileSync('recommendations.csv', 'utf8');

// Parse the CSV content
const { data } = Papa.parse(fileContent, { header: true });

// Extract movie name and year from each row
const movies = data.map((row) => {
  const movie = row.Movie.trim();
  const year = row.Year ? row.Year.match(/\d+/)[0] : '';
  return { movie, year };
});

// Convert the movies array to JSON
const jsonOutput = JSON.stringify(movies, null, 2);

// Display the JSON output
console.log(jsonOutput);
