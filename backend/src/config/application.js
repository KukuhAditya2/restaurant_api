import * as dotenv from "dotenv";
import express from "express";
import MySqlStore from "express-mysql-session";
import bodyParser from "body-parser";
import errorMiddleware from "../middleware/errorMiddleware.js";
import router from "../routes/user-router.js";
import routCategory from "../routes/category-router.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import authUser from "../routes/auth-router.js";
import productRouter from "../routes/product-router.js";
dotenv.config();
const mySqlStore = MySqlStore(session);

export const app = express();

app.use(cookieParser());

const options = {
  host: process.env.host,
  user: process.env.port,
  database: process.env.database,
  charset: "utf8mb4"
};

const sessionStore = new mySqlStore(options);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto"
    },
    store: sessionStore
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(router);
app.use(routCategory);
app.use(productRouter);
app.use(authUser);

app.use(errorMiddleware);
