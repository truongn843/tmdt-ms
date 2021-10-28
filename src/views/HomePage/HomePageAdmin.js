import React from "react";
import { useHistory } from "react-router";
import Navbar from "../../components/NavBar/AdminNavbar";
import ProductList from "../../components/ProductList/ProductList";

import "./homepage.css";

function HomePageGuest() {
  let history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };
  document.title = "BK Phone";
  return (
    <div>
      <Navbar handleLogout={handleLogout} />
      <ProductList />
    </div>
  );
}

export default HomePageGuest;
