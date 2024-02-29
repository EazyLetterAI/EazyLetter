import React from "react";
import "./LandingComponent.css"; // Import your CSS file
import AudioPlayer from "./AudioPlayer"; // Import your AudioPlayer component

function LandingComponent({
  productintro,
  productname,
  procutsubtitle,
  procutdescription,
  videoUrl,
  videoOnLeft = true,
  audio = true,
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
            {audio ? (
              <AudioPlayer audioSrc={videoUrl} />
            ) : (
              <iframe
                src={videoUrl}
                title="Video Frame"
                width="460"
                height="315"
                allowFullScreen
              ></iframe>
            )}
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
            {audio ? (
              <AudioPlayer audioSrc={videoUrl} />
            ) : (
              <iframe
                src={videoUrl}
                title="Video Frame"
                width="460"
                height="315"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default LandingComponent;
