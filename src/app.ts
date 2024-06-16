import express from "express";
import cors from "cors";
import globalErrorHandler from "./config/middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import { config } from "./config/config";

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

app.use("/api/user", userRouter);

//Global error handler
app.use(globalErrorHandler);

export default app;
