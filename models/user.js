//
require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//onnecting to mongodb
let uri = process.env.MONGO_URI
uri = uri.replace('<password>', process.env.MONGO_PASS);

mongoose.connect(uri)

//creating the model
const userSchema = new mongoose.Schema({
    Username: String,
    email: String,
    password: String
});

//configuring passport plugin
userSchema.plugin(passportLocalMongoose);

//exporting the model
const User = mongoose.model('User', userSchema)


module.exports = User