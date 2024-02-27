import React from "react";
import { Link } from "react-router-dom";
import "./PageHeading.css";

function PageHeading({
  currentPageName,
  description,
  imageUrl,
  linkTutorial,
  tutorialText,
}) {
  return (
    <div className="page-heading">
      <div className="breadcrumbs">
        {" "}
        <Link
          to="/home"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Home /
        </Link>{" "}
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Dashboard /
        </Link>{" "}
        {currentPageName}
      </div>
      <div className="content">
        <div className="image">
          <img src={imageUrl} alt={currentPageName} />
        </div>
        <div className="details">
          <h1>{currentPageName}</h1>
          <p>
            {description}{" "}
            <a href={linkTutorial} target="_blank" rel="noopener noreferrer">
              {tutorialText}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageHeading;
