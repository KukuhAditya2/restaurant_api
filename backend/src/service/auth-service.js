import { prismaClient } from "../config/Database.js";
import argon2 from "argon2";
import ResponseError from "../error/error.response.js";

const login = async (req) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email: req.body.email
    },
    select: {
      uuid: true,
      name: true,
      email: true,
      password: true,
      role: true
    }
  });

  if (!user) throw new ResponseError(400, "Email Or Password Wrong");

  const matchPassword = await argon2.verify(user.password, req.body.password);

  if (!matchPassword) throw new ResponseError(400, "Email Or Password Wrong");

  req.session.userId = user.uuid;
  const { uuid, name, email, role } = user;
  // const uuid = user.uuid;
  // const name = user.name;
  // const email = user.email;
  // const role = user.role;

  return { uuid, name, email, role };
};

export const me = async (req) => {
  if (!req.session.userId) {
    throw new ResponseError(401, "You Must Login First");
  } else {
    const user = await prismaClient.user.findUnique({
      where: {
        uuid: req.session.userId
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
  }
};

const logout = async (req) => {
  req.session.destroy((err) => {
    if (err) throw new ResponseError(400, "Dont have log'out");
  });
};

export default { login, logout, me };
