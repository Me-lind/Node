const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');
const fs = require('fs');
const path = require('path');

async function LogEvents() {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    logItem = `${dateTime} - ${uuidv4()} - new log event emitted`;

    const folderPath = path.join(__dirname, 'Logs');

    // if file does not exist create one
    try {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    } catch (err) {
        console.error(err);
    }

    // append log item
    fs.appendFile(path.join(folderPath, 'eventLogs.txt'), logItem + '\n', (err) => {
        if (err) throw err;
        console.log('Log item saved🎉🎉');
    });

}
module.exports = LogEvents;

