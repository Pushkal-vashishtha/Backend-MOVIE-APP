require("dotenv").config();
const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");

router.post("/fetch-movie", async (req, res) => {
  let search_term = req.body.searchTerm;

  try {
    const url = `https://api.themoviedb.org/3/search/movie?query=${search_term}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.TMDB_AUTH_KEY,
      },
    };

    const responseData = await fetch(url, options);
    const result = await responseData.json();
    console.log("Result", result);

    // Check if any results were found
    if (result.results.length === 0) {
      return res
        .status(404)
        .json({ error: "No movies found with the given search term" });
    }

    // Render the page with a list of movies and posters
    res.render("addMovieList", { movieList: result.results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

// Create a new route for handling movie selection
router.get("/addMovie/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  // res.json(movieId)
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          process.env.TMDB_AUTH_KEY,
      },
    };

   const responseData = await fetch(url,options);
   const movieDetails = await responseData.json();

   const watchProvidersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;
   const watchProvidersResponse = await fetch(watchProvidersUrl,options)
   const watchProviderResult = await watchProvidersResponse.json()
   
   const watchProviders = Object.keys(watchProviderResult.results).filter((country)=> country === "IN" ).map((country)=>{
    const countryData = watchProviderResult.results[country];
    return {
        country,
        providerName:countryData.flatrate ? countryData.flatrate[0]?.provider_name : countryData.buy[0]?.provider_name
    }
   })
   movieDetails.watchProviders = watchProviders
   const genreIds= movieDetails.genres.map(genre=> genre.id);
   const genreNames= movieDetails.genres.map(genre=> genre.name);
   movieDetails.genreIds =genreIds;
   movieDetails.genres = genreNames;
   movieDetails.production_companies = movieDetails.production_companies.map(company=>company.name)
   movieDetails.watchProviders = movieDetails.watchProviders.map(provider=>provider.name)

   res.render('addMovie',{movieDetails});
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch details" });
  }
});

module.exports = router;
