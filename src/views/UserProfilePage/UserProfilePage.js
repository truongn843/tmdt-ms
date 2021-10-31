import React from "react";
import UserNavbar from "../../components/NavBar/UserNavbar";
import UserProfile from "../../components/UserProfile/UserProfile";
import {onAuthStateChanged, getAuth} from "firebase/auth";
import {app} from "../../firebase";
import {getFirestore, doc, getDoc}from "firebase/firestore"
import { useHistory } from "react-router";
import Footer from "../../components/Footer/Footer";

function UserProfilePage() {
  const auth = getAuth(app);
  const userID = localStorage.getItem('userID');
  let history = useHistory();

  onAuthStateChanged(auth, (user)=> {
    if(user){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userID);
        const userSnap = await getDoc(userRef);
        if (userSnap.data().type === "admin")
            history.push("/admin-profile");
      }
      if (userID) verifyAdmin();
    }
    else{
      localStorage.clear();
      history.push("/");
    }
      
  });
  return (
    <div>
      <UserNavbar />
      <UserProfile />
      <Footer/>
    </div>
  );
}

export default UserProfilePage;
