import React, { useState } from 'react'
import assets from '../assets/assets'
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App';
import Loader from '../components/Loader';


const Add = ({ token, loading, setLoading }) => {

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onsubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {

      if (!image1) {
        toast.error("You need to upload at least one image");
        return;
      }

      if (sizes.length === 0) {
        toast.error("You need to select at least one size");
        return;
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
      }
      else {
        toast.error(response.data.message)
      }

    }
    catch (error) {
      toast.error(error.message)
    }
    finally {
      setLoading(false);
    }
  }

  return (loading ? (
    <Loader/>
  ) :

    (
      <form onSubmit={onsubmitHandler} className='flex flex-col w-full items-start gap-3'>

        <div>

          <p className='mb-2'>Upload Image</p>

          <div className='flex gap-2'>

            <label className='cursor-pointer' htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(event) => setImage1(event.target.files[0])} type="file" id="image1" hidden />
            </label>

            <label className='cursor-pointer' htmlFor="image2">
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(event) => setImage2(event.target.files[0])} type="file" id="image2" hidden />
            </label>

            <label className='cursor-pointer' htmlFor="image3">
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(event) => setImage3(event.target.files[0])} type="file" id="image3" hidden />
            </label>

            <label className='cursor-pointer' htmlFor="image4">
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(event) => setImage4(event.target.files[0])} type="file" id="image4" hidden />
            </label>

          </div>

        </div>

        <div className='w-full'>
          <p className='mb-2'>Product Name</p>
          <input onChange={(event) => setName(event.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product Description</p>
          <textarea onChange={(event) => setDescription(event.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here...' required />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

          <div>
            <p className='mb-2'>Category</p>
            <select onChange={(event) => setCategory(event.target.value)} className='w-full px-3 py-2'>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>Sub Category</p>
            <select onChange={(event) => setSubCategory(event.target.value)} className='w-full px-3 py-2'>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>Product Price</p>
            <input onChange={(event) => setPrice(event.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' min={1} />
          </div>

        </div>

        <div>

          <p className='mb-2'>Product Sizes</p>

          <div className='flex gap-3'>

            <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
              <p className={`px-3 py-1 cursor-pointer ${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"}`}>S</p>
            </div>

            <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
              <p className={`px-3 py-1 cursor-pointer ${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"}`}>M</p>
            </div>

            <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
              <p className={`px-3 py-1 cursor-pointer ${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"}`}>L</p>
            </div>

            <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
              <p className={`px-3 py-1 cursor-pointer ${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"}`}>XL</p>
            </div>

            <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
              <p className={`px-3 py-1 cursor-pointer ${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"}`}>XL</p>
            </div>

          </div>

        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button type='submit' className='cursor-pointer w-28 py-3 mt-4 bg-black text-white '>Add</button>

      </form>
    )

  );

};

export default Add;