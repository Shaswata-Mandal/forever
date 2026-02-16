import orderModel from "../models/orderModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

//global variables
const currency = "inr";
const deliveryCharge = 10;


//Gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})


//Placing orders using COD methods
const placeOrder = async (req, res) => {

    try {

        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        }

        const newOrder = new orderModel(orderData);
        newOrder.save();

        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

};


//Placing orders using Stripe methods
const placeOrderStripe = async (req, res) => {

    try {

        const { userId, items, amount, address } = req.body;

        //frontend url from which this request is beign made
        const { origin } = req.headers;

        //saving the order data in database initially with payment value false
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        }

        const newOrder = new orderModel(orderData);
        newOrder.save();

        //now creating the line items which is the requirement of the stipe payment
        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        //adding the delivery charge detail to the line item for stripe
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        //now creating a new session. here we define the success and faliure url which will trigger after payment is successfully done or cancelled
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

};

//verify stripe
const verifyStripe = async (req, res) => {

    const { orderId, success } = req.body;

    try {

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true });
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}


//Placing orders using Razorpay methods
const placeOrderRazorpay = async (req, res) => {
    try {

        const { userId, items, amount, address } = req.body;

        //saving the order data in database initially with payment value false
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // console.log(newOrder._id)

        //now creating option to execute the razorpay payment
        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }

        //creating the new order for razorpay and sending it to frontend to initiate razorpay payment
        const razorpayOrder = await razorpayInstance.orders.create(options);

        res.json({
            success: true,
            order: razorpayOrder,
            newOrder
        });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Failed to initiate razorpay payment" });
    }
};

const cancelRazorpayOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.json({ success: false, message: "OrderId required" });
        }

        // delete only if still unpaid (safety check)
        const deleted = await orderModel.findOneAndDelete({
            _id: orderId,
            payment: false
        });

        if (!deleted) {
            return res.json({
                success: false,
                message: "Order already paid or not found"
            });
        }

        res.json({ success: true, message: "Order cancelled" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


//verify razorpay payment
const verifyRazorpay = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const sign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        //payment info from the razorpay for verifying the payment status. this return an object which contains status, receipt(orderId) keys, etc.
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (sign === razorpay_signature && orderInfo.status === "paid") {

            // receipt = your MongoDB orderId
            const mongoOrderId = orderInfo.receipt;

            await orderModel.findByIdAndUpdate(mongoOrderId, {
                payment: true,
                razorpay_payment_id,
            });

            return res.json({ success: true, message: "Payment Successful" });
        }

        // ❌ Payment failed → delete order
        const mongoOrderId = orderInfo.receipt;
        await orderModel.findByIdAndDelete(mongoOrderId);

        res.json({ success: false, message: "Payment Failed" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//user orders data for frontend
const userOrders = async (req, res) => {

    try {

        const { userId } = req.body;

        const orders = await orderModel.find({ userId });

        res.json({ success: true, orders });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

};


//all orders data for admin panel
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({});
        res.json({ success: true, orders });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//update order status for admin panel
const updateStatus = async (req, res) => {

    try {

        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });

        res.json({ success: true, message: "Order status updated!" });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

};


export { placeOrder, placeOrderRazorpay, verifyRazorpay, placeOrderStripe, verifyStripe, allOrders, userOrders, updateStatus, cancelRazorpayOrder };