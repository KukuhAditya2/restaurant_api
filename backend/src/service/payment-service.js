import { prismaClient } from "../config/Database.js";
import ResponseError from "../error/error.response.js";

const createPayment = async (request) => {
  return prismaClient.payment.create({
    data: {
      name: request.name,
      type: request.type
    }
  });
};

const getPayment = async () => {
  return prismaClient.payment.findMany();
};

const getPaymentById = async (paymentId) => {
  const payment = await prismaClient.payment.findUnique({
    where: {
      uuid: paymentId
    }
  });

  if (!payment) throw new ResponseError(404, "Payment Not Found");

  return payment;
};

const updatedPayment = async (request, paymentId) => {
  const payment = await prismaClient.payment.findUnique({
    where: {
      uuid: paymentId
    }
  });

  if (!payment) throw new ResponseError(404, "Payment Not Found");

  return prismaClient.payment.update({
    where: {
      uuid: payment.uuid
    },
    data: {
      name: request.name,
      type: request.type
    }
  });
};

const deletedPayment = async (paymentId) => {
  const payment = await prismaClient.payment.findUnique({
    where: {
      uuid: paymentId
    }
  });

  if (!payment) throw new ResponseError(404, "Payment Not Found");

  return prismaClient.payment.delete({
    where: {
      uuid: payment.uuid
    }
  });
};

export default {
  createPayment,
  getPayment,
  getPaymentById,
  updatedPayment,
  deletedPayment
};
