import React from "react";
import UserNavbar from "../../components/NavBar/UserNavbar";
import ProductList from "../../components/ProductList/ProductList";
import { useHistory } from "react-router";
import { app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"
import "./homepage.css";

function HomePageUser() {
  let history = useHistory();
  const auth = getAuth(app);
  const userID = localStorage.getItem('userID');

  onAuthStateChanged(auth, (user)=> {
    if(user){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userID);
        const userSnap = await getDoc(userRef);;
        if (userSnap.data().type === "admin")
            history.push("/admin");
      }
      if (userID) verifyAdmin();
    }
    else{
      localStorage.clear();
      history.push("/");
    }
      
  });

  document.title = "BK Phone";

  return (
    <div>
      <UserNavbar />
      <ProductList />
    </div>
  );
}

export default HomePageUser;
