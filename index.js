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
app.get('/', (req, res) => res.render('pages/index'));

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

app.get("/coinmarketcap/:id", function(req, res) {
  var coin = req.params.id;
  console.log('coin:', coin);
  var url = "https://api.coinmarketcap.com/v1/ticker/" + coin + "/";
  var body = callAPI(url, function(data) {
    res.json(data);
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
