import React, { useState, useEffect } from "react";
import {app} from "../../firebase";
import "./user-profile.css";
import { collection, query, where, getDocs, getFirestore, setDoc, doc, getDoc, orderBy, Timestamp } from "firebase/firestore";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useHistory } from "react-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons"
import userAvt from "../../assert/avatar.png";

const auth = getAuth(app);

function UserProfile(props) {
  const [alert, setAlert] = useState({status: false, currentOrderID: null});
  const [msg, setMsg] = useState({ status: false, message: "" });
  const [msg2, setMsg2] = useState({ status: false, message: "" });
  const [pwd, setPwd] = useState({ currPwd: "", newPwd: "", newPwdRp: ""});
  const [img, setImg] = useState({selectedFile: null, imgURL: ""});
  const [email, setEmail] = useState({value: null});
  const [tab, setTab] = useState({value: 1});
  let history = useHistory();
  const userID = localStorage.getItem('userID');
  const [orderList, setOrderList] = useState({list: []});
  const [user, setUser] = useState({
    email: "",
    fullname: "",
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    avatar: false
  });
  
  document.title = "Thông tin cá nhân - BK Phone";

  useEffect(()=>{
    const fetchData = async () => {
      const db = getFirestore(app);
      const storage = getStorage(app);
      const userRef = doc(db, 'users', userID);
      const userSnap = await getDoc(userRef);
      setUser({
        email: userSnap.data().email,
        fullname: userSnap.data().fullname,
        phone: userSnap.data().phone,
        address: userSnap.data().address,
        gender: userSnap.data().gender,
        dateOfBirth: userSnap.data().dateOfBirth,
        avatar: userSnap.data().avatar
      });
      setEmail({value: userSnap.data().email})
      if (userSnap.data().avatar)
        getDownloadURL(ref(storage, 'user-avatar/' + userID)).then((url)=>{
          setImg({...img, imgURL: url});
        });
    }
    if (userID) {
      fetchData();
      loadOrders();
    }
    try {
      setMsg({status: true, message: history.location.state.msg});
      window.scrollTo(0,100);
    } catch (error) {
    };
  }, []);

  const loadOrders = async () => {
    const db = getFirestore(app);
    const q = query(collection(db, "orders"), where("userID","==",userID), orderBy("dateCreated", 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
      console.log(doc.data());
      let numOrders = doc.data().items.length;
      let dvvc = "";
      let status = "";
      let orderedDate = doc.data().dateCreated.toDate();
      orderedDate = orderedDate.getDate() + '-' + (orderedDate.getMonth() + 1) + '-' + orderedDate.getFullYear()
                    + ' ' + orderedDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
      switch(doc.data().shippingService){
        case "direct": dvvc = "Nhận tại quầy"; break;
        case "grab": dvvc = "Grab"; break;
        case "ghn": dvvc = "Giao hàng nhanh"; break;
        default:;
      }
      switch(doc.data().status){
        case "accept": status = "Đã tiếp nhận"; break;
        case "waitingForPayment": status = "Chờ thanh toán"; break;
        case "onDelivery": status = "Đang vận chuyển"; break;
        case "complete": status = "Đã giao hàng"; break;
        case "cancel": status = "Đã huỷ đơn"; break;
        default:;
      }
      for (let i = 0; i < numOrders; i++){
        if (i === 0)
          setOrderList(prev=>({
            list: [...prev.list, (<tr>
              <td rowSpan={numOrders}>{doc.id}</td>
              <td>{doc.data().items[i].name}</td>
              <td>{doc.data().items[i].quantity}</td>
              <td rowSpan={numOrders}>{dvvc}</td>
              <td rowSpan={numOrders}>{orderedDate}</td>
              <td rowSpan={numOrders}>{status}</td>
              <td rowSpan={numOrders} style={{color: "red"}}>{Number(doc.data().amount).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}</td>
              { (doc.data().status === "accept" || doc.data().status === "waitingForPayment" ) ? (
                <td rowSpan={numOrders} className="btn-cancel-order" onClick={e=>setAlert({status: true, currentOrderID: doc.id})}>
                  <FontAwesomeIcon icon={faTimesCircle}/>
                </td>
              ) : (<td rowSpan={numOrders}></td>)}
              
            </tr>)]
          }))
        else 
        setOrderList(prev=>({
          list: [...prev.list, (<tr>
            <td>{doc.data().items[i].name}</td>
            <td>{doc.data().items[i].quantity}</td>
          </tr>)]
        }))
      }
    })
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const fetchData = async () => {
      const db = getFirestore(app);
      const storage = getStorage(app);
      const userRef = doc(db, 'users', userID);
      const userSnap = await getDoc(userRef);
      let cloneData = JSON.parse(JSON.stringify(userSnap.data()));;
      cloneData.fullname = user.fullname;
      cloneData.phone = user.phone;
      cloneData.gender = user.gender;
      cloneData.dateOfBirth = user.dateOfBirth;
      cloneData.address = user.address;
      if (user.avatar === true)
        cloneData.avatar = true;
      await setDoc(doc(db, 'users', userID), cloneData);
      if (user.avatar === true && img.selectedFile != null) { 
        uploadBytes(ref(storage, 'user-avatar/' + userID), img.selectedFile);
      }
    }
    if (userID) fetchData();
    setMsg({status: true, message: "Cập nhật thông tin thành công."});
    window.scrollTo(0,100);
  }

  const closeMsg = () => setMsg({...msg, status: false});
  const closeMsg2 = () => setMsg2({...msg2, status: false});

  const handleAvt = e => {
    setImg({...img, selectedFile: e.target.files[0]});
    setUser({...user, avatar: true});
  }

  const handleChangePwd = e => {
    e.preventDefault();

    if (pwd.newPwd !== pwd.newPwdRp){
      setMsg2({status: true, message: "Nhập lại mật khẩu mới không khớp."});
      return;
    }

    let credential = EmailAuthProvider.credential(email.value, pwd.currPwd);
    reauthenticateWithCredential(auth.currentUser, credential).then(()=>{
      updatePassword(auth.currentUser, pwd.newPwd).then(()=>{
        setMsg2({status: true, message: "Đổi mật khẩu thành công."});
      }).catch((error)=>{
        switch(error.code) {
          case "auth/weak-password":
            setMsg2({status: true, message: "Mật khẩu mới tối thiểu 6 ký tự."}); break;
          default:
            setMsg2({status: true, message: error.message});
        }
      })
    }).catch((error)=>{
      setMsg2({status: true, message: "Mật khẩu hiện tại không chính xác. Vui lòng thử lại."});
    })
  }

  const cancelOrder = e =>{

    const changeStatus = async () => {
      const db = getFirestore(app);
      const orderRef = doc(db, "orders", alert.currentOrderID);
      const orderSnap = await getDoc(orderRef);
      let cloneData = JSON.parse(JSON.stringify(orderSnap.data()));;
      cloneData.status = "cancel";
      cloneData.dateCreated = orderSnap.data().dateCreated.toDate();
      await setDoc(orderRef, cloneData).then(()=>{
        window.location.reload(window.scrollY);
      });
    }
    if (alert.currentOrderID !== null) changeStatus();
  }

  const closeAlert = e => {
    setAlert({...alert, status: false});
  }

  return (
    <div className="container">
      <div className="tab-group">
        <div className={"user-content " + (tab.value === 1 ? 'active' : '')} onClick={()=>setTab({value:1})}>
          Cập nhật thông tin
        </div>
        <div className={"user-content " + (tab.value === 2 ? 'active' : '')} onClick={()=>setTab({value:2})}>
          Đổi mật khẩu
        </div>
        <div className={"user-content " + (tab.value === 3 ? 'active' : '')} onClick={()=>setTab({value:3})}>
          Đơn hàng của bạn
        </div>
      </div> 
      { tab.value === 1 &&

      
      <div className="user-container large-padding">
          {msg.status === true && (
            <div className="alert">
              <span className="closebtn" onClick={closeMsg}>&times;</span> 
              {msg.message}
            </div>
          )}
        <form onSubmit={submitHandler}>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label vertical-align">
              Ảnh đại diện
            </label>
            <div className="col-sm-8">
              <div className="col-sm-5">
              {img.selectedFile === null ? (user.avatar === true ? (
                <img
                className="avatar-image"
                src={img.imgURL}
                alt="User Avatar"
              />
              ) : (
                <img
                className="avatar-image"
                src={userAvt}
                alt="User Avatar"
              />
              )) : (
              <img
                className="avatar-image"
                src={URL.createObjectURL(img.selectedFile)}
                alt="Product Preview"
              />
              )
              
              }
              <input
                  type="file"
                  className="form-control"
                  onChange={handleAvt}
                />
              </div>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">
              Họ tên
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUser({ ...user, fullname: e.target.value })}
                value={user.fullname}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">
              Điện thoại
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                value={user.phone}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">
              Địa chỉ giao hàng
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                value={user.address}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">
              Email
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                value={user.email}
                disabled
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">
              Giới tính
            </label>
            <div className="col-sm-8">
              <input type="radio" value="male" name="gender"
                onChange={(e) => setUser({ ...user, gender: 'male' })}
                checked={user.gender === 'male'}
              /><span style={{marginRight: "1rem", marginLeft: "5px"}}>Nam</span>
              <input type="radio" value="female" name="gender"
                onChange={(e) => setUser({ ...user, gender: 'female' })}
                checked={user.gender === 'female'}
              /> Nữ
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">
              Ngày sinh
            </label>
            <div className="col-sm-8">
              <input
                type="date"
                className="form-control"
                onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })}
                value={user.dateOfBirth}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-sm-4 col-form-label"></label>
            <div className="col-sm-8">
              <button className="btn submit-btn" type="submit">Lưu thay đổi</button>
            </div>
          </div>
        </form>
      </div>
      }
      { tab.value === 2 &&

      <div className="user-container large-padding">
          {msg2.status === true && (
            <div className="alert">
              <span className="closebtn" onClick={closeMsg2}>&times;</span> 
              {msg2.message}
            </div>
          )}
        <form onSubmit={handleChangePwd}>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">
              Mật khẩu hiện tại
            </label>
            <div className="col-sm-8">
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPwd({ ...pwd, currPwd: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">
              Mật khẩu mới
            </label>
            <div className="col-sm-8">
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPwd({ ...pwd, newPwd: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">
              Nhập lại mật khẩu mới
            </label>
            <div className="col-sm-8">
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPwd({ ...pwd, newPwdRp: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label"></label>
            <div className="col-sm-8">
              <button className="btn submit-btn" type="submit">Đổi mật khẩu</button>
            </div>
          </div>
        </form>
      </div>
      }
      { tab.value === 3 &&
      <div className="user-container">
        <table className="user-orders-table">
          <tbody>
            <tr>
              <th style={{width: "10%"}}>Đơn hàng</th>
              <th style={{width: "38%"}}>Tên mặt hàng</th>
              <th style={{width: "7%"}}>Số lượng</th>
              <th style={{width: "10%"}}>DVVC</th>
              <th style={{width: "10%"}}>Ngày lên đơn</th>
              <th style={{width: "10%"}}>Trạng thái</th>
              <th style={{width: "10%"}}>Tổng tiền</th>
              <th style={{width: "5%"}}></th>
            </tr>
            {orderList.list}
          </tbody>
        </table>
        <i>DVVC: Dịch vụ vận chuyển</i>
      </div>
      }
      { alert.status === true && 
        <div className="alert-box">
          <strong>Bạn có chắc muốn hủy đơn hàng?</strong><hr/>
          <div className="btn-confirm" onClick={closeAlert}>Không</div>
          <div className="btn-confirm" onClick={cancelOrder}>Đồng ý</div>
        </div>
      }
      
    </div>
  );
}

export default UserProfile;
