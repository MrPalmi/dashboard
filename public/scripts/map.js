function initMap() {
    var uluru = {lat: latlong[0], lng: latlong[1]};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });
}