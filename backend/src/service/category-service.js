import { prismaClient } from "../config/Database.js";
import ResponseError from "../error/error.response.js";

const createCategory = async (request) => {
  const category = await prismaClient.category.count({
    where: {
      name: request.name
    },
    select: {
      name: true
    }
  });

  if (category.name === 1)
    throw new ResponseError(400, "Categories Already Exists");

  return prismaClient.category.create({
    data: {
      name: request.name
    },
    select: {
      uuid: true,
      name: true,
      created_at: true
    }
  });
};

const getCategory = async () => {
  return prismaClient.category.findMany({
    select: {
      uuid: true,
      name: true
    }
  });
};

const getCategoryById = async (categoryId) => {
  const category = await prismaClient.category.findUnique({
    where: {
      uuid: categoryId
    }
  });

  if (!category) throw new ResponseError(400, "Category Not Exist");

  return category;
};

const updateCategory = async (request, categoryId) => {
  const category = await prismaClient.category.findUnique({
    where: {
      uuid: categoryId
    }
  });

  if (!category) throw new ResponseError(400, "Category Not Exist");

  return prismaClient.category.update({
    where: {
      uuid: category.uuid
    },
    data: {
      name: request.name
    },
    select: {
      uuid: true,
      name: true
    }
  });
};

const deleted = async (categoryId) => {
  const category = await prismaClient.category.findUnique({
    where: {
      uuid: categoryId
    }
  });

  if (!category) throw new ResponseError(400, "Category Not Exist");

  return prismaClient.category.delete({
    where: {
      uuid: category.uuid
    }
  });
};

export default {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleted
};
