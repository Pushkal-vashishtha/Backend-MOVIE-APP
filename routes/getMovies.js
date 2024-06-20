const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const User = require("../models/User");

router.get("/getMovies/:genreId?", async (req, res) => {
  try {
    const { genreId } = req.params;
    if (genreId) {
      if (genreId === "Netflix") {
        const moviesByWatchProvider = await Movie.find({
          watchProviders: { $in: [genreId] },
        });
        res.json(moviesByWatchProvider);
      } else {
        const moviesByGenre = await Movie.find({ genreIds: genreId });
        res.json(moviesByGenre);
      }
    } else {
      const allMovies = await Movie.find();
      res.json(allMovies);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
});

router.get('/getSimilarMovies/:movieID', async (req, res) => {
    try {
      const { movieID } = req.params;
  
      // Find the selected movie by its ID
      const selectedMovie = await Movie.findById(movieID);
  
      // Ensure the movie is found
      if (!selectedMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
  
      // Find similar movies based on genres
      const similarMovies = await Movie.find({
        genreIds: { $in: selectedMovie.genreIds },
        _id: { $ne: movieID } // Exclude the selected movie itself
      });
  
      res.json(similarMovies);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/searchMovies/:movieName', async (req, res) => {
    try {
      const { movieName } = req.params;
  
      // Use a case-insensitive regular expression to perform a partial match on movie names
      const matchingMovies = await Movie.find({ title: { $regex: new RegExp(movieName, 'i') } });
  
      res.json(matchingMovies);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

module.exports = router;
