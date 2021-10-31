import React from "react";
import "./Footer.css";
import logoFirebase from "./firebase.png";
import logoReact from "./react.png";

export default function Footer (){

    return <div className="footer">
        Website bán điện thoại - Project Thương Mại Điện Tử - Đại học Bách Khoa TP.HCM
        <hr/>
        268 Lý Thường Kiệt, Phường 14, Quận 10, Thành phố Hồ Chí Minh
        <div className="footer-logo-container"><img src={logoFirebase} alt="" height="100%"/></div>
        <div className="footer-logo-container"><img src={logoReact} alt="" height="100%"/></div>
    </div>;
}