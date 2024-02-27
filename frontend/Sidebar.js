import * as React from "react";
import "./Sidebar.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar(props) {
  const [selectedButton, setSelectedButton] = useState("Dashboard"); // Default selected button

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <>
      <div className="sidebar">
        <div className="div-10">
          <div className="div-12">
            <Link
              to="/account"
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }}
            >
              <button
                className={
                  selectedButton === "Account"
                    ? "sidebar-pages-active"
                    : "sidebar-pages"
                }
                onClick={() => handleButtonClick("Account")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  viewBox="0 0 24 24"
                  id="Layer_1"
                  data-name="Layer 1"
                  fill="#4c515a"
                  stroke="#4c515a"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0" />

                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <g id="SVGRepo_iconCarrier">
                    <defs></defs>

                    <circle class="cls-1" cx="12" cy="7.25" r="5.73" />

                    <path
                      class="cls-1"
                      d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"
                    />
                  </g>
                </svg>
                Account{" "}
              </button>
            </Link>
          </div>
          <div className="div-12">
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }}
            >
              <button
                className={
                  selectedButton === "Dashboard"
                    ? "sidebar-pages-active"
                    : "sidebar-pages"
                }
                onClick={() => handleButtonClick("Dashboard")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="64 64 896 896"
                  width="18px"
                  height="18px"
                  focusable="false"
                >
                  <path d="M924.8 385.6a446.7 446.7 0 00-96-142.4 446.7 446.7 0 00-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 00-142.4 96 446.7 446.7 0 00-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6A371.12 371.12 0 01140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.5 205.5-122.6 276zM623.5 421.5a8.03 8.03 0 00-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 000 79.2 55.95 55.95 0 0079.2 0 55.87 55.87 0 0014.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8zm260 218v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8zm12.7-197.2l-31.1-31.1a8.03 8.03 0 00-11.3 0l-56.6 56.6a8.03 8.03 0 000 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3zm-458.6-31.1a8.03 8.03 0 00-11.3 0l-31.1 31.1a8.03 8.03 0 000 11.3l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3l-56.6-56.6zM262 530h-80c-4.4 0-8 3.6-8 8v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8z" />
                </svg>
                Dashboard{" "}
              </button>
            </Link>
          </div>
          <div className="div-12">
            <button
              className={
                selectedButton === "EazyResume" ||
                selectedButton === "EazyLetter" ||
                selectedButton === "EazyReview" ||
                selectedButton === "Database"
                  ? "sidebar-pages-active"
                  : "sidebar-pages"
              }
              onClick={() => handleButtonClick("Apps")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18px"
                height="18px"
                viewBox="0 -19.04 75.804 75.804"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0" />

                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g
                    id="Group_67"
                    data-name="Group 67"
                    transform="translate(-798.203 -587.815)"
                  >
                    {" "}
                    <path
                      id="Path_59"
                      data-name="Path 59"
                      d="M798.2,589.314a1.5,1.5,0,0,1,2.561-1.06l33.56,33.556a2.528,2.528,0,0,0,3.564,0l33.558-33.556a1.5,1.5,0,1,1,2.121,2.121l-33.558,33.557a5.53,5.53,0,0,1-7.807,0l-33.56-33.557A1.5,1.5,0,0,1,798.2,589.314Z"
                    />{" "}
                  </g>{" "}
                </g>
              </svg>
              Apps
            </button>
          </div>
          <div className="div-16">
            <div className="div-17">
              <Link to="/eazyresume">
                <button
                  className={
                    selectedButton === "EazyResume"
                      ? "sidebar-button-active"
                      : "sidebar-button"
                  }
                  onClick={() => handleButtonClick("EazyResume")}
                >
                  {" "}
                  EazyResume{" "}
                </button>
              </Link>
            </div>
            <div className="div-19" />
          </div>
          <Link to="/eazyletter">
            <button
              className={
                selectedButton === "EazyLetter"
                  ? "sidebar-button-active"
                  : "sidebar-button"
              }
              onClick={() => handleButtonClick("EazyLetter")}
            >
              {" "}
              EazyLetter{" "}
            </button>
          </Link>
          <Link to="/eazyreview">
            <button
              className={
                selectedButton === "EazyReview"
                  ? "sidebar-button-active"
                  : "sidebar-button"
              }
              onClick={() => handleButtonClick("EazyReview")}
            >
              EazyReview
            </button>
          </Link>

          <Link
            to="/database"
            style={{
              textDecoration: "none",
              color: "inherit",
              width: "100%",
            }}
          >
            <button
              className={
                selectedButton === "Database"
                  ? "sidebar-button-active"
                  : "sidebar-button"
              }
              onClick={() => handleButtonClick("Database")}
            >
              {" "}
              Database{" "}
            </button>
          </Link>
          <Link
            to="/ressourcecenter"
            style={{
              textDecoration: "none",
              color: "inherit",
              width: "100%",
            }}
          >
            <button
              className={
                selectedButton === "Train"
                  ? "sidebar-button-active"
                  : "sidebar-button"
              }
              onClick={() => handleButtonClick("Train")}
            >
              {" "}
              Training{" "}
            </button>
          </Link>
          <div className="div-12">
            <Link
              to="/settings"
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }}
            >
              <button
                className={
                  selectedButton === "Settings"
                    ? "sidebar-pages-active"
                    : "sidebar-pages"
                }
                onClick={() => handleButtonClick("Settings")}
              >
                <svg
                  width="18px"
                  height="18px"
                  viewBox="0 0 1024 1024"
                  class="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#4c515a"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0" />

                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <g id="SVGRepo_iconCarrier">
                    <path d="M600.704 64a32 32 0 0130.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0134.432 15.36L944.32 364.8a32 32 0 01-4.032 37.504l-77.12 85.12a357.12 357.12 0 010 49.024l77.12 85.248a32 32 0 014.032 37.504l-88.704 153.6a32 32 0 01-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 01600.704 960H423.296a32 32 0 01-30.464-22.208L357.696 828.48a351.616 351.616 0 01-42.56-24.64l-112.32 24.256a32 32 0 01-34.432-15.36L79.68 659.2a32 32 0 014.032-37.504l77.12-85.248a357.12 357.12 0 010-48.896l-77.12-85.248A32 32 0 0179.68 364.8l88.704-153.6a32 32 0 0134.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 01423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 00-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 000 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0034.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0034.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 000-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 00-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 110 384 192 192 0 010-384zm0 64a128 128 0 100 256 128 128 0 000-256z" />
                  </g>
                </svg>
                Settings
              </button>
            </Link>
          </div>
          <div className="logout-button">
            <Link
              to="/logout"
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }}
            >
              <button
                className={
                  selectedButton === "Logout"
                    ? "sidebar-pages-active"
                    : "sidebar-pages"
                }
                onClick={() => handleButtonClick("Logout")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  viewBox="0 0 24 24"
                  fill="#4c515a"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0" />

                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M14.9453 1.25C13.5778 1.24998 12.4754 1.24996 11.6085 1.36652C10.7084 1.48754 9.95048 1.74643 9.34857 2.34835C8.82363 2.87328 8.55839 3.51836 8.41916 4.27635C8.28387 5.01291 8.25799 5.9143 8.25196 6.99583C8.24966 7.41003 8.58357 7.74768 8.99778 7.74999C9.41199 7.7523 9.74964 7.41838 9.75194 7.00418C9.75803 5.91068 9.78643 5.1356 9.89448 4.54735C9.99859 3.98054 10.1658 3.65246 10.4092 3.40901C10.686 3.13225 11.0746 2.9518 11.8083 2.85315C12.5637 2.75159 13.5648 2.75 15.0002 2.75H16.0002C17.4356 2.75 18.4367 2.75159 19.1921 2.85315C19.9259 2.9518 20.3144 3.13225 20.5912 3.40901C20.868 3.68577 21.0484 4.07435 21.1471 4.80812C21.2486 5.56347 21.2502 6.56459 21.2502 8V16C21.2502 17.4354 21.2486 18.4365 21.1471 19.1919C21.0484 19.9257 20.868 20.3142 20.5912 20.591C20.3144 20.8678 19.9259 21.0482 19.1921 21.1469C18.4367 21.2484 17.4356 21.25 16.0002 21.25H15.0002C13.5648 21.25 12.5637 21.2484 11.8083 21.1469C11.0746 21.0482 10.686 20.8678 10.4092 20.591C10.1658 20.3475 9.99859 20.0195 9.89448 19.4527C9.78643 18.8644 9.75803 18.0893 9.75194 16.9958C9.74964 16.5816 9.41199 16.2477 8.99778 16.25C8.58357 16.2523 8.24966 16.59 8.25196 17.0042C8.25799 18.0857 8.28387 18.9871 8.41916 19.7236C8.55839 20.4816 8.82363 21.1267 9.34857 21.6517C9.95048 22.2536 10.7084 22.5125 11.6085 22.6335C12.4754 22.75 13.5778 22.75 14.9453 22.75H16.0551C17.4227 22.75 18.525 22.75 19.392 22.6335C20.2921 22.5125 21.0499 22.2536 21.6519 21.6517C22.2538 21.0497 22.5127 20.2919 22.6337 19.3918C22.7503 18.5248 22.7502 17.4225 22.7502 16.0549V7.94513C22.7502 6.57754 22.7503 5.47522 22.6337 4.60825C22.5127 3.70814 22.2538 2.95027 21.6519 2.34835C21.0499 1.74643 20.2921 1.48754 19.392 1.36652C18.525 1.24996 17.4227 1.24998 16.0551 1.25H14.9453Z" />{" "}
                    <path d="M15 11.25C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H4.02744L5.98809 14.4306C6.30259 14.7001 6.33901 15.1736 6.06944 15.4881C5.79988 15.8026 5.3264 15.839 5.01191 15.5694L1.51191 12.5694C1.34567 12.427 1.25 12.2189 1.25 12C1.25 11.7811 1.34567 11.573 1.51191 11.4306L5.01191 8.43056C5.3264 8.16099 5.79988 8.19741 6.06944 8.51191C6.33901 8.8264 6.30259 9.29988 5.98809 9.56944L4.02744 11.25H15Z" />{" "}
                  </g>
                </svg>
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{``}</style>
    </>
  );
}
export default Sidebar;
