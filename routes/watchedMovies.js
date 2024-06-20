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


module.exports =router ;