import React, { useState, useEffect } from "react";
import FilterButton from "./FilterButton";
import "../reset.css";
import "./filter-bar.css";
import ProductCard from "../ProductCard/productCard";
import {app} from "../../firebase";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "./product.css"

function ProductList(){
  const filterData = require("../../pseudo-data/filter.json");
  const [prdList, setPrdList] = useState({list: []});
  const [displayProduct, setDisplayProduct] = useState({list: []});


  useEffect(() => {
    
    const fetchData = async () => {
      const db = getFirestore(app);
      const storage = getStorage(app);
      
      const querySnapshot = await getDocs(collection(db, "products"));
      querySnapshot.forEach((doc)=>{
        getDownloadURL(ref(storage, 'products/' + doc.id)).then((url)=>{
          setPrdList(prevState => ({
            list: [...prevState.list, {
              title: doc.data().title,
              price: doc.data().price,
              discounted: doc.data().discounted,
              id: doc.id,
              imgURL: url
            }]
          }));
          setDisplayProduct(prevState => ({
            list: [...prevState.list, (
              <ProductCard 
              id={doc.id}
              title={doc.data().title}
              price={doc.data().price}
              discountFrom={doc.data().discountFrom}
              imgURL={url}
              rating={doc.data().rating === "n/a" ? 0 : doc.data().rating}
            ></ProductCard>
            )]
          }));
        });
      })
    }
    fetchData();
  }, [])

  return (
    <div>

    <div className="product-container">
    <div className="filter-bar">
      <div className="group-select">
        <div className="btn filter-btn">Reset bộ lọc</div>
        {/* Giá */}
        <FilterButton data={filterData.cost} />
        {/* Hãng */}
        <FilterButton data={filterData.brand} />
        {/* Pin */}
        <FilterButton data={filterData.batery} />
        {/* Camera  */}
        <FilterButton data={filterData.camera} />
        {/* Màn hình */}
        <FilterButton data={filterData.screen} />
      </div>
      <div className="group-result">
        <div className="result">{prdList.list.length} sản phẩm</div>
        <div className="form-check check">
          <input
            className="form-check-input "
            type="checkbox"
            value=""
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Giảm giá
          </label>
        </div>

        <div className="form-check check">
          <input
            className="form-check-input "
            type="checkbox"
            value=""
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Trả góp
          </label>
        </div>

        <div className="form-check check">
          <input
            className="form-check-input "
            type="checkbox"
            value=""
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Mới
          </label>
        </div>
      </div>
    </div>
      <div className="product-container-label">Điện thoại nổi bật</div>
      {displayProduct.list}
    </div>
    </div>
  );
}
export default ProductList;