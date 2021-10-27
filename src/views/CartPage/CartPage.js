import React from "react";
import "./CartPage.css";
import CartList from "../../components/CartList/CartList";
import cartItems from "../../pseudo-data/cartItems.json";
import Address from "../../components/CardContent/Address";
import MaKhuyenMai from "../../components/CardContent/MaKhuyenMai";
import DonHang from "../../components/CardContent/DonHang";
import ButtonThanhToan from "../../components/Button/ButtonThanhToan";
import { useHistory } from "react-router";
import UserNavbar from "../../components/NavBar/UserNavbar";

function CartPage() {
  let history = useHistory();
  const handlePayment = () => {
    console.log("payment");
    history.push("/payment");
  };
  return (
    <div>
      <UserNavbar />
      <div className="cartPage">
        <div className="cartPage-path">
          <span>HomePage &gt; </span>
          <span>Giỏ hàng</span>
        </div>
        <h2 id="giohang">Giỏ hàng</h2>
        <div className="cartPage-container">
          <div className="cartPage-left">
            <CartList data={cartItems} />
            <ButtonThanhToan handlePayment={handlePayment} />
          </div>
          <div className="cartPage-right">
            <Address />
            <MaKhuyenMai />
            <DonHang />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
