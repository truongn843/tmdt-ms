import React, { useState } from "react";
import { useHistory } from "react-router";
import banner from "../../assert/banner.png";
import { app } from "../../firebase";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore"

import "../../components/reset.css";
import "./signup.css";

function SignUp() {
  const [user, setUser] = useState({ email: "", password: "", rPassword: "" , phone: ""});
  const [error, setError] = useState({ status: false, message: "" });

  let history = useHistory();
  const auth = getAuth(app);
  let email = localStorage.getItem('email');

  onAuthStateChanged(auth, (user)=> {
    if(user && email !== null){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
          if (doc.data().type === "admin")
            history.push("/admin");
          else 
            history.push("/user");
        })
      }
      verifyAdmin();
    }
  });


  const handleLogin = () => {
    history.push("/login");
  };
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Signing up...");
    const auth = getAuth(app);

    if (user.password !== user.rPassword){
      setError({status: true, message: "Mật khẩu nhập lại không khớp."}); return;
    }

    if (/^0([1-9]{9,10})$/.test(user.phone) === false){
      console.log('error');
      setError({status: true, message: "Số điện thoại không hợp lệ."}); return;
    }
      
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        // Signed in 
        const loggedUser = userCredential.user;
        console.log("Register Successfully");
        setError({status: true, message: "Đăng kỷ thành công! Bạn sẽ được chuyển hướng sau vài giây."});
        const addNewUser = async () => {
          const db = getFirestore(app);
          await addDoc(collection(db, 'users'), {
            type: 'member',
            email: loggedUser.email,
            phone: user.phone,
            avatar: false,
            fullname: null,
            gender: null,
            dateOfBirth: null,
            address: null
          }).then((docRef)=>{
            localStorage.setItem('userID', docRef.id);
          })
        }
        addNewUser();
        localStorage.setItem('email', loggedUser.email);
        setTimeout(()=>history.push("/user"), 2000);
        //history.push("/");
        // ...
      })
      .catch((error) => {
        console.log("Register failed, CODE " + error.code + ": " + error.message);
        switch(error.code) {
          case "auth/weak-password":
            setError({status: true, message: "Mật khẩu tối thiểu 6 ký tự."}); break;
          case "auth/email-already-in-use":
            setError({status: true, message: "Email này đã được đăng ký."}); break;
          default:
            setError({status: true, message: error.message});
        }
      });
  }
  return (
    <div>
      <div className="form">
        <img src={banner} alt="" className="form-image" />
        <form action="" className="form-container" onSubmit={submitHandler}>
          <div className="signup-content">Đăng kí</div>
          {error.status === true && (
            <div className="login-result-error">{error.message}</div>
          )}
          <input 
            type="email" 
            placeholder="Email" 
            className="form-input" 
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            value={user.email}
            required/>
          <input
            type="password"
            placeholder="Mật khẩu"
            className="form-input"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
            required
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="form-input"
            onChange={(e) => setUser({ ...user, rPassword: e.target.value })}
            value={user.rPassword}
            required
          />
          <input 
            type="text" 
            placeholder="Điện thoại" 
            className="form-input" 
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            value={user.phone}
            required
          />
          <button className="signup" type="submit">ĐĂNG KÍ</button>
          <div className="btn login-link" onClick={handleLogin}>
            Đăng nhập
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;