const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require("body-parser");

var app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/allocine", function(req, res) {
  var o = {} // empty Object
  var key = 'Orientation Sensor';
  o[key] = []; // empty Array, which you can push() values into


  var data = {
    sampleTime: '1450632410296',
    data: '76.36731:3.4651554:0.5665419'
  };
  var data2 = {
    sampleTime: '1450632410296',
    data: '78.15431:0.5247617:-0.20050584'
  };
  o[key].push(data);
  o[key].push(data2);
  console.log(JSON.stringify(o));
  res.status(200).json(o);
});

app.post("/allocine", function(req, res) {
});
