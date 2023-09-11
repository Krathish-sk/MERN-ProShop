import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc : Get All Products
// @route : GET /api/products
// @access : Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc : Get Single Product
// @route : GET /api/products/:id
// @access : Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create a Product
// @route POST /api/products
// @access Private Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Product Name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Product Brand",
    category: "Product Category",
    countInStock: 0,
    numReviews: 0,
    description: "Product Description",
  });
  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc Update a Product
// @route PUT /api/product/:id
// @access Private Admin
export const updatedProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, image, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.brand = brand;
    product.image = image;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found !!");
  }
});

// @desc Delete a Product
// @route DELETE /api/products/:id
// @access Private Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Product was not found");
  }
});

// @desc Create a Product Review
// @route POST /api/product/:id/review
// @access Registerd Users
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already been reviewd");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).josn({ message: "Review added successfully" });
  } else {
    res.status(404);
    throw new Error("Product was not found");
  }
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});
