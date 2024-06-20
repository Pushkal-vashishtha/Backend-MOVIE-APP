const express = require('express');
const router = express.Router();

function isAdminAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    res.redirect('/admin/login');
  }

router.get('/',isAdminAuthenticated,(req,res)=>{
    res.render('dashboard')
})

router.get('/addMovieRoute', isAdminAuthenticated,(req,res)=>{
  res.render('addMovieList')
})
router.get('/updateMovieRoute', isAdminAuthenticated, (req, res) => {
  res.redirect('/edit-movie-list'); // Assuming you have an updateMovie view
});
router.get('/deleteMovieRoute', isAdminAuthenticated, (req, res) => {
  res.redirect('/delete-movie'); // Assuming you have an updateMovie view
});

module.exports = router;