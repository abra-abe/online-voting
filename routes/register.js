const express = require("express");
const router = express.Router();
const User = require("../models/user")

router.get("/", (req, res) => {
    res.render('register.ejs');
})

router.post("/", (req,res) => {
    var username = req.body.username
    var email = req.body.email
    var pass = req.body.password

    console.log(username);
    //posting details to the database
   User.register({username: username, email: email, active: false}, pass)

   User.findOne({username: username}).then(user=>{
    if(user){
        // errors.push({msg: 'Email already exists'});
        // res.render('register',{errors})
        console.log("username exists already");
        // req.flash('error_msg', 'This username already exists');
        res.redirect('/register');
    }
})
    // console.log(req.User);
    res.redirect('/voting');
})

module.exports = router