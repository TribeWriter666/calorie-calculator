import React, { useState } from "react";
import imageCompression from "browser-image-compression";

function ImageProcess({ onImageProcessed }) {
  const [error, setError] = useState("");

  // Handle image upload, compression, and conversion to Base64
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const options = {
      maxSizeMB: 1, // Compress to a maximum of 1MB
      maxWidthOrHeight: 1920, // Max dimensions
      useWebWorker: true, // Use web workers for better performance
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const base64Image = await toBase64(compressedFile);

      onImageProcessed(base64Image); // Send the Base64-encoded image to parent component
    } catch (err) {
      setError("Error compressing or converting the image: " + err.message);
    }
  };

  // Convert compressed image to Base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      <h2>Upload and Process Image</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ImageProcess;
