import React, { useState, useEffect } from "react";
import "./ProductDetail.css";
import {app} from "../../firebase";
import addToCart  from "../../firebase.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {getFirestore, query, collection, where, getDocs, doc, getDoc, addDoc, setDoc}from "firebase/firestore"
import RatingStar from "../RatingStar/RatingStar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";

export default function ProductDetail (props) {
    let history = useHistory();
    const userID = localStorage.getItem('userID');
    const db = getFirestore(app);
    const [userReview, setUserReview] = useState({star: 1, review: "", alreadyReview: false});
    const [addSuccess, setAdd] = useState({status: false});
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

    useEffect(()=>{
        const storage = getStorage(app);
        getDownloadURL(ref(storage, 'products/' + props.id)).then((url)=>{
            setPrdImage({url: url});
          });
        getProduct();

        const checkReview = async () => {
            const q = query(collection(db, "reviews"), where("userID", "==", userID), where("productID", "==", props.id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc)=>{
                setUserReview({...userReview, alreadyReview: true});
            })
        }
        if (userID) checkReview();
    },[])

    const handleBuyNow = e => {
        if (localStorage.getItem('userID') !== null){
            addToCart(props.id, product.title, product.price, prdImage.url);
            history.push("/cart");
        }    
        else {
            history.push({
                pathname: "/login",
                state: {msg: "Trước hết bạn cần đăng nhập.", returnPath: "/product-detail"}
            });
        }
    }

    const handleAddToCart = e => {
        if (localStorage.getItem('userID') !== null){
            setAdd({status: true});
            setTimeout(()=>setAdd({status: false}),1500);
            addToCart(props.id, product.title, product.price, prdImage.url);
        }    
        else {
            history.push({
                pathname: "/login",
                state: {msg: "Trước hết bạn cần đăng nhập."}
            });
        }
    }

    const sendReview = e => {
        e.preventDefault();
        if (userID) {
            let review = {
                userID: userID,
                rating: userReview.star,
                review: userReview.review,
                productID: props.id,
                date: new Date()
            }
            let oldRating = parseFloat(product.rating);
            let oldRatingCount = parseFloat(product.ratingCount);
            let newRating = (oldRating * oldRatingCount + review.rating) / (oldRatingCount + 1);
            const addReview = async () => {
                await addDoc(collection(db, "reviews"), review);
                const prdRef = doc(db, 'products', props.id);
                const prdSnap = await getDoc(prdRef);
                let cloneData = JSON.parse(JSON.stringify(prdSnap.data()));
                cloneData.ratingCount = oldRatingCount + 1;
                cloneData.rating = newRating;
                cloneData.dateAdded = prdSnap.data().dateAdded.toDate();
                await setDoc(prdRef, cloneData).then(()=>{
                    setTab({value: 3});
                    window.location.reload();
                });
            }
            if (!userReview.alreadyReview)
                addReview();
        }
    }

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
                <div className="content-info">
                    <div className="phone-title">{product.title}</div>
                    {product.rating !== null && <RatingStar rating={product.rating.toFixed(1)}/>}
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
                    <span className="phone-btn" onClick={handleBuyNow}>Mua ngay</span>
                    <span className="phone-btn btn-add" onClick={handleAddToCart}>
                        { addSuccess.status === false ? 
                        <span><FontAwesomeIcon icon={faPlus}/>Thêm vào giỏ</span> : 
                        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                        }
                        
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
                <div className="content-specs">
                    <table>
                        <tr>
                            <td>Tên điện thoại</td>
                            <td>{product.title}</td>
                        </tr>
                        <tr>
                            <td>Vi xử lý (CPU)</td>
                            <td>{product.cpu}</td>
                        </tr>
                        <tr>
                            <td>Vi xử lý đồ họa (GPU)</td>
                            <td>{product.gpu}</td>
                        </tr>
                        <tr>
                            <td>RAM</td>
                            <td>{product.ram} GB</td>
                        </tr>
                        <tr>
                            <td>Bộ nhớ trong</td>
                            <td>{product.memory} GB</td>
                        </tr>
                        <tr>
                            <td>Hệ điều hành</td>
                            <td>{product.os}</td>
                        </tr>
                        <tr>
                            <td>Dung lượng pin</td>
                            <td>{product.battery} mAh</td>
                        </tr>
                        <tr>
                            <td className="spec-category">Kết nối</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>SIM 1</td>
                            <td>{product.sim1}</td>
                        </tr>
                        <tr>
                            <td>SIM 2</td>
                            <td>{product.sim2}</td>
                        </tr>
                        <tr>
                            <td>Mạng di động</td>
                            <td>{product.mobileNetwork}</td>
                        </tr>
                        <tr>
                            <td>Bluetooth</td>
                            <td>{product.bluetooth}</td>
                        </tr>
                        <tr>
                            <td>Wifi</td>
                            <td>{product.wifi}</td>
                        </tr>
                        <tr>
                            <td>Cổng sạc</td>
                            <td>{product.charge}</td>
                        </tr>
                        <tr>
                            <td className="spec-category">Màn hình</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Kích thước màn hình</td>
                            <td>{product.screenWidth} inch</td>
                        </tr>
                        <tr>
                            <td>Công nghệ màn hình</td>
                            <td>{product.screenTech}</td>
                        </tr>
                        <tr>
                            <td>Độ phân giải màn hình</td>
                            <td>{product.resolution}</td>
                        </tr>
                        <tr>
                            <td className="spec-category">Camera</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Camera trước</td>
                            <td>{product.frontCamera}</td>
                        </tr>
                        <tr>
                            <td>Camera sau</td>
                            <td>{product.rearCamera}</td>
                        </tr>
                    </table>
                </div>
                }
                {   tab.value === 3 && 
                <div className="content-rating">
                    <div className="big-stars">
                        <RatingStar rating={product.rating.toFixed(1)}/>
                        <div className="rating-count">Sản phẩm đã được đánh giá {product.ratingCount} lần.</div>
                    </div>
                    {   localStorage.getItem('userID') === null && 
                    <div className="rating-count">
                        Hãy <strong>đăng nhập</strong> để gửi đánh giá.
                    </div> 
                    }
                    {   localStorage.getItem('userID') !== null && userReview.alreadyReview &&
                    <div className="rating-count">
                        Bạn đã đánh giá sản phẩm này rồi.
                    </div> 
                    }
                    {   localStorage.getItem('userID') !== null && !userReview.alreadyReview &&
                    <form className="form-rate">
                        <div className="rating-count">Đánh giá sản phẩm</div><hr/>
                        <label className="rate-field">Thang đánh giá:</label>
                        <div className="star-radio-group">
                            <input id="1s" className="radio-fake" type="radio" name="user-star"
                                onChange={e=>setUserReview({...userReview, star: 1})} checked={userReview.star === 1}
                            />
                            <label for="1s"><RatingStar rating={1}/></label><br/>
                            <input id="2s" className="radio-fake" type="radio" name="user-star"
                                onChange={e=>setUserReview({...userReview, star: 2})} checked={userReview.star === 2}
                            />
                            <label for="2s"><RatingStar rating={2}/></label><br/>
                            <input id="3s" className="radio-fake" type="radio" name="user-star"
                                onChange={e=>setUserReview({...userReview, star: 3})} checked={userReview.star === 3}
                            />
                            <label for="3s"><RatingStar rating={3}/></label><br/>
                            <input id="4s" className="radio-fake" type="radio" name="user-star"
                                onChange={e=>setUserReview({...userReview, star: 4})} checked={userReview.star === 4}
                            />
                            <label for="4s"><RatingStar rating={4}/></label><br/>
                            <input id="5s" className="radio-fake" type="radio" name="user-star"
                                onChange={e=>setUserReview({...userReview, star: 5})} checked={userReview.star === 5}
                            />
                            <label for="5s"><RatingStar rating={5}/></label><br/>
                        </div>
                        <label for="user-review" className="rate-field">Nhận xét của người dùng:</label>
                        <textarea type="text" placeholder="Nhận xét của bạn về sản phẩm." rows="5" id="user-review"
                            onChange={e=>setUserReview({...userReview, review: e.target.value})}
                        />
                        <button type="submit" className="phone-btn" onClick={sendReview}>Gửi đánh giá</button>
                    </form>
                    }
                    
                    
                </div>
                }
            </div>
            <div>

            </div>
        </div>
    </div>
    );
}