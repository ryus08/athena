const {app, globalShortcut} = require('electron');
const screenshot = require('desktop-screenshot');
let count = 1;
app.on('ready', () => {
    globalShortcut.register('V', () => {
        screenshot(`screenshot${count}.png`, function(error, complete) {
            count = count + 1;
            if (error) {
                console.log('Screenshot failed', error);
            } else {
                console.log('Screenshot succeeded');
            }
        });
    });
});
