import React from 'react'

const NewletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now and get 20% off</p>
            <p className='text-gray-400 mt-3'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste necessitatibus vitae pariatur blanditiis ipsa fuga impedit officiis saepe, nulla obcaecati eligendi illo officia recusandae minus voluptates dignissimos cum perferendis quas.</p>

            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
                <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required />
                <button type='submit' className='bg-black text-white cursor-pointer text-xs px-10 py-4'>SUBSCRIBE</button>
            </form>
        </div>
    )
}

export default NewletterBox