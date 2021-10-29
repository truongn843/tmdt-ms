import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router";
import "./button.css";

const ButtonCart = () => {
  const history = useHistory();
  const handleViewCart = e =>{
    history.push("/cart");
  }
  return (
    <div>
      <button type="button" className="btn-outline btn-cart" onClick={handleViewCart}>
        <FontAwesomeIcon icon="shopping-cart"></FontAwesomeIcon>
        Giỏ hàng
      </button>
    </div>
  );
};

export default ButtonCart;
