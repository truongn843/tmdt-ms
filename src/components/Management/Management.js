import React, { useState, useEffect } from "react";
import {app} from "../../firebase";
import "./Management.css";
import { collection, query, where, getDocs, getFirestore, setDoc, doc, getDoc, orderBy, Timestamp } from "firebase/firestore";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useHistory } from "react-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faFileAlt } from "@fortawesome/free-regular-svg-icons"
import RatingStar from "../RatingStar/RatingStar";
import { faPlus, faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { clone } from "@babel/types";

function Management(props) {
    let history = useHistory();
    const [alert, setAlert] = useState({status: false, currentPrdID: null});
    const [alert2, setAlert2] = useState({status: false, currentOrderID: null});
    const [tab, setTab] = useState({value: 1});
    const [displayProduct, setDisplayProduct] = useState({list: []});
    const [displayOrder, setDisplayOrder] = useState({list: []});
    const [displayItem, setDisplayItem] = useState({list: []});
    const [order, setOrder] = useState({
        dateCreated: null,
        name: null,
        phone: null,
        address: null,
        amount: null,
        status: null,
        paymentMethod: null,
        shippingService: null
    })

    const addProduct = e => {
        history.push("/add-product");
    }

    const toStatus = (data) => {
        let status = "";
        switch(data){
            case "accept": status = "Đã tiếp nhận"; break;
            case "waitingForPayment": status = "Chờ thanh toán"; break;
            case "onDelivery": status = "Đang vận chuyển"; break;
            case "complete": status = "Đã giao hàng"; break;
            case "cancel": status = "Đã huỷ đơn"; break;
            default:;
        }
        return status;
    }

    const toMyDate = (data) => {
        let myDate = "";
        myDate = data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear()
                + ' ' + data.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        return myDate;
    }

    const toPaymentMethod = (data) => {
        let pMethod = "";
        switch(data){
            case "cod": pMethod = "Thanh toán khi nhận hàng"; break;
            case "momo": pMethod = "Chuyển khoản MoMo"; break;
            case "banking": pMethod = "Chuyển khoản ngân hàng"; break;
            default:;
        }
        return pMethod;
    }

    const toShippingServ = (data) => {
        let shipping = "";
        switch(data){
            case "direct": shipping = "Nhận tại cửa hàng."; break;
            case "grab": shipping = "Grab"; break;
            case "ghn": shipping = "Giao hàng nhanh"; break;
            default:;
        }
        return shipping;
    }

    const loadProducts = async () => {
        const db = getFirestore(app);
        const q = query(collection(db, "products"), orderBy("dateAdded", 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
            let dateAdded = doc.data().dateAdded.toDate();
            dateAdded = toMyDate(dateAdded);
            setDisplayProduct(prev=>({
                list: [...prev.list, (
                <tr>
                    <td>{doc.data().title}</td>
                    <td>{dateAdded}</td>
                    <td>
                    {Number(doc.data().price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                    </td>
                    <td><RatingStar rating={doc.data().rating}/></td>
                    <td className="mn-btn-container">
                        <span className="mn-btn mn-edit"><FontAwesomeIcon icon={faEdit}/></span>
                        <span className="mn-btn mn-rm" onClick={e=>setAlert({status: true, currentPrdID: doc.id})}><FontAwesomeIcon icon={faTimesCircle}/></span>
                    </td>
                </tr>
                )]
            }))
        })
    }



    const loadOrders = async () => {
        const db = getFirestore(app);
        const q = query(collection(db, "orders"), orderBy("dateCreated", 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
            let status = toStatus(doc.data().status);
            let orderedDate = doc.data().dateCreated.toDate();
            orderedDate = toMyDate(orderedDate);
            setDisplayOrder(prev=>({
                list: [...prev.list, <tr>
                    <td>{doc.id}</td>
                    <td>{doc.data().name}</td>
                    <td>{doc.data().phone}</td>
                    <td>{orderedDate}</td>
                    <td>{status}</td>
                    <td style={{color: "red"}}>
                    {Number(doc.data().amount).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                    </td>
                    <td className="mn-btn-container">
                        <span className="mn-btn mn-edit" onClick={e=>orderDetail(e, doc.id)}><FontAwesomeIcon icon={faFileAlt}/></span>
                        {   (doc.data().status === "accept" || doc.data().status === "waitingForPayment" ) &&
                        <span className="mn-btn mn-rm" onClick={e=>setAlert2({status: true, currentOrderID: doc.id})}><FontAwesomeIcon icon={faTimesCircle}/></span>
                        }
                    </td>
                </tr>]
            }))
        })
      }

    useEffect(()=>{
        loadProducts();
        loadOrders();
    },[])



    const orderDetail = (e, id) => {
        setTab({value: 3});
        const loadOrderDetail = async () => {
            const db = getFirestore(app);
            const orderRef = doc(db, "orders", id);
            const orderSnap = await getDoc(orderRef);
            setOrder({
                dateCreated: toMyDate(orderSnap.data().dateCreated.toDate()),
                name: orderSnap.data().name,
                phone: orderSnap.data().phone,
                address: orderSnap.data().address,
                amount: orderSnap.data().amount,
                status: toStatus(orderSnap.data().status),
                paymentMethod: toPaymentMethod(orderSnap.data().paymentMethod),
                shippingService: toShippingServ(orderSnap.data().shippingService),
            });
            orderSnap.data().items.forEach((item)=>{
                setDisplayItem(prev=>({
                    list: [...prev.list, <tr>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{Number(item.price).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}</td>
                        <td style={{color:'red'}}>{Number(item.price * item.quantity).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}</td>
                    </tr>]
                }))
            })
        }
        loadOrderDetail();
    }

    const deletePrd = e => {
        const deleteProduct = async () => {
            const db = getFirestore(app);
            const storage = getStorage(app);
            // Xóa sản phẩm trong các giỏ hàng
            const updateCart = async (docID, data) => {
                const cartRef = doc(db, "carts", docID);
                await setDoc(cartRef, data);
            }

            const qCart = query(collection(db, "carts"), where("cartItems", "!=", []));
            const cartSnap = await getDocs(qCart);
            cartSnap.forEach((doc)=>{
                let cloneData = JSON.parse(JSON.stringify(doc.data()));;
                cloneData.cartItems = cloneData.cartItems.filter((item)=>{
                    return item.id !== alert.currentPrdID;
                })
                updateCart(doc.id, cloneData);
            })
            // Xóa review sản phẩm

        }
        if (alert.currentPrdID) deleteProduct();
        //window.location.reload();
    }

    const cancelOrder = e =>{
        const changeStatus = async () => {
          const db = getFirestore(app);
          const orderRef = doc(db, "orders", alert2.currentOrderID);
          const orderSnap = await getDoc(orderRef);
          let cloneData = JSON.parse(JSON.stringify(orderSnap.data()));;
          cloneData.status = "cancel";
          cloneData.dateCreated = orderSnap.data().dateCreated.toDate();
          await setDoc(orderRef, cloneData).then(()=>{
            window.location.reload(window.scrollY);
          });
        }
        if (alert2.currentOrderID !== null) changeStatus();
    }

    const handleTab = (e, tab) => {
        setTab({value: tab});
        setDisplayItem({list: []});
    }

return <div class="container">
    <div className="tab-group">
        <div className={"mn-prd-tab " + (tab.value === 1 ? 'active' : '')} onClick={(e)=>handleTab(e,1)}>
        Mặt hàng
        </div>
        <div className={"mn-prd-tab " + (tab.value === 2 ? 'active' : '')} onClick={(e)=>handleTab(e,2)}>
        Đơn hàng
        </div>
        <div className={"mn-prd-tab " + (tab.value === 3 ? 'active' : 'mn-none-display')}>
        Chi tiết đơn hàng
        </div>
    </div> 
    { tab.value === 1 &&
        <div className="management-container">
            <div className="phone-btn" onClick={addProduct}><FontAwesomeIcon icon={faPlus}/> Thêm mặt hàng</div>
            <table className="user-orders-table">
            <tbody>
                <tr>
                    <th style={{width: "38%"}}>Tên mặt hàng</th>
                    <th style={{width: "12%"}}>Ngày thêm</th>
                    <th style={{width: "12%"}}>Giá bán</th>
                    <th style={{width: "10%"}}>Điểm đánh giá</th>
                    <th style={{width: "6%"}}>Action</th>
                </tr>
                {displayProduct.list}
            </tbody>
            </table>
        </div>
    }
    { tab.value === 2 &&
        <div className="management-container">
            <table className="user-orders-table">
            <tbody>
                <tr>
                    <th style={{width: "12%"}}>Đơn hàng</th>
                    <th style={{width: "25%"}}>Tên khách hàng</th>
                    <th style={{width: "13%"}}>SĐT</th>
                    <th style={{width: "13%"}}>Ngày lên đơn</th>
                    <th style={{width: "13%"}}>Trạng thái</th>
                    <th style={{width: "10%"}}>Tổng tiền</th>
                    <th style={{width: "10%"}}>Action</th>
                </tr>
                {displayOrder.list}
            </tbody>
            </table>
        </div>
    }
    {   tab.value === 3 &&
        <div className="management-container">
            <div className="order-container">
                <div className="content-specs">
                    <table>
                        <tbody>
                            <tr>
                                <td>Tên khách hàng</td>
                                <td>{order.name}</td>
                            </tr>
                            <tr>
                                <td>Số điện thoại</td>
                                <td>{order.phone}</td>
                            </tr>
                            <tr>
                                <td>Địa chỉ giao hàng</td>
                                <td>{order.address}</td>
                            </tr>
                            <tr>
                                <td>Ngày đặt hàng</td>
                                <td>{order.dateCreated}</td>
                            </tr>
                            <tr>
                                <td>Trạng thái đơn hàng</td>
                                <td>{order.status}</td>
                            </tr>
                            <tr>
                                <td>Dịch vụ vận chuyển</td>
                                <td>{order.shippingService}</td>
                            </tr>
                            <tr>
                                <td>Phương thức thanh toán</td>
                                <td>{order.paymentMethod}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <table className="user-orders-table">
                    <tbody>
                        <tr>
                            <th style={{width: "40%"}}>Tên mặt hàng</th>
                            <th style={{width: "10%"}}>Số lượng</th>
                            <th style={{width: "10%"}}>Đơn giá</th>
                            <th style={{width: "50%"}}>Thành tiền</th>
                        </tr>
                        {displayItem.list}
                        <tr>
                            <td colSpan="4" style={{color: "red"}}>Tổng: {Number(order.amount).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
    { alert.status === true && 
        <div className="alert-box">
          <strong>Bạn thật sự muốn xóa mặt hàng?</strong><hr/>
          <div className="btn-confirm" onClick={e=>setAlert({...alert, status: false})}>Không</div>
          <div className="btn-confirm" onClick={deletePrd}>Đồng ý</div>
        </div>
    }
    { alert2.status === true && 
        <div className="alert-box">
          <strong>Bạn có chắc muốn hủy đơn hàng?</strong><hr/>
          <div className="btn-confirm" onClick={e=>setAlert2({...alert2, status: false})}>Không</div>
          <div className="btn-confirm" onClick={cancelOrder}>Đồng ý</div>
        </div>
    }
</div>;
}
export default Management;