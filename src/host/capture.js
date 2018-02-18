const { app, globalShortcut } = require('electron');
const screenshot = require('desktop-screenshot');
const moment = require('moment');
const path = require('path');

let dir = "screenshots";
let fileprefix = "screenshot";
app.on('ready', () => {
  globalShortcut.register('G', () => {
    screenshot(`${dir}/${fileprefix}-${moment().format("YYYY-MM-DD-hh-mm-ss-SSS")}.png`, (error) => {
      if (error) {
        console.log('Screenshot failed', error);
      } else {
        console.log('Screenshot succeeded');
      }
    });
  });
});
