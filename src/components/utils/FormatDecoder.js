// Tries to determine formatting of text from tesseract.js output
export class FormatDecoder {
  /**
   * @param {array} result - the data output resulting from anaysing a picture document
   */
  constructor(result) {
    // result = {data}
    this._result = result;
  }

  /**
   * @param {array} lines
   * @param {number} confidence
   * @returns {array} array of filtered lines based on confidence values
   *
   * Alse removes lines that only contain punctuations
   */
  _filterLines(lines, confidence) {
    // prettier-ignore
    const punctuations = ["!",'"',"$","%","&","/","(",")","{","}","[","]","+","*","^","°","#",",",";",":",".",];
    const onlyPunctuation = (text) => {
      let only = true;
      // iterates through line string as array
      [...text].forEach((char) => {
        // sets 'only'(punctuation) to false when a char other than
        // punctuation was found
        punctuations.forEach((p) => {
          if (char !== p) only = false;
        });
      });
      return only;
    };

    return lines.reduce((accu, line) => {
      // Only add lines to result which surpass confidence threshold
      if (line.confidence >= confidence) {
        if (!onlyPunctuation(line.text)) accu.push(line);
      }
      return accu;
    }, []);
  }

  /**
   *
   * @returns {array} an array of lines with averaged height per line values
   */
  _addLineHeights(lines) {
    // Return array of line objects including the text line and average line height
    return lines.map((l) => {
      let [height, lineEnd] = l.baseline.has_baseline
        ? [l.baseline.y0 - l.bbox.y0, l.baseline.y0]
        : [l.bbox.y1 - l.bbox.y0, l.bbox.y1];

      return {
        ...l,
        height: height,
        lineEnd: lineEnd,
      };
    });
  }

  /**
   * takes the array of line objects and adds the
   * @param {array} lines
   * @returns
   */
  _addLineDistance(lines) {
    // accumulate all occurences of line heights

    const occur = lines.reduce((accu, line) => {
      let key = `size_${line.height}_px`;
      if (accu[key]) {
        accu[key] += 1;
      } else {
        accu[key] = 1;
      }
      return accu;
    }, {});

    console.log(occur);

    // get lines for determining line spacing
    let lineAfter, lineSpaceAfter;

    // add the line spacing after the line to the object array
    return lines.map((line, i) => {
      if (i < lines.length - 1) {
        lineAfter = lines.at(i + 1);
        lineSpaceAfter = lineAfter.lineEnd - lineAfter.height - line.lineEnd;
      } else {
        lineSpaceAfter = 0;
      }
      return { ...line, lineSpaceAfter };
    });
  }

  /**
   * merge lines with similar tags to create text blocks
   */
  _mergeLines(lines) {
    const last = { tag: "", index: 0, lineEnd: 0, lineSpaceAfter: 0 };
    let spaceNext = false;

    return lines.reduce((accu, line) => {
      //only merge paragraphs and lines with no spacing after
      if (
        //concats current line with last ones
        last.tag === line.format &&
        line.format === "p" &&
        !spaceNext &&
        last.lineSpaceAfter < line.height / 1.1
      ) {
        accu[last.index].text = accu[last.index].text.concat(` ${line.text}`);
      }
      // makes current line a new line so creates spacing
      else {
        accu.push(line);
        spaceNext = false;
      }

      // updating 'last' variable with current values for next iteration
      last.index = accu.length - 1;
      last.tag = line.format;
      last.lineSpaceAfter = line.lineSpaceAfter;
      return accu;
    }, []);
  }

  /**
   * Sorts the LWH ("lines with heights") array to determine percentages of
   * line height, then used to determine the individual sizing or formatting
   * depending on the ratio
   *
   * So if its an h1, h3 or p html tag. (so only three different sizes for now)
   *
   * @param {array} lines
   * @returns {array} the "lines with heights" array inlcuding definitions
   * on which html tag to use for formatting
   */
  _addHirarchy(lines) {
    // create new array with map so the 'lines' parameter doesnt get altered by the sort method
    // sorts the lines by height from biggest to smallest
    // LWH = L-ines W-ith H-eight
    let sortedLWH = lines.map((l) => l).sort((a, b) => b.height - a.height);

    const smallest = sortedLWH.at(-1).height;

    function sizeInc(line) {
      return Math.floor((100 / smallest) * line.height - 100);
    }

    /////////// Formatting /////////////
    return lines.map((line, i) => {
      if (sizeInc(line) > 25 && i === 0) return { ...line, format: "h1" };
      else if (sizeInc(line) > 20) return { ...line, format: "h3" };
      else return { ...line, format: "p" };
      //line = {format, text, height, lineEnd}
    });
  }

  /**
   * @returns {array} an array of html elements determined
   * by the "createHirarchy" method
   */
  _generateFormatedText(lines) {
    // checks format of the line and creates html tag
    return lines.map((line) => {
      switch (line.format) {
        case "h1":
          return <h1>{line.text}</h1>;
        case "h3":
          return <h3>{line.text}</h3>;
        default:
          return <p>{line.text}</p>;
      }
    });
  }

  /// Getters ///

  get formatedText() {
    return this._generateFormatedText(
      this._mergeLines(
        this._addHirarchy(
          this._addLineDistance(
            this._addLineHeights(this._filterLines(this._result.lines, 40))
          )
        )
      )
    );
  }
}
