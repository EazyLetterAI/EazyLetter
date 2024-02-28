import React from "react";
import "./LandingComponent.css"; // Import your CSS file

function LandingComponent({
  productintro,
  productname,
  procutsubtitle,
  procutdescription,
  videoUrl,
  videoOnLeft = true,
  backgroundColor,
  buttonmessage,
}) {
  const containerStyle = {
    backgroundColor: backgroundColor,
  };
  return (
    <div className="landing-container" style={containerStyle}>
      {videoOnLeft ? (
        <>
          <div className="video-column">
            <iframe
              src={videoUrl}
              title="Video Frame"
              width="560"
              height="350"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
          <div className="text-column">
            <h1 className="intro-title">{productintro}</h1>
            <h2 className="product-title">{productname}</h2>
            <h3 className="product-subtitle">{procutsubtitle}</h3>
            <p className="product-description">{procutdescription}</p>
            <button className="custom-button">{buttonmessage}</button>
          </div>
        </>
      ) : (
        <>
          <div className="text-column">
            <h1 className="intro-title">{productintro}</h1>
            <h2 className="product-title">{productname}</h2>
            <h3 className="product-subtitle">{procutsubtitle}</h3>
            <p className="product-description">{procutdescription}</p>
            <button className="custom-button">{buttonmessage}</button>
          </div>
          <div className="video-column">
            <iframe
              src={videoUrl}
              title="Video Frame"
              width="560"
              height="315"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </>
      )}
    </div>
  );
}

export default LandingComponent;
