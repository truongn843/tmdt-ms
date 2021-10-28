import React from "react";
import "./CartItem.css";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { getFirestore, doc, getDoc, setDoc } from "@firebase/firestore";
import { app } from "../../firebase"

export default function CartItem(props) {
  const db = getFirestore(app);
  const cartRef = doc(db, 'carts', localStorage.getItem('userID'));

  const handleRemove = e => {
    const rmv = async () => {
      const cartSnap = await getDoc(cartRef);
      let userCart = JSON.parse(JSON.stringify(cartSnap.data()));
      userCart.cartItems = userCart.cartItems.filter((item)=>{
        return item.id !== props.id;
      })
      console.log(userCart);
      await setDoc(cartRef, userCart);
    }
    rmv().then(()=>{
      document.location.reload(window.scrollY);
    });
  }
  const handleIncrease = e => {
    const inc = async () => {
      const cartSnap = await getDoc(cartRef);
      let userCart = JSON.parse(JSON.stringify(cartSnap.data()));
      userCart.cartItems = userCart.cartItems.map((item)=>{
        if (item.id === props.id)
          item.quantity++;
        return item;
      })
      console.log(userCart);
      await setDoc(cartRef, userCart);
    }
    inc().then(()=>{
      document.location.reload(window.scrollY);
    });
  }
  const handleDecrease = e => {
    let success = false;
    const dec = async () => {
      const cartSnap = await getDoc(cartRef);
      let userCart = JSON.parse(JSON.stringify(cartSnap.data()));
      userCart.cartItems = userCart.cartItems.map((item)=>{
        if (item.id === props.id)
          if (item.quantity > 1){
            item.quantity--;
            success = true;
          }
        return item;
      })
      console.log(userCart);
      await setDoc(cartRef, userCart);
    }
    dec().then(()=>{
      if (success)
        document.location.reload(window.scrollY);
    });
  }
  return (
    <div className="cartItemcontainer">
      <div className="cartItem">
        <img src={props.imgURL} alt="" />
        {props.name}
      </div>
      <div className="cartItemPrice">
        {Number(parseFloat(props.price) * 1000000).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </div>
      <div className="cartItemQuantity">
        <button onClick={handleDecrease}>
          <IoRemoveCircleOutline size="1.5em" />
        </button>
        <span>{props.quantity}</span>
        <button onClick={handleIncrease}>
          <IoAddCircleOutline size="1.5em" />
        </button>
      </div>
      <div className="cartItemTotal">
        {(
          Number(parseFloat(props.price) * 1000000) * props.quantity
        ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        <button className="cartDelete" type="button" onClick={handleRemove}>
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
}
