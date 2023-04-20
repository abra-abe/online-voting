const express = require("express");
const connectEnsureLogin = require("connect-ensure-login");
const router = express.Router();
const Vote = require("../models/vote")

router.get("/", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.render('voting.ejs')
})

router.post("/", (req, res) => {
    const vote = req.body.candidate;

  let nVote = new Vote({vote: vote});

  nVote.save((nVote));

  res.redirect("/results");
})

module.exports = router