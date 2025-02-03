import React from 'react'
import InsightViewer, { useMultipleImages, useFrame } from '@lunit/insight-viewer'

// const IMAGES = [
//   "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.724.1165.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YWNH599TLSBE4OK0J0B1%2F20250203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250203T123338Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJZV05INTk5VExTQkU0T0swSjBCMSIsImV4cCI6MTczODYyNjQxOSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.ectZUsYuK-YvvdPSh7FTPKBbzIhIoXOPAJ5DYEtJTsLmU2TouzOxgUZVzoW-4cA8dnZA815ccYdqQHbfpIX1Qg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=e5ecbee27e84278fe03ed7c475a39589b9bf11fc3ae132fade4939b573ebf0cc",
//   "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.728.1168.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YWNH599TLSBE4OK0J0B1%2F20250203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250203T123536Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJZV05INTk5VExTQkU0T0swSjBCMSIsImV4cCI6MTczODYyNjQxOSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.ectZUsYuK-YvvdPSh7FTPKBbzIhIoXOPAJ5DYEtJTsLmU2TouzOxgUZVzoW-4cA8dnZA815ccYdqQHbfpIX1Qg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=ec27a241cba75c543875d9efe4fc95ca8574a1a42e60c4387cc3c0b6b2ff4872",
//   "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.947.1240.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013534Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=25a54cd6e1d56969d19116d3adb187055c0bf1aeb7bd3580cfe63ba34a58cf04",
//   "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.947.1240.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013534Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=25a54cd6e1d56969d19116d3adb187055c0bf1aeb7bd3580cfe63ba34a58cf04",
//   "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013725Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=583b825fc55d639a1d8543d6c03ff0a53466e9305317df9a470353a2aac97c46",
//   "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013725Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=583b825fc55d639a1d8543d6c03ff0a53466e9305317df9a470353a2aac97c46",
//   "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013725Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=583b825fc55d639a1d8543d6c03ff0a53466e9305317df9a470353a2aac97c46",
//   "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.746.1175.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013800Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=fe13f396e32fa73b1e9f58943c680d45b1518bfac2576545b1f3b9e4d5aa3d5d",

// ];
const IMAGES = [
  "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.724.1165.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YWNH599TLSBE4OK0J0B1%2F20250203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250203T123338Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJZV05INTk5VExTQkU0T0swSjBCMSIsImV4cCI6MTczODYyNjQxOSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.ectZUsYuK-YvvdPSh7FTPKBbzIhIoXOPAJ5DYEtJTsLmU2TouzOxgUZVzoW-4cA8dnZA815ccYdqQHbfpIX1Qg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=e5ecbee27e84278fe03ed7c475a39589b9bf11fc3ae132fade4939b573ebf0cc",

  "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.734.1170.dcm",
  "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.724.1165.dcm",
  "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.728.1168.dcm",
  "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.731.1169.dcm",
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