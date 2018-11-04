import { Spring } from "wobble";

import {
  interpolateObject,
  applyOverlayStyle,
  diffRect,
  getTransformString
} from "./utils";

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
  // Create a new spring
  const spring = new Spring({
    fromValue,
    initialVelocity,
    toValue: 1,
    ...options.spring
  });

  // Set listeners for spring events, start the spring.

  const diffStyle = diffRect(rectFrom, rectTo);
  const cloneContainer = document.createElement("div");
  const clone = to.cloneNode(true);
  to.style.visibility = "hidden";

  let isDeleted = false;

  cloneContainer.appendChild(clone);
  options.portalElement.appendChild(cloneContainer);

  applyOverlayStyle(cloneContainer, rectTo);
  const cloneTranslateIn = interpolateObject(diffStyle, {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1
  });

  spring
    .onStart(onStart)
    .onUpdate(s => {
      cloneContainer.style.transform = getTransformString(
        cloneTranslateIn(s.currentValue)
      );
      onUpdate(s);
    })
    .onStop(s => {
      onStop(s);
      cleanup();
    })
    .start();

  const cleanup = () => {
    if (isDeleted) return;
    options.portalElement.removeChild(cloneContainer);
    to.style.visibility = "visible"; // show original to
    isDeleted = true;
  };

  return cleanup;
}
