import React, { Component } from "react";
import ButtonDatMua from "../../components/Button/ButtonDatMua";
import Card from "../../components/Card/Card";
import Address from "../../components/CardContent/Address";
import DonHang from "../../components/CardContent/DonHang";
import HinhThucGiaoHang from "../../components/CardContent/HinhThucGiaoHang";
import HinhThucThanhToan from "../../components/CardContent/HinhThucThanhToan";
import MaKhuyenMai from "../../components/CardContent/MaKhuyenMai";
import NavBar from "../../components/NavBar/UserNavbar";
import Path from "../../components/Path/Path";
import "./PaymentPage.css";
export default class PaymentPage extends Component {
  render() {
    return (
      <>
        <NavBar />
        <Path />
        <Card
          left1={<HinhThucGiaoHang />}
          left2={<HinhThucThanhToan />}
          left3={<ButtonDatMua />}
          right1={<Address />}
          right2={<MaKhuyenMai />}
          right3={<DonHang />}
        />
      </>
    );
  }
}
