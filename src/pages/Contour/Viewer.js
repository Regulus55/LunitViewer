import React from 'react'
import InsightViewer, { useMultipleImages, useFrame } from '@lunit/insight-viewer'

const IMAGES = [
  "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.734.1170.dcm",
  "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm",
];

const style = {
  width: '80vw',
  height: '500px',
 
}

export default function Viewer() {
  const { images } = useMultipleImages({
    wadouri: IMAGES
  })

  const { frame, setFrame } = useFrame({
    initial: 0,
    max: images.length - 1,
  })

  function changeFrame(e) {
    const { value } = e.target
    setFrame(Number(value))
  }

  return (
    <div>
      <input
        type="range"
        id="frame"
        name="frame"
        min="0"
        max={IMAGES.length - 1}
        step="1"
        onChange={changeFrame}
        className="frame-control"
        value={frame}
      />
      <div style={style}>
        <InsightViewer image={images[frame]} />
      </div>
    </div>
  )
}

