import { Spring } from "wobble";
import { cubicBezier } from "@popmotion/popcorn";

import { applyOverlayStyle } from "./utils";

const ease = cubicBezier(0.5, 0.5, 0, 1);

export default function({
  from,
  to,
  rectFrom,
  rectTo,
  fromValue = 0,
  initialVelocity,
  onUpdate = () => {},
  onStart = () => {},
  onStop = () => {},
  options
}) {
  const spring = new Spring({
    fromValue,
    initialVelocity,
    toValue: 1,
    ...options.spring
  });

  to.style.visibility = "hidden";

  applyOverlayStyle(to, rectTo);
  applyOverlayStyle(from, rectFrom);

  let isDeleted = false;

  spring
    .onStart(onStart)
    .onUpdate(s => {
      const progress = s.currentValue;

      to.style.opacity = ease(progress);
      from.style.opacity = ease(progress);
      onUpdate(s);
    })
    .onStop(s => {
      onStop(s);
      cleanup();
    })
    .start();

  const cleanup = () => {
    if (isDeleted) return;
    to.style.visibility = "visible"; // show original to
    isDeleted = true;
  };

  return cleanup;
}
