import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
    const { currency, getCartAmount, delivery_fee } = useContext(ShopContext);

    // Store subtotal and shipping fee to avoid redundant function calls
    const subtotal = getCartAmount() || 0;
    const shippingFee = delivery_fee || 0;
    const total = subtotal === 0 ? 0 : subtotal + shippingFee;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={"Cart"} text2={"Total"} />
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currency} {subtotal.toFixed(2)}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency} {shippingFee.toFixed(2)}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <b>Total</b>
                    <b>{currency} {total.toFixed(2)}</b>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
