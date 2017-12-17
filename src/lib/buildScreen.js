var fs = require('fs'),
    jimp = require('jimp'),
    Promise = require('bluebird'),
    pixelmatch = require('pixelmatch');

// Takes an images that is greyscale and red and converts it to black and white.
var decide = function(image) {
    image.opaque();
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        this.bitmap.data[idx] = this.bitmap.data[idx + 1] = this.bitmap.data[idx + 2] = 
            this.bitmap.data[idx] == 255 ? 255 : 0;
    });
};

if (require.main === module) {
  void async function run() {
    var prompt = require('prompt');
    prompt.start();
    var sourceFilename = process.argv[2] || (await Promise.promisify(prompt.get)(['sourceFilename1'])).sourceFilename;
    let image = await Promise.promisify(jimp.read)(sourceFilename);
    decide(image);
    image.write("screen.png");
    }();
}