import { useState } from "react";
import { Responder } from "./utils/stringFunctionality";

export const SmartReply = () => {
  const [text, setText] = useState();
  const [response, setResponse] = useState();

  return (
    <div
      style={{
        margin: "20px",
        padding: "30px",
        backgroundColor: "lightgrey",
        borderRadius: "20px",
      }}
    >
      <h2>smartreply testing</h2>
      <input
        type="text"
        placeholder="To test"
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button
        onClick={() => {
          let resp = new Responder(text);
          setResponse(resp._normalize());
        }}
      >
        Get response
      </button>
      <h4>{text}</h4>
      <p>{response}</p>
    </div>
  );
};
