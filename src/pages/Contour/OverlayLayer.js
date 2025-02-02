import React from 'react'
import { Viewport } from "@lunit/insight-viewer";

const style = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  padding: "4px",
  textShadow: "1px 1px 1px black",
  color: "#fff"
}

export default function OverlayLayer({
  viewport: { scale, hflip, vflip, x, y, invert, windowWidth, windowCenter }
}) {
  return (
    <div style={style}>
      <ul>
        <li>
          scale: <span data-cy-scale>{scale}</span>
        </li>
        <li>
          hflip/vflip: <span data-cy-hflip>{`${hflip}`}</span> /{" "}
          <span data-cy-vflip>{`${vflip}`}</span>
        </li>
        <li>
          translation: <span data-cy-x>{x?.toFixed(2)}</span> /{" "}
          <span data-cy-y>{y?.toFixed(2)}</span>
        </li>
        <li>
          invert: <span data-cy-invert>{`${invert}`}</span>
        </li>
        <li>
          WW / WC: <span data-cy-window-width>{windowWidth?.toFixed(2)}</span> /{" "}
          <span data-cy-window-center>{windowCenter?.toFixed(2)}</span>
        </li>
      </ul>
    </div>
  );
}
