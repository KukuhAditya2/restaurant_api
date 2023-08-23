import ResponseError from "../error/error.response.js";
import { prismaClient } from "../config/Database.js";

// Orders Products
const orderProduct = async (request, userAuth) => {
  const { products, customer } = request;

  const productIds = products.map((product) => product.productId);
  const dbProducts = await prismaClient.product.findMany({
    where: {
      uuid: {
        in: productIds
      }
    }
  });
  const missingProductIds = productIds.filter(
    (productId) => !dbProducts.some((dbProduct) => dbProduct.uuid === productId)
  );

  if (missingProductIds.length > 0) {
    throw new ResponseError(
      400,
      `Product ${missingProductIds.join(", ")} Not Found`
    );
  }

  const totalPrice = dbProducts.reduce((total, dbProduct) => {
    const orderedProduct = products.find(
      (product) => product.productId === dbProduct.uuid
    );
    return total + dbProduct.price * orderedProduct.quantity;
  }, 0);

  const orders = await prismaClient.$transaction(async (transaction) => {
    const orders = await transaction.order.create({
      data: {
        userId: userAuth,
        total_price: totalPrice,
        total_paid: 0,
        total_kembalian: 0,
        tanda_terima: customer,
        orderDetails: {
          create: products.map((product) => ({
            products: {
              connect: {
                uuid: product.productId
              }
            },
            quantity: product.quantity
          }))
        }
      },
      include: {
        orderDetails: {
          select: {
            products: {
              select: {
                uuid: true,
                name: true,
                price: true
              }
            },
            quantity: true
          }
        },
        user: true,
        payment: true,
        OrderHistory: true
      }
    });

    await transaction.orderHistory.create({
      data: {
        orderId: orders.uuid,
        totalKembalian: orders.total_kembalian,
        totalPaid: orders.total_paid,
        totalPrice: orders.total_price
      }
    });

    return orders;
  });

  return {
    uuid: orders.uuid,
    kasir: orders.user.name,
    customer: orders.tanda_terima,
    detailProduct: orders.orderDetails,
    totalPrice: orders.total_price,
    createdAt: orders.created_at,
    updatedAt: orders.updated_at
  };
};

// Pembayaran
const paid = async (request, orderId) => {
  const order = await prismaClient.order.findUnique({
    where: {
      uuid: orderId
    }
  });

  if (!order) throw new ResponseError(404, "Order ID Not Found");

  let totals;

  if (request.paid >= order.total_price) {
    totals = request.paid - order.total_price;
  } else {
    throw new ResponseError(400, "Your money is not enough");
  }

  const payment = await prismaClient.payment.findFirst({
    where: {
      name: request.payment
    }
  });

  if (!payment) throw new ResponseError(404, "Payment Not Found");

  const history = await prismaClient.orderHistory.findUnique({
    where: {
      orderId: order.uuid
    }
  });

  if (history.status === "LUNAS")
    throw new ResponseError(400, "Product Already Payment");

  const result = await prismaClient.order.update({
    where: {
      uuid: order.uuid
    },
    data: {
      total_paid: request.paid,
      total_kembalian: totals,
      paymentId: payment.uuid,
      OrderHistory: {
        update: {
          totalPaid: request.paid,
          totalKembalian: totals,
          status: "LUNAS"
        }
      }
    },
    include: {
      orderDetails: true,
      OrderHistory: true,
      user: true,
      payment: true
    }
  });

  return {
    uuid: result.uuid,
    customer: result.tanda_terima,
    kasir: result.user.name,
    products_details: result.orderDetails,
    total_price: result.total_price,
    total_dibayar: result.total_paid,
    total_kembalian: result.total_kembalian,
    payment: result.payment.name,
    status: result.OrderHistory.status,
    createdAt: result.created_at,
    updatedAt: result.updated_at
  };
};

const getAllOrder = async (request) => {
  const page = request.page || 1;
  const itemsPerPage = request.take || 10;
  const skip = (page - 1) * itemsPerPage;
  const searchQuery = request.name;
  const year = request.year;
  const month = request.month;
  const day = request.day;

  const filters = [];

  if (year) {
    filters.push({
      created_at: {
        gte: new Date(year),
        lte: new Date(Number(year) + 1, 0, 1)
      }
    });
  }
  if (month) {
    filters.push({
      created_at: {
        gte: new Date(year, month - 1),
        lte: new Date(year, month, 1)
      }
    });
  }
  if (day) {
    filters.push({
      created_at: {
        gte: new Date(year, month - 1, day),
        lte: new Date(year, month - 1, Number(day) + 1)
      }
    });
  }

  const result = await prismaClient.order.findMany({
    where: {
      tanda_terima: {
        contains: searchQuery
      },
      AND: filters
    },
    take: itemsPerPage,
    skip: skip,
    orderBy: {
      updated_at: "desc"
    },
    include: {
      user: true,
      orderDetails: {
        select: {
          products: {
            select: {
              uuid: true,
              name: true,
              price: true
            }
          },
          quantity: true
        }
      },
      OrderHistory: true,
      payment: true
    }
  });

  if (!result) throw new ResponseError(404, "Order Not Found");

  const totalItem = await prismaClient.order.count({
    where: {
      AND: filters
    }
  });

  const data = result.map((data) => {
    return {
      uuid: data.uuid,
      customer: data.tanda_terima,
      kasir: data.user.name,
      products_details: data.orderDetails,
      total_price: data.total_price,
      status: data.OrderHistory.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  });

  return {
    data,
    paging: {
      page: page,
      total_item: totalItem,
      total_page: Math.ceil(totalItem / itemsPerPage)
    }
  };
};

const getOrderById = async (orderId) => {
  const result = await prismaClient.order.findUnique({
    where: {
      uuid: orderId
    },
    include: {
      user: true,
      orderDetails: {
        select: {
          products: {
            select: {
              uuid: true,
              name: true,
              price: true
            }
          },
          quantity: true
        }
      },
      OrderHistory: true,
      payment: true
    }
  });

  if (!result) throw new ResponseError(404, "Order ID Not Found");

  return {
    uuid: result.uuid,
    customer: result.tanda_terima,
    kasir: result.user.name,
    products_details: result.orderDetails,
    total_price: result.total_price,
    status: result.OrderHistory.status,
    createdAt: result.created_at,
    updatedAt: result.updated_at
  };
};

const updatedOrder = async (request, orderId) => {
  const product = request;

  const order = await prismaClient.order.findUnique({
    where: {
      uuid: orderId
    },
    include: {
      OrderHistory: true,
      orderDetails: {
        include: {
          products: true
        }
      }
    }
  });

  if (!order) throw new ResponseError(404, "Order ID Not Found");

  if (order.OrderHistory.status === "LUNAS")
    throw new ResponseError(400, "Order Already Payment, Not Can Update");

  const products = await prismaClient.orderDetail.findFirst({
    where: {
      orderId: order.uuid,
      productId: product.productId
    }
  });

  if (!products) throw new ResponseError(404, "Product ID Not Found");

  await prismaClient.orderDetail.updateMany({
    where: {
      orderId: order.uuid,
      productId: product.productId
    },
    data: {
      quantity: product.quantity
    }
  });

  const dataProduct = await prismaClient.orderDetail.findMany({
    where: {
      orderId: order.uuid
    },
    include: {
      products: true,
      orders: true
    }
  });

  let totalPrice = 0;
  for (const data of dataProduct) {
    const productPrice = data.products.price;
    const quantity = data.quantity;
    totalPrice += productPrice * quantity;
  }

  const updated = await prismaClient.order.update({
    where: {
      uuid: order.uuid
    },
    data: {
      total_price: totalPrice,
      OrderHistory: {
        update: {
          totalPrice: totalPrice
        }
      }
    },
    include: {
      OrderHistory: true,
      user: true,
      orderDetails: {
        select: {
          products: {
            select: {
              uuid: true,
              name: true,
              price: true
            }
          },
          quantity: true
        }
      },
      payment: true
    }
  });

  return {
    uuid: updated.uuid,
    customer: updated.tanda_terima,
    kasir: updated.user.name,
    products_details: updated.orderDetails,
    total_price: updated.total_price,
    status: updated.OrderHistory.status,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at
  };
};

const deletedOrderProduct = async (productId, orderId) => {
  const order = await prismaClient.order.findUnique({
    where: {
      uuid: orderId
    },
    include: {
      OrderHistory: true,
      orderDetails: {
        where: {
          productId: productId
        }
      }
    }
  });

  if (!order) throw new ResponseError(404, "Order ID Not Found");
  if (!order.orderDetails || order.orderDetails.length === 0)
    throw new ResponseError(404, "Product ID Not Found");
  if (order.OrderHistory.status === "LUNAS")
    throw new ResponseError(400, "Product Already Payment Not Have Deleted");

  await prismaClient.orderDetail.deleteMany({
    where: {
      orderId: order.uuid,
      productId: productId
    }
  });

  const dataProduct = await prismaClient.orderDetail.findMany({
    where: {
      orderId: order.uuid
    },
    include: {
      products: true,
      orders: true
    }
  });

  let totalPrice = 0;
  for (const data of dataProduct) {
    const productPrice = data.products.price;
    const quantity = data.quantity;
    totalPrice += productPrice * quantity;
  }

  const updated = await prismaClient.order.update({
    where: {
      uuid: order.uuid
    },
    data: {
      total_price: totalPrice,
      OrderHistory: {
        update: {
          totalPrice: totalPrice
        }
      }
    },
    include: {
      OrderHistory: true,
      user: true,
      orderDetails: {
        select: {
          products: {
            select: {
              uuid: true,
              name: true,
              price: true
            }
          },
          quantity: true
        }
      },
      payment: true
    }
  });

  return {
    uuid: updated.uuid,
    customer: updated.tanda_terima,
    kasir: updated.user.name,
    products_details: updated.orderDetails,
    total_price: updated.total_price,
    status: updated.OrderHistory.status,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at
  };
};

// Add New Product In Order

const addNewProductsOrders = async (request, orderId) => {
  const products = request.products;

  const ordersId = await prismaClient.order.findUnique({
    where: {
      uuid: orderId
    },
    include: {
      OrderHistory: true
    }
  });

  if (!ordersId) throw new ResponseError(404, "Order ID Not Found");
  if (ordersId.OrderHistory.status === "LUNAS")
    throw new ResponseError(400, "Order Already Payment Not Add New Products");

  const productsId = products.map((data) => data.productId);

  const dbProduct = await prismaClient.product.findMany({
    where: {
      uuid: {
        in: productsId
      }
    }
  });

  const missingProduct = productsId.filter(
    (productId) => !dbProduct.some((dbProduct) => dbProduct.uuid === productId)
  );

  if (missingProduct.length > 0) {
    throw new ResponseError(
      400,
      `Product ${missingProduct.join(" || ")} Not Found`
    );
  }

  const orders = await prismaClient.order.update({
    where: {
      uuid: ordersId.uuid
    },
    data: {
      orderDetails: {
        create: products.map((data) => ({
          products: {
            connect: {
              uuid: data.productId
            }
          },
          quantity: data.quantity
        }))
      }
    }
  });

  const product = await prismaClient.orderDetail.findMany({
    where: {
      orderId: orders.uuid
    },
    include: {
      products: true,
      orders: true
    }
  });

  let totalPrice = 0;
  for (const data of product) {
    const price = data.products.price;
    const quantity = data.quantity;
    totalPrice += price * quantity;
  }

  const result = await prismaClient.order.update({
    where: {
      uuid: orders.uuid
    },
    data: {
      total_price: totalPrice,
      OrderHistory: {
        update: {
          totalPrice: totalPrice
        }
      }
    },
    include: {
      orderDetails: {
        select: {
          products: {
            select: {
              uuid: true,
              name: true,
              price: true
            }
          },
          quantity: true
        }
      },
      user: true,
      OrderHistory: true,
      payment: true
    }
  });

  return {
    uuid: result.uuid,
    customer: result.tanda_terima,
    kasir: result.user.name,
    products_details: result.orderDetails,
    total_price: result.total_price,
    status: result.OrderHistory.status,
    createdAt: result.created_at,
    updatedAt: result.updated_at
  };
};

const deletedOrder = async (orderId) => {
  const order = await prismaClient.order.findUnique({
    where: {
      uuid: orderId
    },
    include: {
      orderDetails: true,
      OrderHistory: true,
      user: true
    }
  });

  if (!order) throw new ResponseError(404, "Order ID Not Found");

  if (order.OrderHistory.status === "LUNAS" && order.user.role === "kasir")
    throw new ResponseError(400, "Already Payment Not Have Deleted");

  await prismaClient.$transaction(async (transaction) => {
    await transaction.orderHistory.deleteMany({
      where: {
        orderId: orderId
      }
    });

    await transaction.orderDetail.deleteMany({
      where: {
        orderId: orderId
      }
    });

    await transaction.order.deleteMany({
      where: {
        uuid: orderId
      }
    });
  });
};

export default {
  orderProduct,
  paid,
  getAllOrder,
  getOrderById,
  updatedOrder,
  deletedOrderProduct,
  addNewProductsOrders,
  deletedOrder
};
