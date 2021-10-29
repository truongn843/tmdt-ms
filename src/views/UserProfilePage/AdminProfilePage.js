import React from "react";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import UserProfile from "../../components/UserProfile/UserProfile";
import {onAuthStateChanged, getAuth} from "firebase/auth";
import {app} from "../../firebase";
import {getFirestore, doc, getDoc}from "firebase/firestore"
import { useHistory } from "react-router";

function AdminProfilePage() {
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
            history.push("/user-profile");
      }
      if (userID) verifyAdmin();
    }
    else
      history.push("/");
  });
  return (
    <div>
      <AdminNavbar />
      <UserProfile />
    </div>
  );
}

export default AdminProfilePage;
