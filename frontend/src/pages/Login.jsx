import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassowrd] = useState("");
  const [email, setEmail] = useState("");

  const {token, setToken, backendUrl} = useContext(ShopContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event)=>{
    event.preventDefault();
    try {
      
      //signup
      if(currentState === "Sign Up"){

        const response = await axios.post(backendUrl + "/api/user/register", {name, email, password});

        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          navigate("/");
          toast.success("Welcome to Forever");
        }
        else{
          toast.error(response.data.message);
        }
        

      }
      //login
      else{

        const response = await axios.post(backendUrl + "/api/user/login", {email, password});
        
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          navigate("/");
          toast.success("Welcome back to Forever");
        }
        else{
          toast.error(response.data.message);
        }

      }

    } 
    catch (error) {
      toast.error(error.message);
    }

  }

  useEffect(()=>{

    if(token){
      navigate("/")
    }

  },[token]);

  return (
    <div>

      <form onSubmit={onSubmitHandler} className='flex flex-col items-center min-h-[360px] w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>

        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>

        {currentState === "Login" ? "" : <input onChange={(event)=>setName(event.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
        <input onChange={(event)=>setEmail(event.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
        <input onChange={(event)=>setPassowrd(event.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer'>Forgor your password?</p>
          {
            currentState === "Login" ? <p className='cursor-pointer' onClick={()=>setCurrentState("Sign Up")}>Create Account</p> : <p className='cursor-pointer' onClick={()=>setCurrentState("Login")}>Login Here</p>
          }
        </div>

        <button type='submit' className='cursor-pointer bg-black text-white font-light px-8 py-2 mt-4'>{currentState === "Login" ? "Sign in" : "Sign up"}</button>

      </form>

    </div>
  )
}

export default Login