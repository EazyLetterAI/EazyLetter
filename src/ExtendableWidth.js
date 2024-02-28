import React, { useRef } from "react";

function ExtendableWidth({
  className,
  onInput,
  style,
  placeholder,
  value,
  onChange,
}) {
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;

    // Reset the width to allow shrinking
    textarea.style.width = "";
    // Set the width to match the content
    textarea.style.width = textarea.scrollWidth + "px";

    if (onChange) {
      onChange(textarea.value);
    }
  };

  return (
    <input
      ref={textareaRef}
      className={className}
      onInput={handleInput}
      onChange={() => {}} // This is to prevent React warning about uncontrolled component
      style={{
        ...style,
        overflowY: "hidden",
        resize: "none",
      }}
      placeholder={placeholder}
      value={value}
    />
  );
}

export default ExtendableWidth;
