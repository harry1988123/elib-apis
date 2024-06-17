import express from "express";
import cors from "cors";
import globalErrorHandler from "./config/middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import { config } from "./config/config";
import { loginUser } from "./user/userController";
import bookRouter from "./book/bookRouter";

const app = express();

app.get("/", (req, res, next) => {
    res.json({
        message: "Hello World",
    });
});

app.use(
    cors({
        origin: config.frontendDomain,
    })
);
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//Global error handler
app.use(globalErrorHandler);

export default app;
