import express from "express";
import authControllers from "../controllers/auth-controllers.js";

const authUser = express.Router();

authUser.get("/me", authControllers.me);
authUser.post("/login", authControllers.login);
authUser.delete("/logout", authControllers.logout);

export default authUser;
