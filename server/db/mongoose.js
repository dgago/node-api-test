const mongoose = require("mongoose");

const dbName = "z";
const url = `mongodb://13.65.32.65:17510/${dbName}`;

mongoose.PromiseProvider = global.Promise;
mongoose.connect(url);

module.exports = { mongoose };
