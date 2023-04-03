require('dotenv').config();
const express = require("express");
const joi = require("joi");
const router = express.Router();
const {MongoClient} = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
const Token = require("../models/token");
const User = require("../models/user");

//for sending email
const sendEmail = require("../utils/send-email")

let uri = process.env.MONGO_URI;
uri = uri.replace('<password>', process.env.MONGO_PASS);
const mongoClient = new MongoClient(uri);

//route for forgot password
router.get("/", (req, res) => {
    res.render("forgot.ejs")
})

router.post("/", async (req, res) => {
    try {
        const db =  mongoClient.db("test");
        const users = db.collection("users");
        const tokens = db.collection("tokens");
        const enteredEmail = req.body.email;

        const schema = joi.object({ email: joi.string().email().required() })
        const {error} = schema.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const userEmail = await users.findOne({email: enteredEmail});
        if(!userEmail){
            return res.status(400).send("user with that email does not exist...");
        }

        const nUserId = await users.find({email: enteredEmail}).toArray();
        var a = nUserId[0]._id;
        console.log(a.toString());
        // console.log(users._id);
        var token = await tokens.findOne({ userId: a.toString()});//issue iko apa bro...
    
        if(!token) {
            token = await new Token({
                userId: a,
                token: Date.now().toString()
            }).save();

            // console.log(token.toArray().userId);
        }
       //hapo juu mambo hayaendi kaka...🙆🏿‍♂️🙆🏿‍♂️🙆🏿‍♂️

        //Generating the password reset link
        const link = process.env.BASE_URL+'/password/recover/'+token.userId+'/'+token.token;
        console.log(link);
        // res.send(link)
        await sendEmail(enteredEmail, 'Password reset link', link)
        res.status(200).send("Email has been sent, please check your email...")
    } catch (error) {
        res.send("Ooops!!! An error occured...")
        console.log(error);
    }
    // res.send(link)
})


//rendering the password reset form in the ejs template
router.get("/:userId/:token", (req, res) => {
    res.render("reset.ejs", { userId:req.params.userId, token:req.params.token })
})

router.post("/:userId/:token", async (req, res) => {
    try {

        const db =  mongoClient.db("test");
        const users = db.collection("users");
        const tokens = db.collection("tokens");

        const schema = joi.object({ password: joi.string().required() });
        const {error} = schema.validate(req.body);
        if(error){
            return res.status(400).send(error.details[0].message);
        }

        
        const userId = req.params.userId;
        const user = await users.find({ "_id": new ObjectId(userId) }).toArray();
        console.log(user);
        // const user = await users.find({_id: req.params.userId})
        if(!user){
            res.status(400).send("Invlid or expired link");
        }

        const token = await tokens.findOne({
            userId: req.params.userId,
            token: req.params.token
        });
        if(!token){
            return res.status(400).send("Invalid or expired link");
        }

        // user.password = req.body.password;
        // await user.save();
        // await token.delete();

        // Reseting the user's password
        User.findOne({ _id: userId }).then(User => {
            if (! User) return res.sendStatus(404);
            User.setPassword(req.body.password, (err, updatedUser) => {
                if (err) throw err
                updatedUser.save();
            });
            console.log("password changed successfully");
          });
        

        res.send("password was reset successfully");

    } catch (error) {
        res.send("Ooops!!! An error occured...")
        console.log(error);
    }
})

module.exports = router