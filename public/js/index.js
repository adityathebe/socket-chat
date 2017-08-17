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

socket.on('newLocationMsg', function(msg) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');

    li.text(`${msg.from} - `);
    a.attr('href', msg.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    var messageBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from : 'Client',
        text : messageBox.val(),
    }, function(data) {
        messageBox.val('');
    });
});

var locationBtn = jQuery('#send-location');
locationBtn.on('click', function() {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    locationBtn.attr('disabled', 'disabled').text('Sending location');

    navigator.geolocation.getCurrentPosition(function(position) {
        locationBtn.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMsg', {
            lat : position.coords.latitude,
            lon : position.coords.longitude,
        });
    }, function() {
        locationBtn.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location')
    });
})