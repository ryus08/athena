const { PNG } = require('pngjs');
const jimp = require('jimp');
const Promise = require('bluebird');
const writeFile = Promise.promisify(require('fs').writeFile);
const streamToBuffer = Promise.promisify(require('stream-to-buffer'));
const pixelmatch = require('pixelmatch');
const prompt = require('prompt');

if (require.main === module) {
  (async function run() {
    prompt.start();
    const sourceFilename1 = process.argv[2] || (await Promise.promisify(prompt.get)(['sourceFilename1'])).sourceFilename;
    const sourceFilename2 = process.argv[3] || (await Promise.promisify(prompt.get)(['sourceFilename2'])).sourceFilename;
    const image1 = await jimp.read(sourceFilename1);
    const image2 = await jimp.read(sourceFilename2);
    try {
      const diff = new PNG({ width: image1.bitmap.width, height: image1.bitmap.height });

      pixelmatch(image1.bitmap.data, image2.bitmap.data, diff.data, image1.bitmap.width, image1.bitmap.height, { threshold: 0.05, includeAA: true });

      await streamToBuffer(diff.pack()).then(buffer => writeFile('out.png', buffer));
    } catch (e) {
      console.log(e);
    }
  }());
}
