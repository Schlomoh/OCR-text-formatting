import Image from "image-js";
import { createWorker } from "tesseract.js";
import { FormatDecoder } from "./FormatDecoder";
import { sharpen } from "./sharpening";

// The OCR analysing
export class TextAnalyser {
  /**
   * @param {string} lang the language code the model shall be initialized with
   */
  constructor() {
    this._image = "";
    this._worker = createWorker();
    this._result = null;
    this.isReady = false;
  }

  /**
   * Initialize the engine with the tesseract ocr model
   */
  async initialize(lang) {
    await this._worker.load();
    await this._worker.loadLanguage(lang);
    await this._worker.initialize(lang);
    this.isReady = true;
    console.log("OCR initialized");
  }

  /**
   * normalizes image by turning it into greyscale
   * and resizing it to a width of 1500px
   *
   * @returns {string} a data URL of the new img
   */

  async _normalizeImage() {
    const im = await Image.load(URL.createObjectURL(this._image));
    const sharpened = sharpen(im)
    return sharpened.resize({ width: 1500 }).grey().toDataURL();
  }

  /**
   * Can be called independently when an image was set
   *
   * Also gets called when no result is defined and a text
   * getter method is called
   *
   * @param {string} image - the image url
   * @returns text recognized by the OCR engine as string
   */
  async analyse() {
    if (this.isReady && this._image !== "") {
      try {
        const normalized = await this._normalizeImage();
        const { data } = await this._worker.recognize(normalized);
        console.log(data);
        this._result = data;
      } catch (er) {
        console.log(er);
      }
    } else {
      console.log("Could not do OCR analysing. No image was defined.");
    }
  }

  /**
   * Sets the input image
   * @param {string} img
   */
  set inputImage(img) {
    this._image = img;
  }

  /**
   * Can be called without having called the "analyse" method
   *
   * @returns {string} a string of the text recognized in the image
   */
  get stringText() {
    if (this._result) return this._result.text;
    else
      return this.analyse().then(() => {
        return this._result.text;
      });
  }

  /**
   * @returns {array} an array of lines, each line formatted as an html element
   */
  get formatedText() {
    const Formatter = new FormatDecoder(this._result);
    return Formatter.formatedText;
  }
}
