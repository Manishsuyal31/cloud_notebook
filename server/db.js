const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://inotebook:inotebook123@cluster0.cb7ko.mongodb.net/inotebook?retryWrites=true&w=majority';

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo Successfully")
    })
};

module.exports = connectToMongo;