import React,{useState, useEffect} from "react";
import "./CartPage.css";
import CartItem from "../../components/CartItem/CartItem";
import Address from "../../components/CardContent/Address";
import MaKhuyenMai from "../../components/CardContent/MaKhuyenMai";
import DonHang from "../../components/CardContent/DonHang";
import { useHistory } from "react-router";
import UserNavbar from "../../components/NavBar/UserNavbar";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import { faShoppingCart, faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {onAuthStateChanged, getAuth} from "firebase/auth";
import {app} from "../../firebase";
import {getFirestore, query, collection, where, getDocs, doc, getDoc}from "firebase/firestore"

function CartPage() {
  const [navbar, setNavbar] = useState({bar: null});
  const [name, setName] = useState({value: null});
  const [address, setAddress] = useState({value: null});
  const [phone, setPhone] = useState({value: null});
  const [cart, setCart] = useState({items: []});
  const [cost, setCost] = useState({estimated: 0, voucherDiscount: 0})

  let history = useHistory();
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
    if (email !== null) verifyAdmin();
    const loadVoucher = async () => {
      const cartRef = doc(db, 'carts', localStorage.getItem('userID'));
      const cartSnap = await getDoc(cartRef);
      let voucher = {
        percent: 0,
        max: 0
      };
      if (cartSnap.exists() && cartSnap.data().voucher !== ""){
        const q = query(collection(db, "vouchers"), where("code", "==", cartSnap.data().voucher));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc)=>{
          voucher.percent = doc.data().percent;
          voucher.max = doc.data().max
        }) 
      }
      return voucher;
    }
    const loadCartData = async () => {
      const voucher = await loadVoucher();
      const cartRef = doc(db, 'carts', localStorage.getItem('userID'));
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists())
      cartSnap.data().cartItems.forEach((item)=>{
        setCart(prev=>({
          items: [...prev.items,(
            <CartItem 
              imgURL = {item.imgURL}
              name = {item.name}
              quantity = {item.quantity}
              price = {item.price}
              id = {item.id}
            />
          )]
        }));
        setCost(prev=>({
          estimated: item.price * item.quantity + prev.estimated,
          voucherDiscount: 
            (prev.voucherDiscount + item.price * item.quantity * voucher.percent / 100 > voucher.max) ?
            voucher.max : (prev.voucherDiscount + item.price * item.quantity * voucher.percent / 100)
        }))
      });
    }
    if (email !== null) loadCartData();
  }, [])

  const handlePayment = () => {
    if (name.value == null || address.value == null){
      history.push({
        pathname: '/user-profile',
        state: {msg: "Trước hết bạn cần nhập tên và địa chỉ nhận hàng."}
      });
    }    
    else {
      console.log(cost);
      history.push({
        pathname: '/payment',
        state: {...cost, voucher: cost.voucherDiscount !== 0}
      });
    };
  };

  const backToHome = () => {
    history.push("/user");
  }

  document.title = "Giỏ hàng - BK Phone";

  return (
    <div>
      {navbar.bar}
      <div className="cartPage">
        <h2 id="giohang"><FontAwesomeIcon icon={faShoppingCart}/> Giỏ hàng</h2>
        <div className="cartPage-container">
          <div className="cartPage-left">
            <div className="cartList-container">
              <div className="cartList-header">
                <h6 className="cart-title">Sản phẩm</h6>
                <h6 className="cart-price">Đơn giá</h6>
                <h6 className="cart-quantity">Số lượng</h6>
                <h6 className="cart-total">Thành tiền</h6>
              </div>
              <div className="cart-product">{cart.items}</div>
            </div>
            { cart.items.length === 0 ?
              (<div className="no-items">Không có sản phẩm nào trong giỏ hàng.</div>) :
              (<div className="btn-payment" onClick={handlePayment}>Tiến hành thanh toán</div>)
            }
            <div className="btn-payment btn-comeback" onClick={backToHome}><FontAwesomeIcon icon={faChevronLeft}/> Trang Chủ</div>
            
          </div>
          <div className="cartPage-right">
            <Address 
              fullname={name.value} 
              address={address.value} 
              phone={phone.value}
            />
            <MaKhuyenMai 
              input={true}
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

export default CartPage;
