import React, {useState, useEffect} from "react";
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
import {onAuthStateChanged, getAuth} from "firebase/auth";
import {getFirestore, doc, getDoc, setDoc, deleteDoc}from "firebase/firestore";


import "./PaymentPage.css";
import Footer from "../../components/Footer/Footer";
import { Button } from "bootstrap";
import { connectStorageEmulator } from "@firebase/storage";



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

  const[thontinGHN, setThongtinGHN] = useState({  
  })
  
  
  const auth = getAuth(app);
  let userID = localStorage.getItem('userID');

  onAuthStateChanged(auth, (user)=>{
    if (user){}
    else {
      history.push({
        pathname: '/login',
        state: {msg: "Trước hết bạn cần đăng nhập."}
      });
      localStorage.clear();
    }
      
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
  
  const db = getFirestore(app)
  ;
  const verifyAdmin = async () => {
    const userRef = doc(db, 'users', userID);
    console.log(userRef);
    const userSnap = await getDoc(userRef);
    console.log(userSnap.data())
    if (userSnap.exists()){
      if (userSnap.data().type === "admin")
        setNavbar({bar: (<AdminNavbar/>)})
      else 
        setNavbar({bar: (<UserNavbar/>)})
    }
    setUserInfo({...userInfo, name: userSnap.data().fullname, address: userSnap.data().address, phone: userSnap.data().phone});
  }

  const addOrder = async (orderID) => {
    let newOrder = {
      userID: userID,
      dateCreated: new Date(),
      name: userInfo.name,
      phone: userInfo.phone,
      address: userInfo.address,
      amount: cartInfo.estimated - cartInfo.voucherDiscount,
      status: paymentInfo.method === "cod" ? "accept" : "waitingForPayment",
      paymentMethod: paymentInfo.method,
      shippingService: paymentInfo.shipping,
      items: [],
      statusMoMo: '',
      momoUrlPay: '',
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
    if (userID) verifyAdmin();
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
    if (paymentInfo.method) 
   
      history.push({
        pathname: "/order-status",
        state: {
          orderID: orderID, 
          amount: cartInfo.estimated - cartInfo.voucherDiscount,
          paymentMethod: paymentInfo.method,
          thontinGHN: thontinGHN
        }
      })
  }



const setWarp = () => {

    if (paymentInfo.method !== 'cod' && paymentInfo.shipping === 'ghn'){
      setThongtinGHN({"payment_type_id": 2,
      "note": "",
      "required_note": "KHONGCHOXEMHANG",
      "return_phone": "0332190444",
      "return_address": "39 NTT",
      "return_district_id": null,
      "return_ward_code": "",
      "client_order_code": "",
      "to_name": userInfo.name,
      "to_phone": userInfo.phone,
      "to_address": userInfo.address,
      "to_ward_code": "20308",
      "to_district_id": 1444,
      "cod_amount": cartInfo.estimated - cartInfo.voucherDiscount,
      "content": "Ban dien thoai",
      "weight": 1000,
      "length": 10,
      "width": 10,
      "height": 10,
      "pick_station_id": 1444,
      "deliver_station_id": null,
      "insurance_value": 10000000,
      "service_id": 0,
      "service_type_id": 2,
      "order_value": cartInfo.estimated,
      "coupon": null,
      "pick_shift": [
        2
      ],
      "items": [
        {
          "name": "Điện thoại",
          "code": "Đt1234",
          "quantity": 1,
          "price": 200000,
          "length": 12,
          "width": 12,
          "height": 12,
        }
      ]
    })
  } else if ( paymentInfo.method === 'cod' && paymentInfo.shipping === 'ghn' )
  {
    setThongtinGHN({"payment_type_id": 2,
    "note": "",
    "required_note": "KHONGCHOXEMHANG",
    "return_phone": "0332190444",
    "return_address": "39 NTT",
    "return_district_id": null,
    "return_ward_code": "",
    "client_order_code": "",
    "to_name": userInfo.name,
    "to_phone": userInfo.phone,
    "to_address": userInfo.address,
    "to_ward_code": "20308",
    "to_district_id": 1444,
    "cod_amount": 0,
    "content": "Ban dien thoai",
    "weight": 1000,
    "length": 10,
    "width": 10,
    "height": 10,
    "pick_station_id": 1444,
    "deliver_station_id": null,
    "insurance_value": 10000000,
    "service_id": 0,
    "service_type_id": 2,
    "order_value": cartInfo.estimated,
    "coupon": null,
    "pick_shift": [
      2
    ],
    "items": [
      {
        "name": "Điện thoại",
        "code": "Đt1234",
        "quantity": 1,
        "price": 200000,
        "length": 12,
        "width": 12,
        "height": 12,
      }
    ]
  })}
  }






const showlog = (e) => {
  e.preventDefault();
  console.log(thontinGHN)
 
}




const handleGHNcreate = (e) => {
  e.preventDefault();
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("ShopId", "82780");
myHeaders.append("Token", "339aa1d0-386b-11ec-b514-aeb9e8b0c5e3");



var raw = JSON.stringify(
  thontinGHN
);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));


}


const handleGHNupdate = () => {
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("ShopId", "82780");
myHeaders.append("Token", "339aa1d0-386b-11ec-b514-aeb9e8b0c5e3");

var raw = JSON.stringify({
  "note": "nhớ gọi 30p khi giao3123123213231312",
  "order_code": "Z8746"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/update", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
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
                    <label htmlFor="ship-direct">Nhận tại cửa hàng</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon icon-motor-grab"><FontAwesomeIcon icon={faMotorcycle}/></div>
                    <input id="ship-grab" type="radio" className="radio-fake" name="shipping" value="grab"
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, shipping: 'grab' })}
                      checked={paymentInfo.shipping === 'grab'}
                    />
                    <label htmlFor="ship-grab">Grab</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon icon-motor-ghn"><FontAwesomeIcon icon={faMotorcycle}/></div>
                    <input id="ship-ghn" type="radio" className="radio-fake" name="shipping" value="ghn"
                      
                      onChange={(e) => {
                        setPaymentInfo({ ...paymentInfo, shipping: 'ghn' });
                      setWarp();               
  }}                
                      checked={paymentInfo.shipping === 'ghn'}
                    />
                    <label htmlFor="ship-ghn">Giao hàng nhanh</label>
                  </div>
                  {paymentInfo.shipping==='ghn' ? <div>
                  <button className='btn filter-btn' onClick={handleGHNcreate}>Xác nhận</button> 
                  <button className='btn filter-btn' onClick={handleGHNupdate}>Update</button> 
                  </div>
                  
                  :null }
                </div>
                
                
                
                <div> 
                {/* <form onChange={handleChangeShiping}>
                <label>
                  Người nhận:
                  <input type="text" name="to_name" value={userInfo.name}/>
                </label>
                <label>
                  Địa chỉ:
                  <input type="text" name="to_address" value={userInfo.address}/>
                </label>
                <label>
                  Sđt:
                  <input type="text" name="to_phone" value={userInfo.phone}/>
                </label>
                <label>
                  Note:
                  <input type="text" name="note" value={thontinGHN.note}/>
                </label>
                  <input type="submit" onClick={showlog} value='submit'/> 
                </form> */}
                
                </div>
              </fieldset>
              <fieldset>
                <legend>Phương thức thanh toán</legend>
                <div className="fieldset-container">
                  <div className="input-group">
                    <div className="input-icon"><img src={codImg} alt="COD"/></div>
                    <input id="pay-cod" type="radio" className="radio-fake" name="paymethod" value="cod"
                      onChange={(e) => {setPaymentInfo({ ...paymentInfo, method: 'cod' });
                      setWarp();
                    }}
                      
                      checked={paymentInfo.method === 'cod'}
                    />
                    <label htmlFor="pay-cod">Thanh toán khi nhận hàng</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon"><img src={momoImg} alt="MoMo"/></div>
                    <input id="pay-momo" type="radio" className="radio-fake" name="paymethod" value="momo"
                      onChange={(e) => {setPaymentInfo({ ...paymentInfo, method: 'momo' });setWarp() }}
                      checked={paymentInfo.method === 'momo'} 
                    />
                    <label htmlFor="pay-momo">Ví điện tử MoMo</label>
                  </div>
                  <div className="input-group">
                    <div className="input-icon"><img src={atmImg} alt="Card"/></div>
                    <input id="pay-banking" type="radio" className="radio-fake" name="paymethod" value="banking"
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, method: 'banking' })}
                      checked={paymentInfo.method === 'banking'}
                      defaultChecked 
                    />
                    <label htmlFor="pay-banking">Chuyển khoản ngân hàng</label>
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
      <Footer/>
    </div>
  );
}
