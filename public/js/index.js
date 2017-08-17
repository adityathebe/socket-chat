var socket = io();

function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMsg = messages.children('li:last-child');

    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMsgHeight = newMsg.innerHeight();
    var lastMsgHeight = newMsg.prev().innerHeight();

    if (clientHeight + scrollTop + newMsgHeight + lastMsgHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }    
}

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMsg', function(msg) {
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text : msg.text,
        from : msg.from,
        time : formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMsg', function(msg) {
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from : msg.from,
        url : msg.url,
        time : formattedTime,
    });
    jQuery('#messages').append(html);
    scrollToBottom();
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