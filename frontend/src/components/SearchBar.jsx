import React, { useContext, useEffect } from 'react'
import {ShopContext} from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    //we want the search bar to appear only on the collection page and disappear on the other pages
    const location = useLocation();

    useEffect(()=>{
        if(location.pathname !== "/collection"){
            setShowSearch(false);
        }
    }, [location])

    return showSearch ? (
        <div className='border-t bg-gray-50 text-center'>
            <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 outline-none bg-inherit text-sm"
                />
                <img className='w-4' src={assets.search_icon} alt="" />
            </div>
            <img className='inline w-3 cursor-pointer' onClick={()=> {setShowSearch(false); setSearch("")}} src={assets.cross_icon} alt="" />
        </div>
    ) : null
}

export default SearchBar