import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

import connectMongoDB from "./config/db";
import authRouter from "./routers/auth";
import productRouter from "./routers/product";
import sizeRouter from "./routers/size";
import colorRouter from "./routers/color";
import categorySizeRouter from "./routers/category-size";
import categoryRouter from "./routers/category";
import cartRouter from "./routers/cart";
import orderRouter from "./routers/order";
import attribute from "./routers/attribute";
import imagesRouter from "./routers/images";
import momoRouter from "./routers/momo";
import zaloPayRouter from "./routers/zalopay";

const app = express();
dotenv.config();
// middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// connect db

const dbURL = process.env.DB_URI
connectMongoDB(dbURL);
// mongodb+srv://vinsomatem97:vinsomatem97@mlb.jo6kt.mongodb.net/?retryWrites=true&w=majority&appName=MLB
// routers
app.use("/api", authRouter);
app.use("/api", productRouter);
app.use("/api", sizeRouter);
app.use("/api", colorRouter);
app.use("/api", categorySizeRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", attribute);
app.use("/images", imagesRouter);
app.use("/api", momoRouter);
app.use("/api", zaloPayRouter);


export const viteNodeApp = app;
