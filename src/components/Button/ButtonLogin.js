import React from "react";
import fontawesome from "@fortawesome/fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import "./button.css";
fontawesome.library.add(faShoppingCart);

const ButtonLogin = ({ handleLogin }) => {
  return (
    <div>
      <button type="button" className="btn-outline btn-login" onClick={handleLogin}>
        Đăng nhập
      </button>
    </div>
  );
};

export default ButtonLogin;
