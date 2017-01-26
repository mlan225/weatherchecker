var express = require("express"); 
var weather = require('openweather-apis');
var bodyParser = require("body-parser"); 
var app = express(); 
 
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static('public'));

app.get("/",function(req,res){
    
    
 
    weather.setLang('en');
    // English - en, Russian - ru, Italian - it, Spanish - es (or sp), 
    // Ukrainian - uk (or ua), German - de, Portuguese - pt,Romanian - ro, 
    // Polish - pl, Finnish - fi, Dutch - nl, French - fr, Bulgarian - bg, 
    // Swedish - sv (or se), Chinese Tra - zh_tw, Chinese Sim - zh (or zh_cn), 
    // Turkish - tr, Croatian - hr, Catalan - ca 
 
 
    // set city by name 
    weather.setCity('Lexington');
    
     // 'metric'  'internal'  'imperial' 
 	weather.setUnits('imperial');
 	
 	
    // check http://openweathermap.org/appid#get for get the APPID 
 	weather.setAPPID('c9b18f54cb76c49dcab4a8cae4a6e940'); 
 	
 
    // get 3 days forecast 
    weather.getWeatherForecastForDays(3, function(err, obj){
        // res.send(obj["list"]); 
        var temp1 = (obj["list"]);
        var temp2 = (obj["list"]);
        var temp3 = (obj["list"]);
        
        
         
        res.render("testView",{temp1:temp1, temp2:temp2,temp3:temp3}); 
    });
    
    
    
}); 

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Test server running..."); 
});