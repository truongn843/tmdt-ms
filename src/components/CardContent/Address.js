import React, { Component } from 'react';
import './Address.css';
import ButtonEdit from '../Button/ButtonEdit' ;
export default class Address extends Component {
    render() {
        return (
            <div className='card'>
                <div className='adjust-margin'> 
                <div className='dcgh-adjust'>
                Địa chỉ giao hàng
                <ButtonEdit/>
                </div>
               
                <hr />
                <div className='name-dia-chi'>
                    Name
                </div>
                <div className='dia-chi'>
                    Lý Thường Kiệt, Quận 10, HCM
                </div>
                <div className='dien-thoai'>
                    0123456789
                </div>
                </div>
            </div>
            
        )
    }
}
