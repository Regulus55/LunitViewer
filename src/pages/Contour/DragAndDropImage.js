import React, { useState } from 'react';

function DragAndDropImage() {
  const [images, setImages] = useState([]);

  // 이미지 드래그 앤 드롭 핸들러
  const handleDrop = (e) => {
    e.preventDefault(); // 기본 동작 방지 (드래그된 파일이 페이지에 열리는 것을 막기 위해)
    const files = e.dataTransfer.files; // 드래그 앤 드롭한 파일들

    // 파일들을 이미지로 변경하고 상태 업데이트
    const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  // 드래그 오버 핸들러 (드래그 중임을 표시하기 위해 사용)
  const handleDragOver = (e) => {
    e.preventDefault(); // 기본 동작 방지
  };

  return (
    <div
      className="drop-zone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <h3>이미지를 드래그 앤 드롭 하세요</h3>

      <div>
        {images.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {images.map((image, index) => (
              <div key={index} style={{ margin: '10px' }}>
                <img src={image} alt={`uploaded-${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        ) : (
          <p>업로드된 이미지가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default DragAndDropImage;
