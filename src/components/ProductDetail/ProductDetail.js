import React, { useState, useEffect } from "react";
import "./ProductDetail.css";
import {app} from "../../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {getFirestore, query, collection, where, getDocs, doc, getDoc}from "firebase/firestore"
import RatingStar from "../RatingStar/RatingStar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function ProductDetail (props) {
    const [tab, setTab] = useState({value: 1});
    const [prdImage, setPrdImage] = useState({url: null});
    const [product, setProduct] = useState({
        title: null,
        price: null,
        discountFrom: null,
        brand: null,
        battery: null,
        cpu: null,
        frontCamera: null,
        rearCamera: null,
        bluetooth: null,
        gpu: null,
        screenWidth: null,
        screenTech: null,
        ram: null,
        memory: null,
        resolution: null,
        sim1: null,
        sim2: null,
        charge: null,
        wifi: null,
        os: null,
        mobileNetwork: null,
        rating: null,
        ratingCount: null,
        description: null
      });

    const getProduct = async () => {
        const db = getFirestore(app);
        const prdRef = doc(db, "products", props.id);
        const prdSnap = await getDoc(prdRef);
        if (prdSnap.exists()){
            setProduct({
                title: prdSnap.data().title,
                price: prdSnap.data().price,
                discountFrom: prdSnap.data().discountFrom,
                brand: prdSnap.data().brand,
                battery: prdSnap.data().battery,
                cpu: prdSnap.data().cpu,
                frontCamera: prdSnap.data().frontCamera,
                rearCamera: prdSnap.data().rearCamera,
                bluetooth: prdSnap.data().bluetooth,
                gpu: prdSnap.data().gpu,
                screenWidth: prdSnap.data().screenWidth,
                screenTech: prdSnap.data().screenTech,
                ram: prdSnap.data().ram,
                memory: prdSnap.data().memory,
                resolution: prdSnap.data().resolution,
                sim1: prdSnap.data().sim1,
                sim2: prdSnap.data().sim2,
                charge: prdSnap.data().charge,
                wifi: prdSnap.data().wifi,
                os: prdSnap.data().os,
                mobileNetwork: prdSnap.data().mobileNetwork,
                rating: prdSnap.data().rating,
                ratingCount: prdSnap.data().ratingCount,
                description: prdSnap.data().description
            })
        }
    }
    console.log(product);
    useEffect(()=>{
        const storage = getStorage(app);
        getDownloadURL(ref(storage, 'products/' + props.id)).then((url)=>{
            setPrdImage({url: url});
          });
        getProduct();
    },[])

    return (
    <div className="product-detail-container">
        <div className="col-image">
            <div className="image-container">
                <img src={prdImage.url} alt="" width="100%"/>
            </div>
        </div>
        <div className="col-info">
            <div className="tab-row">
                <div className={"tab-col " + (tab.value === 1 ? 'active' : '')} onClick={()=>setTab({value:1})}>
                    Thông tin
                </div>
                <div className={"tab-col " + (tab.value === 2 ? 'active' : '')} onClick={()=>setTab({value:2})}>
                    thông số kỹ thuật
                </div>
                <div className={"tab-col " + (tab.value === 3 ? 'active' : '')} onClick={()=>setTab({value:3})}>
                    đánh giá
                </div>
            </div>
            <div className="content-row">
                {   tab.value === 1 && 
                <div>
                    <div className="phone-title">{product.title}</div>
                    {product.rating !== null && <RatingStar rating={product.rating}/>}
                    {product.discountFrom !== "" && 
                    <div>
                        <span className="discount-price">{Number(product.discountFrom).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",})}
                        </span>
                        <span className="discount-percent">Tiết kiệm {Math.round(100 - (product.price / product.discountFrom * 100))}%</span>
                    </div>
                    
                    }
                    
                    <div className="phone-price">{Number(product.price).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}</div>
                    <span className="phone-btn">Mua ngay</span>
                    <span className="phone-btn">
                        <FontAwesomeIcon icon={faPlus}/> 
                        Thêm vào giỏ
                    </span>
                    <div className="km-container">
                        <div className="phone-km">Khuyến mãi đi kèm (Minh họa)</div>
                        <ul>
                            <li>Tặng Phiếu mua hàng 100,000đ áp dụng mua thẻ cào, thẻ game.</li>
                            <li>Giảm thêm 5% khi mua cùng sản phẩm bất kỳ có giá cao hơn.</li>
                            <li>Giảm 50% giá gói cước 1 năm (Vina350/Vina500) cho Sim VinaPhone trả sau (Trị giá đến 3 triệu).</li>
                        </ul>
                    </div>
                    
                </div>
                }
                {   tab.value === 2 && 
                <div>
                    b
                </div>
                }
                {   tab.value === 3 && 
                <div>
                    c
                </div>
                }
            </div>
            <div>

            </div>
        </div>
    </div>
    );
}