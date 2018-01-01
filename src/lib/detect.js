/*eslint-disable */
// Detects triangles and quadrilaterals
const cv = require('opencv');
const Polygon = require('polygon');

const lowThresh = 0;
const highThresh = 100;
const nIters = 2;
const minArea = 6000;
const maxArea = 9000;

const BLUE = [255, 0, 0]; // B, G, R
const RED = [0, 0, 255, 100]; // B, G, R
const GREEN = [0, 255, 0]; // B, G, R
const WHITE = [255, 255, 255]; // B, G, R

cv.readImage('C:\\Users\\Zach\\Desktop\\athena\\debugimages\\train\\test/test.jpg', (err, im) => {
  if (err) throw err;

  width = im.width();
  height = im.height();
  if (width < 1 || height < 1) throw new Error('Image has no size');

  const out = new cv.Matrix(height, width);
  im.convertGrayscale();
  imCanny = im.copy();
  imCanny.canny(lowThresh, highThresh);
  imCanny.dilate(nIters);

  contours = imCanny.findContours();

  for (i = 0; i < contours.size(); i++) {
    if (contours.area(i) < minArea || contours.area(i) > maxArea) continue;

    const arcLength = contours.arcLength(i, true);
    contours.approxPolyDP(i, 0.01 * arcLength, true);

    if (!contours.isConvex(i)) continue;

    console.log(contours.cornerCount(i));
    out.drawContour(contours, i, RED, RED);

    let leastX = Number.MAX_SAFE_INTEGER;
    let mostX = 0;
    let leastY = Number.MAX_SAFE_INTEGER;
    let mostY = 0;

    for (j = 0; j < contours.cornerCount(i); j++) {
      leastX = Math.min(leastX, contours.point(i, j).x);
      mostX = Math.max(mostX, contours.point(i, j).x);
      leastY = Math.min(leastY, contours.point(i, j).y);
      mostY = Math.max(mostY, contours.point(i, j).y);
    }

    const points = [];

    for (j = 0; j < contours.cornerCount(i); j++) {
      points.push(contours.point(i, j));
    }
    const p = new Polygon(points);

    const corner = p.closestPointTo(p.center());

    out.line([points[0].x, points[0].y], [points[2].x, points[2].y], GREEN);
    out.line([points[1].x, points[1].y], [points[3].x, points[3].y], WHITE);
    out.line([corner.x, corner.y], [corner.x, corner.y], BLUE);
  }

  out.save('C:\\Users\\Zach\\Desktop\\athena\\debugimages\\train\\test/detect-shapes.png');
});
/* eslint-enable */
