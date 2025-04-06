import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({ id, images, name, price, bestseller }) => {

    //getting the currency value from context
    const { currency } = useContext(ShopContext);

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>

            <div className='relative overflow-hidden'>

                {/* BestSeller Badge */}
                {bestseller && (
                    <p className='absolute top-2 left-2 bg-yellow-500 text-white text-[10px] px-2 py-1 rounded'>
                        BestSeller
                    </p>
                )}

                <img className='hover:scale-110 transition ease-in-out' src={images[0]} alt="" />
                
            </div>

            <p className='pt-3 pb-1 text-sm'>{name}</p>

            <p className='text-sm font-medium'>{currency}{price}</p>

        </Link>
    )
}

export default ProductItem