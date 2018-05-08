function parsingData (data) {
    console.log(data)
}

let Request = new XMLHttpRequest();
Request.open('GET', 'https://epitech-dashboard.herokuapp.com/allocine/P0076');
Request.onload = function () {
    let data = JSON.parse(this.response);
    parsingData(data);
};
Request.send();