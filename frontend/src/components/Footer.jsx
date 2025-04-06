import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col mt-10 sm:grid grid-cols-[3fr_1fr_1fr] gap-14 lg:mt-40 text-sm border-t py-10'>
            <div className=''>
                <img className='mb-5 w-32' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi excepturi nesciunt eum, dolores obcaecati, consectetur minus reprehenderit aliquam asperiores recusandae similique eligendi labore possimus nobis. Incidunt praesentium velit tempore placeat?</p>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>Get In Touch</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+1-000-000-0000</li>
                    <li>shaswatamandal15@gmail.com</li>
                    <Link to="https://www.instagram.com/shaswat_0515?igsh=MWZodGc3czl6MDFjcw==" target='new'>Instagram</Link>
                </ul>
            </div>
        </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ forever.com - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer