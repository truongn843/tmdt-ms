import React, { useEffect } from "react";
import CartItem from "../CartItem/CartItem";
import "./css/CartList.css";
import { useState } from "react";

export default function CartList(props) {
  const [toggle, setToggle] = useState(-1);
  const [data, setData] = useState(props.data);
  const [Items, setItems] = useState(
    data.map((item, index) => (
      <CartItem
        key={index}
        data={item}
        decrease={() => {
          decrease(index);
        }}
        increase={() => {
          increase(index);
        }}
        remove={() => {
          remove(index);
        }}
      />
    ))
  );
  const increase = (index) => {
    let newData = data;
    newData[index].quantity += 1;
    setData(newData);
    setToggle(-toggle);
  };
  const decrease = (index) => {
    if (data[index].quantity > 1) {
      let newData = data;
      newData[index].quantity -= 1;
      setData(newData);
      setToggle(-toggle);
    }
  };
  const remove = (index) => {
    let newData = data;
    newData.splice(index, 1);
    setData(newData);
    setToggle(-toggle);
    console.log(data);
  };

  const dataChange = () => {
    setItems(
      data.map((item, index) => (
        <CartItem
          key={index}
          data={item}
          decrease={() => {
            decrease(index);
          }}
          increase={() => {
            increase(index);
          }}
          remove={() => {
            remove(index);
          }}
        />
      ))
    );
  };
  useEffect(dataChange, [toggle]);
  return (
    <div className="cartList-container">
      <div className="cartList-header">
        <h6 className="cart-title">Sản phẩm ({data.length})</h6>
        <h6 className="cart-price">Đơn giá</h6>
        <h6 className="cart-quantity">Số lượng</h6>
        <h6 className="cart-total">Thành tiền</h6>
      </div>
      <div className="cart-product">{Items}</div>
    </div>
  );
}
