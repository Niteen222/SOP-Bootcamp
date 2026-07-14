import { useState } from "react";
import SpeechRecorder from "../SpeechRecorder";


export default function Lesson() {
  const [text, setText] = useState("");

  return (
    <div>
      <h2>Variables</h2>

      <div
        style={{
          background: "#eee",
          padding: "15px",
          marginBottom: "10px"
        }}
      >
        🤖 A variable is like a labeled box where
        you store something.
      </div>

      <SpeechRecorder setText={setText} />

      <textarea
        rows="5"
        style={{ width: "100%", marginTop: "10px" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button style={{ marginTop: "10px" }}>
        Submit
      </button>
    </div>
  );
}