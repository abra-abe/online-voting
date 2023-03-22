require('dotenv').config();
const mongoose = require('mongoose');

//connect to mongodb
let uri = process.env.MONGO_URI;
uri = uri.replace('<password>', process.env.MONGO_PASS);

mongoose.connect(uri);

//creating the model
const voteSchema = new mongoose.Schema({
    vote: String
});

//exporting the model
const Vote = mongoose.model('Vote', voteSchema)

module.exports = Vote;