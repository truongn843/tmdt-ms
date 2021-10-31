import React from "react";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import UserProfile from "../../components/UserProfile/UserProfile";
import {onAuthStateChanged, getAuth} from "firebase/auth";
import {app} from "../../firebase";
import {getFirestore, doc, getDoc}from "firebase/firestore"
import { useHistory } from "react-router";
import Management from "../../components/Management/Management";
import Footer from "../../components/Footer/Footer";

function AdminManagePage() {
  const auth = getAuth(app);
  const userID = localStorage.getItem('userID');
  let history = useHistory();

  onAuthStateChanged(auth, (user)=> {
    if(user){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userID);
        const userSnap = await getDoc(userRef);
        if (userSnap.data().type === "member")
            history.push("/user");
      }
      if (userID) verifyAdmin();
    }
    else{
      localStorage.clear();
      history.push("/");
    }
      
  });
  document.title = "Trang quản lý - BK Phone";
  return (
    <div>
      <AdminNavbar/>
      <Management/>
      <Footer/>
    </div>
  );
}

export default AdminManagePage;
