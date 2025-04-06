import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState("cod");
  const {backendUrl, token, getCartAmount, cartItems, setCartItems, delivery_fee, products} = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: "", 
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;

    setFormData(data => ({...data, [name]:value}));
  };

  const initPay = (order, orderData)=>{
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
  
      handler: async (response) => {
        try {

          // console.log(order.id)
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { token } }
          );
  
          if (data.success) {

            const orderSaveResponse = await axios.post(backendUrl + "/api/order/saveOrderRazorpay", {orderData, id: order.receipt}, {headers: {token}});

            if (orderSaveResponse.data.success) {
              navigate("/orders");
              setCartItems({});
            }
            else{
              toast.error(orderSaveResponse.data.message);
            }
            
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error("Verification failed: " + error.message);
        }
      },
  
      // ✅ If user closes the modal (without paying)
      modal: {
        ondismiss: function () {
          toast.warn("Payment process was cancelled.");
        },
      },
      
      // Optional but nice to have
      theme: {
        color: "#4F46E5",
      },
    };

    //for opening the razorpay payment popup. after payment in the popup, the handle function will be executed
    // to check if the payment was successful or not. handler function will give a object as a response wich is then passed 
    // to our backend to verify the payment status
    const rzp = new window.Razorpay(options);

    rzp.open();
  }


  const onSubmitHandler = async (event)=>{

    event.preventDefault();

    try {
      
      let orderItems = []

      //this will create a array in which the product information will be there that were added to the cart along with size and quantity 
      for(const items in cartItems){
        for(const item in cartItems[items]){

          if(cartItems[items][item] > 0){
            
            const itemInfo = structuredClone(products.find(product => product._id === items));

            if(itemInfo){
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }

        }
      }

      //now creating a new order entry with single address, the items that were added to the cart, total amount
      let orderData = {
        address: formData, 
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      }

      //now adding the payment method to the orderData
      switch (method) {

        //api call for COD
        case "cod":
          orderData.paymentMethod = "COD";
          orderData.payment = false;
          const response = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } });

          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          }
          else {
            toast.error(response.data.error);
          }
          break;

        //api call for Stripe
        case "stripe":

          //getting the approprite structure of the order details to use in the payment api
          const responseStripe = await axios.post(backendUrl + "/api/order/stripe", orderData, {headers: {token}});

          if (responseStripe.data.success) {

            const {session_url} = responseStripe.data;
            window.location.replace(session_url);

          }
          else {
            toast.error(responseStripe.data.error);
          }

          break;

        //api call for Razorpay
        case "razorpay":
          
          //getting the approprite structure of the order details to use in the payment api
          const responseRazorpay = await axios.post(backendUrl + "/api/order/razorpay", orderData, {headers: {token}});

          if (responseRazorpay.data.success) {

            //calling the initpay funciton for razorpay to initiate the payment
            initPay(responseRazorpay.data.order, responseRazorpay.data.newOrder);

          }
          else {
            toast.error(responseRazorpay.data.error);
          }

          break;

        default:
          toast.error("Invalid payment method selected");
          return;

      }
      

    } catch (error) {
      toast.error(error.message);
    }

  }



  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* {Left side} */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[380px] lg:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={"Delivery"} text2={"Information"} />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' />
          <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' />
        </div>

        <input required onChange={onChangeHandler} name="email" value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email Address' />
        <input required onChange={onChangeHandler} name="street" value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name="city" value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name="state" value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name="country" value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>

        <input required onChange={onChangeHandler} name="phone" value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />

      </div>

      {/* {Right side} */}
      <div className='mt-8 lg:min-w-[480px]'>

        <div className='mt-8 max-w-80'>
          <CartTotal/>
        </div>

        <div className='mt-12'>
          <Title text1={"Payment"} text2={"Method"}/>

          {/* {Payment method selection} */}
          <div className='flex gap-3 flex-col lg:flex-row'>

            <div onClick={()=>{setMethod("stripe")}} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>

            <div onClick={()=>{setMethod("razorpay")}} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400": ""}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>

            <div onClick={()=>{setMethod("cod")}} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>Cash On Delivery</p>
            </div>

          </div>
        </div>

        <div className='w-full text-end mt-8'>
          <button type='submit' className='bg-black text-white text-sm px-16 py-3 cursor-pointer'>Place Order</button>
        </div>

      </div>

    </form>
  )
}

export default PlaceOrder