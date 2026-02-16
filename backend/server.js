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
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    "http://localhost:5173",
    "http://localhost:5174"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps / postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("CORS not allowed for this origin: " + origin));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true
}));


//api endpoints
app.get("/", (req, res) => {
    res.send("this is root");
});

app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/order", orderRouter);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
})