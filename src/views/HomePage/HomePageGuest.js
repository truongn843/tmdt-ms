import React from "react";
import { useHistory } from "react-router-dom";
import GuestNavbar from "../../components/NavBar/GuestNavbar";
import ProductList from "../../components/ProductList/ProductList";
import { app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"

import "./homepage.css";

function HomePageGuest() {
  let history = useHistory();
  const auth = getAuth(app);
  let email = localStorage.getItem('email');

  onAuthStateChanged(auth, (user)=> {
    if(user){
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
    console.log("LOGIN");
    history.push("/login");
  };
  document.title = "BK Phone";
  return (
    <div>
      <GuestNavbar handleLogin={handleLogin} />
      <ProductList />
    </div>
  );
}

export default HomePageGuest;
