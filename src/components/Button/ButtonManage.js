import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./button.css";
import { useHistory } from "react-router";

const ButtonManage = () => {
    let history = useHistory();
    const handleAddProduct = () => {
        history.push("/add-product");
      };
    return (
    <div>
      <button type="button" className="btn-outline btn-edit" onClick={handleAddProduct}>
        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
        Quản lý
      </button>
    </div>
  );
};

export default ButtonManage;
