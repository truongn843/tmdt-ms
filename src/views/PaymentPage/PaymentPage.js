import React, {useState, useEffect} from "react";
import Card from "../../components/Card/Card";
import Address from "../../components/CardContent/Address";
import DonHang from "../../components/CardContent/DonHang";
import MaKhuyenMai from "../../components/CardContent/MaKhuyenMai";
import UserNavbar from "../../components/NavBar/UserNavbar";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import codImg from './img/icon-payment-method-cod.jpg'
import momoImg from './img/icon-payment-method-mo-mo.jpg'
import atmImg from './img/icon-payment-method-atm.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faChevronLeft, faMotorcycle, faRunning} from "@fortawesome/free-solid-svg-icons"
import { useHistory } from "react-router";
import {app} from "../../firebase";
import {getFirestore, query, collection, where, getDocs, doc, getDoc}from "firebase/firestore";
import {onAuthStateChanged, getAuth} from "firebase/auth";

import "./PaymentPage.css";


export default function PaymentPage (props) {
  let history = useHistory();
  const [navbar, setNavbar] = useState({bar: null});
  const [name, setName] = useState({value: null});
  const [address, setAddress] = useState({value: null});
  const [phone, setPhone] = useState({value: null});
  const [voucher, setVoucher] = useState({value: false});
  const [cost, setCost] = useState({estimated: 0, voucherDiscount: 0})

  const auth = getAuth(app);
  const email = localStorage.getItem('email');

  onAuthStateChanged(auth, (user)=> {
    if(user);
    else
      history.push({
        pathname: '/login',
        state: {msg: "Trước hết bạn cần đăng nhập."}
      });
  });

  useEffect(() => {
    try {
      setVoucher({value: props.location.state.voucher});
      if (props.location.state.estimated !== 0)
        setCost({estimated: props.location.state.estimated, voucherDiscount: props.location.state.voucherDiscount});
      else
        history.push('/cart');
    } catch (error) {
      history.push('/cart');
    }

    const db = getFirestore(app);
    const verifyAdmin = async () => {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc)=>{
        if (doc.data().type === "admin")
          setNavbar({bar: (<AdminNavbar/>)})
        else 
          setNavbar({bar: (<UserNavbar/>)})
        setName({value: doc.data().fullname});
        setAddress({value: doc.data().address});
        setPhone({value: doc.data().phone});
      })
    }
    verifyAdmin();
  }, []);
  return (
    <div className="payment-container">
      {navbar.bar}
      <div className="cartPage">
        <h2 id="giohang"><FontAwesomeIcon icon={faCreditCard}/> Thanh toán</h2>
        <div className="cartPage-container">
          <div className="cartPage-left">
            <form className="cartList-container">
              <fieldset>
                <legend>Phương thức giao hàng</legend>
                <div className="fieldset-container">
                  <div className="input-group">
                    <div className="input-icon icon-run"><FontAwesomeIcon icon={faRunning}/></div>
                    <input id="ship-direct" type="radio" className="radio-fake" name="shipping" value="direct"/>
                    <label for="ship-direct">Nhận tại cửa hàng</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon icon-motor-grab"><FontAwesomeIcon icon={faMotorcycle}/></div>
                    <input id="ship-grab" type="radio" className="radio-fake" name="shipping" value="grab"/>
                    <label for="ship-grab">Grab</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon icon-motor-ghn"><FontAwesomeIcon icon={faMotorcycle}/></div>
                    <input id="ship-ghn" type="radio" className="radio-fake" name="shipping" value="ghn"/>
                    <label for="ship-ghn">Giao hàng nhanh</label>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>Phương thức thanh toán</legend>
                <div className="fieldset-container">
                  <div className="input-group">
                    <div className="input-icon"><img src={codImg} alt="COD"/></div>
                    <input id="pay-cod" type="radio" className="radio-fake" name="paymethod" value="cod"/>
                    <label for="pay-cod">Thanh toán khi nhận hàng</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon"><img src={momoImg} alt="MoMo"/></div>
                    <input id="pay-momo" type="radio" className="radio-fake" name="paymethod" value="momo"/>
                    <label for="pay-momo">Ví điện tử MoMo</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon"><img src={atmImg} alt="Card"/></div>
                    <input id="pay-banking" type="radio" className="radio-fake" name="paymethod" value="banking"/>
                    <label for="pay-banking">Chuyển khoản ngân hàng</label>
                  </div>
                </div>
              </fieldset>
              <div className="btn-payment btn-comeback"><FontAwesomeIcon icon={faChevronLeft}/> Giỏ hàng</div>
              <div className="btn-payment">Thanh toán</div>
            </form>
          </div>
          <div className="cartPage-right">
            <Address 
              fullname={name.value} 
              address={address.value} 
              phone={phone.value}
            />
            <MaKhuyenMai 
              input={voucher.value}
            />
            <DonHang
              estimated={cost.estimated}
              voucherDiscount={cost.voucherDiscount}
              deliveryFee={0}
              total={cost.estimated - cost.voucherDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
