const express = require("express");
const { adminMiddleware, requireSignin } = require("../common-middleware");
const { createProduct, getProductsBySlug, getProductDetailsById } = require("../controller/product");
const router = express.Router();
const multer = require("multer");
const shorid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shorid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
);

router.get("/products/:slug", getProductsBySlug)
router.get("/product/:productId", getProductDetailsById);

module.exports = router;
