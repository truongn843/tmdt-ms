import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { useHistory } from "react-router";
import banner from "../../assert/banner.png";
import { app } from "../../firebase";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, onAuthStateChanged, sendPasswordResetEmail  } from "firebase/auth";
import { collection, query, where, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";

import "../../components/reset.css";



function ForgetPassword(props) {
  const [fgPwd, setFgPwd] = useState({stage: 1});
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState({ status: false, message: "" });
  let history = useHistory();
  const auth = getAuth(app);
  const userID = localStorage.getItem('userID');

  onAuthStateChanged(auth, (user)=> {
    if(user && userID !== null){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userID);
        const userSnap = await getDoc(userRef);
        if (userSnap.data().type === "admin")
          history.push("/admin");
        else 
          history.push("/user");
      }
      if (userID) verifyAdmin();
    }
    else {
      localStorage.clear();
    }
  });

  const submitHandler = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, user.email).then(() => {
        alert('Đã gửi yêu cầu tìm mật khẩu tới email của bạn.');
        history.push('/login');
        })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorMessage);
    });
  };
  const backToHome = e => {
    history.push("/");
  }
  useEffect(() => {
    try{
      setError({status: true, message: props.location.state.msg});
    }
    catch (error) {};
  }, [])

  return (
    <div>
      <div className="form" onSubmit={submitHandler}>
        <img src={banner} alt="" className="form-image" />
        <div className="homepage" onClick={backToHome}><FontAwesomeIcon icon={faArrowLeft}/> Trang chủ</div>
        <form action="" className="form-container">
          <div className="login-content">Quên mật khẩu</div>
          {error.status === true && (
            <div className="login-result-error">{error.message}</div>
          )}
          <input
            type="text"
            placeholder="Nhập email"
            className="password"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            value={user.email}
            required
          />
          {/* <input
            type="password"
            placeholder="Mật khẩu mới"
            className="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
            required
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            className="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
            required
          /> */}
          <button type="submit" className="login">
            TÌM MẬT KHẨU
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
