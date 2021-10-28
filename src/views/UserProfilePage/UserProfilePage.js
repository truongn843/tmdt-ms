import React from "react";
import UserNavbar from "../../components/NavBar/UserNavbar";
import UserProfile from "../../components/UserProfile/UserProfile";
import {onAuthStateChanged, getAuth} from "firebase/auth";
import {app} from "../../firebase";
import {getFirestore, query, collection, where, getDocs}from "firebase/firestore"
import { useHistory } from "react-router";

function UserProfilePage() {
  const auth = getAuth(app);
  const email = localStorage.getItem('email');
  let history = useHistory();

  onAuthStateChanged(auth, (user)=> {
    if(user){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
          if (doc.data().type === "admin")
            history.push("/admin-profile");
        })
      }
      verifyAdmin();
    }
    else
      history.push("/");
  });
  return (
    <div>
      <UserNavbar />
      <UserProfile />
    </div>
  );
}

export default UserProfilePage;
