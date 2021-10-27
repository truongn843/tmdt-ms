import React, { Component } from 'react'
import './MaKhuyenMai.css'
export default class MaKhuyenMai extends Component {
    render() {
        return (
            <div className='card'>
                    <div className='ma-khuyen-mai-box'>
                        <div>
                        Mã khuyến mãi:           
                        </div>
                        <input className='ma-khuyen-mai-input' type="text" placeholder="Nhập mã khuyến mãi" />    
                    </div>
                    
            </div>
        )
    }
}
