import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";


//App Configuration
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//cors helps to access the backend from frontend IP
app.use(cors());


//api endpoints
app.get("/", (req, res)=>{
    res.send("this is root");
});

app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/order", orderRouter);

app.listen(port, ()=>{
    console.log(`Server started on port: ${port}`);
})