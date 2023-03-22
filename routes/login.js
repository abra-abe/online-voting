const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", (req, res) => {
    res.render('login.ejs');
})

router.post("/", passport.authenticate('local', {
    failureRedirect: "/login"
}), (req, res) => {
    console.log(req.user);
    res.redirect("/dashboard")
})

module.exports = router