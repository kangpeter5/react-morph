import React from "react";
import { useState } from "react";
import useMorph from "./useMorph";

import "./App.css";
const spring = {
  damping: 26,
  mass: 1,
  stiffness: 170
};

function App() {
  const [toggle, setCount] = useState(1);

  const onClick = () => setCount(c => !c);

  // const morphTitle = useMorph({
  // spring,
  //   onClick
  // });
  const morphDiv = useMorph({ spring, onClick });
  const fade = useMorph({ type: "fade", spring });
  // const morph3 = useMorph();

  // const mock = {};

  return (
    <div className="App">
      <button onClick={onClick}>- Morph -</button>
      {/* <button onClick={() => setCount(c => (c + 1) % 3)}>- Morph -</button> */}
      <br />
      {toggle ? (
        <>
          {/* <h1 {...morphTitle}>Hello Morph hook!</h1> */}
          <div key="from" className="from" {...morphDiv()}>
            <p key="fade-from" {...fade()}>
              From ipsum
            </p>
          </div>
        </>
      ) : (
        <>
          {/* <h5 {...morphTitle}>Hello Morph</h5> */}
          <div key="to" className="to" {...morphDiv()}>
            <p key="fade-to" {...fade()}>
              To ipsum
            </p>
          </div>
        </>
      )}
      {/* {toggle === 0 && <div className="from" {...morph3} />}
      {toggle === 1 && <div className="to" {...morph3} />}
      {toggle === 2 && <div className="three" {...morph3} />} */}
    </div>
  );
}

export default App;
