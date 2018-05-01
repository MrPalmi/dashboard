const widget = [
    {
        "name": "Météo",
        "isActivated": 0,
        "url": "https://epitech-dashboard.herokuapp.com/meteo/",
        "param": "",
        "description": "°C",
    },
    {
        "name": "Bourse",
        "isActivated": 0,
        "url": "https://epitech-dashboard.herokuapp.com/bourse/",
        "param": "",
        "description": "$",
    },
    {
        "name": "Date/Heure",
        "isActivated": 0,
        "url": "https://epitech-dashboard.herokuapp.com/date/",
        "param": "",
        "description": "",
    },
    {
        "name": "Google Map",
        "isActivated": 0,
        "url": "https://epitech-dashboard.herokuapp.com/map/",
        "param": "",
        "description": "",
    },
    {
        "name": "Steam",
        "isActivated": 0,
        "url": "https://epitech-dashboard.herokuapp.com/steam/",
        "param": "",
        "description": "joueurs connectés",
    },
    {
        "name": "Allociné",
        "isActivated": 0,
        "url": "https://epitech-dashboard.herokuapp.com/allociné/",
        "param": "",
        "description": "",
    },
    {
        "name": "Coinmarketcap",
        "isActivated": 0,
        "url": "https://epitech-dashboard.herokuapp.com/coimarketcapp/",
        "param": "",
        "description": "$",
    },
];

/*var request = new XMLHttpRequest();
request.open('GET', 'https://epitech-dashboard.herokuapp.com/widgets');
request.onload  = function(){
    var data = JSON.parse(this.response);
    data.forEach(function(elem) {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');

        const h1 = document.createElement('h1');
        h1.textContent = elem.name;

        const p = document.createElement('p');
        p.textContent = elem.param + elem.description;

        container.appendChild(card);
        card.appendChild(h1);
        card.appendChild(p)
    })
}
request.send();*/



function addWidget(){
    var selected = document.getElementById("widgetName");
    var param = document.getElementById("param");
    widget.forEach(function(elem){
        if (elem.name === selected.options[selected.selectedIndex].value){
            elem.isActivated = 1;
            elem.param = param.value;
            console.log(elem.name + elem.isActivated);
        }
    });
    console.log("adding a widget");
    addHtmlWidget(selected.selectedIndex - 1);
    /*var request = new XMLHttpRequest();
    request.open('POST', 'https://epitech-dashboard.herokuapp.com/widgets');
    request.setRequestHeader("Content-type", "application/json");
    request.send(widget[selected.selectedIndex - 1]);*/
}

const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(container);

var i = 0;
function addHtmlWidget (index) {
    const card = document.createElement('div');
    card.setAttribute('class', 'card');
    const h1 = document.createElement('h1');
    h1.textContent = widget[index].name;

    const p = document.createElement('p');
    p.setAttribute("id", "p" + i);
    p.textContent = widget[index].param + widget[index].description;

    container.appendChild(card);
    card.appendChild(h1);
    card.appendChild(p);
    i++;
}
