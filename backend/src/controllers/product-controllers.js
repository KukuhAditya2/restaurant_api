import productService from "../service/product-service.js";

export const getProduct = async (req, res, next) => {
  try {
    const request = {
      name: req.query.name,
      price: req.query.price,
      stock: req.query.stock,
      page: req.query.page,
      take: req.query.take
    };
    const result = await productService.getProduct(request);
    res.status(200).json({
      status: 200,
      result
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const result = await productService.getProductById(productId);
    res.status(200).json({
      status: 200,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await productService.createProducts(request);
    res.status(200).json({
      status: 200,
      message: "Create Successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const request = req.body;
    const result = await productService.updateProduct(request, productId);
    res.status(200).json({
      status: 200,
      message: "Update Successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deletedProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    await productService.deletedProduct(productId);
    res.status(200).json({
      status: 200,
      message: "Deleted Success"
    });
  } catch (error) {
    next(error);
  }
};
