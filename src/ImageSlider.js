import React from "react";
import "./ImageSlider.css"; // Vous pouvez définir les styles CSS dans ce fichier

const ImageSlider = ({ images, title }) => {
  return (
    <div className="slider-container">
      {title}
      <div className="slider">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            style={{ height: "70px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
