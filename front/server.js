const widget = [
    {
        "name": "Météo",
        "url": "https://epitech-dashboard.herokuapp.com/weather/",
        "param": ""
    },
    {
        "name": "Bourse",
        "url": "https://epitech-dashboard.herokuapp.com/stockmarket/",
        "param": ""
    },
    {
        "name": "Date/Heure",
        "url": "https://epitech-dashboard.herokuapp.com/date/",
        "param": ""
    },
    {
        "name": "Google Map",
        "url": "https://epitech-dashboard.herokuapp.com/map/",
        "param": ""
    },
    {
        "name": "Steam",
        "url": "https://epitech-dashboard.herokuapp.com/steam/",
        "param": ""
    },
    {
        "name": "Allociné",
        "url": "https://epitech-dashboard.herokuapp.com/allociné/",
        "param": ""
    },
    {
        "name": "Coinmarketcap",
        "url": "https://epitech-dashboard.herokuapp.com/coinmarketcap/",
        "param": ""
    },
];

/*let request = new XMLHttpRequest();
request.open('GET', 'https://epitech-dashboard.herokuapp.com/widgets');
request.onload  = function(){
    let data = JSON.parse(this.response);
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
    let selected = document.getElementById("widgetName");
    let param = document.getElementById("param");
    widget.forEach(function(elem){
        if (elem.name === selected.options[selected.selectedIndex].value){
            elem.param = param.value;
        }
    });
    addHtmlWidget(selected.selectedIndex - 1);
    /*let request = new XMLHttpRequest();
    request.open('POST', 'https://epitech-dashboard.herokuapp.com/widgets');
    request.setRequestHeader("Content-type", "application/json");
    request.send(widget[selected.selectedIndex - 1]);*/
}

const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(container);

function formatData(index, data){
    let p = "";
    switch (index) {
        case 0:
            let temps = "";
            console.log(data.weather[0].main);
            switch (data.weather[0].main){
                case 'Clouds':
                    temps = "nuageux";
                    break;
                case 'Rain':
                    temps = "pluvieux";
                    break;
                case 'Snow':
                    temps = "neigeux";
                    break;
                default:
                    temps = "ensoleillé"
            }
            p = "A " + widget[index].param + " il fait actuellement " + data.main.temp + "°C et le temps est " + temps + ".";
            break;
        case 1:
            p = "Le cours de l'action " + widget[index].param + " est actuellement de " + data + "$."
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
        case 7:
            break;
        case 8:
            break;
        case 9:
            break;

    }
    return p;
}

let i = 0;
function addHtmlWidget (index) {
    let url = "";
    url = widget[index].url + widget[index].param;
    console.log(url);

    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload  = function() {
        let data = JSON.parse(this.response);

        const card = document.createElement('div');
        card.setAttribute('class', 'card');

        const h1 = document.createElement('h1');
        h1.textContent = widget[index].name;

        const p = document.createElement('p');
        p.setAttribute("id", "p" + i);
        p.textContent = formatData(index, data);

        container.appendChild(card);
        card.appendChild(h1);
        card.appendChild(p);
    };
    request.send();
    i++;
}
