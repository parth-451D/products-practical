import { NextFunction, Response } from "express";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import couponModel from "../../models/coupons";
import orderModel from "../../models/orders";
import { Constants } from "../../config/constants";

export class ProductMiddleware {
  public async validateCoupon(req: any, res: Response, next: NextFunction) {
    try {
      const { coupon } = req.body;
      if (!coupon) {
        const response = ResponseBuilder.badRequest(req.t("ENTER_COUPON"));
        return res.status(response.code).json(response);
      }
      const couponInDatabase = await couponModel.findOne({
        where: { name: coupon },
      });
      if (!couponInDatabase) {
        const response = ResponseBuilder.badRequest(req.t("COUPON_NOT_FOUND"));
        return res.status(response.code).json(response);
      }
      const productMiddleware = new ProductMiddleware();
      switch (coupon) {
        case "FIRST50":
          await productMiddleware.checkFIRST50Coupon(
            req,
            res,
            next,
            couponInDatabase
          );
          break;
        case "PATRON50":
          await productMiddleware.checkPATRON50Coupon(
            req,
            res,
            next,
            couponInDatabase
          );
          break;
        case "REPEAT80":
          await productMiddleware.checkREPEAT80Coupon(
            req,
            res,
            next,
            couponInDatabase
          );
          break;
        default:
          break;
      }
    } catch (error) {
      const response = ResponseBuilder.errorMessage(error.message);
      return res.status(response.code).json(response);
    }
  }

  public async checkFIRST50Coupon(
    req: any,
    res: Response,
    next: NextFunction,
    couponInDatabase: any
  ) {
    // check is user has used that coupon or not
    const isUsed = await orderModel.findOne({
      where: {
        email: req.body.email,
        coupon_used: couponInDatabase?.dataValues?.id,
      },
    });
    if (isUsed) {
      const response = ResponseBuilder.badRequest(req.t("COUPON_IS_USED"));
      return res.status(response.code).json(response);
    }

    // check if user has any order placed
    const order = await orderModel.count({
      where: { email: req.body.email },
    });
    if (order > Constants.MINIMUM_PURCHASE_FOR_FIRST_COUPON) {
      const response = ResponseBuilder.badRequest(req.t("NOT_ELIGIBLE"));
      return res.status(response.code).json(response);
    }
    req.couponDetails = couponInDatabase;
    next();
  }

  public async checkPATRON50Coupon(
    req: any,
    res: Response,
    next: NextFunction,
    couponInDatabase: any
  ) {
    // check is user has used that coupon or not
    const isUsed = await orderModel.findOne({
      where: {
        email: req.body.email,
        coupon_used: couponInDatabase?.dataValues?.id,
      },
    });
    if (isUsed) {
      const response = ResponseBuilder.badRequest(req.t("COUPON_IS_USED"));
      return res.status(response.code).json(response);
    }
    // check if user has made minimum count for requiring coupon
    const userPurchaseCount = await orderModel.count({
      where: {
        email: req.body.email,
      },
    });
    if (userPurchaseCount < Constants.MINIMUM_PURCHASE_FOR_PATRON_COUPON) {
      const response = ResponseBuilder.badRequest(req.t("NOT_ELIGIBLE"));
      return res.status(response.code).json(response);
    }

    req.couponDetails = couponInDatabase;
    next();
  }

  public async checkREPEAT80Coupon(
    req: any,
    res: Response,
    next: NextFunction,
    couponInDatabase: any
  ) {
    // get last order details for user
    const idRepeatOrder = await orderModel.findOne({
      where: {
        email: req.body.email,
      },
      order: [["createdAt", "DESC"]],
    });
    console.log("idRepeatOrder", idRepeatOrder);
    if (!idRepeatOrder) {
      const response = ResponseBuilder.badRequest(req.t("NOT_ELIGIBLE"));
      return res.status(response.code).json(response);
    }

    const { product_id, size_id, color_id } = idRepeatOrder.dataValues;
    console.log("-----database-----", product_id, size_id, color_id);
    const { productId, sizeId, colorId } = req.body;
    console.log("-----body----", productId, sizeId, colorId);
    if (
      product_id === productId &&
      sizeId === size_id &&
      colorId === color_id
    ) {
      req.couponDetails = couponInDatabase;
      next();
    } else {
      const response = ResponseBuilder.badRequest(req.t("NOT_ELIGIBLE"));
      return res.status(response.code).json(response);
    }
  }
}
