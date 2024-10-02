const LogEvents = require('./logEvents');
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

eventEmitter.on('logEvent', (message) => {
    LogEvents(message);
});
setTimeout(() => {
    eventEmitter.emit('logEvent', 'new log event emitted');
}, 2000);
