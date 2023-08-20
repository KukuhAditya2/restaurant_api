import paymentService from "../service/payment-service.js";

export const createPayment = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await paymentService.createPayment(request);
    res.status(200).json({
      message: "Success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req, res, next) => {
  try {
    const result = await paymentService.getPayment();
    res.status(200).json({
      message: "Succes",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const paymentId = req.params.paymentId;
    const result = await paymentService.getPaymentById(paymentId);
    res.status(200).json({
      message: "Success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updatedPayment = async (req, res, next) => {
  try {
    const paymentId = req.params.paymentId;
    const request = req.body;
    const result = await paymentService.updatedPayment(request, paymentId);
    res.status(200).json({
      message: "Success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deletedPayment = async (req, res, next) => {
  try {
    const paymentId = req.params.paymentId;
    const result = await paymentService.deletedPayment(paymentId);
    res.status(200).json({
      message: "Deleted Success"
    });
  } catch (error) {
    next(error);
  }
};
