import React from 'react'
import InsightViewer, { useMultipleImages, useFrame } from '@lunit/insight-viewer'

const IMAGES = [
  "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.734.1170.dcm",
  "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm",
  "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.752.1177.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T050221Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=5c604f2353ee55ff842fdd780d57fb2380c9a4b2ab6ddf341fd360cc5f2cf8c8",

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