import { useRef, useEffect } from "react";

import morphTransition from "./morphTransition";
import usePrevious from "./usePrevious";
import { getRect } from "./utils";

const defaultsOptions = {
  portalElement: document.body,
  getMargins: true,
  spring: {
    stiffness: 179,
    damping: 50,
    mass: 1
  }
};

const STATES_MAXINE = {
  initialState: "INIT",
  states: {
    // Hide to
    // Save previous
    INIT: "GET_RECTS"
  }
};

export default function useMorph(opts = defaultsOptions) {
  const options = { ...defaultsOptions, ...opts };
  const ref = useRef();
  let to = ref.current;

  const prevToRef = useRef();
  const from = prevToRef.current;

  const rectFrom = from && getRect(from, { getMargins: options.getMargins });

  let isAnimating = false;
  const prevSpring = useRef();

  useEffect(() => {
    prevToRef.current = to;

    to.style.visibility = "visible";

    if (!from) return;
    if (isAnimating) return;
    isAnimating = true;

    const rectTo = getRect(to, { getMargins: options.getMargins });

    const cleanup = morphTransition({
      from,
      to,
      rectFrom,
      rectTo,
      fromValue:
        prevSpring.current !== undefined &&
        prevSpring.current.currentValue !== 1
          ? 1 - prevSpring.current.currentValue
          : 0,
      initialVelocity: prevSpring.current && prevSpring.current.currentVelocity,
      onUpdate(s) {
        prevSpring.current = s;
      },
      options
    });

    return () => {
      if (isAnimating) cleanup();
    };
  });

  const getRef = node => {
    if (!node) return;
    to = node;
  };

  return { ref: getRef, style: { visibility: "hidden" } };
}
