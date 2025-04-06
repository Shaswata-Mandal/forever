import React, { useState, useContext } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {

    const [visible, setVisible] = useState(false)
    const { setShowSearch, getCartCount, token, setToken } = useContext(ShopContext);
    const navigate = useNavigate();

    const logout = ()=>{
        localStorage.removeItem("token");
        setToken("");
        navigate("/login");
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium'>

            <Link to="/"><img src={assets.logo} className="w-30 sm:w-36" alt="" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

                <NavLink to='/' className="flex flex-col items-center gap-1">
                    <p>Home</p>
                    <hr className='w-2/4 border-none h-[1.5px]' />
                </NavLink>

                <NavLink to='/collection' className="flex flex-col items-center gap-1">
                    <p>Collection</p>
                    <hr className='w-2/4 border-none h-[1.5px]' />
                </NavLink>

                <NavLink to='/about' className="flex flex-col items-center gap-1">
                    <p>About</p>
                    <hr className='w-2/4 border-none h-[1.5px]' />
                </NavLink>

                <NavLink to='/contact' className="flex flex-col items-center gap-1">
                    <p>Contact</p>
                    <hr className='w-2/4 border-none h-[1.5px]' />
                </NavLink>

            </ul>

            <div className='flex items-center gap-6'>
                <Link to="/collection"><img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" /></Link>

                <div className='group relative'>

                    <img onClick={()=> token ? null : navigate("/login") } src={assets.profile_icon} className='w-5 cursor-pointer' alt="" />

                    {/* {Drop down} */}

                    {token &&

                        <div className={"group-hover:block hidden absolute dropdown-menu right-0 pt-4"}>
                            <div className='flex flex-col gap-2 w-36 py-2 bg-slate-100 text-gray-500 rounded'>
                                <p className='cursor-pointer hover:text-black pl-2'>My Profile</p>
                                <p onClick={()=> navigate("/orders")} className='cursor-pointer hover:text-black pl-2'>Orders</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black pl-2'>Logout</p>
                            </div>
                        </div>

                    }
                    

                </div>

                <Link to="/cart" className='relative'>
                    <img src={assets.cart_icon} alt="" className='w-5 min-w-5' />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>

                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>

            {/* {sidebar menu for small screen} */}
            <div className={`z-500 absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p>Back</p>
                    </div>

                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b-1 border-t-1' to="/">Home</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b-1' to="/collection">Collection</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b-1' to="/about">About</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b-1' to="/contact">Contact</NavLink>
                </div>
            </div>

        </div>
    )
}

export default Navbar