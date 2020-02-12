
const mongoose = require('mongoose');

const {MONGO_URL} = process.env

mongoose.Promise = global.Promise;

module.exports = () => {
    return mongoose.connect(MONGO_URL, { 
      useNewUrlParser: true,
      useCreateIndex: true, 
      useUnifiedTopology: true
    })
};
