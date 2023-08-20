import { prismaClient } from "../config/Database.js";
import ResponseError from "../error/error.response.js";

const getProduct = async (request) => {
  const page = request.page || 1;
  const itemsPerPage = request.take || 10;
  const skip = (page - 1) * itemsPerPage;
  const searchName = request.name;
  const searchPrice = Number(request.price);
  const searchStock = Number(request.stock);

  const filters = [];

  if (searchName) {
    filters.push({
      name: {
        contains: searchName
      }
    });
  }

  if (searchPrice) {
    filters.push({
      price: searchPrice
    });
  }

  if (searchStock) {
    filters.push({
      stock: searchStock
    });
  }

  const result = await prismaClient.product.findMany({
    where: {
      AND: filters
    },
    take: itemsPerPage,
    skip: skip,
    orderBy: {
      name: "asc"
    },
    include: {
      category: true
    }
  });

  const totalItem = await prismaClient.product.count({
    where: {
      AND: filters
    }
  });

  const data = result.map((data) => {
    return {
      uuid: data.uuid,
      sku: data.sku,
      name: data.name,
      stock: data.stock,
      price: data.price,
      category: data.category.name,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  });

  return {
    data,
    pagging: {
      page: page,
      total_item: totalItem,
      total_page: Math.ceil(totalItem / itemsPerPage)
    }
  };
};

const getProductById = async (productId) => {
  const product = await prismaClient.product.findUnique({
    where: {
      uuid: productId
    },
    select: {
      uuid: true,
      sku: true,
      name: true,
      stock: true,
      price: true,
      category: {
        select: {
          uuid: true,
          name: true
        }
      }
    }
  });

  if (!product) throw new ResponseError(404, "Product Not Exist");

  return product;
};

const createProducts = async (request) => {
  const result = request;

  const category = await prismaClient.category.findFirst({
    where: {
      name: result.category
    }
  });

  if (!category) throw new ResponseError(404, "Category Not Found");

  result.category = category.uuid;

  return prismaClient.product.create({
    data: {
      sku: result.sku,
      name: result.name,
      stock: result.stock,
      price: result.price,
      category_id: result.category
    },
    select: {
      uuid: true,
      sku: true,
      name: true,
      stock: true,
      price: true,
      category: {
        select: {
          name: true
        }
      }
    }
  });
};

const updateProduct = async (request, productId) => {
  const product = await prismaClient.product.findUnique({
    where: {
      uuid: productId
    }
  });

  if (!product) throw new ResponseError(404, "Product Not Found");

  let dataUpdated = {};

  if (request.category) {
    const categories = await prismaClient.category.findFirst({
      where: {
        name: request.category
      },
      select: {
        uuid: true
      }
    });
    if (!categories) throw new ResponseError(404, "Category Not Found");

    dataUpdated.category_id = categories.uuid;
  }

  if (request.name) {
    dataUpdated.name = request.name;
  }
  if (request.sku) {
    dataUpdated.sku = request.sku;
  }
  if (request.price) {
    dataUpdated.price = request.price;
  }
  if (request.stock) {
    dataUpdated.stock = request.stock;
  }

  const result = await prismaClient.product.update({
    where: {
      uuid: product.uuid
    },
    data: dataUpdated,
    select: {
      uuid: true,
      sku: true,
      name: true,
      stock: true,
      price: true,
      category: {
        select: {
          name: true
        }
      }
    }
  });

  return {
    uuid: result.uuid,
    sku: result.sku,
    name: result.name,
    stock: result.stock,
    price: result.price,
    category: result.category.name
  };
};

const deletedProduct = async (productId) => {
  const product = await prismaClient.product.findUnique({
    where: {
      uuid: productId
    }
  });

  if (!product) throw new ResponseError(404, "Product Not Found");

  return prismaClient.product.delete({
    where: {
      uuid: product.uuid
    }
  });
};

export default {
  getProduct,
  getProductById,
  createProducts,
  updateProduct,
  deletedProduct
};
