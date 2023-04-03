require("dotenv").config();
const mongoose = require("mongoose");

//connect to mongodb
let uri = process.env.MONGO_URI;
uri = uri.replace('<password>', process.env.MONGO_PASS);

//create schema
const tokenSchema = new mongoose.Schema({
    userId: String,
    token: String
})

//exporting the model
const Token = mongoose.model('Token', tokenSchema)

module.exports = Token;