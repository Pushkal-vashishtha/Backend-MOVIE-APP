const express = require('express');
const router = express.Router();
const isLoggedIn = require('../routes/isLoggedIn')

router.post('/add-to-mylist/:movieId',async(req,res)=>{
    try {
        const user = req.user;
        user.mylist.push(req.params.movieId)
        await user.save()
        res.json({success:true , user })
    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
})

router.post('/remove-from-mylist/:movieId')

module.exports = router