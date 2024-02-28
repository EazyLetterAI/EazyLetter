import React, { useState } from "react";
import Modal from "react-modal";
import "./DescriptionInput.css";
import ExtendableInput from "./ExtendableInput"; // Assuming this is the path to your ExtendableInput component
import { autocompleteClasses } from "@mui/material";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Transparent black overlay
  },
  content: {
    position: "absolute",
    left: "60%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "400px",
    padding: "40px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    fontSize: "20px",
    color: "#cccccc",
  },
};

function DescriptionInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleUpdate = () => {
    // Close the modal after updating
    handleClose();
  };

  return (
    <div>
      <input
        type="text"
        className="job-description"
        onClick={handleInputClick}
        value={inputText} // Bind the input value to inputText state
        readOnly // Make the input field read-only to prevent direct editing
        placeholder="Click to enter job description"
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        contentLabel="Job Description Modal"
        style={customStyles}
      >
        <label>Job description:</label>
        <ExtendableInput
          className="description-modal"
          value={inputText} // Bind the ExtendableInput value to inputText state
          onChange={(e) => setInputText(e.target.value)} // Update inputText state
        />
        <button style={customStyles.closeButton} onClick={handleClose}>
          &#10005;
        </button>
        <button className="submitbutton description" onClick={handleUpdate}>
          Update
        </button>
      </Modal>
    </div>
  );
}

export default DescriptionInput;
