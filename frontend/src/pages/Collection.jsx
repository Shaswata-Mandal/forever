import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const {} =  useContext(ShopContext);

  //funcitoning of filters
  const toggleCategory = (event) => {
    if (category.includes(event.target.value)) {
      setCategory(prev => prev.filter(item => item != event.target.value))
    }
    else {
      setCategory(prev => [...prev, event.target.value])
    }
  }

  const toggleSubCategory = (event) => {
    if (subCategory.includes(event.target.value)) {
      setSubCategory(prev => prev.filter(item => item != event.target.value))
    }
    else {
      setSubCategory(prev => [...prev, event.target.value])
    }
  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy);

  }

  //functioning of sorting
  const sortProducts = () => {

    let filterProductCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(filterProductCopy.sort((a, b) => (a.price - b.price)));
        break;
      case "high-low":
        setFilterProducts(filterProductCopy.sort((a, b) => (b.price - a.price)));
        break;
      case "bestseller":
        setFilterProducts(filterProductCopy.filter(item => item.bestseller));
        break;
      default:
        applyFilter();
    };

  }

  //useEffect will run for the firts time when the page renders evenif the states defined in the dependencies are unchaged
  //After the initial execution, useEffect will only run again if either category or subCategory changes.
  useEffect(() => {
    applyFilter();
    setSortType("relevant");
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProducts()
  }, [sortType, products]);


  return (
    <div className='flex flex-col pt-5 sm:flex-row gap-1 sm:gap-10 sm:pt-10 border-t'>

      {/* {Filter Options} */}
      <div className='min-w-60'>

        <p onClick={() => setShowFilter(!showFilter)} className='my-2 font-semibold text-xl flex items-center cursor-pointer gap-2'>Filters
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>

        {/* {Category Filter} */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>

          <p className='mb-3 text-sm font-medium'>Categories</p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'Men'} onChange={toggleCategory} /> Men
            </p>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'Women'} onChange={toggleCategory} /> Women
            </p>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'Kids'} onChange={toggleCategory} /> Kids
            </p>

          </div>

        </div>

        {/* {SubCategory Filter} */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>

          <p className='mb-3 text-sm font-medium'>Type</p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'Topwear'} onChange={toggleSubCategory} /> Topwear
            </p>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'Bottomwear'} onChange={toggleSubCategory} /> Bottomwear
            </p>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'Winterwear'} onChange={toggleSubCategory} /> Winterwear
            </p>

          </div>

        </div>

      </div>

      {/* {Right side} */}
      <div className='flex-1'>

        <div className='flex flex-col md:flex-row justify-between text-base sm:text-2xl mb-4'>

          <Title text1={"All"} text2={"Collections"} />

          {/* {Sorting feature} */}
          <select value={sortType} className='w-42 h-10 border-2 border-gray-300 text-sm px-2' onChange={(event) => setSortType(event.target.value)}>
            <option value="relevant">Sort by: Relevant</option>
            <option value="bestseller">BestSellers</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>

        </div>

        {/* {Map Products} */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>

          {
            filterProducts.map((item, index) => (
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} images={item.images} bestseller={item.bestseller} />
            ))
          }

        </div>

      </div>

    </div>
  )
}

export default Collection