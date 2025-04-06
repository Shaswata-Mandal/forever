import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";

const Cart = () => {

  const { products, currency, cartItems, updateQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(()=>{

    const tempData = [];
    for(const items in cartItems){
      for(const item in cartItems[items]){
        if(cartItems[items][item]>0){
          tempData.push({
            _id: items, 
            size: item, 
            quantity: cartItems[items][item]
          });
        }
      }
    }

    setCartData(tempData);

  }, [cartItems]);

  const navigate = useNavigate()

  const goToCheckout = () => {
    if (Object.keys(cartItems).length === 0) {
      toast.error("Your Cart is Empty")
      return;
    }
    navigate("/place-order");
  };

  return (
    <div className='border-t pt-14'>

      <div className='text-2xl mb-3'>
        <Title text1={"Your"} text2={"Cart"}/>
      </div>

      <div>
        {
          cartData.map((item, index)=>{
            const productData = products.find((product)=> product._id === item._id)

            return (
              <div key={index} className='py-4 border-t text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img src={productData.images[0]} className='w-16 sm:w-20' alt="" />
                  <div>
                    <p className='text-sm md:text-lg'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50 rounded'>{item.size}</p>
                    </div>
                  </div>
                </div>

                <input onChange={(event)=>{event.target.value === '' || event.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(event.target.value))}} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 rounded text-center' type="number" min={1} value={item.quantity}/>

                <img onClick={()=>{updateQuantity(item._id, item.size, 0)}} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />

              </div>
            )
          })
        }
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal/>
          <div className='w-full text-end'>
            <button onClick={()=> goToCheckout()} className='bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer'>Proceed To Checkout</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart