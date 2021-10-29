import React, { useState, useEffect } from "react";
import {app} from "../../firebase";
import "./user-profile.css";
import { collection, query, where, getDocs, getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useHistory } from "react-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import userAvt from "../../assert/avatar.png";

const auth = getAuth(app);

function UserProfile(props) {
  const [msg, setMsg] = useState({ status: false, message: "" });
  const [msg2, setMsg2] = useState({ status: false, message: "" });
  const [pwd, setPwd] = useState({ currPwd: "", newPwd: "", newPwdRp: ""});
  const [img, setImg] = useState({selectedFile: null, imgURL: ""});
  const [email, setEmail] = useState({value: null});
  let history = useHistory();
  const userID = localStorage.getItem('userID');
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
    if (userID) fetchData();
    try {
      setMsg({status: true, message: history.location.state.msg});
      window.scrollTo(0,100);
    } catch (error) {
      console.log(error);
    };
  }, []);

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
  return (
    <div className="container">
      <div className="tab-group">
        <div className="user-content">Thông tin tài khoản</div>
        <div className="user-content">Đổi mật khẩu</div>
        <div className="user-content">Đơn hàng</div>
      </div>  
      <div className="user-container">
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
      <div className="user-content">Đổi mật khẩu</div>
      <div className="user-container">
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
    </div>
  );
}

export default UserProfile;
