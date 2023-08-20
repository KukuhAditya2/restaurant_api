import { prismaClient } from "../config/Database.js";
import argon2 from "argon2";
import ResponseError from "../error/error.response.js";

// GET ALL USER

const getAllUser = async (request) => {
  const searchName = request.name;
  const searchEmail = request.email;

  const filters = [];
  if (searchEmail) {
    filters.push({
      email: {
        contains: searchEmail
      }
    });
  }
  if (searchName) {
    filters.push({
      name: {
        contains: searchName
      }
    });
  }

  return prismaClient.user.findMany({
    where: {
      AND: filters
    },
    select: {
      uuid: true,
      name: true,
      email: true,
      role: true
    }
  });
};

// Get User By ID
const getUserById = async (userId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      uuid: userId
    },
    select: {
      uuid: true,
      name: true,
      email: true,
      role: true
    }
  });

  if (!user) throw new ResponseError(404, "User Not Found");

  return user;
};

// CREATE USER

const createUser = async (req) => {
  const { name, email, password, confirmPassword, role } = req;

  if (password !== confirmPassword)
    throw new ResponseError(400, "Password And Confirm Password Not Match");

  const user = await prismaClient.user.count({
    where: {
      email: email
    },
    select: {
      email: true
    }
  });

  if (user.email === 1) throw new ResponseError(400, "Email Already Exists");

  const hashPassword = await argon2.hash(password);

  return prismaClient.user.create({
    data: {
      name: name,
      email: email,
      password: hashPassword,
      role: role
    },
    select: {
      uuid: true,
      name: true,
      email: true,
      role: true,
      created_at: true
    }
  });
};

const updateUser = async (request, userId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      uuid: userId
    }
  });

  if (!user) throw new ResponseError(404, "User Not Found");

  const { name, password, confirmPassword, role } = request;

  if (password !== confirmPassword)
    throw new ResponseError(400, "Password And Confirm Password Not Match");

  let data = {};

  if (role) {
    data.role = role;
  }

  if (name) {
    data.name = name;
  }
  if (password) {
    data.password = await argon2.hash(password);
  }

  return prismaClient.user.update({
    where: {
      uuid: userId
    },
    data: data,
    select: {
      uuid: true,
      name: true,
      email: true,
      role: true
    }
  });
};

const deleteUser = async (userId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      uuid: userId
    },
    select: {
      uuid: true
    }
  });

  if (!user) throw new ResponseError(404, "User Not Found");

  return prismaClient.user.delete({
    where: {
      uuid: user.uuid
    }
  });
};

export default {
  getAllUser,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
