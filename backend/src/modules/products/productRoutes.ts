import { Router } from "express";
import { ProductController } from "./productController";
import { ProductMiddleware } from "./productMiddleware";

const router: Router = Router();
const productController: ProductController = new ProductController();
const productMiddleware: ProductMiddleware = new ProductMiddleware();

// get all products
router.get("/", productController.getAllProducts);

// get all sizes of product
router.get("/sizes/:productId", productController.getAllSizes);

// get all color of product
router.get("/colors", productController.getAllAvailableColors);

// get product details
router.get("/:productId", productController.getProductDetails);

// check coupon code
router.post(
  "/check-coupon",
  productMiddleware.validateCoupon,
  productController.getDiscountPercentage
);

// place order
router.post("/order", productController.placeOrder);

export const productRoute: Router = router;
