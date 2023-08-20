import { prismaClient } from "../config/Database.js";

const authMiddleware = async (req, res, next) => {
  if (!req.session.userId)
    return res.status(401).json({ massage: "You Must Login First" });

  const user = await prismaClient.user.findUnique({
    where: {
      uuid: req.session.userId
    },
    select: {
      uuid: true,
      role: true,
      name: true
    }
  });

  if (!user) return res.status(404).json({ massage: "User Not Found" });

  req.userId = user.uuid;
  req.role = user.role;
  req.auth = user;
  next();
};

const adminOnly = async (req, res, next) => {
  const user = await prismaClient.user.findUnique({
    where: {
      uuid: req.session.userId
    },
    select: {
      uuid: true,
      role: true
    }
  });

  if (!user) return res.status(404).json({ massage: "User Not Found" });

  if (user.role !== "admin")
    return res.status(403).json({ massage: "Forbidden Access" });
  next();
};

// const statusLogin = async (req, res, next) => {
//   if(req.session.userId){

//   }
// };

export { authMiddleware, adminOnly };
