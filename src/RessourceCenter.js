import * as React from "react";
import { useState } from "react";
import PageHeading from "./PageHeading";
import Video from "./Video";
import "./RessourceCenter.css";

function RessourceCenter() {
  const [searchTerm, setSearchTerm] = useState("");

  const videos = [
    {
      title: "EazyResume Tutorial",
      subtitle:
        "EazyResume is a smart resume interface allowing you to design winning resumes quickly.",
      videourl:
        "https://www.loom.com/embed/95417cc892e44e8eba841e9188cc7f1b?sid=1d360ca0-72ee-4188-ad99-5464a8075489",
      transcript:
        "Hi, I'm Jonathan, the sales and marketing director for Easy Letter. In this video, I will show you how our easy resume feature works. You'll learn how to fill out a resume template with basic information like your name, LinkedIn, email, location, and phone number. I'll also guide you on specifying your experience and industry to generate personalized bullet points using our AI. Watch this video to see how our AI resume builder can help you create a professional resume effortlessly.",
    },
    {
      title: "EazyLetter Tutorial",
      subtitle: "How to write the perfect cover letter using AI.",
      videourl:
        "https://www.loom.com/embed/22c2c4097fe8406b80a8ec7080a69403?sid=91d4b8a2-bc13-4c22-8ef8-244ea1dce2a4",
    },
    {
      title: "EazyLetter Presentation",
      subtitle: "What is EazyLetter and how it works?",
      videourl: "https://www.youtube.com/embed/ytOZ1I9-MJ4?si=n2lwqQ3Deu9PbI8v",
    },
    // Add more videos as needed
  ];
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="content-library">
      <PageHeading
        currentPageName="Ressource Center" // Set the current page name dynamically
        description="A comprehensive ressource center with tutorials, pro tips and methods to get ahead in your recruitment processes." // Set the description dynamically
        imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/821719b1235948e9817e36e82f5135206f1a7df72d1d81de9af32170edfdde1d?"
        className="page-heading"
      />
      <div
        className="search-bar"
        style={{ position: "relative", width: "80%" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 1024 1024"
          className="icon"
          version="1.1"
          fill="#cccccc70"
          stroke="#cccccc70"
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z"
              fill="#cccccc"
            />
          </g>
        </svg>
        <input
          className="search-input"
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: "40px" }}
        />
      </div>
      <div className="videoslider">
        {filteredVideos.map((video, index) => (
          <Video
            className="videoelement"
            key={index}
            title={video.title}
            subtitle={video.subtitle}
            videourl={video.videourl}
            transcript={video.transcript}
          />
        ))}
      </div>
    </div>
  );
}

export default RessourceCenter;
