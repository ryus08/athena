var PNG = require('pngjs').PNG,
    jimp = require('jimp'),
    Promise = require('bluebird'),
    writeFile = Promise.promisify(require('fs').writeFile),
    StreamToBuffer =  Promise.promisify(require("stream-to-buffer")),
    pixelmatch = require('pixelmatch');
    
if (require.main === module) {
  void async function run() {
    var prompt = require('prompt');
    prompt.start();
    var sourceFilename1 = process.argv[2] || (await Promise.promisify(prompt.get)(['sourceFilename1'])).sourceFilename;
    var sourceFilename2 = process.argv[3] || (await Promise.promisify(prompt.get)(['sourceFilename2'])).sourceFilename;
    let image1 = await jimp.read(sourceFilename1);
    let image2 = await jimp.read(sourceFilename2);
    try {
        var diff = new PNG({width: image1.bitmap.width, height: image1.bitmap.height});
        
        pixelmatch(image1.bitmap.data, image2.bitmap.data, diff.data, image1.bitmap.width, image1.bitmap.height, {threshold: 0.05, includeAA: true});

        await StreamToBuffer(diff.pack()).then(buffer => writeFile("out.png", buffer));
    }
    catch(e){
        console.log(e);
    }
    }();
}