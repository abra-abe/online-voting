require('dotenv').config();
const express = require("express");
const {MongoClient} = require("mongodb");
const connectEnsureLogin = require("connect-ensure-login");
const router = express.Router();

router.get("/", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    let uri = process.env.MONGO_URI;
    uri = uri.replace('<password>', process.env.MONGO_PASS);
    // console.log(uri);
    const client = new MongoClient(uri);

    async function run() {
        try{
            const db =  client.db("test");
            const votes = db.collection("votes");

            //query for votes of abc
            const query1 = { vote: "abc"};

            //find the number of documents matching the specified query1
            const count_abc = await votes.countDocuments(query1);

            //query for votes of xyz
            const query2 = { vote: "xyz"};

            //find the number of documents matching the specified query2
            const count_xyz = await votes.countDocuments(query2);

            res.send('abc: '+count_abc+' <br>'+'xyz: '+count_xyz);
        }finally{
            await client.close();
        }
    }
    run();
});;

module.exports = router