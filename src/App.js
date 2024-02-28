import React, { useState } from "react";

import LandingPage from "./LandingPage";
import EazyResume from "./EazyResume";
import EazyLetter from "./EazyLetter";
import { useHistory } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./Footer";
import Account from "./Account";
import RessourceCenter from "./RessourceCenter";

function App() {
  const [showMainContent, setShowMainContent] = useState(false);

  const handleGoButtonClick = () => {
    setShowMainContent(true);
  };

  return (
    <>
      <Header />
      <div className="main-content">
        {showMainContent ? (
          <div className="sidebar-container" style={{ display: "flex" }}>
            <Sidebar />
            <div className="app-container" style={{ flex: "1" }}>
              <Routes>
                <Route exact path="/account" element={<Account />} />
                <Route exact path="/eazyresume" element={<EazyResume />} />
                <Route path="/eazyletter" element={<EazyLetter />} />
                <Route path="/ressourcecenter" element={<RessourceCenter />} />
              </Routes>
            </div>
          </div>
        ) : (
          <LandingPage onGoButtonClick={handleGoButtonClick} />
        )}
      </div>
    </>
  );
}

export default App;
