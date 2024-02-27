import LandingPage from "./Landingpage";
import EazyResume from "./EazyResume";
import EazyLetter from "./EazyLetter";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./Footer";
import Account from "./Account";
import RessourceCenter from "./RessourceCenter";

function App() {
  return (
    <>
      <Header />
      <div className="main-content">
        <div className="sidebar-container" style={{ display: "flex" }}>
          <Sidebar />
        </div>
        <div className="app-container" style={{ flex: "1" }}>
          <Routes>
            <Route exact path="/account" element={<Account />} />
            <Route exact path="/eazyresume" element={<EazyResume />} />
            <Route path="/eazyletter" element={<EazyLetter />} />
            <Route path="/ressourcecenter" element={<RessourceCenter />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
