import axios from "axios";

export const getAllProducts = async () => {
  return await axios.get(`${process.env.REACT_APP_BASE_URL}/products`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getAllSizesByProduct = async (productId) => {
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL}/products/sizes/${productId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getAllColorBySizeId = async (productId, sizeId) => {
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL}/products/colors?productId=${productId}&sizeId=${sizeId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getPoductDetailById = async (productId, sizeId, colorId) => {
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL}/products/${productId}?sizeId=${sizeId}&colorId=${colorId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const applyCoupon = async (data) => {
  return await axios.post(
    `${process.env.REACT_APP_BASE_URL}/products/check-coupon`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const makeOrder = async (data) => {
  return await axios.post(
    `${process.env.REACT_APP_BASE_URL}/products/order`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
