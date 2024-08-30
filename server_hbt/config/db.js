const mongoose = require("mongoose");

const {connection} = mongoose.connect("mongodb+srv://umamahesh:maheshmongodb123@cluster0.ouvzfui.mongodb.net/hbt_be");

module.exports = connection