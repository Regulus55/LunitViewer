import React from 'react'
import InsightViewer, { useImage, useDicomFile } from "@lunit/insight-viewer";

const style = {
  width: "500px",
  height: "500px",
};

export default function App() {
  const { imageId, file, setImageIdByFile } = useDicomFile();
  const { image } = useImage({
    dicomfile: imageId,
  });
  console.log("file", imageId, file);

  function handleChange(event) {
    if (!event.target.files) return;

    setImageIdByFile(event.target.files[0]);
  }

  return (
    <>
      <input type="file" accept="application/dicom" onChange={handleChange} />{" "}
      {file?.name}
      <div style={style}>
        <InsightViewer image={image} />
      </div>
    </>
  );
}
