const widget = [
    {
        'name': 'Météo',
        'url': '/weather/',
        'param': '',
        'id': ''
    },
    {
        'name': 'Bourse',
        'url': '/stockmarket/',
        'param': '',
        'id': ''
    },
    {
        'name': 'Date/Heure',
        'url': '/time/',
        'param': '',
        'id': ''
    },
    {
        'name': 'Google Map',
        'url': '/lgtandlat/',
        'param': '',
        'id': ''
    },
    {
        'name': 'Steam',
        'url': '/steam/',
        'param': '',
        'id': ''
    },
    {
        'name': 'Allociné',
        'url': '/allocine/',
        'param': '',
        'id': ''
    },
    {
        'name': 'Coinmarketcap',
        'url': '/coinmarketcap/',
        'param': '',
        'id': ''
    },
    {
        'name': 'Subreddit Subscriber',
        'url': '/redditsubcount/',
        'param': '',
        'id': ''
    },
    {
        'name': 'Subreddit',
        'url': '/subreddit/',
        'param': '',
        'id': ''
    }
];


const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);


const latlong = [];
let map = 0;
let idValue = 0;

let firstRequest = new XMLHttpRequest();
firstRequest.open('GET', '/widgets');
firstRequest.onload = function () {
    let data = JSON.parse(this.response);
    for (let i = 0; data[i]; i++) {
        addHtmlWidgetStart(data[i])
    }
};
firstRequest.send();


function addHtmlWidgetStart(myData) {
    let url = '';
    url = myData.url + myData.param;

    const card = document.createElement('div');
    card.setAttribute('class', 'card');

    const h1 = document.createElement('h1');
    h1.textContent = myData.name;
    container.appendChild(card);
    card.appendChild(h1);

    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = function () {
        let data = JSON.parse(this.response);
        if (data.error){
            const p = document.createElement('p');
            p.textContent = data.message;
            p.setAttribute('id', myData.id);
            card.appendChild(p);
        }
        else {
            if (myData.name === 'Google Map') {
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
            else if (myData.name === 'Allociné') {
                let array = formatAllociné(data);
                const div = document.createElement('div');
                for (let i = 0; array[i]; i++) {
                    const p = document.createElement('p');
                    p.textContent = array[i].title + ' { ' + array[i].time + ' }';
                    div.appendChild(p);
                }
                card.appendChild(div);
            }
            else if (myData.name === 'Subreddit') {
                const div = document.createElement('div');
                div.setAttribute('style', 'overflow-y: auto');
                for (let i = 0; data.data.children[i]; i++) {
                    const p = document.createElement('p');
                    const a = document.createElement('a');
                    a.textContent = data.data.children[i].data.title;
                    a.setAttribute('href', 'https://www.reddit.com/' + data.data.children[i].data.permalink);
                    a.setAttribute('target', '_blank');
                    p.appendChild(a);
                    div.appendChild(p);
                }
                card.appendChild(div);
            }
            else {
                const p = document.createElement('p');
                p.setAttribute('id', myData.id);
                p.textContent = formatDataStart(data, myData);
                card.appendChild(p);
            }
        }
        idValue++;
    };
    request.send();
}

function formatDataStart(data, myData) {
    let p = '';
        switch (myData.name) {
            case 'Météo':
                let temps = '';
                switch (data.weather[0].main) {
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
                p = 'Le cours de l\'action ' + myData.param + ' est actuellement de ' + data + '$.';
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
                p = 'Il y a actuellement ' + data + ' joueurs connectés à ' + myData.param + '.';
                break;
            case 'Allociné':
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

function addWidget() {
    let selected = document.getElementById('widgetName');
    let param = document.getElementById('param');
    if (selected.options[selected.selectedIndex].value - 1 != 3) {
        if (selected.options[selected.selectedIndex].value && param.value) {
            widget.forEach(function (elem) {
                if (elem.name === 'Steam'){
                    let labelparam = document.getElementById('paramlabel');
                    elem.param = labelparam.value;
                }
                else {
                    if (elem.name === selected.options[selected.selectedIndex].value) {
                        elem.param = param.value;
                    }
                }
            });
        }
    }
    if (selected.options[selected.selectedIndex].value - 1 === 3 && map != 0) {
        console.log('too much map');
    }
    else {
        addHtmlWidget(selected.selectedIndex - 1);
        idValue++;
        if (selected.options[selected.selectedIndex].value - 1 === 3)
            map++;
    }
}

function addHtmlWidget(index) {
    if (index === 3 && map != 0) {
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
            if (data.error) {
                const p = document.createElement('p');
                p.textContent = data.message;
                p.setAttribute('id', idValue);
                card.appendChild(p);
            }
            else {
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
                else if (index === 5) {
                    let array = formatAllociné(data);
                    const div = document.createElement('div');
                    div.setAttribute('style', 'overflow-y: auto');
                    for (let i = 0; array[i]; i++) {
                        const p = document.createElement('p');
                        p.textContent = array[i].title + ' { ' + array[i].time + ' }';
                        div.appendChild(p);
                    }
                    card.appendChild(div);
                }
                else if (index === 8) {
                    const div = document.createElement('div');
                    div.setAttribute('style', 'overflow-y: auto');
                    for (let i = 0; data.data.children[i]; i++) {
                        const p = document.createElement('p');
                        const a = document.createElement('a');
                        a.textContent = data.data.children[i].data.title;
                        a.setAttribute('href', 'https://www.reddit.com/' + data.data.children[i].data.permalink);
                        a.setAttribute('target', '_blank');
                        p.appendChild(a);
                        div.appendChild(p);
                    }
                    card.appendChild(div);
                }
                else {
                    const p = document.createElement('p');
                    p.setAttribute('id', idValue - 1);
                    p.textContent = formatData(index, data);
                    card.appendChild(p);
                }
            }
        };
        widget[index].id = idValue;
        let frequest = new XMLHttpRequest();
        frequest.open('POST', '/widgets');
        frequest.setRequestHeader('Content-type', 'application/json');
        frequest.send(JSON.stringify(widget[index]));
        request.send();
        location.reload();
    }
}

function formatData(index, data) {
    let p = '';

        switch (index) {
            case 0:
                let temps = '';
                switch (data.weather[0].main) {
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
                p = 'Le cours de l\'action ' + widget[index].param + ' est actuellement de ' + data + '$.';
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
                p = 'Il y a actuellement ' + data + ' joueurs connectés à ' + widget[index].param + '.';
                break;
            case 5:
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


function formatAllociné(data) {
    let date = new Date();
    let array = [];
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    let yet = 0;
    var monthTab = ['janvier', 'février', 'mars', 'avril',
        'mai', 'juin', 'juillet', 'août',
        'septembre', 'octobre', 'novembre', 'décembre']

    data.feed.theaterShowtimes[0].movieShowtimes.forEach(function (element) {
        var display = element.display
        var seances = display.split("\r\n");
        seances.forEach(function (seance) {
            //On va séparer les heures de la data
            var sep1 = seance.split(":");

            //D'abord la date
            var date = sep1[0].split("du")[1].trim();
            var date = date.split(" ");
            var nameDay = date[0];
            var dayNumber = parseInt(date[1]);
            var seanceMonth = date[2];
            var seanceYear = parseInt(date[3]);
            //Ensuite les séances dispo
            sep1.splice(0, 1)
            sep1 = sep1.join(':').trim();
            hours = sep1.split(', ');
            //TADAM
            hours.forEach(function (hour) {
                //              console.log(hour);
                yet = 0;
                if (monthTab[month] === seanceMonth &&
                    dayNumber === day &&
                    year === seanceYear) {

                    array.forEach(function (aElement) {
                        if (aElement.title == element.onShow.movie.title) {
                            aElement.time += ', ' + hour;
                            yet = 1;
                        }
                    }
                    );
                    if (yet == 0) {
                        let elem = new Object();
                        elem.title = element.onShow.movie.title;
                        elem.time = hour;
                        array.push(elem)
                    }
                }
            });
        });
    }
    );
    return array;
}

function refreshData(widget) {
    let request = new XMLHttpRequest();
    request.open('GET', widget.url + widget.param);
    request.onload = function () {
        let data = JSON.parse(this.response);
        if (data.error) {
            document.getElementById(widget.id).innerHTML = data.message;
        }
        else {
            switch (widget.name) {
                case 'Météo':
                    let temps = '';
                    switch (data.weather[0].main) {
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
                    document.getElementById(widget.id).innerHTML = 'A ' + widget.param + ' il fait actuellement ' + data.main.temp + '°C et le temps est ' + temps + '.';
                    break;
                case 'Bourse':
                    document.getElementById(widget.id).innerHTML = 'Le cours de l\'action ' + widget.param + ' est actuellement de ' + data + '$.';
                    break;
                case 'Date/Heure':
                    let array = data.formatted.split(' ');
                    let date = array[0].split('-');
                    document.getElementById(widget.id).innerHTML = 'A ' + widget.param + ' il est actuellement ' + array[1] + ' et nous sommes le ' + date[2] + '-' + date[1] + '-' + date[0] + '.';
                    break;
                case 'Google Map':
                    /* google map*/
                    break;
                case 'Steam':
                    document.getElementById(widget.id).innerHTML = 'Il y a actuellement ' + data + ' joueurs connectés à ' + widget.param + '.';
                    break;
                case 'Allociné':
                    break;
                case 'Coinmarketcap':
                    document.getElementById(widget.id).innerHTML = 'La valeur du ' + data.data.name + ' est de ' + data.data.quotes.USD.price + '$.';
                    document.getElementById(widget.id).innerHTML = 'La valeur du ' + data.data.name + ' est de ' + data.data.quotes.USD.price + '$.';
                    break;
                case 'Subreddit Subscriber':
                    document.getElementById(widget.id).innerHTML = 'Le subreddit "' + widget.param + '" possède ' + data + ' subscribers.';
                    break;
                case 'Subreddit':
                    /* reddit 2 */
                    break
            }
        }
    };
    request.send();
}

function executeAsync(func) {
    setTimeout(func, 0);
}

setInterval(function refreshWeather(){
    let Request = new XMLHttpRequest();
    Request.open('GET', '/widgets');
    Request.onload = function () {
        let data = JSON.parse(this.response);
        for (let i = 0; data[i]; i++) {
            new refreshData(data[i]);
            // executeAsync(function() {
            // });
        }
    };
    Request.send();
}, 1000);