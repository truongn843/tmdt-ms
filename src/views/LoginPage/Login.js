import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useHistory } from "react-router";
import banner from "../../assert/banner.png";
import { app } from "../../firebase";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";

import "../../components/reset.css";
import "./login.css";


function Login(props) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState({ status: false, message: "" });
  let history = useHistory();
  const submitHandler = (e) => {
    e.preventDefault();
    const auth = getAuth(app);
      setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        localStorage.setItem('email', user.email);
        const forward = async () => {
          const db = getFirestore(app);
          const q = query(collection(db, "users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc)=>{
            localStorage.setItem('userID', doc.id);
            if (doc.data().type === 'admin')
              history.push('/admin');
            else 
              history.push('/user');
          })
        }
        forward();
      })
      .catch((error) => {
        console.log("Login failed, CODE " + error.code + ": " + error.message);
        switch(error.code) {
          case "auth/user-not-found":
            setError({status: true, message: "Tài khoản chưa được đăng ký."}); break;
          case "auth/wrong-password":
            setError({status: true, message: "Mật khẩu không chính xác. Vui lòng thử lại."}); break;
          default:
            setError({status: true, message: error.message});
        }
      });
    })
    .catch((error) => {
      // Handle Errors here.
    });
    
  };
  const singupHandler = () => {
    history.push("/signup");
  };
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
        <form action="" className="form-container">
          <div className="login-content">Đăng nhập</div>
          {error.status === true && (
            <div className="login-result-error">{error.message}</div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            value={user.email}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
            required
          />
          <div className="help">
            <div className="btn signup-account" onClick={singupHandler}>
              Đăng kí tài khoản
            </div>
            <div className="btn forgot-pass">Quên mật khẩu</div>
          </div>
          <button type="submit" className="login">
            ĐĂNG NHẬP
          </button>
          <div className="or">Hoặc</div>
          <div className="sso">
            <FontAwesomeIcon
              icon={faFacebook}
              className="icon"
            ></FontAwesomeIcon>
            <FontAwesomeIcon icon={faGoogle} className="icon"></FontAwesomeIcon>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
