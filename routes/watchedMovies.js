const express = require('express')
const router = express.Router();
const isLoggedIn = require("../routes/isLoggedIn");
const Movie = require('../models/movie')

router.post('/update-watched-time/:movieId',isLoggedIn,async(req,res)=>{
    try {
        
        const user = req.user;
        const movieId = req.params.movieId;
        const watchedTime = req.body.watchedTime;

        const movieToUpdate = user.watchedMovies.find(item => item.movie.equals(movieId))
        console.log("Movie to update" ,movieToUpdate)
        if(movieToUpdate){
            movieToUpdate.watchedTime = watchedTime

            const movieDetails = await Movie.findById(movieId)
            if(movieDetails){
                movieToUpdate.uploadTime =  Date.now()
            }
        }else{
            const movieDetails = await Movie.findById(movieId)
            if(movieDetails){
                user.watchedMovies.push({movie: movieId, watchedTime, uploadTime:Date.now()})
            }
        }
        await user.save()
        res.json({success: true , user})

    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
})


router.post('/remove-watched-movie/:movieId', isLoggedIn ,async(req,res)=>{
    try {
        const user = req.user;
        const movieIdToRemove = req.params.movieId

        const movieIndexToRemove = user.watchedMovies.findIndex(item => item.movie.equals(movieIdToRemove));
        if(movieIndexToRemove!==-1){
            user.watchedMovies.splice(movieIndexToRemove,1);
            await user.save();
            res.json({success:true , message:"Removed successfully"})
        }else{
            res.status(404).json({success:false, message:"Movie Not found in watched List"})
        }

    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
})

router.post('/remove-all-watched-movies', isLoggedIn, async (req, res) => {
    try {
        const user = req.user;

        // Clear the watchedMovies array
        user.watchedMovies = [];
        
        await user.save();

        res.json({ success: true, message: 'All watched movies removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get('/watched-time/:movieId', isLoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const movieId = req.params.movieId;

        // Find the movie in the user's watchedMovies and retrieve the watched time
        const movieWatchedTime = user.watchedMovies.find(item => item.movie.equals(movieId));

        if (movieWatchedTime) {
            res.json({ success: true, watchedTime: movieWatchedTime.watchedTime });
        } else {
            res.json({ success: true, watchedTime: 0 }); // If movie not found, return 0 watched time
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/watched-movies', isLoggedIn, async (req, res) => {
    try {
        const user = req.user;

        // Fetch all movies with their watched times
        const watchedMovies = await Promise.all(user.watchedMovies.map(async ({ movie, watchedTime, uploadTime }) => {
            // Populate the movie details using the movie ID
            const movieDetails = await Movie.findById(movie);

            return {
                movie: movieDetails,
                watchedTime,
                uploadTime,
            };
        }));

        // Sort the watchedMovies based on the uploadTime in descending order
        watchedMovies.sort((a, b) => b.uploadTime - a.uploadTime);
        // watchedMovies.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));

        res.json({ success: true, watchedMovies });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
module.exports =router ;