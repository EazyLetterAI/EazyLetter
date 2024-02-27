import * as React from "react";
import "./EazyLetter.css";
import axios from "axios";
import { useState } from "react";
import PageHeading from "./PageHeading";
import ExtendableInput from "./ExtendableInput";
import ExtendableWidth from "./ExtendableWidth";

function EazyLetter() {
  const [Name, setName] = useState("");
  const [Company, setCompany] = useState("");
  const [Position, setPosition] = useState("");
  const [Url, setUrl] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [City, setCity] = useState("");
  const [Jobdescription, setJobdescription] = useState("");
  const [responseContent, setResponseContent] = useState(""); // State to store response content
  // const generatePDF = async () => {
  //   try {
  //     const response = await axios.post(
  //       "/api/generatePDF",
  //       { Name, Url, Email, Phone, City, responseContent },
  //       { responseType: "blob" }
  //     );

  //     // Create a blob URL to download the PDF
  //     const blob = new Blob([response.data], { type: "application/pdf" });
  //     const url = window.URL.createObjectURL(blob);

  //     // Trigger download
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${Name}_${City}_coverletter.pdf`;
  //     link.click();
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  const handleDownloadPDF = async () => {
    try {
      // Construct the URL with query parameters
      const url = new URL("http://localhost:3000/download-pdf");
      url.searchParams.append("Name", Name);
      url.searchParams.append("Url", Url);
      url.searchParams.append("Email", Email);
      url.searchParams.append("Phone", Phone);
      url.searchParams.append("City", City);
      url.searchParams.append("responseContent", responseContent);

      // Make a GET request to the backend endpoint with the constructed URL
      const response = await fetch(url);

      // Check if the request was successful (status code 200)
      if (response.ok) {
        // Create a blob from the response data
        const blob = await response.blob();

        // Create a URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "output.pdf"; // Set the filename for the downloaded file

        // Append the link to the document body and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the DOM
        document.body.removeChild(link);
      } else {
        throw new Error("Failed to download PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleResponseContentChange = (newValue) => {
    setResponseContent(newValue);
  };

  const handleSubmit = () => {
    axios
      .post("/submit-input", { Name, Company, Position, Jobdescription })
      .then((response) => {
        // Convert the response object to a string
        const responseString = response.data;
        // Set the response content to the input field
        setResponseContent(responseString);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="eazyletter">
      <PageHeading
        currentPageName="EazyLetter" // Set the current page name dynamically
        description="Write your ATS-tested cover letter today and get ahead in your recruitment process." // Set the description dynamically
        imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/821719b1235948e9817e36e82f5135206f1a7df72d1d81de9af32170edfdde1d?"
        tutorialText="Full tutorial here."
        linkTutorial="https://www.loom.com/share/22c2c4097fe8406b80a8ec7080a69403?t=5"
      />

      <div className="block-form">
        <div className="eazyletter-wrapper">
          <div className="eazyletter-form">
            <ExtendableWidth
              className="eazyletter-input"
              placeholder="Document name"
            />
            <select className="eazyletter-input" placeholder="Industry" />
            <button className="eazyletter-button" onClick={handleDownloadPDF}>
              Download PDF
            </button>
          </div>
          <div className="coverletter">
            <div className="generated-letter">
              <ExtendableWidth
                className="name-input"
                placeholder="Name"
                value={Name}
                onChange={(value) => setName(value)}
              />
              <div>
                <ExtendableWidth
                  className="details-input"
                  placeholder="Linkedin Url"
                  value={Url}
                  onChange={(value) => setUrl(value)}
                />
                <ExtendableWidth
                  className="details-input"
                  placeholder="Email"
                  value={Email}
                  onChange={(value) => setEmail(value)}
                />
                <ExtendableWidth
                  className="details-input"
                  placeholder="Phone number"
                  value={Phone}
                  onChange={(value) => setPhone(value)}
                />
                <ExtendableWidth
                  className="details-input"
                  placeholder="City, Country"
                  value={City}
                  onChange={(value) => setCity(value)}
                />
              </div>
              <div className="hrbar" />
              <ExtendableInput
                className="coverletter-input"
                placeholder="Your cover letter will be generated here"
                value={responseContent} // Pass responseContent state as value prop
                // onChange={handleResponseContentChange} // Pass onChange handler
                onChange={(value) => setResponseContent(value)}
                type="text"
              />
            </div>
            <div className="parameters">
              <label htmlFor="company">Company:</label>
              <input
                className="parameters-input"
                id="company"
                value={Company}
                onChange={(e) => setCompany(e.target.value)}
              ></input>
              <label htmlFor="position">Position:</label>
              <input
                className="parameters-input"
                id="position"
                value={Position}
                onChange={(e) => setPosition(e.target.value)}
              ></input>
              <label>Job description:</label>
              <textarea
                className="parameters-input description"
                id="description"
                value={Jobdescription}
                onChange={(e) => setJobdescription(e.target.value)}
              ></textarea>
              <label htmlFor="background">Background:</label>
              <input
                type="file"
                id="background"
                accept=".pdf"
                onchange="handleFileSelect()"
              ></input>
              <button
                className="eazyletter-button generate"
                onClick={handleSubmit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  width="20px"
                  viewBox="0 0 2410 2410"
                >
                  <path
                    d="M1 578.4C1 259.5 259.5 1 578.4 1h1249.1c319 0 577.5 258.5 577.5 577.4V2406H578.4C259.5 2406 1 2147.5 1 1828.6V578.4z"
                    fill="#74aa9c"
                  ></path>
                  <path
                    id="a"
                    d="M1107.3 299.1c-197.999 0-373.9 127.3-435.2 315.3L650 743.5v427.9c0 21.4 11 40.4 29.4 51.4l344.5 198.515V833.3h.1v-27.9L1372.7 604c33.715-19.52 70.44-32.857 108.47-39.828L1447.6 450.3C1361 353.5 1237.1 298.5 1107.3 299.1zm0 117.5-.6.6c79.699 0 156.3 27.5 217.6 78.4-2.5 1.2-7.4 4.3-11 6.1L952.8 709.3c-18.4 10.4-29.4 30-29.4 51.4V1248l-155.1-89.4V755.8c-.1-187.099 151.601-338.9 339-339.2z"
                    fill="#fff"
                  ></path>
                  <use xlinkHref="#a" transform="rotate(60 1203 1203)"></use>
                  <use
                    xlinkHref="#a"
                    transform="rotate(120 1203 1203)"
                  ></use>{" "}
                  <use xlinkHref="#a" transform="rotate(180 1203 1203)"></use>
                  <use xlinkHref="#a" transform="rotate(240 1203 1203)"></use>
                  <use xlinkHref="#a" transform="rotate(300 1203 1203)"></use>
                </svg>
                Generate with GPT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EazyLetter;
