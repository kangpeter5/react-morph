import React from "react";
import ReactDOM from "react-dom";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import useMorph from "./useMorph";

import "./App.css";

function App() {
  const [toggle, setCount] = useState(1);

  const morphTitle = useMorph({
    spring: {
      damping: 50
    }
  });
  const morphDiv = useMorph();
  const morph3 = useMorph();

  return (
    <div className="App">
      <button onClick={() => setCount(c => (c + 1) % 3)}>- Morph -</button>
      <br />
      {toggle ? (
        <>
          <h1 />
          <h1 {...morphTitle}>Hello Morph hook!</h1>
          <div className="from" {...morphDiv} />
        </>
      ) : (
          <>
            <br />
            <br />
            <br />
            <h5 {...morphTitle}>Hello Morph hook!</h5>
            <div className="to" {...morphDiv} />
          </>
        )}
      hi

          {toggle === 0 && <div className="from" {...morph3} />}
          {toggle === 1 && <div className="to" {...morph3} />}
          {toggle === 2 && <div className="three" {...morph3} />}
    </div>
  );
}

export default App;
