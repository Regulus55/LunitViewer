import React, { useState, useEffect } from 'react';
import { Img } from 'react-image';

const IMAGES = [
  '/images/2.16.840.1.114362.1.11890052.23347336132.553945887.744.1174.dcm',
  '/images/2.16.840.1.114362.1.11890052.23347336132.553945887.746.1175',
  '/images/2.16.840.1.114362.1.11890052.23347336132.553945887.749.1176',
  '/images/2.16.840.1.114362.1.11890052.23347336132.553945887.755.1178',
  '/images/2.16.840.1.114362.1.11890052.23347336132.553945887.757.1179',
];


const style = {
  width: '500px',
  height: '500px',
};

export default function Viewer() {
  const [currentFrame, setCurrentFrame] = useState(0);

  function changeFrame(e) {
    const { value } = e.target;
    setCurrentFrame(Number(value));
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
        value={currentFrame}
      />
      <div style={style}>
        <Img src={IMAGES[currentFrame]} alt="Dicom Image" />
      </div>
    </div>
  );
}
