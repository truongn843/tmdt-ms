import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import { app } from "../../firebase";
import { getAuth, signOut } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, getDoc } from "firebase/firestore"

import ButtonCart from "../Button/ButtonCart";
import avatar from "../../assert/avatar.png";
import "../reset.css";
import "./css/navbar.css";
import Logo from "./Logo/Logo";
import ButtonManage from "../Button/ButtonManage";
import Search from "../Search/Search";

function AdminNavbar(props) {
  const [img, setImg] = useState({avatar: false, imgURL: ""});
  let history = useHistory();
  const auth = getAuth(app);
  const userID = localStorage.getItem('userID');

  useEffect(()=>{
    const fetchData = async () => {
      const db = getFirestore(app);
      const storage = getStorage(app);
      const userRef = doc(db, 'users', userID);
      const userSnap = await getDoc(userRef);
      if (userSnap.data().avatar)
        getDownloadURL(ref(storage, 'user-avatar/' + userID)).then((url)=>{
          setImg({avatar: true, imgURL: url});
        });
    }
    if (userID) fetchData();
  }, []);

  const handleBackToHome = () => {
    history.push(`/admin`);
  };
  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("Sign out successfully.");
    }).catch((error) => {
    });
    localStorage.removeItem('userID');
    history.push("/");
  };
  
  const handleViewProfile = () => {
    history.push(`/admin-profile`);
  };
  const handleViewCart = () => {
    history.push("/cart");
  };  
  const handleSearchCallback = (searchData) => {
    props.parentCallBack(searchData);   
  }
  return (
    <nav className="navbar nav-container">
      <Logo handlebackToHome={handleBackToHome} />
      <Search parentCallBack={handleSearchCallback}/>
      <div className="btn-group">
        <ButtonManage />
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
