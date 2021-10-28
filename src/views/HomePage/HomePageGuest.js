import React from "react";
import { useHistory } from "react-router-dom";
import GuestNavbar from "../../components/NavBar/GuestNavbar";
import ProductList from "../../components/ProductList/ProductList";

import "./homepage.css";

function HomePageGuest() {
  let history = useHistory();
  const handleLogin = () => {
    console.log("LOGIN");
    history.push("/login");
  };
  document.title = "BK Phone";
  return (
    <div>
      <GuestNavbar handleLogin={handleLogin} />
      <ProductList />
    </div>
  );
}

export default HomePageGuest;
