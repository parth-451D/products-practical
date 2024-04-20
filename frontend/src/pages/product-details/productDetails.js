import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  applyCoupon,
  getAllColorBySizeId,
  getAllSizesByProduct,
  getPoductDetailById,
  makeOrder,
} from "../../services/productService";
import { SuccessAlert } from "../../helper";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId } = location?.state;
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [couponErrorMessage, setCouponErrorMessage] = useState("");
  const [couponDetails, setCouponDetails] = useState(null);

  const handleSizeChange = (sizeId) => {
    setSelectedSize(sizeId);
  };

  const handleColorChange = (colorId) => {
    setSelectedColor(colorId);
  };

  const getSizes = async () => {
    try {
      const data = await getAllSizesByProduct(productId);
      setSizes(data?.data?.result);
      setSelectedSize(data?.data?.result[0]?.size_id || 1);
    } catch (error) {
      console.log(error);
    }
  };

  const getColorBySize = async () => {
    try {
      const data = await getAllColorBySizeId(productId, selectedSize);
      setColors(data?.data?.result);
      setSelectedColor(data?.data?.result[0]?.color_id);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductDetails = async () => {
    try {
      const sizes = await getPoductDetailById(
        productId,
        selectedSize,
        selectedColor
      );
      setProductDetails(sizes?.data?.result);
    } catch (error) {
      console.log(error);
    }
  };

  const validateCoupon = async () => {
    try {
      if (validateEmail()) {
        const payload = {
          productId: productId,
          sizeId: selectedSize,
          colorId: selectedColor,
          coupon: coupon,
          email: email,
        };
        await applyCoupon(payload)
          .then((res) => {
            setCouponErrorMessage("");
            setCouponDetails(res?.data?.result?.couponDetails);
          })
          .catch((err) => {
            setCouponErrorMessage(err?.response?.data?.error);
          });
      }
    } catch (error) {}
  };

  const placeOrder = async () => {
    try {
      if (validateEmail()) {
        const payload = {
          product_id: productId,
          size_id: selectedSize,
          color_id: selectedColor,
          email: email,
          coupon_used: couponDetails?.id || null,
          price:
            productDetails?.price -
              (productDetails?.price * couponDetails?.discount) / 100 ||
            productDetails?.price,
        };
        const data = await makeOrder(payload);
        console.log(data?.data?.msg);
        SuccessAlert({ title: data?.data?.msg });
        navigate("/product");
      }
    } catch (error) {}
  };

  const validateEmail = () => {
    if (email.trim() === "") {
      setEmailError("Enter email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter valid email address");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (productId) getSizes();
  }, [productId]);

  useEffect(() => {
    if (selectedSize) getColorBySize();
  }, [productId, selectedSize]);

  useEffect(() => {
    if (selectedSize && selectedColor) getProductDetails();
  }, [productId, selectedSize, selectedColor]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div class="bg-gradient-to-r from-indigo-500 to-violet-500 text-white p-8 rounded-lg shadow-lg details-cart">
        {productDetails && (
          <div class="text-3xl font-bold mb-4">
            {productDetails?.price_product_details?.name}
          </div>
        )}

        {productDetails && (
          <div class="text-3xl font-bold mb-4 flex items-center">
            <p className="mr-2">Price:</p>
            {productDetails?.price}
          </div>
        )}

        {couponDetails && (
          <div class="text-3xl font-bold mb-4 flex items-center">
            <p className="mr-2">Discounted Price:</p>
            {productDetails?.price -
              (productDetails?.price * couponDetails?.discount) / 100}
          </div>
        )}

        {sizes && sizes.length > 0 && (
          <div className="mb-4">
            <p className="font-bold text-2xl mb-4">Select Size</p>
            <div className="flex items-center">
              {sizes.map((ele, idx) => {
                return (
                  <div
                    className={`size cursor-pointer mr-2 ${
                      selectedSize === ele.size_id ? "active" : ""
                    }`}
                    onClick={() => handleSizeChange(ele.size_id)}
                  >
                    <p>{ele?.price_size_details?.size}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {colors && colors.length > 0 && (
          <div className="mb-4">
            <p className="font-bold text-2xl mb-4">Select Color</p>
            <div className="flex items-center mt-4">
              {colors.map((ele, idx) => (
                <div
                  className={`size cursor-pointer mr-2  ${
                    selectedColor === ele?.color_id ? "active-color" : ""
                  }`}
                  key={idx}
                  style={{
                    backgroundColor: ele.price_color_details.color_code,
                  }}
                  onClick={() => handleColorChange(ele.color_id)}
                ></div>
              ))}
            </div>
          </div>
        )}

        <div className="">
          <p>Enter Email Address:</p>
          <input
            className="bg-white text-gray-800 rounded-lg px-4 py-2 w-full font-semibold text-2xl"
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />
          <p className="text-red-600 text-lg">{emailError}</p>
        </div>

        <div className="text-base mb-4">Use coupon code:</div>
        <div className="bg-white text-gray-800 rounded-lg px-4 py-2 flex items-center justify-between">
          <input
            className="text-2xl font-semibold w-full"
            type="text"
            placeholder="write code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            onClick={() => validateCoupon()}
            className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply
          </button>
        </div>

        <p className="text-red-600 text-lg">{couponErrorMessage}</p>
        <div className="mt-5">
          <button
            onClick={() => placeOrder()}
            className="bg-blue-800 text-white px-3 py-1 rounded
            focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
