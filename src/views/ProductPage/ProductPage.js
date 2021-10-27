import React from "react";
import { useHistory } from "react-router-dom";
import GuestNavbar from "../../components/NavBar/GuestNavbar";
import Path from "../../components/Path/Path";
import Product from "../../components/Product/Product";

function HomePageGuest() {
  let history = useHistory();
  const handleLogin = () => {
    console.log("LOGIN");
    history.push("/login");
  };
  return (
    <div>
      <GuestNavbar handleLogin={handleLogin} />
      <Path />
      <Product />
    </div>
  );
}

export default HomePageGuest;
