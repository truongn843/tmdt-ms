import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from "@fortawesome/fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import ButtonCart from "../Button/ButtonCart";
import ButtonLogin from "../Button/ButtonLogin";
import Logo from "./Logo/Logo";

import "../reset.css";
import "./css/navbar.css";
import Search from "../Search/Search";

fontawesome.library.add(faSearch);

function GuestNavbar(props) {
  let history = useHistory();

  const handleBackToHome = (e) => {
    history.push("/");
  };
  const handleLogin = (e) => {
    history.push("/login");
  }
  const handleSearchCallback = (searchData) => {
    props.parentCallBack(searchData);   
  }
  return (
    <nav className="navbar nav-container">
      <Logo handlebackToHome={handleBackToHome} />
      <Search parentCallBack={handleSearchCallback}/>
      <div className="btn-group">
        <ButtonCart />
        <ButtonLogin handleLogin={handleLogin} />
      </div>
    </nav>
  );
}

export default GuestNavbar;
