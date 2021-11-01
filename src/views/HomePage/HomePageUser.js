import React, {useState} from "react";
import UserNavbar from "../../components/NavBar/UserNavbar";
import ProductList from "../../components/ProductList/ProductList";
import { useHistory } from "react-router";
import { app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"
import "./homepage.css";
import Footer from "../../components/Footer/Footer";

function HomePageUser() {
  let history = useHistory();
  const auth = getAuth(app);
  const userID = localStorage.getItem('userID');
  const [search, setSearch] = useState({value: null});

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

  const handleSearchCallback = (searchData) => {
    setSearch({value: searchData})
  }

  document.title = "BK Phone";

  return (
    <div>
      <UserNavbar parentCallBack={handleSearchCallback}/>
      <ProductList search={search.value}/>
      <Footer/>
    </div>
  );
}

export default HomePageUser;
