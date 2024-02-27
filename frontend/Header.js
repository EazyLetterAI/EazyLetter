import * as React from "react";
import "./Header.css";

function Header() {
  return (
    <div className="header">
      <div className="div-2">
        <div className="div-3">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a5c7a54446159e38073adb76d9ada6221e602e4a0a170fc7d733748b40d3b10e?"
            className="img"
          />
        </div>
        <div className="div-5">
          <div className="menu-item">Dashboard</div>
          <div className="menu-item">Account</div>
        </div>
      </div>
    </div>
  );
}
export default Header;
