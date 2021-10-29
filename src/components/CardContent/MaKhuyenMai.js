import React , {useState, useEffect} from 'react'
import './MaKhuyenMai.css'
import {app} from "../../firebase";
import {getFirestore, query, collection, where, getDocs, doc, getDoc, setDoc}from "firebase/firestore"

function MaKhuyenMai (props) {
    const [msg, setMsg] = useState({value: false, msg: null});
    const [apply, setApply] = useState({value: false, code: null});

    const db = getFirestore(app);
    const cartRef = doc(db, 'carts', localStorage.getItem('userID'));

    useEffect(()=>{
        const loadVoucher = async () => {
            const cartSnap = await getDoc(cartRef);
            if (cartSnap.exists()){
                if (cartSnap.data().voucher !== ""){
                    setApply({value: true, code: cartSnap.data().voucher});
                    setMsg({value: true, msg: "Đã áp dụng mã."})
                }
            }
        };
        loadVoucher();
    },[]);

    const applyVoucher = e => {
        const checkVoucher = async () => {
            const q = query(collection(db, "vouchers"), where("code", "==", apply.code));
            const querySnapshot = await getDocs(q);
            let found = false;
            querySnapshot.forEach((doc)=>{
                found = true;
            })
            if (found) {
                const cartSnap = await getDoc(cartRef);
                let userCart = JSON.parse(JSON.stringify(cartSnap.data()));
                userCart.voucher = apply.code;
                await setDoc(cartRef, userCart);
                document.location.reload(window.scrollY);
            }
            else 
                setMsg({value: true, msg: "Mã không tồn tại."});
        }
        if (apply.code !== null)
            checkVoucher();
        else 
            setMsg({value: true, msg: "Vui lòng nhập mã."});      
    }

    const removeVoucher = e => {
        const removeVoucher = async () => {
            const cartSnap = await getDoc(cartRef);
            let userCart = JSON.parse(JSON.stringify(cartSnap.data()));
            userCart.voucher = "";
            await setDoc(cartRef, userCart);
            document.location.reload(window.scrollY);
        }
        removeVoucher();
    }

    return (
        <div className='card card-km'>
            <div id="km-title"> Mã khuyến mãi</div>
            <hr/>
            <form id="km-group">
                {   props.input === true ? (
                    <div>
                        <input 
                            id="km-input" 
                            type="text" 
                            placeholder="Nhập mã khuyến mãi" 
                            disabled={apply.value} 
                            value={apply.code}
                            onChange={(e)=> setApply({...apply, code: e.target.value})}
                        />
                        {   apply.value === false?
                        (<div id="km-btn" onClick={applyVoucher}>Áp mã</div>):
                        (<div id="km-btn" onClick={removeVoucher}>Hủy</div>)
                        }
                        {   msg.value === true && 
                        (<div id="km-msg">{msg.msg}</div>)
                        }
                    </div>
                ) : ("Không có mã giảm giá nào được áp dụng.")

                }
                
                
            </form>
            
        </div>
    )
}

export default MaKhuyenMai;