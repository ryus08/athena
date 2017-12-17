var fs = require('fs'),
    jimp = require('jimp'),
    Promise = require('bluebird'),
    pixelmatch = require('pixelmatch');

var decide = function(image) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        
            var red   = this.bitmap.data[ idx + 0 ];
            var green = this.bitmap.data[ idx + 1 ];
            var blue  = this.bitmap.data[ idx + 2 ];
            var alpha = this.bitmap.data[ idx + 3 ];
        
        });
};

if (require.main === module) {
  void async function run() {
    var prompt = require('prompt');
    prompt.start();
    var sourceFilename = process.argv[2] || (await Promise.promisify(prompt.get)(['sourceFilename1'])).sourceFilename;
    let image = await Promise.promisify(jimp.read)(sourceFilename);
    image.posterize(2);
    image.opaque();
    image.write("screen.png");
    }();
}