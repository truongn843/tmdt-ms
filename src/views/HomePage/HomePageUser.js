import React from "react";
import UserNavbar from "../../components/NavBar/UserNavbar";
import ProductList from "../../components/ProductList/ProductList";

import "./homepage.css";

function HomePageUser() {
  document.title = "BK Phone";
  return (
    <div>
      <UserNavbar />
      <ProductList />
    </div>
  );
}

export default HomePageUser;
