const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const request = require('request');
const allocine = require('allocine-api');
const SteamApi = require('steam-api');
const bodyParser = require("body-parser");
const fs = require('fs');
const session = require('express-session');

var app = express();

var sess;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
        secret: 'Sup3rS3cr3tC0d3',
        name: 'session_cookie',
        resave: false,
        saveUninitialized: false
      }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.get('/', (req, res) => res.sendFile('views/pages/index.html', { root: __dirname }));

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/allocine/:id", function(req, res) {
  var cinema = req.params.id;
  allocine.api('showtimelist', {theaters: cinema}, function(error, results) {
    if(error) { console.log('Error : '+ error); return; }
    res.status(200).json(results);
  });
});

app.get("/allocinesearch/:id", function(req, res) {
  var city = req.params.id;
  allocine.api('search', {q: city, filter: 'theater'}, function(error, results) {
    if(error) { console.log('Error : '+ error); return; }
    res.status(200).json(results);
  });
});


app.get("/steam/:id", function(req, res) {
  var game = req.params.id;

  var userStats = new SteamApi.UserStats('steam-api-key');

  userStats.GetNumberOfCurrentPlayers(game).done(function(result){
    res.status(200).json(result);
  });
});

app.get("/steam", function(req, res) {

  var appl = new SteamApi.App('steam-api-key');

  appl.GetAppList().done(function(result){
    res.status(200).json(result);
  });
});

function callAPI(url, callback) {
  request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    callback(body);
  });
}

app.get("/lgtandlat/:id", function(req, res) {
  var address = req.params.id;

  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCoXD3dN_6TPERUPESZZJCQINpj-9wH6mY"

  var body = callAPI(url, function(data) {
    if (data["status"] == "OK") {
      res.json(data["results"][0]["geometry"]["location"]);
    } else {
      res.json({error: 1, message: "Impossible de trouver latitude et longitude de la recherche"});
    }
  });
});

app.get("/weather/:id", function(req, res) {
  var city = req.params.id;

  var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=3ee58512b501c5a957e02833caa95404";

  var body = callAPI(url, function(data) {
    if (data["cod"] == 404)
      res.json({error: 1, message: "Impossible de trouver l'emplacement de la recherche"});
    else
      res.status(200).json(data);
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
      if (ddata["status"] == "OK") {
        res.json(ddata);
      } else {
        res.json({error: 1, message: "Impossible de trouver les coordonées de la recherche"});
      }
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
  var url = "https://api.coinmarketcap.com/v2/ticker/" + coin + "/";
  var body = callAPI(url, function(data) {
    res.json(data);
  });
});

app.get("/coinmarketcap/", function(req, res) {
  var url = "https://api.coinmarketcap.com/v2/listings/";
  var body = callAPI(url, function(data) {
    res.json(data);
  });
});

app.get("/redditsubcount/:id", function(req, res) {
  var subreddit = req.params.id;
  var url = "https://www.reddit.com/r/" + subreddit + ".json";
  var body = callAPI(url, function(data) {
    if (data['data']['children'][0]) {
      res.json(data['data']['children'][0]['data']["subreddit_subscribers"]);
    } else {
      res.json({error: 1, message: "Impossible de récuperer le nombre d'abonnées au subreddit"})
    }
  });
});

app.get("/subreddit/:id", function(req, res) {
  var subreddit = req.params.id;
  var url = "https://www.reddit.com/r/" + subreddit + ".json";
  var body = callAPI(url, function(data) {
    if (data['data']['children'][0]) {
      res.json(data);
    } else {
      res.json({error: 1, message: "Impossible de récuperer les posts du subreddit"})
    }
  });
});

var widgets = []

app.get("/widgets/", function(req, res) {
  sess = req.session;
  if (sess.username) {
      fs.readFile('widgets.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        uname = sess.username;
        res.json(JSON.parse(JSON.stringify(obj[uname].widgets)));
      }});
    } else {
    res.status(403).send('403, You are not allowed to be here, try and log in ?');
  }
});

app.get("/resetwidgets/", function(req, res) {
  sess = req.session;
  if (sess.username) {
  fs.readFile('widgets.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      obj = JSON.parse(data);
      uname = sess.username;
      obj[uname].widgets = []
      json = JSON.stringify(obj);
      fs.writeFile('widgets.json', json, 'utf8');
    }});
    res.status(200).redirect("/");
  } else {
    res.status(403).send('403, You are not allowed to be here, try and log in ?');
  }
});

app.post("/widgets/", function (req, res) {
  sess = req.session;
  if (sess.username) {
    console.log('\n-- INCOMING REQUEST AT ' + new Date().toISOString());
    console.log(req.method + ' ' + req.url);
    console.log("NAME : " + req.body.name);
    console.log("URL : " + req.body.url);
    console.log("PARAM :" + req.body.param);
    console.log("ID :" + req.body.id);
    var widget = {
      name: req.body.name,
      url: req.body.url,
      param: req.body.param,
      id: req.body.id
    };
    fs.readFile('widgets.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
        obj = JSON.parse(data);
        uname = sess.username;
        obj[uname].widgets.push(widget);
        json = JSON.stringify(obj);
      fs.writeFile('widgets.json', json, 'utf8');
    }});
  } else {
    res.status(403).send('403, You are not allowed to be here, try and log in ?');
  }
});

app.get('/',function(req,res){
  sess = req.session;
  if(sess.username) {
    res.sendFile('views/pages/index.html', { root: __dirname })
  } else {
      res.redirect('/login');
  }
});

app.post('/login',function(req,res){
  sess = req.session;

  fs.readFile('widgets.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      obj = JSON.parse(data);
      if (obj[req.body.username]) {
        sess.username = req.body.username;
        res.status(200).json({success:1, message:""});
      } else if (obj[req.body.username] && obj[req.body.username].password != req.body.password) {
        res.status(200).json({success:0, message:"Wrong password"});        
      } else {
        res.status(200).json({success:0, message:"User doesn't exist"});
      }
  }});
});

app.post('/register',function(req,res){
  sess = req.session;

  sess.username = req.body.username;
  fs.readFile('widgets.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      obj = JSON.parse(data);
      if (obj[req.body.username]) {
        res.status(200).json({success:0, message:"Username taken"});
      } else if (req.body.password.length < 6) {
        res.status(200).json({success:0, message:"Password is to short (6 characters required)"});
      } else {
        obj[req.body.username] = {password: req.body.password, widgets: []};
        json = JSON.stringify(obj);
        fs.writeFile('widgets.json', json, 'utf8');
        res.status(200).json({success:1, message:"User created successfuly, please login"});
      }
    }});
});

app.get('/deleteallusers',function(req,res){
  sess = req.session;

  if (sess.username == "admin") {
    fs.readFile('widgets.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
        obj = JSON.parse(data);
        Object.keys(obj).forEach(function(key) {
          var val = obj[key];
          if (key != "admin") {
            delete obj[key]
          }
        });
        json = JSON.stringify(obj);
        fs.writeFile('widgets.json', json, 'utf8');
        res.status(200).redirect("/"); 
      }
    });
  } else {
    res.status(403).send('403, You are not allowed to be here, try and log in ?');
  }
});


app.get('/login',function(req,res){
  sess = req.session;
  if (sess.username) {
    res.redirect('/');
  } else {
    res.sendFile('views/pages/login.html', { root: __dirname })    
  }
});

app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
