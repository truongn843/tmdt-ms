import React, { useState, useEffect } from "react";
import "./EditProduct.css";
import {app} from "../../firebase";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Select from 'react-select';
import placeholder from '../../assert/placeholder.png';
import { useHistory } from "react-router";


function EditProduct(props) {
    let history = useHistory();
    const [img, setImg] = useState({selectedFile: null, imgURL: null});
    const [displayOption, setDisplayOption] = useState({bluetooth: null, sim1: null, sim2: null, os: null, charge: null, mobileNetwork: null});
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
        rating: 0,
        ratingCount: 0,
        imgURL: "",
        dateAdded: null
    });

    bluetoothVers.forEach((ver, i)=>{
        bluetoothOptions.push({value: ver, label: ver});
    })

    simTypes.forEach((sim, i)=>{
        simOptions.push({value: sim, label: sim});
    })
    
    const idxSIM = (data) => {
        let idx;
        switch(data){
            case 'Không hỗ trợ': idx = 0; break;
            case 'Nano SIM': idx = 1; break;
            case 'Micro SIM': idx = 2; break;
            case 'eSIM': idx = 3; break;
            default:;
        }
        return idx;
    }
    
    const idxMN = (data) => {
        let idx;
        switch(data){
            case '4G': idx = 0; break;
            case '5G': idx = 1; break;
            default:;
        }
        return idx;
    }

    const idxOS = (data) => {
        let idx;
        switch(data){
            case 'Android': idx = 0; break;
            case 'iOS': idx = 1; break;
            default:;
        }
        return idx;
    }

    const idxBluetooth = (data) => {
        let idx;
        switch(data){
            case 5: idx = 0; break;
            case 4.2: idx = 1; break;
            case 4.1: idx = 2; break;
            case 4: idx = 3; break;
            case 3: idx = 4; break;
            default:;
        }
        return idx;
    }

    const idxCharge = (data) => {
        let idx;
        switch(data){
            case 'USB Type C': idx = 0; break;
            case 'Lightning': idx = 1; break;
            case 'Micro USB': idx = 2; break;
            default:;
        }
        return idx;
    }

    const loadProduct = async () => {
        const prdID = history.location.state.prdID;
        const db = getFirestore(app);
        
        const prdRef = doc(db, "products", prdID);
        const prdSnap = await getDoc(prdRef);

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
            dateAdded: prdSnap.data().dateAdded.toDate(),
            imgURL: prdSnap.data().imgURL
        })

        setDisplayOption({
            sim1: <Select 
                value={simOptions.value}
                options={simOptions}
                defaultValue={simOptions[idxSIM(prdSnap.data().sim1)]}
                onChange={handleSIM1}
            />,
            sim2: <Select 
                value={simOptions.value}
                options={simOptions}
                defaultValue={simOptions[idxSIM(prdSnap.data().sim2)]}
                onChange={handleSIM2}
            />,
            mobileNetwork: <Select 
                value={mnOptions.value}
                options={mnOptions}
                defaultValue={mnOptions[idxMN(prdSnap.data().mobileNetwork)]}
                onChange={handleMn}
            />,
            bluetooth: <Select 
                value={bluetoothOptions.value}
                options={bluetoothOptions}
                defaultValue={bluetoothOptions[idxBluetooth(prdSnap.data().bluetooth)]}
                onChange={handleBluetooth}
            />,
            charge: <Select 
                value={chargeOptions.value}
                options={chargeOptions}
                defaultValue={chargeOptions[idxCharge(prdSnap.data().charge)]}
                onChange={handleCharge}
            />,
            os: <Select 
                value={osOptions.value}
                options={osOptions}
                defaultValue={osOptions[idxOS(prdSnap.data().os)]}
                onChange={handleOs}
            />
        })
    }

    useEffect(()=>{
        const storage = getStorage(app);
        getDownloadURL(ref(storage, 'products/' + history.location.state.prdID)).then((url)=>{
            setImg({...img, imgURL: url});
        });
        if (history.location.state.prdID) loadProduct();
    },[])

    const editProduct = (e) => {
        e.preventDefault();
        const editThisProduct = async () => {
            const prdID = history.location.state.prdID;
            const db = getFirestore(app);
            const storage = getStorage(app);
            await setDoc(doc(db, "products", prdID), product);
            const updateImgURL = async (url) => {
                await updateDoc(doc(db, "products", prdID), {
                  imgURL: url
                })
              }
            if (img.selectedFile)
                uploadBytes(ref(storage, 'products/' + prdID), img.selectedFile).then(()=>{
                    getDownloadURL(ref(storage, 'products/' + prdID)).then((url)=>{
                        updateImgURL(url);
                      })
                });
            alert("Cập nhật sản phẩm thành công!");
            history.push("/admin-manage");
        }
        editThisProduct();
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
        setImg({...img, selectedFile: e.target.files[0]});
    }

    return (
    <div className="container">
        <div className="row add-up">
        <form onSubmit={editProduct}>
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
                src={img.imgURL}
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
                <label className="col-sm-4 col-form-label">
                Tên sản phẩm
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.title}
                    onChange={(e) => {
                    setProduct({ ...product, title: e.target.value });
                    }}
                    placeholder="Tên điện thoại vắn tắt, vd: Iphone 13 Pro 64GB"
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Thương hiệu
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.brand}
                    onChange={(e) => {
                    setProduct({ ...product, brand: e.target.value });
                    }}
                    placeholder="Vd: Apple, Samsung, Xiaomi, Huawei..."
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Giá bán (VNĐ)
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.price}
                    onChange={(e) => {
                    setProduct({ ...product, price: e.target.value });
                    }}
                    placeholder="Vd: 21299000. Nếu hết hàng thì để 'Hết hàng'"
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Giá gốc (VNĐ)
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.discountFrom}
                    onChange={(e) => {
                    setProduct({ ...product, discountFrom: e.target.value });
                    }}
                    placeholder="Bỏ trống nếu không giảm giá."
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
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
                <label className="col-sm-4 col-form-label">
                Tên vi xử lý (CPU)
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.cpu}
                    onChange={(e) => {
                    setProduct({ ...product, cpu: e.target.value });
                    }}
                    placeholder="Vd: Apple A13 "
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Vi xử lý đồ họa (GPU)
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.gpu}
                    onChange={(e) => {
                    setProduct({ ...product, gpu: e.target.value });
                    }}
                    placeholder="Vd: Apple GPU 5 nhân"
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Dung lượng RAM (GB)
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.ram}
                    onChange={(e) => {
                    setProduct({ ...product, ram: e.target.value });
                    }}
                    placeholder="Chỉ điền số. Vd: 8"
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Bộ nhớ trong (GB)
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.memory}
                    onChange={(e) => {
                    setProduct({ ...product, memory: e.target.value });
                    }}
                    placeholder="Chỉ điền số. Vd: 64"
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Hệ điều hành
                </label>
                <div className="col-sm-8">
                {displayOption.os}
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Dung lượng pin (mAh)
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.battery}
                    onChange={(e) => {
                    setProduct({ ...product, battery: e.target.value });
                    }}
                    placeholder="Chỉ điền số. Vd: 3200"
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-form-label">
                <h6>2.2 Kết nối</h6>
                </label>
            </div>
            
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                SIM 1
                </label>
                <div className="col-sm-8">
                {displayOption.sim1}
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                SIM 2
                </label>
                <div className="col-sm-8">
                {displayOption.sim2}
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Mạng di động
                </label>
                <div className="col-sm-8">
                {displayOption.mobileNetwork}
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Bluetooth
                </label>
                <div className="col-sm-8">
                {displayOption.bluetooth}
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
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Loại cổng sạc
                </label>
                <div className="col-sm-8">
                {displayOption.charge}
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-form-label">
                <h6>2.3 Màn hình</h6>
                </label>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Kích thước màn hình (inch)
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.screenWidth}
                    onChange={(e) => {
                    setProduct({ ...product, screenWidth: parseFloat(e.target.value) });
                    }}
                    placeholder="Chỉ điền số. Vd: 6.3"
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Công nghệ màn hình
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.screenTech}
                    onChange={(e) => {
                    setProduct({ ...product, screenTech: e.target.value });
                    }}
                    placeholder="Vd: OLED, LCD,..."
                    
                />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                Độ phân giải màn hình
                </label>
                <div className="col-sm-8">
                <input
                    type="text"
                    className="form-control"
                    
                    value={product.resolution}
                    onChange={(e) => {
                    setProduct({ ...product, resolution: e.target.value });
                    }}
                    placeholder="Vd: 1920x1080"
                    
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
                    
                />
                </div>
            </div>
            
            <button
                type="submit"
                className="btn add-btn" 
            >
                LƯU THAY ĐỔI
            </button>
            
        </div>
        </form>
        </div>
    </div>
    );
}

export default EditProduct;
