import { useEffect, useState } from "react";
import { TextAnalyser } from "./utils/TextAnalyser";
import "./textRecognition.css";

export const TextRecognition = () => {
  // states
  const [img, setImg] = useState(),
    [ocrText, setOcrText] = useState(""),
    [ocrRunning, setRunning] = useState(false),
    [init, setInit] = useState(false),
    [OCR, setOCR] = useState();

  const initialize = async () => {
    let ocr = new TextAnalyser();
    await ocr.initialize("deu");
    setInit(true);
    setOCR(ocr);
  };

  const removeAll = () => {
    setImg();
    setOcrText("");
  };

  const analyse = async (ocr) => {
    setRunning(true);
    try {
      ocr.inputImage = img;
      await ocr.analyse();
      setOcrText(ocr.formatedText);
      setRunning(false);
    } catch (e) {
      console.log(e);
      setOcrText("Something went wrong");
      setRunning(false);
    }
  };

  const Buttons = () => (
    <>
      <input
        type="file"
        id="imgInput"
        onInput={(e) => {
          setImg(e?.target.files[0]);
          setOcrText("");
        }}
      />
      <button
        disabled={!init || ocrRunning}
        onClick={() => document.getElementById("imgInput").click()}
      >
        Upload image
      </button>
      <button
        disabled={!img || ocrRunning || ocrText}
        onClick={() => analyse(OCR)}
      >
        <strong> Start OCR-ing</strong>
      </button>
      <button disabled={!img || ocrRunning} onClick={removeAll}>
        Remove Image
      </button>
    </>
  );

  const Image = () => {
    return (
      <div id="imageWrapper">
        {img ? (
          <img
            id="uploadImage"
            src={img ? URL.createObjectURL(img) : null}
            alt=""
          />
        ) : null}
      </div>
    );
  };

  const Results = () => {
    const ResultWrapper = ({ children }) => {
      return <div id="resultWrapper">{children}</div>;
    };

    return !init ? (
      <h3>Initializing...</h3>
    ) : init && !img && !ocrRunning ? (
      <h3>OCR Initialized. You may now upload an image.</h3>
    ) : img && !ocrRunning && !ocrText ? (
      <h3>You may now start the OCR analysing.</h3>
    ) : ocrRunning ? (
      <h3>Analysing...</h3>
    ) : ocrText ? (
      <>
        <h3>Result:</h3>
        <ResultWrapper>{ocrText}</ResultWrapper>
      </>
    ) : null;
  };

  // initialize when view is rendered even before an image was uploaded
  useEffect(() => {
    if (!init) initialize();
  });

  return (
    <div id="wrapperBox">
      <h2>OCR testing</h2>
      <Buttons />
      <Image />
      <Results />
    </div>
  );
};
