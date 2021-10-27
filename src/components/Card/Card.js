import React, { Component } from 'react';
import './Card.css';
export default class Card extends Component {
    render() {
        return (
            <div className='payment-flex-box'>
                <div className='flex-box-left'> 
                    <div className='hinh-thuc'>
                    1. Hình thức giao hàng 
                    </div>
                        {this.props.left1}
                    <div className='hinh-thuc'>
                    2. Hình thức thanh toán
                    </div>
                        {this.props.left2}
                        {this.props.left3}
                </div>
                <div className='flex-box-right'>
                        {this.props.right1}
                        {this.props.right2}
                        {this.props.right3}
                    
                </div>
                
            </div>
        )
    }
}
