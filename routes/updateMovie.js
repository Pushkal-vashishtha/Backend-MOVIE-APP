const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.get('/edit-movie-list', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render('editMovieList', { movies });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.render('updateMovieDetails', { movie });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/update-movie/:id', async (req, res) => {
    try {
        // Validate and parse input values
        const movieID = isNaN(req.body.movieID) ? undefined : Number(req.body.movieID);
        const budget = isNaN(req.body.budget) ? undefined : Number(req.body.budget);
        const ratings = isNaN(req.body.ratings) ? undefined : Number(req.body.ratings);
        const popularity = isNaN(req.body.popularity) ? undefined : Number(req.body.popularity);
        const revenue = isNaN(req.body.revenue) ? undefined : Number(req.body.revenue);
        const runtime = isNaN(req.body.runtime) ? undefined : Number(req.body.runtime);

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                movieID: movieID,
                backdropPath: req.body.backdropPath,
                budget: budget,
                genreIds: req.body.genreIds.split(',').map(id => Number(id)),
                genres: req.body.genres.split(','),
                originalTitle: req.body.originalTitle,
                overview: req.body.overview,
                ratings: ratings,
                popularity: popularity,
                posterPath: req.body.posterPath,
                productionCompanies: req.body.productionCompanies.split(','),
                releaseDate: req.body.releaseDate,
                revenue: revenue,
                runtime: runtime,
                status: req.body.status,
                title: req.body.title,
                watchProviders: [req.body.watchProviders],
                logos: 'https://image.tmdb.org/t/p/original' + req.body.logos,
                downloadLink: req.body.downloadLink,
            },
            { new: true }
        );

        res.render('updateMovieDetails', {
            movie: updatedMovie,
            successMessage: 'Movie updated successfully!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
