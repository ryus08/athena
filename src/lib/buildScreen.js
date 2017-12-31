const jimp = require('jimp');
const Promise = require('bluebird');

// Takes an images that is greyscale and red and converts it to black and white.
const decide = function(image) {
  image.opaque();
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    this.bitmap.data[idx] = this.bitmap.data[idx + 1] = this.bitmap.data[idx + 2] =
            this.bitmap.data[idx] == 255 ? 255 : 0;
  });
};

if (require.main === module) {
  void async function run() {
    let prompt = require('prompt');
    prompt.start();
    let sourceFilename = process.argv[2] || (await Promise.promisify(prompt.get)(['sourceFilename1'])).sourceFilename;
    let image = await Promise.promisify(jimp.read)(sourceFilename);
    decide(image);
    image.write('screen.png');
  }();
}
