

import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import InsightViewer, { useMultipleImages, useFrame } from '@lunit/insight-viewer'

const style = {
  width: '80vw',
  height: '500px',
}

export default function Viewer() {
  const [images, setImages] = useState([]);
  const { frame, setFrame } = useFrame({
    initial: 0,
    max: images.length - 1,
  });

  const onDrop = (acceptedFiles) => {
    const fileUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
    setImages(fileUrls);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.dcm', 
  });

  function changeFrame(e) {
    const { value } = e.target;
    setFrame(Number(value));
  }

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Drag and drop DICOM images here, or click to select files</p>
      </div>

      {images.length > 0 && (
        <>
          <input
            type="range"
            id="frame"
            name="frame"
            min="0"
            max={images.length - 1}
            step="1"
            onChange={changeFrame}
            className="frame-control"
            value={frame}
          />
          <div style={style}>
            <InsightViewer image={images[frame]} />
          </div>
        </>
      )}
    </div>
  );
}
