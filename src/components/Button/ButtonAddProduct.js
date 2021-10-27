import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import "./button.css";

const ButtonAddProduct = ({ handleAddProduct }) => {
  return (
    <div>
      <button type="button" className="btn-outline" onClick={handleAddProduct}>
        <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
        Thêm sản phẩm
      </button>
    </div>
  );
};

export default ButtonAddProduct;
