import React from 'react';
import './Address.css';
import ButtonEdit from '../Button/ButtonEdit' ;

function Address(props){
    return (
        <div className='card'>
            <div className='adjust-margin'>
            <div id='address-header'>
                <span id="address">Địa chỉ giao hàng</span>
                <div id='address-edit'><ButtonEdit url="/user-profile"/></div>
            </div>
            
            <br/>
            <hr />
            <div className='name-dia-chi'>
                {props.fullname !== null ? props.fullname : "Bạn chưa nhập tên."}
            </div>
            <div className='dia-chi'>
                {props.address !== null ? props.address : "Bạn chưa nhập địa chỉ nhận hàng."}
            </div>
            <div className='dien-thoai'>
                SĐT: {props.phone}
            </div>
            </div>
        </div>
        
    );
}

export default Address;
