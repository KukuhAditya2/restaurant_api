import orderProductService from "../service/order-Product-service.js";

export const orderProducts = async (req, res, next) => {
  try {
    const request = req.body;
    const userAuth = req.userId;
    const result = await orderProductService.orderProduct(request, userAuth);
    res.status(200).json({
      message: "Success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const paid = async (req, res, next) => {
  try {
    const totalPaid = req.body;
    const orderId = req.params.orderId;
    const result = await orderProductService.paid(totalPaid, orderId);
    res.status(200).json({
      message: "Success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrder = async (req, res, next) => {
  try {
    const request = {
      page: req.query.page,
      take: req.query.take,
      name: req.query.name,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    const result = await orderProductService.getAllOrder(request);
    res.status(200).json({
      Message: "Successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const result = await orderProductService.getOrderById(orderId);
    res.status(200).json({
      Message: "OK",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updatedOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const request = req.body;
    const result = await orderProductService.updatedOrder(request, orderId);
    res.status(200).json({
      message: "Updated Successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deletedOrderProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const orderId = req.params.orderId;
    const result = await orderProductService.deletedOrderProduct(
      productId,
      orderId
    );
    res.status(200).json({
      Message: "Deleted Success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const addNewProductsOrders = async (req, res, next) => {
  try {
    const request = req.body;
    const orderId = req.params.orderId;
    const result = await orderProductService.addNewProductsOrders(
      request,
      orderId
    );
    res.status(200).json({
      Message: "Success Add New Order Products",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deletedOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    await orderProductService.deletedOrder(orderId);
    res.status(200).json({
      Message: "Deleted Successfully"
    });
  } catch (error) {
    next(error);
  }
};
