const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017"
//const mongoURI = "mongodb+srv://mongo:mongo@cluster0.bc6y1hw.mongodb.net/schooldb?retryWrites=true&w=majority"
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

module.exports = connectToMongo;
