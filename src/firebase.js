// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, query, where, getDoc, getFirestore, setDoc, doc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAx8rbh1c8b1rRjX8qRcq9Vw4If7v_uoPU",
  authDomain: "tmdt-project-f2b6d.firebaseapp.com",
  databaseURL: "https://tmdt-project-f2b6d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tmdt-project-f2b6d",
  storageBucket: "tmdt-project-f2b6d.appspot.com",
  messagingSenderId: "1055592252236",
  appId: "1:1055592252236:web:0b71cb32778743c708c5e9",
  measurementId: "G-76716E7GGW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

function addToCart(prdId, prdName, prdPrice, prdImgURL){
  const db = getFirestore(app);
  const cartRef = doc(db, 'carts', localStorage.getItem('userID'));
  const fetchData = async () => {
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists())
    {
      console.log("Updating user's cart...");
      const userCart = JSON.parse(JSON.stringify(cartSnap.data()));
      let done = false;
      userCart.cartItems.forEach((item)=>{
        if (item.id === prdId){
          done = true;
          item.quantity++;
        } 
      })
      if (!done) userCart.cartItems.push({
        id: prdId, quantity: 1, price: prdPrice, name: prdName, imgURL: prdImgURL
      });
      await setDoc(cartRef, userCart);
    } 
    else 
    {
      console.log("Create user's cart...");
      await setDoc(cartRef, {
        email: localStorage.getItem('email'),
        voucher: "",
        cartItems: [
          {id: prdId, quantity: 1, price: prdPrice, name: prdName, imgURL: prdImgURL}
        ]
      })
    }
    return cartSnap.data();
  }
  fetchData();
}
export default addToCart;