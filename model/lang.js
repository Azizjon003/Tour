const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  sourceWord: {
    type: String,
  },
  uz: {
    type: String,
  },
  eng: String,
  ru: String,
});

const Lang = mongoose.model("Language", Schema);

module.exports = Lang;
