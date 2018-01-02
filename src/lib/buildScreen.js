const Jimp = require('jimp');
const Promise = require('bluebird');
const Portraits = require('./objects/portaits');
const prompt = require('prompt');
const _ = require('lodash');

function decide(image, portraits) {
  const portaitImage = image;
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    if (!_.some(portraits.polygons, polygon => polygon.containsPoint({ x, y }))) {
      portaitImage.bitmap.data[idx + 3] = 0;
      portaitImage.bitmap.data[idx] = 0;
    }
  });
}

if (require.main === module) {
  (async function run() {
    prompt.start();
    const portraits = await Portraits.fromTraining('C:\\Users\\Zach\\Desktop\\athena\\debugimages\\train\\test/test.jpg');

    const sourceFilename = process.argv[2] || (await Promise.promisify(prompt.get)(['sourceFilename1'])).sourceFilename;
    const image = await Promise.promisify(Jimp.read)(sourceFilename);
    decide(image, portraits);
    image.write('screen.png');
  }());
}
