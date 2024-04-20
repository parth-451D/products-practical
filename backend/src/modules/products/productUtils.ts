import { Constants } from "../../config/constants";
import colorModel from "../../models/colors";
import orderModel from "../../models/orders";
import priceMappingModel from "../../models/priceMapping";
import productModel from "../../models/products";
import sizeModel from "../../models/sizes";

export class ProductUtils {
  public getAllProducts = async () => {
    try {
      return await productModel.findAll();
    } catch (error) {
      return { message: error.message, code: Constants.ERROR_CODE };
    }
  };

  public getAvailableSizes = async (productId: number) => {
    try {
      return await priceMappingModel.findAll({
        where: {
          product_id: productId,
        },
        attributes: ["size_id"],
        include: [
          {
            model: sizeModel,
            as: "price_size_details",
            attributes: ["size"],
          },
        ],
        group: ["size_id"],
      });
    } catch (error) {
      return { message: error.message, code: Constants.ERROR_CODE };
    }
  };

  public getAvailableColorsBySize = async (
    productId: number,
    sizeId: number
  ) => {
    try {
      return await priceMappingModel.findAll({
        where: {
          product_id: productId,
          size_id: sizeId,
        },
        attributes: ["color_id"],
        include: [
          {
            model: colorModel,
            as: "price_color_details",
            attributes: ["color", "color_code"],
          },
        ],
        group: ["color_id"],
      });
    } catch (error) {
      return { message: error.message, code: Constants.ERROR_CODE };
    }
  };

  public getProductDetails = async (req: any) => {
    try {
      const { colorId, sizeId } = req.query;
      return await priceMappingModel.findOne({
        where: {
          product_id: req.params.productId,
          color_id: colorId,
          size_id: sizeId,
        },
        include: [
          {
            model: productModel,
            as: "price_product_details",
            attributes: ["id", "name"],
          },
        ],
      });
    } catch (error) {
      return { message: error.message, code: Constants.ERROR_CODE };
    }
  };

  public makeOrder = async (req: any) => {
    try {
      return await orderModel.create(req.body);
    } catch (error) {
      return { message: error.message, code: Constants.ERROR_CODE };
    }
  };
}
