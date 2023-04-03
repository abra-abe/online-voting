require('dotenv').config();
const express = require("express");
const redis = require("redis");
const router = express.Router();
const {MongoClient} = require("mongodb");
const { options } = require('joi');


router.get("/:name",(req, res) => {
    //for redis
    const redisClient = redis.createClient()

    //for mongodb
    let uri = process.env.MONGO_URI;
    uri = uri.replace('<password>', process.env.MONGO_PASS);
    const mongoClient = new MongoClient(uri);


    const {name} = req.params


    async function run() {
        try{
            // mongoClient.connect();
            const db =  mongoClient.db("test");
            const users = db.collection("users");

            const changeStream = users.watch();

            //creates a change stream for the collection
            changeStream.on('change', (change) => {
                console.log("change detected in the database");
                // console.log(change.documentKey);

                // //invoking the invalidating method
                // invalidateCache(`user-${name}`)


                redisClient.publish('myChannel', JSON.stringify(change));

                redisClient.subscribe('myChannel');


                if(change.operationType === 'insert'){
                    redisClient.set(`myKey:${change.fullDocument._id}`, JSON.stringify(change.fullDocument));
                } else if (change.operationType === 'update') {
                    redisClient.get(`myKey:${change.fullDocument._id}`, (err, result) => {
                        if(err) throw err
    
                        if(result) {
                            const updatedDocument = { ...JSON.parse(result), ...change.updateDescription.updatedFields };
                            redisClient.set(`myKey:${change.fullDocument._id}`, JSON.stringify(updatedDocument));
                        }
                    });
                } else if (change.operationType === 'delete') {
                    redisClient.del(`myKey:${change.fullDocument._id}`)
                }
    
            });


            // //method for invalidating cache
            // function invalidateCache(key){
            //     redisClient.del(key, (err, reply) => {
            //         if(reply == 1){
            //             console.log(`Cache for ${key} has been invalidated`);
            //         } else {
            //             console.log(`Cache for ${key} not found`);
            //         }
            //     });
            // }

            redisClient.on("message", function(channel, message){
                const change = JSON.parse(message);

            })

            

            // /*THIS CODE WORKS PAUSING IT FOR A WHILE....


            // redisClient.get(`user-${name}`, async (err, reply) => {
            //     if(err) throw err;
            //     if(!reply) {
            //         userData = await users.find({username: `${name}`}).toArray()

            //          redisClient.set(`user-${name}`,JSON.stringify(userData), (err, reply)=>{
            //             if(err) throw err

            //         })

                
            //     console.log(userData);
            //     userData = JSON.stringify(userData);
            //     res.send(JSON.parse(userData));
            //     }
            //     res.send(JSON.parse(reply));
            // })


            // */

            
        }finally{
            // await mongoClient.close();
        }
    }
    run();

})


module.exports = router