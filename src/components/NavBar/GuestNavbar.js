import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from "@fortawesome/fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import { app } from "../../firebase";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"
import ButtonCart from "../Button/ButtonCart";
import ButtonLogin from "../Button/ButtonLogin";
import Logo from "./Logo/Logo";

import "../reset.css";
import "./css/navbar.css";
fontawesome.library.add(faSearch);

function GuestNavbar() {
  let history = useHistory();
  const auth = getAuth(app);
  onAuthStateChanged(auth, (user)=> {
    if(user){
      const verifyUser = async () => {
        const db = getFirestore(app);
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
          if (doc.data().type === "admin")
            history.push("/admin");
          else 
            history.push("/user");
        });
      }
      verifyUser();
    } 
  });

  const handleBackToHome = (e) => {
    history.push("/");
  };
  const handleLogin = (e) => {
    history.push("/login");
  }
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
        <ButtonCart />
        <ButtonLogin handleLogin={handleLogin} />
      </div>
    </nav>
  );
}

export default GuestNavbar;
