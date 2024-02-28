import React from "react";
import { useState } from "react";
import "./Video.css";

function Video({ title, subtitle, videourl, transcript }) {
  const [showTranscript, setShowTranscript] = useState(false);

  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  return (
    <div className="videocontent" onClick={toggleTranscript}>
      <div className="title">{title}</div>
      <iframe
        width="90%"
        height="350"
        src={videourl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>

      <div className="subtitle">{subtitle}</div>
      {showTranscript && <div className="transcript">{transcript}</div>}
    </div>
  );
}

export default Video;
