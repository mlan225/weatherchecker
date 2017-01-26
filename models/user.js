var mongoose = require("mongoose"); 
var passportLocalMongoose = require("passport-local-mongoose"); 

var userSchema = new mongoose.Schema({
    username: String,
    password: String, 
}); 

userSchema.plugin(passportLocalMongoose); //will add in all of the passport-local-mongoose methods and put them into the UserSchema

module.exports = mongoose.model("User", userSchema);  