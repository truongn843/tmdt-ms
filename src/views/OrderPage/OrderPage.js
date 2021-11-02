import React, {useState, useEffect} from "react";
import "./OrderPage.css";
import { useHistory } from "react-router";
import {app} from "../../firebase";
import {getFirestore, doc, getDoc}from "firebase/firestore";
import {onAuthStateChanged, getAuth} from "firebase/auth";
import UserNavbar from "../../components/NavBar/UserNavbar";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import qrcode from "./qrcode.jpg";
import Footer from "../../components/Footer/Footer";

export default function OrderPage (props) {
    let history = useHistory();
    const [navbar, setNavbar] = useState({bar: null})
    const [status, setStatus] = useState({orderID: null, amount: null, paymentMethod: null});

    const auth = getAuth(app);
    const userID = localStorage.getItem('userID');

    onAuthStateChanged(auth, (user)=>{
      if (user){}
      else {
        localStorage.clear();
        history.push({
          pathname: '/login',
          state: {msg: "Trước hết bạn cần đăng nhập."}
        });
      }
        
    });

    const db = getFirestore(app);
    const verifyAdmin = async () => {
      const userRef = doc(db, 'users', userID);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()){
        if (userSnap.data().type === "admin")
          setNavbar({bar: (<AdminNavbar/>)})
        else 
          setNavbar({bar: (<UserNavbar/>)})
      }
    }

    console.log(status);

    useEffect(() => {
      try{
        setStatus({
          orderID: props.location.state.orderID,
          amount: props.location.state.amount,
          paymentMethod: props.location.state.paymentMethod
        });
      } catch (error) {
        history.push("/");
      };
      if (userID) verifyAdmin();
    }, []);

    const backToHome = e => {
        history.push("/");
    }

    const handleMoMoPayment = () => {

      console.log(process.env.REACT_APP_PARTNER_CODE);
      console.log(process.env.REACT_APP_ACCESS_KEY);
      console.log(process.env.REACT_APP_SECRET_KEY);

      var partnerCode = process.env.REACT_APP_PARTNER_CODE;
      var    accessKey = process.env.REACT_APP_ACCESS_KEY;
      
      var    requestId = process.env.REACT_APP_PARTNER_CODE + new Date().getTime();
      var    amount = status.amount.toString();
      var    orderId = status.orderID;
      var    orderInfo= "thanh toan don hang "  + orderId + " " + amount;
      var    returnUrl =  "http://localhost:3000/";
      var    notifyUrl = "https://google.com.vn";
      var    requestType = "captureMoMoWallet";
      var    extraData = "";
      var secretkey = process.env.REACT_APP_SECRET_KEY;
   
      var rawSignature = "partnerCode=" + partnerCode +
                      "&accessKey="+accessKey+
                      "&requestId=" + requestId+
                      "&amount=" + amount+
                      "&orderId=" + orderId+
                      "&orderInfo=" + orderInfo +
                      "&returnUrl=" + returnUrl+
                      "&notifyUrl=" + notifyUrl+
                      "&extraData=" + extraData
      const crypto = require('crypto');
      var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');

      const url = 'https://test-payment.momo.vn/gw_payment/transactionProcessor';

      const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        accessKey : accessKey,
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        returnUrl : returnUrl,
        notifyUrl : notifyUrl,
        extraData : extraData,
        requestType : requestType,
        signature : signature,
        
    })

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
      const https = require('https');
      const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/gw_payment/transactionProcessor',
        method: 'POST',
        headers: myHeaders
  } 
    

    const req =  https.request(options, res => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (body) => {
          const payUrl=JSON.parse(body).payUrl.toString();
          console.log(payUrl);
          window.setTimeout(function(){ window.location = payUrl; },1000);
      });
      res.on('end', () => {
          console.log('No more data in response begin redirect');
      });
      }   )

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });
  // write data to request body
    console.log("Sending....")
    req.write(requestBody);
    req.end();  

    }



  //   const handleMoMoBanking= () => {

  //     console.log(process.env.REACT_APP_PARTNER_CODE);
  //     console.log(process.env.REACT_APP_ACCESS_KEY);
  //     console.log(process.env.REACT_APP_SECRET_KEY);

  //     var partnerCode = process.env.REACT_APP_PARTNER_CODE;
  //     var    accessKey = process.env.REACT_APP_ACCESS_KEY;
      
  //     var    requestId = process.env.REACT_APP_PARTNER_CODE + new Date().getTime();
  //     var    amount = status.amount.toString();
  //     var    orderId = status.orderID;
  //     var    orderInfo= "thanh toan don hang "  + orderId + " " + amount;
  //     var    redirectUrl =  "http://localhost:3000/";
  //     var    ipnUrl = "https://google.com.vn";
  //     var    requestType = "payWithATM";
  //     var    extraData = "";
  //     var secretkey = process.env.REACT_APP_SECRET_KEY;
   
  //     var rawSignature = "partnerCode=" + partnerCode +
  //                     "&accessKey="+accessKey+
  //                     "&requestId=" + requestId+
  //                     "&amount=" + amount+
  //                     "&orderId=" + orderId+
  //                     "&orderInfo=" + orderInfo +
  //                     "&redirectUrl=" + redirectUrl+
  //                     "&ipnUrl=" + ipnUrl+
  //                     "&extraData=" + extraData
  //     const crypto = require('crypto');
  //     var signature = crypto.createHmac('sha256', secretkey)
  //       .update(rawSignature)
  //       .digest('hex');

  //     const url = 'https://test-payment.momo.vn/gw_payment/transactionProcessor';

  //     const requestBody = JSON.stringify({
  //       partnerCode : partnerCode,
  //       accessKey : accessKey,
  //       requestId : requestId,
  //       amount : amount,
  //       orderId : orderId,
  //       orderInfo : orderInfo,
  //       redirectUrl : redirectUrl,
  //       ipnUrl : ipnUrl,
  //       extraData : extraData,
  //       requestType : requestType,
  //       signature : signature,
  //       lang: vi
  //   })

  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //     const https = require('https');
  //     const options = {
  //       hostname: 'test-payment.momo.vn',
  //       port: 443,
  //       path: '/gw_payment/transactionProcessor',
  //       method: 'POST',
  //       headers: myHeaders
  // } 
    

  //   const req =  https.request(options, res => {
  //     console.log(`Status: ${res.statusCode}`);
  //     console.log(`Headers: ${JSON.stringify(res.headers)}`);
  //     res.setEncoding('utf8');
  //     res.on('data', (body) => {
  //         // const payUrl=JSON.parse(body).payUrl.toString();
  //         console.log(payUrl);
  //         window.setTimeout(function(){ window.location = payUrl; },1000);
  //     });
  //     res.on('end', () => {
  //         console.log('No more data in response begin redirect');
  //     });
  //     }   )

  //   req.on('error', (e) => {
  //     console.log(`problem with request: ${e.message}`);
  //   });
  // // write data to request body
  //   console.log("Sending....")
  //   req.write(requestBody);
  //   req.end();  

  //   }



    return (
    <div>
        {navbar.bar}
        <div className="order-container">
                {  status.paymentMethod === "cod" && (
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
                {   status.paymentMethod !== "cod" && (
                    <div className="card accepted">
                        <div className="order-img">
                            <i className="icon">✓</i>
                        </div>
                        <h1>Đã tiếp nhận đơn hàng</h1> 
                        
                        <p>Đơn hàng của quý khách đã được tiếp nhận và chờ thanh toán.<hr/></p>
                        <h1>Mã đơn hàng: <strong>{status.orderID}</strong></h1> <hr/>
                        <p>
                            Khách hàng vui lòng chuyển số tiền tương ứng vào một trong những  <br/>
                            tài khoản ngân hàng (hoặc ví MoMo) dưới đây với nội dung là <strong>mã đơn hàng</strong>.
                        </p><br/>
                        <p className="amount-display">Số tiền cần thanh toán: 
                          <span className="amount-value">
                            {Number(status.amount).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                          </span>
                        </p>
                        { status.paymentMethod === "banking" &&
                        <table className="bank-account">
                          <tbody>
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
                            <tr>
                            {/* <button className="bank-account amount-display amount-value" onClick={handleMoMoBanking}>Bấm để thanh toán ngân hàng </button> */}
                            </tr>
                          </tbody>
                        </table>
                        
                        }
                        
                      
                        { status.paymentMethod === "momo" &&
                        <div>
                          { ((status.amount <= 20000000) && (status.amount >= 1000)) ?
                        <button className="bank-account amount-display amount-value" onClick={handleMoMoPayment}>Bấm để tạo mã QR </button>
                          : <p className="bank-account amount-display amount-value">"Số tiền thanh toán Momo phải lớn hơn 1.000đ và bé hơn 20.000.000đ. Vui lòng chọn hình thức thanh toán khác"  </p> }
                          {/* <table className="bank-account">
                            <tbody>
                              <tr>
                                <th>Ví điện tử</th>
                                <th>SĐT</th>
                                <th>Tên chủ TK</th>
                              </tr>
                              <tr>
                                <td>MoMo</td>
                                <td>0333 446 xxx</td>
                                <td>NGUYEN HUU TRUONG</td>
                              </tr>
                            </tbody>
                          </table>
                          <img src={qrcode} alt="qrcode" width="300px"/> */}
                        </div>
                        
                        }
                        
                        <p><i>Nếu gặp sự cố, quý khách vui lòng liên hệ hotline <strong>1900 xxxx</strong> để được hỗ trợ.</i>
                            <br/><br/>  Cảm ơn quý khách đã lựa chọn sản phẩm của chúng tôi !
                        </p>
                        <button onClick={backToHome}>Tiếp tục mua hàng</button>
                    </div>
                )}

        </div> 
        
        <Footer/>
    </div>
    );
}