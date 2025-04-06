import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from './ProductItem';

const BestSeller = () => {

    const { products } = useContext(ShopContext);

    const [bestSeller, setBestSeller] = useState([]);

    //whenever this component renders, we need to load 10 products data from the context to the state variable
    useEffect(() => {
        const bestProducts = products.filter((item)=>(item.bestseller))
        setBestSeller(bestProducts.slice(0,5));
    }, [products]);
    

    return (
        <div>
            <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={"Best"} text2={"Sellers"}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates ullam, eaque doloribus laboriosam quas ipsum architecto in rerum illo odit labore repellat cupiditate consequatur quos saepe, laudantium corporis unde? Iusto.
                </p>
            </div>

            {/* {Rendering products} */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    bestSeller.map((item, index)=>(
                        <ProductItem key={index} id={item._id} images={item.images} name={item.name} price={item.price}/>
                    ))
                }
            </div>

        </div>
        </div>
    )
}

export default BestSeller