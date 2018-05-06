const widget = [
    {
        'name': 'Météo',
        'url': '/weather/',
        'param': ''
    },
    {
        'name': 'Bourse',
        'url': '/stockmarket/',
        'param': ''
    },
    {
        'name': 'Date/Heure',
        'url': '/time/',
        'param': ''
    },
    {
        'name': 'Google Map',
        'url': '/lgtandlat/',
        'param': ''
    },
    {
        'name': 'Steam',
        'url': '/steam/',
        'param': ''
    },
    {
        'name': 'Allociné',
        'url': '/allocine/',
        'param': ''
    },
    {
        'name': 'Coinmarketcap',
        'url': '/coinmarketcap/',
        'param': ''
    },
    {
        'name': 'Subreddit Subscriber',
        'url': '/redditsubcount/',
        'param': ''
    },
];

const latlong = [];

function addWidget(){
    let selected = document.getElementById('widgetName');
    let param = document.getElementById('param');
    if (selected.options[selected.selectedIndex].value - 1 != 3) {
        if (selected.options[selected.selectedIndex].value && param.value) {
            widget.forEach(function (elem) {
                if (elem.name === selected.options[selected.selectedIndex].value) {
                    elem.param = param.value;
                }
            });
        }
    }
    addHtmlWidget(selected.selectedIndex - 1);
    let request = new XMLHttpRequest();
    request.open('POST', '/widgets');
    request.setRequestHeader('Content-type', 'application/json');
    console.log(JSON.stringify(widget[selected.selectedIndex - 1]));
    request.send(JSON.stringify(widget[selected.selectedIndex - 1]));
}

const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(container);

function formatData(index, data){
    let p = '';
    switch (index) {
        case 0:
            let temps = '';
            switch (data.weather[0].main){
                case 'Clouds':
                    temps = 'nuageux';
                    break;
                case 'Rain':
                    temps = 'pluvieux';
                    break;
                case 'Snow':
                    temps = 'neigeux';
                    break;
                case 'Sun':
                    temps = 'ensoleillé';
                default:
                    temps = 'dégagé';
            }
            p = 'A ' + widget[index].param + ' il fait actuellement ' + data.main.temp + '°C et le temps est ' + temps + '.';
            break;
        case 1:
            p = 'Le cours de l\'action ' + widget[index].param + ' est actuellement de '+ data + '$.';
            break;
        case 2:
            let array = data.formatted.split(' ');
            let date = array[0].split('-');
            p = 'A ' + widget[index].param + ' il est actuellement ' + array[1] + ' et nous sommes le ' + date[2] + '-' + date[1] + '-' + date[0] + '.';
            break;
        case 3:
            /* google map*/
            break;
        case 4:
            p = 'Il y a actuellement ' + data +  ' joueurs connectés à ' + widget[index].param + '.';
            break;
        case 5:
            /* Allociné */
            break;
        case 6:
            p = 'La valeur du ' + data.data.name + ' est de ' + data.data.quotes.USD.price + '$.';
            p = 'La valeur du ' + data.data.name + ' est de ' + data.data.quotes.USD.price + '$.';
            break;
        case 7:
            p = 'Le subreddit "' + widget[index].param + '" possède ' + data + ' subscribers.';
            break;
        case 8:
            /* reddit 2 */
            break;
    }
    return p;
}

let i = 0;

function addHtmlWidget (index) {
    let url = '';
    url = widget[index].url + widget[index].param;

    const card = document.createElement('div');
    card.setAttribute('class', 'card');

    const h1 = document.createElement('h1');
    h1.textContent = widget[index].name;
    container.appendChild(card);
    card.appendChild(h1);


    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = function () {
        let data = JSON.parse(this.response);

        if (index === 3) {
            latlong[0] = data.lat;
            latlong[1] = data.lng;
            const div = document.createElement('div');
            div.setAttribute('id', 'map');
            const script1 = document.createElement('script');
            script1.src = 'scripts/map.js';
            const script2 = document.createElement('script');
            script2.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCoXD3dN_6TPERUPESZZJCQINpj-9wH6mY&callback=initMap';
            card.appendChild(div);
            card.appendChild(script1);
            card.appendChild(script2);
        }
        else {
            const p = document.createElement('p');
            p.setAttribute('id', 'p' + i);
            p.textContent = formatData(index, data);
            card.appendChild(p);
        }
    };
    request.send();
    i++;
}