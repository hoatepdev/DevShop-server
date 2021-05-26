const Product = require("../models/product");
const slugify = require("slugify");
const Category = require("../models/category");
const product = require("../models/product");

exports.createProduct = (req, res) => {
  const { name, price, description, category, quantity } = req.body;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product, files: req.files });
    }
  });
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug }).then((cate) => {
    if (!cate) return res.status(400).json("Category does not exist");

    Product.find({ category: cate.id }).then((products) => {
      if (!products) return res.status(400).json("Product does not exist");
      res.json({
        products,
        priceRange: {
          under1000: 1000,
          under800: 800,
          under600: 600,
        },
        productsByPrice: {
          under1000: products.filter(
            (product) => product.price > 800 && product.price <= 1000
          ),
          under800: products.filter((product) => product.price > 600 && product.price <= 800),
          under600: products.filter((product) => product.price <=600)
        },
      });
    });
  });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(200).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};
