const mongoose = require('mongoose');
require("dotenv").config();

const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.03m5oyj.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);

const connectToMongo = async () => {
    await mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo");
    })
}

module.exports = connectToMongo;