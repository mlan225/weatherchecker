 var express = require("express"); 
 var weather = require("openweather-apis"); 
 var bodyParser = require("body-parser"); 
 var app = express(); 
 
 
 var city = undefined; 
 var cityTemp = undefined; 
 var cityDesc = undefined;
 var cityHumidity = undefined; 

 
 app.set("view engine", "ejs"); 
 app.use(bodyParser.urlencoded({extended: true})); 
 app.use(express.static('public'));


 
 	
app.get("/", function(req,res){
    res.render("index");  
}); 	


app.get("/search", function(req, res) {
    res.render("search"); 
}); 


app.post("/search", function(req,res){
    
    
   city = req.body.city;
   res.redirect("/results"); 
   console.log(city); 
   
   
   weather.setLang('en');
    
    // set city by name 
    weather.setCity(city); //search by var city 
 
    // 'metric'  'internal'  'imperial' 
 	weather.setUnits('imperial');
 
    // check http://openweathermap.org/appid#get for get the APPID 
 	weather.setAPPID('c9b18f54cb76c49dcab4a8cae4a6e940');
 	
 	weather.getTemperature(function(err,temp){
        if(err){
            console.log(err); 
        }else{
            cityTemp = temp; 
            console.log(cityTemp);
        }
    });
    
    weather.getDescription(function(err, desc){
        if(err){
            console.log(err); 
        }else{
            cityDesc = desc; 
            console.log(cityDesc);
        }
    });
    
     weather.getHumidity(function(err, hum){
         if(err){
             console.log(err); 
         }else{
            cityHumidity = hum; 
            console.log(hum);
         }
    });
   
});



app.get("/results", function(req, res) {
   
    res.render("results", {cityTemp:cityTemp, city:city, cityDesc:cityDesc, cityHumidity:cityHumidity}); 
});
 	
 	
 	
 	
 	
 	
 	
 	





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("weatherapi server started!"); 
});