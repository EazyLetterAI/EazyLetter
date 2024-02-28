import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import exampleImage from "./happy student.png";

import LandingComponent from "./LandingComponent";
import ImageSlider from "./ImageSlider";

function importAll(r) {
  let images = [];
  r.keys().map((item, index) => {
    images.push(r(item));
  });
  return images;
}

const images = importAll(
  require.context("./company_logos", false, /\.(png|jpe?g|svg)$/)
);

function LandingPage({ onGoButtonClick }) {
  const history = useNavigate();

  const handleClick = () => {
    onGoButtonClick(); // Update parent state to show main content
  };

  return (
    <div className="landingpage">
      <div className="landing-1">
        <div>
          <h1 className="subtitle-landing">CAREER CENTER PLATFORM</h1>
          <h1 className="title-landing">Accelerate your students' career</h1>
          <h2 className="subtitle2-landing">
            EazyLetter helps your students getting ahead in their early career
            with resume, cover letter creation, interview preparation and key
            ressources.
          </h2>
          <div class="center-container">
            <button className="custom-button" onClick={handleClick}>
              Try for Free
            </button>
            <button className="ressource-landing" onClick={handleClick}>
              Learn More
            </button>
          </div>
        </div>
        <div>
          {/* Use the imported image within JSX */}
          <img
            src={exampleImage}
            alt="HappyStudent"
            style={{ width: "500px", marginTop: "20px" }}
          />
        </div>
      </div>
      <div className="image-slider">
        <ImageSlider
          images={images}
          title={"Students using EazyLetter landed jobs at top companies. "}
        />
      </div>

      <div className="landing-2">
        <div className="lading-title">
          We build technology for the students of tomorrow.{" "}
        </div>
        <LandingComponent
          productintro="Automation"
          productname="EazyResume"
          procutsubtitle="Build ATS-friendly resumes with AI, save time to focus on your interviews."
          procutdescription="
          Our innovative AI-powered resume builder empowers you to effortlessly craft polished resumes that elevate your professional profile with the finesse of a seasoned expert."
          videoUrl="https://www.loom.com/embed/95417cc892e44e8eba841e9188cc7f1b?sid=1d360ca0-72ee-4188-ad99-5464a8075489"
          videoOnLeft={true}
          backgroundColor="white"
          buttonmessage="Create my resume"
        />
        <LandingComponent
          productintro="Automation"
          productname="EazyLetter"
          procutsubtitle="Craft Cover Letters in Minutes with our AI Generator."
          procutdescription="Streamline the creation of compelling cover letters with our advanced AI-driven tool, tailored to enhance your application and captivate employers with professional finesse."
          videoUrl="https://www.loom.com/embed/22c2c4097fe8406b80a8ec7080a69403?sid=91d4b8a2-bc13-4c22-8ef8-244ea1dce2a4"
          videoOnLeft={false}
          backgroundColor="#FDF0E9"
          buttonmessage="Write my cover letter"
        />
      </div>
    </div>
  );
}

export default LandingPage;
