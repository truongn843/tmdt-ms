import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./button.css";

const ButtonCart = ({ handleViewCart }) => {
  return (
    <div>
      <button type="button" className="btn-outline" onClick={handleViewCart}>
        <FontAwesomeIcon icon="shopping-cart"></FontAwesomeIcon>
        Giỏ hàng
      </button>
    </div>
  );
};

export default ButtonCart;
