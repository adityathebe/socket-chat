const moment = require('moment');

var generateMsg = (from, text) => {
    return {
        from,
        text,
        createdAt : moment().valueOf()
    }
}

var generateLocationMsg = (from, lat, lon) => {
    return {
        from,
        url : `https://www.google.com/maps?q=${lat},${lon}`,
        createdAt : moment().valueOf()
    }
}

module.exports = {
    generateMsg,
    generateLocationMsg
}