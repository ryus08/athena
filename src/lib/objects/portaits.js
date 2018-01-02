const cv = require('opencv');
const Polygon = require('polygon');
const Promise = require('bluebird');


const lowThresh = 0;
const highThresh = 100;
const nIters = 2;
const minArea = 6000;
const maxArea = 9000;

class Portraits {
  constructor(foundPolygons, width, height) {
    this._foundPolygons = foundPolygons;
    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get foundPolygons() {
    return this._foundPolygons;
  }

  static async fromTraining(imagePath) {
    const image = await Promise.promisify(cv.readImage)(imagePath);

    const width = image.width();
    const height = image.height();
    if (width < 1 || height < 1) {
      throw new Error('Image has no size');
    }

    image.convertGrayscale();
    image.canny(lowThresh, highThresh);
    image.dilate(nIters);
    const contours = image.findContours();

    const polygons = [];
    for (let i = 0; i < contours.size(); i += 1) {
      if (contours.area(i) > minArea && contours.area(i) < maxArea) {
        const arcLength = contours.arcLength(i, true);
        contours.approxPolyDP(i, 0.01 * arcLength, true);

        if (contours.isConvex(i)) {
          const points = [];

          for (let j = 0; j < contours.cornerCount(i); j += 1) {
            points.push(contours.point(i, j));
          }
          polygons.push(new Polygon(points));
        }
      }
    }

    return new Portraits(polygons, width, height);
  }
}

module.exports = Portraits;
