import React from "react";

function ExtendableInput({ className, style, placeholder, value, onChange }) {
  const handleInput = (event) => {
    // Resize the textarea as the user types
    event.target.style.height = ""; // Reset the height to allow shrinking
    event.target.style.height = event.target.scrollHeight + "px"; // Set the height to match the content

    // Pass the updated value to the parent component
    onChange(event.target.value);
  };

  return (
    <textarea
      className={className}
      onChange={handleInput}
      style={{
        ...style, // Spread the style prop
        overflowY: "hidden", // Hide vertical scrollbar
      }}
      placeholder={placeholder}
      value={value}
    />
  );
}

export default ExtendableInput;
