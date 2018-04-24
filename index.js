const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const request = require('request');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */
 app.get("/allocine/:id", function(req, res) {
  var cinema = req.params.id;
 });

app.get("/allocine", function(req, res) {
  var o = {} // empty Object
  var key = 'Names';
  o[key] = []; // empty Array, which you can push() values into


  var data = {
    city: 'montpellier',
    data: 'Multiplexe Odysseum'
  };
  var data2 = {
    city: 'montpellier',
    data: 'Comedie'
  };
  o[key].push(data);
  o[key].push(data2);
  console.log(JSON.stringify(o));
  res.status(200).json(o);
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
