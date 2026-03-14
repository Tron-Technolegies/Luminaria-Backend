import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import errorHandleMiddleware from "./middlewares/errorHandlingMiddleware.js";

import rewardSystemRouter from "./routers/rewardSystemRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "https://intermine-solutions.de",
        "https://adminapp.intermine-solutions.de",
        "https://app.intermine-solutions.de",
        "https://api.dahabminers.com",
        "http://localhost:5173",
        "http://localhost:4000",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.get("/api/v1/dummy", (req, res) => {
  res.json({ message: "Welcome to Luminaira" });
});

app.use("/api/v1/reward-system", rewardSystemRouter);

app.use("/*path", (req, res) => {
  res.status(404).json({ message: "Not Found in Server" });
});

app.use(errorHandleMiddleware);

const port = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Database connected successfully`);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
