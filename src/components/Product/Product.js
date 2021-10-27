import React, { useState, useEffect } from "react";
import "./product.css";
import getData from "../ProductList/getData";
import { useParams } from "react-router";
import ThongTin from "./Components/ThongTin";
import ThongSo from "./Components/ThongSo";

function Product() {
  const [tab, setTab] = useState("thongtin");
  const [product, setProduct] = useState({
    id: "",
    title: "",
    image: "",
    price: "",
    discounted: "",
    currency: "đ",
    rating: "",
    brand: "",
    battery: "",
    chipset: "",
    frontCamera: "",
    rearCamera: "",
    bluetooth: "",
    gpu: "",
    screen: "",
    description: "",
  });
  const { id } = useParams();
  let products = getData();
  useEffect(() => {
    setProduct(
      products.filter((item) => {
        return item.id.toString() === id;
      })[0]
    );
    console.log(product);
  }, []);
  return (
    <div>
      <div className="container">
        <div className="row product-up">
          <div className="col col-xl-4 col-lg-4 col-md-4 product-picture">
            <div className="picture-view">
              <img src={product.image} alt="" className="product-image" />
            </div>
          </div>
          <div className="col col-xl-7 col-lg-7 col-md-7 product-decr">
            <div className="row tab">
              <div
                className="col btn tab-item"
                onClick={() => setTab("thongtin")}
              >
                Thông tin
              </div>
              <div
                className="col btn tab-item"
                onClick={() => {
                  setTab("thongso");
                }}
              >
                Thông số
              </div>
              <div className="col btn tab-item">Đánh giá</div>
            </div>
            {tab === "thongtin" && <ThongTin product={product} />}
            {tab === "thongso" && <ThongSo product={product} />}
          </div>
        </div>
        <div className="row product-down"></div>
      </div>
    </div>
  );
}

export default Product;
