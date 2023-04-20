//
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const connectEnsureLogin = require("connect-ensure-login")
const bodyParser = require("body-parser");
// const FileStore = require("session-file-store")(session);

const User = require('./models/user');

const login = require("./routes/login");
const register = require("./routes/register");
const voting = require("./routes/voting");
const results = require("./routes/results");
const users = require("./routes/users");
const forgotPassword = require("./routes/recover-password");

const app = express();

//configuring view engine
app.set('view-engine', 'ejs');

//configuring body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

//configuring express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60*60*60 }//1 hour
}));

//configuring passport
app.use(passport.initialize());
app.use(passport.session());
//configure the authentication strategy for passport
passport.use(User.createStrategy());
//to use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
app.get("/", (req, res) => {
    res.render('home.ejs')
});

app.get("/end", (req, res) => {
    res.render('end.ejs')
});

app.use("/login", login)

app.use("/register", register)

app.use("/voting", voting)

app.use("/results", results)

app.use("/users", users)

app.use("/password/recover", forgotPassword)

app.get("/dashboard", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.send('user: '+req.user.username+'<br>'+' session id: '+req.sessionID+'<br>'+
    ' session expires in: '+req.session.cookie.maxAge+' milliseconds' + '<br>'+
    '<a href="/voting">voting page</a>' + '<br>'+
    '<a href="/results">View Results</a>');
})

app.all("*", (req, res) => {
    res.status(404).send("404! Page Not Found")
})


module.exports = app