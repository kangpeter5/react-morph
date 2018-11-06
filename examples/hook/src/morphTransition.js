import { Spring } from "wobble";
import { clamp, cubicBezier, interpolate } from "@popmotion/popcorn";

import {
  interpolateObject,
  applyOverlayStyle,
  diffRect,
  getTransformString,
  hideInnerMorph,
  cloneElement
} from "./utils";

const resetTranslate = {
  translateX: 0,
  translateY: 0,
  scaleX: 1,
  scaleY: 1
};

const ease = cubicBezier(0.5, 0.5, 0, 1);
const easeInOut = cubicBezier(0.5, 0.5, 0, 1);

const fadeDistance = 0.1;
const halfClampEnd = clamp(1 - fadeDistance, 1);
const halfClampStart = clamp(0, fadeDistance);
const easeFast = x =>
  easeInOut(interpolate([1 - fadeDistance, 1], [0, 1])(halfClampEnd(x)));
const easeSlow = x =>
  easeInOut(interpolate([0, fadeDistance], [0, 1])(halfClampStart(x)));

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

  const fromDiffStyle = diffRect(rectFrom, rectTo);
  const toDiffStyle = diffRect(rectTo, rectFrom);

  const toContainer = cloneElement(to, options.portalElement);
  const fromContainer = cloneElement(from, options.portalElement);

  // hideInnerMorph(toContainer);
  // hideInnerMorph(fromContainer);

  to.style.visibility = "hidden";
  from.style.visibility = "hidden";

  applyOverlayStyle(toContainer, rectTo);
  applyOverlayStyle(fromContainer, rectFrom);

  const toFLIP = interpolateObject(fromDiffStyle, resetTranslate);
  const fromFLIP = interpolateObject(resetTranslate, toDiffStyle);

  const toFade = interpolateObject({ opacity: 0 }, { opacity: 1 });
  const fromFade = interpolateObject({ opacity: 1 }, { opacity: 0 });

  let isDeleted = false;

  spring
    .onStart(onStart)
    .onUpdate(s => {
      const p = s.currentValue;

      switch (options.type) {
        case "fade":
          // toContainer.style.color = "red";
          // fromContainer.style.color = "green";
          toContainer.style.opacity = toFade(easeFast(p)).opacity;
          fromContainer.style.opacity = fromFade(easeSlow(p)).opacity;
          toContainer.style.transform = getTransformString(toFLIP(p));
          fromContainer.style.transform = getTransformString(fromFLIP(p));

          break;
        case "morph":
        default:
          toContainer.style.opacity = toFade(ease(p)).opacity;
          fromContainer.style.opacity = fromFade(ease(p)).opacity;
          toContainer.style.transform = getTransformString(toFLIP(p));
          fromContainer.style.transform = getTransformString(fromFLIP(p));
      }
      onUpdate(s);
    })
    .onStop(s => {
      onStop(s);
      cleanup();
    })
    .start();

  const cleanup = () => {
    if (isDeleted) return;
    options.portalElement.removeChild(toContainer);
    options.portalElement.removeChild(fromContainer);
    to.style.visibility = ""; // show original to
    from.style.visibility = ""; // show original to

    isDeleted = true;
  };

  return cleanup;
}
