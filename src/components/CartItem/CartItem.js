import React from "react";
import "./CartItem.css";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { getFirestore, doc, getDoc, setDoc } from "@firebase/firestore";
import { app } from "../../firebase"
import { useHistory } from "react-router";

export default function CartItem(props) {
  const history = useHistory();
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
      await setDoc(cartRef, userCart).then(()=>{
        document.location.reload(window.scrollY);
      });
    }
    rmv();
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
      await setDoc(cartRef, userCart).then(()=>{
        document.location.reload(window.scrollY);
      });
    }
    inc();
      //document.location.reload(window.scrollY);

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
      await setDoc(cartRef, userCart).then(()=>{
        if (success)
          document.location.reload(window.scrollY);
      });
    }
    dec();
  }

  const handleDetail = e => {
    history.push({
      pathname: "/product-detail",
      state: {prdID: props.id}
    })
  }

  return (
    <div className="cartItemcontainer">
      <div className="cartItem" onClick={handleDetail}>
        <img src={props.imgURL} alt="" />
        {props.name}
      </div>
      <div className="cartItemPrice">
        {Number(props.price).toLocaleString("vi-VN", {
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
          Number(props.price) * props.quantity
        ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        <button className="cartDelete" type="button" onClick={handleRemove}>
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
}
