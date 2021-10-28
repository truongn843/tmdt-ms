import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import { app } from "../../firebase";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"

import ButtonCart from "../Button/ButtonCart";
import ButtonAddProduct from "../Button/ButtonAddProduct";
import avatar from "../../assert/avatar.png";
import "../reset.css";
import "./css/navbar.css";
import Logo from "./Logo/Logo";

function AdminNavbar() {
  const [img, setImg] = useState({avatar: false, imgURL: ""});
  let history = useHistory();
  const auth = getAuth(app);
  let email = localStorage.getItem('email');

  onAuthStateChanged(auth, (user)=> {
    if(user);
    else
      history.push("/");
  });
  useEffect(()=>{
    const fetchData = async () => {
      const db = getFirestore(app);
      const storage = getStorage(app);
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc)=>{
        if (doc.data().avatar)
          getDownloadURL(ref(storage, 'user-avatar/' + doc.id)).then((url)=>{
            setImg({avatar: true, imgURL: url});
          });
      })
    }
    fetchData();
  }, []);

  const handleBackToHome = () => {
    history.push(`/admin`);
  };
  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("Sign out successfully.");
    }).catch((error) => {
    });
    localStorage.removeItem('email');
    localStorage.removeItem('userID');
    history.push("/");
  };
  const handleAddProduct = () => {
    history.push("/add-product");
  };
  const handleViewProfile = () => {
    history.push(`/admin-profile`);
  };
  const handleViewCart = () => {
    history.push("/cart");
  };  
  return (
    <nav className="navbar nav-container">
      <Logo handlebackToHome={handleBackToHome} />
      <div className="nav-search">
        <FontAwesomeIcon icon="search"></FontAwesomeIcon>
        <input
          type="text"
          className="nav-search__input"
          placeholder="Tìm kiếm..."
        />
      </div>
      <div className="btn-group">
        <ButtonAddProduct handleAddProduct={handleAddProduct} />
        <ButtonCart handleViewCart={handleViewCart} />
        <div className="btn user-ava" onClick={handleViewProfile}>
        {img.avatar === true ? (
              <img
              className="avatar"
              src={img.imgURL}
              alt="Avatar"
            />
            ) : (
              <img
              className="avatar"
              src={avatar}
              alt="Avatar"
            />
            )
            }
        </div>
        <FontAwesomeIcon
          icon={faSignOutAlt}
          className="logout-btn"
          onClick={handleLogout}
        ></FontAwesomeIcon>
      </div>
    </nav>
  );
}

export default AdminNavbar;
