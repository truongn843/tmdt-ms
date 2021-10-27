import React from "react";
import "./css/CartItem.css";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

export default function CartItem(props) {
  return (
    <div className="cartItemcontainer">
      <div className="cartItem">
        <img src={props.data.product.image} alt="" />
        {props.data.product.title}
      </div>
      <div className="cartItemPrice">
        {Number(props.data.product.price).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </div>
      <div className="cartItemQuantity">
        <button onClick={props.decrease}>
          <IoRemoveCircleOutline size="1.5em" />
        </button>
        <span>{props.data.quantity}</span>
        <button onClick={props.increase}>
          <IoAddCircleOutline size="1.5em" />
        </button>
      </div>
      <div className="cartItemTotal">
        {(
          Number(props.data.product.price) * props.data.quantity
        ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        <button className="cartDelete" type="button" onClick={props.remove}>
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
}
