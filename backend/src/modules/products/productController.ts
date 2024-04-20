import { Request, Response } from "express";
import { ProductUtils } from "./productUtils";
import { Constants } from "../../config/constants";
import { ResponseBuilder } from "../../helpers/responseBuilder";

export class ProductController {
  private productUtils: ProductUtils = new ProductUtils();

  public getAllProducts = async (req: Request, res: Response) => {
    const result = await this.productUtils.getAllProducts();
    if (result.code === Constants.ERROR_CODE) {
      const response = ResponseBuilder.badRequest(result.message);
      return res.status(response.code).json(response);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("PRODUCTS_GET_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getAllSizes = async (req: Request, res: Response) => {
    const result = await this.productUtils.getAvailableSizes(
      +req.params.productId
    );
    if (result.code === Constants.ERROR_CODE) {
      const response = ResponseBuilder.badRequest(result.message);
      return res.status(response.code).json(response);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("PRODUCTS_SIZES_GET_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getAllAvailableColors = async (req: Request, res: Response) => {
    const { productId, sizeId } = req.query;
    const result = await this.productUtils.getAvailableColorsBySize(
      productId,
      sizeId
    );
    if (result.code === Constants.ERROR_CODE) {
      const response = ResponseBuilder.badRequest(result.message);
      return res.status(response.code).json(response);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("PRODUCTS_COLORS_GET_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getProductDetails = async (req: Request, res: Response) => {
    const result = await this.productUtils.getProductDetails(req);
    if (result.code === Constants.ERROR_CODE) {
      const response = ResponseBuilder.badRequest(result.message);
      return res.status(response.code).json(response);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("PRODUCT_DETAILS_FETCH_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getDiscountPercentage = async (req: Request, res: Response) => {
    const response = ResponseBuilder.data(
      { couponDetails: req.couponDetails || null },
      req.t("GET_DISCOUNT_PERCENTAGE")
    );
    return res.status(response.code).json(response);
  };

  public placeOrder = async (req: Request, res: Response) => {
    const result = await this.productUtils.makeOrder(req);
    if (result.code === Constants.ERROR_CODE) {
      const response = ResponseBuilder.badRequest(result.message);
      return res.status(response.code).json(response);
    } else {
      const response = ResponseBuilder.data(result, req.t("ORDER_SUCCESSFULL"));
      return res.status(response.code).json(response);
    }
  };
}
