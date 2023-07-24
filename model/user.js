const mongoose = require("mongoose");
const useSchema = new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, dafault: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String }
});

module.exports = mongoose.model("user", useSchema);