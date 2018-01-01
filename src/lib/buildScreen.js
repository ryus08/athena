const jimp = require('jimp');
const Promise = require('bluebird');
const prompt = require('prompt');

// Takes an images that is greyscale and red and converts it to black and white.
function decide(image) {
  image.opaque();
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    this.bitmap.data[idx] = this.bitmap.data[idx] === 255 ? 255 : 0;
    this.bitmap.data[idx + 1] = this.bitmap.data[idx];
    this.bitmap.data[idx + 2] = this.bitmap.data[idx];
  });
}

if (require.main === module) {
  (async function run() {
    prompt.start();
    const sourceFilename = process.argv[2] || (await Promise.promisify(prompt.get)(['sourceFilename1'])).sourceFilename;
    const image = await Promise.promisify(jimp.read)(sourceFilename);
    decide(image);
    image.write('screen.png');
  }());
}
