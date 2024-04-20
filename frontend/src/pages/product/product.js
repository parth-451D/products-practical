import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const getAllProductsData = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.data.result);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProductsData();
  }, []);
  return (
    <>
      <div class="h-screen flex items-center justify-center flex-col">
        <h1 className="text-center text-3xl font-extrabold mb-4">
          Product Listing
        </h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {products &&
            products.length > 0 &&
            products.map((ele, idx) => {
              return (
                <div
                  key={idx}
                  class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 "
                >
                  <div
                    class="max-w-sm p-4 border border-gray-200 rounded-lg shadow bg-main 
                    dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center bg-grey cursor-pointer"
                    onClick={() =>
                      navigate("/product-details", {
                        state: { productId: ele.id },
                      })
                    }
                  >
                    <h5 class="text-2xl font-bold tracking-tight text-white">
                      {ele.name}
                    </h5>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Product;
