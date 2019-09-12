let messages = require('./en.messages');

// This is taken from Intl.getIntlMessages
messages.get = function (path) {
    let pathParts = path.split('.');
    let message;

    try {
        message = pathParts.reduce(function (obj, pathPart) {
            return obj[pathPart];
        }, messages);
    } finally {
        if (message === undefined) {
            throw new ReferenceError('Could not find Intl message: ' + path);
        }
    }

    return message;
};

module.exports = messages;