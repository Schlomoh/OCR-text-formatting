//import * as tflite from "@tensorflow/tfjs-tflite";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import * as tflite from "@tensorflow/tfjs-tflite";

class Normalizer {
  constructor(message) {
    this.message = message;
    this.replacements = [
      { oldStr: "won't", newStr: " will not" },
      { oldStr: "n't", newStr: " not" },
      { oldStr: "'ve", newStr: " have" },
      { oldStr: "'re", newStr: " are" },
      { oldStr: "'ll", newStr: " will" },
      { oldStr: "'m", newStr: " am" },
    ];
  }

  /**
   * finds all occurences of "oldStr" and replaces them
   * @param {string} string - the input text
   * @param {string} oldStr - part which to replace
   * @param {string} newStr - the replacement string
   * @returns the altered input string
   */
  _replacer(string, oldStr, newStr) {
    let result = string.replaceAll(oldStr, newStr);
    return result;
  }

  /**
   * Goes through a list replacement pairs and passes them to the private replacer method
   * @param {string} msg - string on which to apply the replacer
   * @returns the altered input string
   */
  _replaceIterator(msg) {
    this.replacements.forEach((replacePair) => {
      msg = this._replacer(msg, replacePair.oldStr, replacePair.newStr);
    });
    return msg;
  }

  /**
   * Cleans up punctuation inside the input string using a regular expression
   * @param {string} msg - the string in which to remove unnecessary punctuation marks
   * @returns the altered input string
   */
  _cleanPunctuation(msg) {
    /**finds multiple puntuations in a string and removes all but the last*/
    let re = /[.?!]*(?=[.?!]$)/g;
    return msg.replace(re, "");
  }
  /**
   * The modified input string.
   * Reformating short terms to their full length and removing redundant punctuation
   */
  get normalizedString() {
    return this._cleanPunctuation(this._replaceIterator(this.message));
  }
}

export class Responder {
  constructor(message, modelSrc = "./smartreply.tflite") {
    this.message = message;
    this.modelSrc = modelSrc;
  }

  _normalize() {
    let norm = new Normalizer(this.message);
    return norm.normalizedString;
  }

  get _normalizedString() {
    return this._normalize();
  }

  async _loadModel() {
    return await tflite.loadTFLiteModel("smartreply_1_default_1.tflite");
  }

  async getResponse(stateSetter) {
    const model = await this._loadModel();
    const outputTensor = model.predict(this._normalizedString);
    stateSetter(outputTensor.dataSync());
  }
}
