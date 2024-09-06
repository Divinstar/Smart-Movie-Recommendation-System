document.addEventListener("DOMContentLoaded", function() {
  var recommendButton = document.getElementById("recommend-button");
  var movieInput = document.getElementById("movie-input");

  recommendButton.addEventListener("click", function() {
    var movieName = movieInput.value.trim();

    if (movieName === "") {
      alert("Please enter a movie name.");
      return;
    }

    var data = { movie_name: movieName };

    fetch('generate_recommendations.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            console.log("Recommendations generated successfully!");

            
            setTimeout(function() {
                fetch('recommendations.json')
                    .then(response => response.json())
                    .then(recommendations => {
                        console.log(recommendations);

                       
                        document.getElementById('poster-container').innerHTML = "";

                       
                        recommendations.forEach(movie => {
                            const imdbId = movie.search_results[0].tconst;
                            const movieName = movie.movie;

                            const options = {
                                method: 'GET',
                                headers: {
                                    accept: 'application/json',
                                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjRjYTkzNTVlZjNiZmFmYjFiMzNhMDhjYWI5MmQ5YyIsInN1YiI6IjY0OGQ1ZDkxYzNjODkxMDEwY2E0ODZmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w1JHI9rHxW3qNz9fJHZRybJ4Xfvysjs7-IUyvc5Ychg', // Replace with your actual TMDB API key
                                },
                            };

                            const tmdbUrl = `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&language=en-US`;

                            fetch(tmdbUrl, options)
                                .then(response => response.json())
                                .then(data => {
                                    if (data.movie_results.length > 0) {
                                        const posterPath = data.movie_results[0].poster_path;
                                        if (posterPath) {
                                            const posterUrl = `https://image.tmdb.org/t/p/w500/${posterPath}`;
                                            
                                            const posterImg = document.createElement('img');
                                            posterImg.src = posterUrl;
                                            posterImg.alt = movieName;
                                            
                                            document.getElementById('poster-container').appendChild(posterImg);
                                        }
                                    }
                                })
                                .catch(error => console.error(error));
                        });
                    })
                    .catch(error => console.error(error));
            }, 5000); // Adjust the delay as needed
        } else {
            console.error("Error generating recommendations.");
        }
    })
    .catch(error => console.error(error));
  });
});
