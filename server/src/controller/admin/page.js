const Page = require("../../models/page");

exports.createPage = async (req, res) => {
  const { banners, products } = req.files;
  const { category, type } = req.body;
  if (banners && banners.length > 0) {
    req.body.banners = banners.map((banner) => ({
      img: `/${banner.filename}`,
      navigateTo: `/bannerClicked?categoryId=${category}&type=${type}`,
    }));
  }
  if (products && products.length > 0) {
    req.body.products = products.map((product) => ({
      img: `/${product.filename}`,
      navigateTo: `/productClicked?categoryId=${category}&type=${type}`,
    }));
  }
  req.body.createBy = req.user._id;

  Page.findOne({ category }).exec((err, page) => {
    if (err) return res.status(400).json({ err });
    if (page) {
      Page.findOneAndUpdate({ category }, req.body).exec((err, updatedPage) => {
        if (err) return res.status(400).json({ err });
        if (updatedPage) return res.status(201).json({ page: updatedPage });
      });
    } else {
      const page = new Page(req.body);
      page.save((err, newPage) => {
        if (err) return res.status(400).json({ err });
        if (newPage) return res.status(201).json({ page: newPage });
      });
    }
  });
};

exports.getPage = async (req, res) => {
  const { category, type } = req.params;
  if (type === "page") {
    Page.findOne({ category }).exec((err, page) => {
      if (err) return res.status(400).json({ err });
      if (page) return res.json({ page });
    });
  }
};
