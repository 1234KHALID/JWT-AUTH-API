const mongoose = require('mongoose');

const { MONGO_URI } = process.env;
exports.connect = () => {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Database is connected sucessful !")
  }).catch((err) => {
    console.log(err);
  })
}