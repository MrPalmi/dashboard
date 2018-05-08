const widget = [
    {
        'name': 'Météo',
        'url': '/weather/',
        'param': '',
    },
    {
        'name': 'Bourse',
        'url': '/stockmarket/',
        'param': '',
    },
    {
        'name': 'Date/Heure',
        'url': '/time/',
        'param': '',
    },
    {
        'name': 'Google Map',
        'url': '/lgtandlat/',
        'param': '',
    },
    {
        'name': 'Steam',
        'url': '/steam/',
        'param': '',
    },
    {
        'name': 'Allociné',
        'url': '/allocine/',
        'param': '',
    },
    {
        'name': 'Coinmarketcap',
        'url': '/coinmarketcap/',
        'param': '',
    },
    {
        'name': 'Subreddit Subscriber',
        'url': '/redditsubcount/',
        'param': '',
    },
];


const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);


const latlong = [];
let map = 0;


let firstRequest = new XMLHttpRequest();
firstRequest.open('GET', '/widgets');
firstRequest.onload = function () {
    let data = JSON.parse(this.response);
    for (let i = 0; data[i] ; i++) {
        if (data[i].name === 'Google Map'){
            console.log('too much map');
        }
        else {
            addHtmlWidgetStart(data[i])
        }
    }
};
firstRequest.send();


function addHtmlWidgetStart (myData) {
    let url = '';
    url = myData.url + myData.param;

    const card = document.createElement('div');
    card.setAttribute('class', 'card');

    const h1 = document.createElement('h1');
    h1.textContent = myData.name;
    container.appendChild(card);
    card.appendChild(h1);

    let j = 0;
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = function () {
        let data = JSON.parse(this.response);

        if (data.name === 'Google Map') {
            latlong[0] = data.lat;
            latlong[1] = data.lng;
            const div = document.createElement('div');
            div.setAttribute('id', 'map');
            const script1 = document.createElement('script');
            script1.src = '/scripts/map.js';
            const script2 = document.createElement('script');
            script2.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCoXD3dN_6TPERUPESZZJCQINpj-9wH6mY&callback=initMap';
            card.appendChild(div);
            card.appendChild(script1);
            card.appendChild(script2);
        }
        else {
            const p = document.createElement('p');
            p.setAttribute('id', 'p' + i);
            p.textContent = formatDataStart(data, myData);
            card.appendChild(p);
        }
    };
    request.send();
    i++;
}

function formatDataStart(data, myData){
    let p = '';
    switch (myData.name) {
        case 'Météo':
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
            p = 'A ' + myData.param + ' il fait actuellement ' + data.main.temp + '°C et le temps est ' + temps + '.';
            break;
        case 'Bourse':
            p = 'Le cours de l\'action ' + myData.param + ' est actuellement de '+ data + '$.';
            break;
        case 'Date/Heure':
            let array = data.formatted.split(' ');
            let date = array[0].split('-');
            p = 'A ' + myData.param + ' il est actuellement ' + array[1] + ' et nous sommes le ' + date[2] + '-' + date[1] + '-' + date[0] + '.';
            break;
        case 'Google Map':
            /* google map*/
            break;
        case 'Steam':
            p = 'Il y a actuellement ' + data +  ' joueurs connectés à ' + myData.param + '.';
            break;
        case 'Allociné':
            formatAllociné(data)
            break;
        case 'Coinmarketcap':
            p = 'La valeur du ' + data.data.name + ' est de ' + data.data.quotes.USD.price + '$.';
            p = 'La valeur du ' + data.data.name + ' est de ' + data.data.quotes.USD.price + '$.';
            break;
        case 'Subreddit Subscriber':
            p = 'Le subreddit "' + myData.param + '" possède ' + data + ' subscribers.';
            break;
        case 'subreddit':
            /* reddit 2 */
            break;
    }
    return p;
}








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
    if (selected.options[selected.selectedIndex].value - 1 === 3 && map != 0){
        console.log('too much map');
    }
    else {
        addHtmlWidget(selected.selectedIndex - 1);
        if (selected.options[selected.selectedIndex].value - 1 === 3)
            map++;
    }
    let request = new XMLHttpRequest();
    request.open('POST', '/widgets');
    request.setRequestHeader('Content-type', 'application/json');
    console.log(JSON.stringify(widget[selected.selectedIndex - 1]));
    request.send(JSON.stringify(widget[selected.selectedIndex - 1]));
}

let i = 0;
function addHtmlWidget (index) {
    if (index === 3 && map != 0){
        console.log('too much map');
    }
    else {
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

            if (index === 3 && map === 0) {
                latlong[0] = data.lat;
                latlong[1] = data.lng;
                const div = document.createElement('div');
                div.setAttribute('id', 'map');
                const script1 = document.createElement('script');
                script1.src = 'scripts/map.js';
                script1.async = false;
                const script2 = document.createElement('script');
                script2.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCoXD3dN_6TPERUPESZZJCQINpj-9wH6mY&callback=initMap';
                script2.async = false;
                card.appendChild(div);
                card.appendChild(script1);
                card.appendChild(script2);
                map++;
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
}

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
            formatAllociné(data);
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


function formatAllociné(data){
    var date = new Date();
    var array = []
    console.log("=================");
    var month = date.getMonth() + 1;
    var day = date.getDate() + 1;
    var year = date.getFullYear();
    var yet = 0;
    data.feed.theaterShowtimes[0].movieShowtimes.forEach(function (element) {;
        yet = 0;
        if (year == parseInt(element.scr[0].d.slice(0, 4)) &&
            day == parseInt(element.scr[0].d.slice(8, 10)) &&
            month == parseInt(element.scr[0].d.slice(5,7))){
                array.forEach(function(aElement) {
                    if (aElement.title == element.onShow.movie.title){
                        aElement.time += '/' + element.scr[0].t[0].$
                        yet = 1;
                    }
                }
            );
            if (yet == 0)
            {
                var elem = new Object();
                elem.title = element.onShow.movie.title;
                elem.time = element.scr[0].t[0].$;
                array.push(elem)
            }
        }
        }
    );
    console.log(array);
    console.log("=================");
}