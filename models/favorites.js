var mongoose = require("mongoose"); 

var favoritesSchema = mongoose.Schema({
    city: String, 
    account: String,
});

module.exports = mongoose.model("Favorite", favoritesSchema); 