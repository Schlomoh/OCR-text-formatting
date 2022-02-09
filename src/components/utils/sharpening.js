import Image from "image-js";

/**
 *
 * @param {Image} image
 */

export function sharpen(image) {
  //prettier-ignore
  const sharpeningKernel = [[0,-1,0],
                            [-1,5,-1],
                            [0,-1,0]]

  const kernelCenter = Math.floor(sharpeningKernel[1].length / 2);

  for (let h = 0; h < image.height; h++) {
    for (let w = 0; w < image.width; w++) {
      // picture
      // 0,1,2 for each channel as index 
      let pixel = [0,1,2].map((i) => {
        //kernel
        return sharpeningKernel.reduce((accu, row) => {
          let offset = kernelCenter * -1;
          row.forEach((kernelValue) => {
            if (!(w - offset < 0 || h - offset < 0)) {
              accu += image.getPixelXY(w - offset, h - offset)[i] * kernelValue;
            }
            offset += 1;
          });
          return accu;
        });
      });
      image.setPixelXY(w, h, pixel);
    }
  }

  return image;
  //image.getPixelXY(a,b)
}
