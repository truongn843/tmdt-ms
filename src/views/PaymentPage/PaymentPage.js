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
import {getFirestore, query, collection, where, getDocs, doc, getDoc, setDoc, deleteDoc}from "firebase/firestore";
import {onAuthStateChanged, getAuth, signOut} from "firebase/auth";

import "./PaymentPage.css";


export default function PaymentPage (props) {
  let history = useHistory();
  const [navbar, setNavbar] = useState({bar: null})
  const [userInfo, setUserInfo] = useState({
    name: null, address: null, phone: null
  });
  const [cartInfo, setCartInfo] = useState({
    estimated: 0, voucherDiscount: 0, useVoucher: false
  });
  const [paymentInfo, setPaymentInfo] = useState({
    shipping: "direct", method: "cod"
  });
  
  const auth = getAuth(app);
  let email = localStorage.getItem('email');
  onAuthStateChanged(auth, (user)=>{
    if (user){
      if (email !== user.email){
        signOut(auth).then(() => {
          console.log("Sign out successfully.");
        }).catch((error) => {
        });
        localStorage.removeItem('email');
        localStorage.removeItem('userID');
        history.push("/login");
      }
    }
    else 
      history.push({
        pathname: '/login',
        state: {msg: "Trước hết bạn cần đăng nhập."}
      });
  });

  const genOrderID = () => {
    var result           = '';
    var date = new Date();
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    result += date.getDate().toString() + date.getMonth().toString();
    var dateLength = result.length;
    for ( var i = 0; i < 12 - dateLength; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
    }
    return result;
  }
  
  const db = getFirestore(app);
  const verifyAdmin = async () => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
      if (doc.data().type === "admin")
        setNavbar({bar: (<AdminNavbar/>)});
      else 
        setNavbar({bar: (<UserNavbar/>)});
      setUserInfo({...userInfo, name: doc.data().fullname, address: doc.data().address, phone: doc.data().phone});
    })
  }

  const addOrder = async (orderID) => {
    let newOrder = {
      email: email,
      dateCreated: new Date(),
      name: userInfo.name,
      phone: userInfo.phone,
      address: userInfo.address,
      amount: cartInfo.estimated - cartInfo.voucherDiscount,
      status: "accepted",
      paymentMethod: paymentInfo.method,
      shippingService: paymentInfo.shipping,
      items: []
    };
    const cartRef = doc(db, 'carts', localStorage.getItem('userID'));
    const cartSnap = await getDoc(cartRef);
    cartSnap.data().cartItems.forEach((item)=>{
      newOrder.items.push(item);
    });
    await setDoc(doc(db, "orders", orderID), newOrder);
    await deleteDoc(cartRef);
  }

  useEffect(() => {
    verifyAdmin();
    try {
      if (props.location.state.estimated !== 0)
        setCartInfo({
          estimated: props.location.state.estimated, 
          voucherDiscount: props.location.state.voucherDiscount,
          useVoucher: props.location.state.voucher
        });
      else
        history.push('/cart');
    } catch (error) {
      history.push('/cart');
    }
  }, []);

  const backToCart = e => {
    history.push("/cart");
  }

  const handlePayment = e => {
    let orderID = genOrderID();
    addOrder(orderID);
    if (paymentInfo.method === "cod"){
      history.push({
        pathname: "/order-status",
        state: {orderStatus: "success", orderID: orderID, amount: cartInfo.estimated - cartInfo.voucherDiscount}
      })
    }
    else {
      history.push({
        pathname: "/order-status",
        state: {orderStatus: "accepted", orderID: orderID, amount: cartInfo.estimated - cartInfo.voucherDiscount}
      })
    }
  }

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
                    <input id="ship-direct" type="radio" className="radio-fake" name="shipping" value="direct"
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, shipping: 'direct' })}
                      checked={paymentInfo.shipping === 'direct'}
                    />
                    <label for="ship-direct">Nhận tại cửa hàng</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon icon-motor-grab"><FontAwesomeIcon icon={faMotorcycle}/></div>
                    <input id="ship-grab" type="radio" className="radio-fake" name="shipping" value="grab"
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, shipping: 'grab' })}
                      checked={paymentInfo.shipping === 'grab'}
                    />
                    <label for="ship-grab">Grab</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon icon-motor-ghn"><FontAwesomeIcon icon={faMotorcycle}/></div>
                    <input id="ship-ghn" type="radio" className="radio-fake" name="shipping" value="ghn"
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, shipping: 'ghn' })}
                      checked={paymentInfo.shipping === 'ghn'}
                    />
                    <label for="ship-ghn">Giao hàng nhanh</label>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>Phương thức thanh toán</legend>
                <div className="fieldset-container">
                  <div className="input-group">
                    <div className="input-icon"><img src={codImg} alt="COD"/></div>
                    <input id="pay-cod" type="radio" className="radio-fake" name="paymethod" value="cod"
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, method: 'cod' })}
                      checked={paymentInfo.method === 'cod'}
                    />
                    <label for="pay-cod">Thanh toán khi nhận hàng</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon"><img src={momoImg} alt="MoMo"/></div>
                    <input id="pay-momo" type="radio" className="radio-fake" name="paymethod" value="momo"
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, method: 'momo' })}
                      checked={paymentInfo.method === 'momo'}
                    />
                    <label for="pay-momo">Ví điện tử MoMo</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon"><img src={atmImg} alt="Card"/></div>
                    <input id="pay-banking" type="radio" className="radio-fake" name="paymethod" value="banking"
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, method: 'banking' })}
                      checked={paymentInfo.method === 'banking'}
                    />
                    <label for="pay-banking">Chuyển khoản ngân hàng</label>
                  </div>
                </div>
              </fieldset>
              <div className="btn-payment btn-comeback" onClick={backToCart}><FontAwesomeIcon icon={faChevronLeft}/> Giỏ hàng</div>
              <div className="btn-payment" onClick={handlePayment}>Thanh toán</div>
            </form>
          </div>
          <div className="cartPage-right">
            <Address 
              fullname={userInfo.name} 
              address={userInfo.address} 
              phone={userInfo.phone}
            />
            <MaKhuyenMai 
              input={cartInfo.useVoucher}
            />
            <DonHang
              estimated={cartInfo.estimated}
              voucherDiscount={cartInfo.voucherDiscount}
              deliveryFee={0}
              total={cartInfo.estimated - cartInfo.voucherDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
