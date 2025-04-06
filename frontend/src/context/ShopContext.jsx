import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

// Create a context
export const ShopContext = createContext();

// Context provider
const ShopContextProvider = (props) => {
    const currency = "$";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);

    const [token, setToken] = useState( localStorage.getItem("token") ? localStorage.getItem("token") : "");

    //Function to fetch all the products form the backend database
    const getProductsData = async ()=>{
        try {
            
            const response = await axios.get(backendUrl + "/api/product/list");

            if(response.data.success){
                
                setProducts(response.data.products);
            }
            else{
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        getProductsData();
    }, []);


    // Function to add an item to the cart
    const addToCart = (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        let cartData = { ...cartItems };

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

        setCartItems(cartData);
        toast.success("Product Added to Cart");
    };

    // Function to get total items count in cart
    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    totalCount += cartItems[itemId][size];
                }
            }
        }
        return totalCount;
    };

    // Function to update item quantity
    const updateQuantity = (itemId, size, quantity) => {
        let cartData = { ...cartItems };

        if (quantity > 0) {
            cartData[itemId][size] = quantity;
            toast.success("Item quantity updated");
        } else {
            delete cartData[itemId][size]; // Remove the size entry
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]; // Remove product if all sizes are removed
            }
            toast.error("Item removed from cart");
        }

        setCartItems(cartData);
    };

    // Function to calculate total cart amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId);
            if (!itemInfo) continue; // Skip if product not found

            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    totalAmount += itemInfo.price * cartItems[itemId][size];
                }
            }
        }
        return totalAmount;
    };

    // Context value
    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount, 
        setCartItems,
        backendUrl,
        token, 
        setToken,
    };

    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
