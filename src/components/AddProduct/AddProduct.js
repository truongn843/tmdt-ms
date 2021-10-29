import React, { useState } from "react";
import "./add-product.css";
import {app} from "../../firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import Select from 'react-select';
import placeholder from '../../assert/placeholder.png';


function AddProduct() {
  const [msg, setMsg] = useState({ status: false, message: "Thêm sản phẩm thành công!" });
  const [img, setImg] = useState({selectedFile: null});
  const bluetoothVers = [5, 4.2, 4.1, 4, 3];
  const simTypes = ['Không hỗ trợ', 'Nano SIM', 'Micro SIM', 'eSIM'];
  const bluetoothOptions = [];
  const simOptions = [];
  const chargeOptions = [
    {label: 'USB Type C', value: 'USB Type C'},
    {label: 'Lightning', value: 'Lightning'},
    {label: 'Micro USB', value: 'Micro USB'}
  ]
  const osOptions = [
    {label: 'Android', value: 'Android'},
    {label: 'iOS', value: 'iOS'}
  ]
  const mnOptions = [
    {label: '4G', value: '4G'},
    {label: '5G', value: '5G'}
  ]

  const [product, setProduct] = useState({
    title: "",
    price: "",
    discountFrom: "",
    brand: "",
    battery: "",
    cpu: "",
    frontCamera: "",
    rearCamera: "",
    bluetooth: 5,
    gpu: "",
    screenWidth: "",
    screenTech: "",
    ram: "",
    memory: "",
    resolution: "",
    sim1: "Nano SIM",
    sim2: "Không hỗ trợ",
    charge: "USB Type C",
    wifi: "",
    os: "Android",
    mobileNetwork: "4G",
    rating: "n/a",
    ratingCount: 0
  });

  bluetoothVers.forEach((ver, i)=>{
    bluetoothOptions.push({value: ver, label: ver});
  })

  simTypes.forEach((sim, i)=>{
    simOptions.push({value: sim, label: sim});
  })

  const addProduct = (e) => {
    e.preventDefault();
    const addNewProduct = async () => {
      const db = getFirestore(app);
      const storage = getStorage(app);
      await addDoc(collection(db, 'products'), {
        ...product,
        dateCreated: new Date() 
      }).then((docRef)=>{
        uploadBytes(ref(storage, 'products/' + docRef.id), img.selectedFile);
      });
    }
    addNewProduct();
    setMsg({...msg, status: true});
  }

  const handleBluetooth = e => {
    setProduct({...product, bluetooth: e.value});
  }

  const handleSIM1 = e => {
    setProduct({...product, sim1: e.value});
  }

  const handleSIM2 = e => {
    setProduct({...product, sim2: e.value});
  }

  const handleCharge = e => {
    setProduct({...product, charge: e.value});
  }

  const handleOs = e => {
    setProduct({...product, os: e.value});
  }

  const handleMn = e => {
    setProduct({...product, mobileNetwork: e.value});
  }

  const handleImg = e => {
    setImg({selectedFile: e.target.files[0]});
  }

  return (
    <div className="container">
      <div className="row add-up">
        <form onSubmit={addProduct}>
        <div className="col col-xl-5 col-lg-4 col-md-4 add-picture">
          <div className="mb-3 row">
              <label className="col-form-label">
                <h5 className="text">Ảnh minh họa sản phẩm</h5>
              </label>
            </div>
          <div className="mb-3 row">
            {img.selectedFile !== null ? (
              <img
              className="product-image"
              src={URL.createObjectURL(img.selectedFile)}
              alt="Product Preview"
            />
            ) : (
              <img
              className="product-image"
              src={placeholder}
              alt="Product Preview"
            />
            )
            }
            
          </div>
        </div>
        <div className="col col-xl-7 col-lg-7 col-md-7 add-decs">
            <div className="mb-3 row">
              <label className="col-form-label">
                <h5>1. Thông tin chung</h5>
              </label>
            </div>
            <div className="mb-3 row">
              <label htmlFor="name" className="col-sm-4 col-form-label">
                Tên sản phẩm
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={product.title}
                  onChange={(e) => {
                    setProduct({ ...product, title: e.target.value });
                  }}
                  placeholder="Tên điện thoại vắn tắt, vd: Iphone 13 Pro 64GB"
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="brand" className="col-sm-4 col-form-label">
                Thương hiệu
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  value={product.brand}
                  onChange={(e) => {
                    setProduct({ ...product, brand: e.target.value });
                  }}
                  placeholder="Vd: Apple, Samsung, Xiaomi, Huawei..."
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="screen" className="col-sm-4 col-form-label">
                Giá bán (VNĐ)
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="screen"
                  value={product.price}
                  onChange={(e) => {
                    setProduct({ ...product, price: e.target.value });
                  }}
                  placeholder="Vd: 21299000. Nếu hết hàng thì để 'Hết hàng'"
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="screen" className="col-sm-4 col-form-label">
                Giá gốc (VNĐ)
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="screen"
                  value={product.discountFrom}
                  onChange={(e) => {
                    setProduct({ ...product, discountFrom: e.target.value });
                  }}
                  placeholder="Bỏ trống nếu không giảm giá."
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="screen" className="col-sm-4 col-form-label">
                Tệp hình ảnh
              </label>
              <div className="col-sm-8">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImg}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-form-label">
                <h5>2. Thông số kỹ thuật</h5>
              </label>
            </div>
            <div className="mb-3 row">
              <label className="col-form-label">
                <h6>2.1 Hệ điều hành - CPU, GPU - bộ nhớ</h6>
              </label>
            </div>
            <div className="mb-3 row">
              <label htmlFor="chipset" className="col-sm-4 col-form-label">
                Tên vi xử lý (CPU)
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="chipset"
                  value={product.cpu}
                  onChange={(e) => {
                    setProduct({ ...product, cpu: e.target.value });
                  }}
                  placeholder="Vd: Apple A13 "
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="gpu" className="col-sm-4 col-form-label">
                Vi xử lý đồ họa (GPU)
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="gpu"
                  value={product.gpu}
                  onChange={(e) => {
                    setProduct({ ...product, gpu: e.target.value });
                  }}
                  placeholder="Vd: Apple GPU 5 nhân"
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="chipset" className="col-sm-4 col-form-label">
                Dung lượng RAM (GB)
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="chipset"
                  value={product.ram}
                  onChange={(e) => {
                    setProduct({ ...product, ram: e.target.value });
                  }}
                  placeholder="Chỉ điền số. Vd: 8"
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="chipset" className="col-sm-4 col-form-label">
                Bộ nhớ trong (GB)
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="chipset"
                  value={product.memory}
                  onChange={(e) => {
                    setProduct({ ...product, memory: e.target.value });
                  }}
                  placeholder="Chỉ điền số. Vd: 64"
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="bluetooth" className="col-sm-4 col-form-label">
                Hệ điều hành
              </label>
              <div className="col-sm-8">
                <Select 
                  value={osOptions.value}
                  options={osOptions}
                  defaultValue={osOptions[0]}
                  onChange={handleOs}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="batery" className="col-sm-4 col-form-label">
                Dung lượng pin (mAh)
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="batery"
                  value={product.battery}
                  onChange={(e) => {
                    setProduct({ ...product, battery: e.target.value });
                  }}
                  placeholder="Chỉ điền số. Vd: 3200"
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-form-label">
                <h6>2.2 Kết nối</h6>
              </label>
            </div>
            
            <div className="mb-3 row">
              <label htmlFor="bluetooth" className="col-sm-4 col-form-label">
                SIM 1
              </label>
              <div className="col-sm-8">
                <Select 
                  value={simOptions.value}
                  options={simOptions}
                  defaultValue={simOptions[1]}
                  onChange={handleSIM1}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="bluetooth" className="col-sm-4 col-form-label">
                SIM 2
              </label>
              <div className="col-sm-8">
                <Select 
                  value={simOptions.value}
                  options={simOptions}
                  defaultValue={simOptions[0]}
                  onChange={handleSIM2}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="bluetooth" className="col-sm-4 col-form-label">
                Mạng di động
              </label>
              <div className="col-sm-8">
                <Select 
                  value={mnOptions.value}
                  options={mnOptions}
                  defaultValue={mnOptions[0]}
                  onChange={handleMn}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="bluetooth" className="col-sm-4 col-form-label">
                Bluetooth
              </label>
              <div className="col-sm-8">
                <Select 
                  value={bluetoothOptions.value}
                  options={bluetoothOptions}
                  defaultValue={bluetoothOptions[0]}
                  onChange={handleBluetooth}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="front-camera" className="col-sm-4 col-form-label">
                Công nghệ Wifi
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="front-camera"
                  value={product.wifi}
                  onChange={(e) => {
                    setProduct({ ...product, wifi: e.target.value });
                  }}
                  placeholder="Vd: Wi-Fi 802.11 a/b/g/n/ac/ax"
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="bluetooth" className="col-sm-4 col-form-label">
                Loại cổng sạc
              </label>
              <div className="col-sm-8">
                <Select 
                  value={chargeOptions.value}
                  options={chargeOptions}
                  defaultValue={chargeOptions[0]}
                  onChange={handleCharge}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-form-label">
                <h6>2.3 Màn hình</h6>
              </label>
            </div>
            <div className="mb-3 row">
              <label htmlFor="screen" className="col-sm-4 col-form-label">
                Kích thước màn hình (inch)
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="screen"
                  value={product.screenWidth}
                  onChange={(e) => {
                    setProduct({ ...product, screenWidth: e.target.value });
                  }}
                  placeholder="Chỉ điền số. Vd: 6.3"
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="screen" className="col-sm-4 col-form-label">
                Công nghệ màn hình
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="screen"
                  value={product.screenTech}
                  onChange={(e) => {
                    setProduct({ ...product, screenTech: e.target.value });
                  }}
                  placeholder="Vd: OLED, LCD,..."
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="screen" className="col-sm-4 col-form-label">
                Độ phân giải màn hình
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="screen"
                  value={product.resolution}
                  onChange={(e) => {
                    setProduct({ ...product, resolution: e.target.value });
                  }}
                  placeholder="Vd: 1920x1080"
                  required
                />
              </div>
            </div>
            
            <div className="mb-3 row">
              <label className="col-form-label">
                <h6>2.4 Camera</h6>
              </label>
            </div>
            
            <div className="mb-3 row">
              <label htmlFor="front-camera" className="col-sm-4 col-form-label">
                Thông số camera trước
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="front-camera"
                  value={product.frontCamera}
                  onChange={(e) => {
                    setProduct({ ...product, frontCamera: e.target.value });
                  }}
                  placeholder="Vd: 10.0 MP f/2.2"
                  required
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="behind-camera"
                className="col-sm-4 col-form-label"
              >
                Thông số camera sau
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="behind-camera"
                  value={product.rearCamera}
                  onChange={(e) => {
                    setProduct({ ...product, rearCamera: e.target.value });
                  }}
                  placeholder="Vd: 12.0 MP f/1.8 - 12.0 MP f/2.2 - 12.0 MP"
                  required
                />
              </div>
            </div>
            {msg.status === true && (
              <div className="mb-3 row">
              <label className="col-form-label">
                <h3>{msg.message}</h3>
              </label>
            </div>
            )}
            
            
            <button
              type="submit"
              className="btn add-btn" 
            >
              THÊM SẢN PHẨM
            </button>
          
        </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
