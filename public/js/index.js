var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMsg', function(msg) {
    var li = jQuery('<li></li>');
    li.text(`${msg.from} - ${msg.text}`);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from : 'Client',
        text : jQuery('[name=message]').val(),
    }, function(data) {
        console.log(data);
    });
});

var locationBtn = jQuery('#send-location');
locationBtn.on('click', function() {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMsg', {
            lat : position.coords.latitude,
            lon : position.coords.longitude,
        })
    }, function() {
        alert('Unable to fetch location')
    });
})