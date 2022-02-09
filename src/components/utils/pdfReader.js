import PDFParser from "pdf2json";
import { writeFile } from "fs";

class PdfReadout {
  constructor() {
    this._pdfParser = new PDFParser();
  }

  _handleData(data) {
    return data;
  }

  /**
   *
   * @param {string} filePath path to the pdf file including filename and extension
   */
  readPdf(filePath) {
    this._pdfParser.on("pdfParser_dataReady", (data) => {
      return this.handleData(data);
    });
    this._pdfParser.loadPDF(filePath);
  }
}
