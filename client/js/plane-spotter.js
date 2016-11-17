// cache els

var $body = $('body');
var $bg = $('.bg');
var $detail = $('.detail');
var $flightNumber = $('.flight-number');
var $altitude = $('.altitude');
var $latitude = $('.latitude');
var $longitude = $('.longitude');
var $speed = $('.speed');
var $distance = $('.distance');
var $route = $('.route');
var $reload = $('.reload');
var $url = $('.url');

// sockets

var socket = io();
var lastState;

socket.on('state', function (state) {
    if (lastState && lastState.imagePath === state.imagePath) {
        updateText(state);
    } else {
        var showDetail = $body.hasClass('show');
        $body.removeClass('show');
        $bg.fadeOut(1000, function () {
            updateText(state);
            $bg
                .css('background-image', 'url('+state.imagePath+')')
                .fadeIn(1000);
            if (showDetail) {
                $body.addClass('show');
            }
        });
    }
    lastState = state;
});

function updateText (state) {
    $url.text(state.url);
    $route.text(state.route.description);

    if (state.distance) {
        $distance.text(state.distance.toFixed(2) + 'mi');
    } else {
        $distance.text('-');
    }

    if (state.plane) {
        $flightNumber.text(state.plane.flight.trim());
        $altitude.text(state.plane.altitude + 'ft' ||  '-');
        $latitude.text(state.plane.lat);
        $longitude.text(state.plane.lon);
        $speed.text(state.plane.speed + 'mph' || '-');
    } else {
        $flightNumber.text('-');
        $altitude.text('-');
        $latitude.text('-');
        $longitude.text('-');
        $speed.text('-');
    }
}

// detail

$detail.on('click', function (e) {
    $body.toggleClass('show');
});

// reload

$reload.on('click', function (e) {
    e.preventDefault();
    window.location.reload();
})

// debug

socket.on('debug', function (data) {
    console.log.apply(console.log, data);
})