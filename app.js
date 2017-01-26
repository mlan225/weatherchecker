 var express = require("express"); 
 var weather = require("openweather-apis"); 
 var bodyParser = require("body-parser"); 
 
 var mongoose = require("mongoose"); 
 var passport = require("passport"); 
 var localStrategy = require("passport-local"); 
 
 var User = require("./models/user"); 
 var Favorite = require("./models/favorites");
 
 
 var app = express(); 
 
//mongoose config=================================

mongoose.connect("mongodb://localhost/weatherchecker");
// mongoose.connect("mongodb://weatherchecker:Warpenguin95@ds131119.mlab.com:31119/weatherchecker"); //the link for mongo labs database
 
//mongoose config=================================


//passport config==================================

app.use(require("express-session")({
    secret: "Pepe the frog", 
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new localStrategy(User.authenticate())); //came with passport-local-mongoose
passport.serializeUser(User.serializeUser()); //encrypt 
passport.deserializeUser(User.deserializeUser()); //decrypt
 
//passport config==================================
 


 
 app.set("view engine", "ejs"); 
 app.use(bodyParser.urlencoded({extended: true})); 
 app.use(express.static('public'));
 app.use(function(req,res,next){ //need next to move on to next middleware
    res.locals.currentUser = req.user; 
    next(); 
 });





//global variable==================================
var query;  
//global variable==================================




 
//landing page 	
app.get("/", function(req,res){
    res.render("index"); 
    //user will see a welcome message for the site and log or sign up here
});
	

//search route -- send to results, change city query with a post to global
app.get("/search", function(req, res) {
    res.render("search"); 
}); 

app.post("/search", function(req,res){
    var newQuery = req.body.city; 
    query = newQuery; 
    res.redirect("/results"); 
});

app.post("/search/favorite",isLoggedIn, function(req, res) { //uses the posted variable from favorites
    var newQuery = req.body.favorite;
    query = newQuery; 
    res.redirect("/results"); 
});


//results page --- send the data with the city query to here to use with the api. 
app.get("/results", function(req, res) {
    
    weather.setLang('en');
    // English - en, Russian - ru, Italian - it, Spanish - es (or sp), 
    // Ukrainian - uk (or ua), German - de, Portuguese - pt,Romanian - ro, 
    // Polish - pl, Finnish - fi, Dutch - nl, French - fr, Bulgarian - bg, 
    // Swedish - sv (or se), Chinese Tra - zh_tw, Chinese Sim - zh (or zh_cn), 
    // Turkish - tr, Croatian - hr, Catalan - ca 
 
 
    // set city by name 
    weather.setCity(query); 
    
     // 'metric'  'internal'  'imperial' 
 	weather.setUnits('imperial');
 	
 	
    // check http://openweathermap.org/appid#get for get the APPID 
 	weather.setAPPID('c9b18f54cb76c49dcab4a8cae4a6e940'); 
 	
 
    // get 3 days forecast 
    weather.getWeatherForecastForDays(3, function(err, obj){
        if(err){
            console.log(err); 
        }else{
            // res.send(obj["list"]); 
            console.log(obj["list"]);
            var temp1 = (obj["list"]);
            var temp2 = (obj["list"]);
            var temp3 = (obj["list"]);
            res.render("results",{temp1:temp1, temp2:temp2,temp3:temp3,query:query});     
        }
        
    });
    
});



 	
 	
//authentication============================================

app.get("/register", function(req, res) {
    res.render("register"); 
}); 

//handle sign up logic
app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username}); //variable for the username
    User.register(newUser, req.body.password, function(err,user){ //register the new username and password
        if(err){
            console.log(err); 
            return res.render("register"); 
        } 
        passport.authenticate("local")(req, res, function(){
            console.log(user); 
            res.redirect("/search");
        }); 
    });  
    
});

app.get("/login", function(req, res) {
    res.render("login"); 
}); 

app.post("/login",passport.authenticate("local", //will authenticate user suff with the database information
    {
        successRedirect: "/search",
        failureRedirect: "/login"
    }), function(req, res) {
});

app.get("/logout", function(req, res) {
    req.logout(); 
    res.redirect("/"); 
}); 

//authentication============================================




//Favorites routes================================================
 
app.get("/favorites",isLoggedIn, function(req, res) {
    var account = req.user.username;
    Favorite.find({account: account},function(err,foundFavorites){
        if(err){
            console.log(err); 
        }else{
            res.render("favorites", {foundFavorites:foundFavorites}); 
        }
    });
}); 

 
 	

app.get("/favorites/new",isLoggedIn, function(req, res) {
    res.render("newFavorite"); 
}); 	
 	
 	
app.post("/favorites/new", function(req, res){
    var account = req.user.username;
    var city = req.body.city; 
    var newFavorite = new Favorite({account,city}); 
    Favorite.create(newFavorite,function(err,createdFavorite){
        console.log("new favorites created");
        console.log(createdFavorite);
        if(err){
            console.log(err); 
        }else{
            account = req.user.username;
            Favorite.find({account: account},function(err,foundFavorites){
                if(err){
                    console.log(err); 
                }else{
                    res.render("favorites", {foundFavorites:foundFavorites}); 
                }
        });
        }
    }); 
    
   
});
    
    

 
//Favorites routes================================================
 	
 	
//middleware================================================

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next(); 
    }
    res.redirect("/login"); 
}



//middleware================================================
 
 
 
 

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("weatherapi server started!"); 
});
