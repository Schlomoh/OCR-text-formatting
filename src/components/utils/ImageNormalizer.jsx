import { Image } from "image-js";

//////////////////// Example
//////////////////////////////////////////////////////////////////////////////

async function execute() {
  let image = await Image.load("cat.jpg");
  let grey = image
    .grey() // convert the image to greyscale.
    .resize({ width: 200 }) // resize the image, forcing a width of 200 pixels. The height is computed automatically to preserve the aspect ratio.
    .rotate(30); // rotate the image clockwise by 30 degrees.
  return grey.save("cat.png");
}

execute().catch(console.error);

async function process() {
  let image = await Image.load(document.getElementById("color").src);

  let grey = image.grey();

  document.getElementById("result").src = grey.toDataURL();
}
process();

///////////////////////////////////////////////////////////////////////////////

export class ImageNormalizer {
  constructor(imgBlob) {
    this._imgBlob = imgBlob;
  }
  // resize to width of 1500px
  // turn into greyscale
  async _normalize() {
    let img = await Image.load(this._imgBlob);
    return img.resize({ width: 1500 }).grey();
  }
  get normalizedImage() {
    return this._normalize();
  }
}
