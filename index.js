const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const request = require('request');
const allocine = require('allocine-api');
const SteamApi = require('steam-api');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.sendFile('views/pages/index.html', { root: __dirname }));

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/allocine/:id", function(req, res) {
  var cinema = req.params.id;
  allocine.api('showtimelist', {theaters: cinema}, function(error, results) {
    if(error) { console.log('Error : '+ error); return; }

    console.log('Voici les données retournées par l\'API Allociné:');
    console.log(results);
    res.status(200).json(results);

  });
});

app.get("/steam/:id", function(req, res) {
  var game = req.params.id;

  var userStats = new SteamApi.UserStats('steam-api-key');

  userStats.GetNumberOfCurrentPlayers(game).done(function(result){
    console.log(result);
    res.status(200).json(result);
  });
});

app.get("/steam", function(req, res) {
  
  var appl = new SteamApi.App('steam-api-key');

  appl.GetAppList().done(function(result){
    console.log(result);
  });
});

function callAPI(url, callback) {
  request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log('body:', body);
    callback(body);
  });
}

app.get("/lgtandlat/:id", function(req, res) {
  var address = req.params.id;
  
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCoXD3dN_6TPERUPESZZJCQINpj-9wH6mY"

  var body = callAPI(url, function(data) {
    console.log(data);

    console.log("STATUS : " + data["status"]);

    if (data["status"] == "OK") {

      res.json(data["results"][0]["geometry"]["location"]);

    } else {
    
      res.json(data["status"]);
    
    }
  });
});

app.get("/weather/:id", function(req, res) {
  var city = req.params.id;
  
  var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=3ee58512b501c5a957e02833caa95404";
  
  var body = callAPI(url, function(data) {
    res.json(data);
  });
});

app.get("/time/:id", function(req, res) {
  var zone = req.params.id;

  var url = "https://epitech-dashboard.herokuapp.com/lgtandlat/" + zone

  var body = callAPI(url, function(data) {
  
    lng = data["lng"]
    lat = data["lat"]

    var nurl = "http://api.timezonedb.com/v2/get-time-zone?key=7C8ZRCKIUQKD&format=json&by=position&lng=" + lng + "&lat=" + lat;
  
    var bbody = callAPI(nurl, function(ddata) {
      res.json(ddata);
    });
  });
});


app.get("/stockmarket/:id", function(req, res) {
  var symbol = req.params.id;
  
  var url = "https://api.iextrading.com/1.0/stock/" + symbol + "/price";
  
  var body = callAPI(url, function(data) {
    res.json(data);
  });
});

app.get("/stockmarket/", function(req, res) {
  var url = "https://api.iextrading.com/1.0/ref-data/symbols";
  
  var body = callAPI(url, function(data) {
    res.json(data);
  });
});


app.get("/coinmarketcap/:id", function(req, res) {
  var coin = req.params.id;
  console.log('coin:', coin);
  var url = "https://api.coinmarketcap.com/v1/ticker/" + coin + "/";
  var body = callAPI(url, function(data) {
    res.json(data);
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
