import React, {useState, useEffect} from "react";
import "./OrderPage.css";
import { useHistory } from "react-router";
import {app} from "../../firebase";
import {getFirestore, query, collection, where, getDocs, doc, getDoc}from "firebase/firestore";
import {onAuthStateChanged, getAuth, signOut} from "firebase/auth";
import UserNavbar from "../../components/NavBar/UserNavbar";
import AdminNavbar from "../../components/NavBar/AdminNavbar";

export default function OrderPage (props) {
    let history = useHistory();
    const [navbar, setNavbar] = useState({bar: null})
    const [status, setStatus] = useState({value: "accepted", orderID: null, amount: null});

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
        console.log('checking');
      }
      else 
        history.push({
          pathname: '/login',
          state: {msg: "Trước hết bạn cần đăng nhập."}
        });
    });

    const db = getFirestore(app);
    const verifyAdmin = async () => {
      console.log('a');
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc)=>{
        if (doc.data().type === "admin")
          setNavbar({bar: (<AdminNavbar/>)});
        else 
          setNavbar({bar: (<UserNavbar/>)});
      })
    }

    useEffect(() => {
      try{
        setStatus({
          value: props.location.state.orderStatus, 
          orderID: props.location.state.orderID,
          amount: props.location.state.amount
        });
      } catch (error) {
        history.push("/");
      };
      verifyAdmin();
    }, []);

    const backToHome = e => {
        history.push("/");
    }

    return (
    <div>
        {navbar.bar}
        <div className="order-container">
                {  status.value === "success" && (
                    <div className="card success">
                        <div className="order-img">
                            <i className="icon">✓</i>
                        </div>
                        <h1>Thành công</h1> 
                        <p>Đơn hàng của quý khách đã được tiếp nhận.<hr/></p>
                        <h1>Mã đơn hàng: <strong>{status.orderID}</strong></h1> <hr/>
                        <button onClick={backToHome}>Tiếp tục mua hàng</button>
                    </div>
                )}
                {  status.value === "error" && (
                    <div className="card error">
                        <div className="order-img">
                            <span>X</span>
                        </div>
                        <h1>Không thành công</h1> 
                        <p>Đã có lỗi xảy ra khi thanh toán.<hr/></p>
                        <button onClick={backToHome}>Tiếp tục mua hàng</button>
                    </div>
                )}
                {   status.value === "accepted" && (
                    <div className="card accepted">
                        <div className="order-img">
                            <i className="icon">✓</i>
                        </div>
                        <h1>Đã tiếp nhận đơn hàng</h1> 
                        
                        <p>Đơn hàng của quý khách đã được tiếp nhận và chờ thanh toán.<hr/></p>
                        <h1>Mã đơn hàng: <strong>{status.orderID}</strong></h1> <hr/>
                        <p>
                            Khách hàng vui lòng chuyển số tiền tương ứng vào  <br/>
                            một trong những tài khoản ngân hàng
                            dưới đây với nội dung là <strong>mã đơn hàng</strong>.
                        </p><br/>
                        <p className="amount-display">Số tiền cần thanh toán: 
                          <span className="amount-value">
                            {Number(status.amount).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                          </span>
                        </p>
                        <table className="bank-account">
                          <tr>
                            <th>Ngân hàng</th>
                            <th>Chi nhánh</th>
                            <th>STK</th>
                            <th>Tên chủ TK</th>
                          </tr>
                          <tr>
                            <td>OCB</td>
                            <td>Lý Thường Kiệt Q10 TPHCM</td>
                            <td>0004 1000 xxxx xxxx</td>
                            <td>NGUYEN HUU TRUONG</td>
                          </tr>
                        </table>
                        <p><i>Nếu gặp sự cố, quý khách vui lòng liên hệ hotline <strong>1900 xxxx</strong> để được hỗ trợ.</i>
                            <br/><br/>  Cảm ơn quý khách đã lựa chọn sản phẩm của chúng tôi !
                        </p>
                        <button onClick={backToHome}>Tiếp tục mua hàng</button>
                    </div>
                )}

        </div>  
    </div>
    );
}