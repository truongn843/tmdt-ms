import React from "react";
import logo from "../../../assert/logo.svg";
import "./logo.css";
function Logo({ handlebackToHome }) {
  return (
    <div onClick={handlebackToHome}>
      <img src={logo} alt="" className="btn img-logo" />
    </div>
  );
}

export default Logo;
