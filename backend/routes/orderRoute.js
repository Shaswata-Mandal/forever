import express from 'express'
import {placeOrder, placeOrderRazorpay, saveOrderAfterPayment, verifyRazorpay, placeOrderStripe, verifyStripe, allOrders, userOrders, updateStatus} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/authUser.js";

const orderRouter = express.Router();

//Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);


//Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);


//User Feature
orderRouter.post("/userorders", authUser, userOrders);

//verify payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

//Saving order after successfull payment when paid through razorpay
orderRouter.post("/saveOrderRazorpay", authUser, saveOrderAfterPayment);

export default orderRouter;