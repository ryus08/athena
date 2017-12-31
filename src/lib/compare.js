const PNG = require('pngjs').PNG;
const jimp = require('jimp');
const Promise = require('bluebird');
const writeFile = Promise.promisify(require('fs').writeFile);
const streamToBuffer = Promise.promisify(require('stream-to-buffer'));
const pixelmatch = require('pixelmatch');

if (require.main === module) {
  void async function run() {
    let prompt = require('prompt');
    prompt.start();
    let sourceFilename1 = process.argv[2] || (await Promise.promisify(prompt.get)(['sourceFilename1'])).sourceFilename;
    let sourceFilename2 = process.argv[3] || (await Promise.promisify(prompt.get)(['sourceFilename2'])).sourceFilename;
    let image1 = await jimp.read(sourceFilename1);
    let image2 = await jimp.read(sourceFilename2);
    try {
        let diff = new PNG({width: image1.bitmap.width, height: image1.bitmap.height});

        pixelmatch(image1.bitmap.data, image2.bitmap.data, diff.data, image1.bitmap.width, image1.bitmap.height, {threshold: 0.05, includeAA: true});

        await streamToBuffer(diff.pack()).then((buffer) => writeFile('out.png', buffer));
    } catch (e) {
        console.log(e);
    }
    }();
}
