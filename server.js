import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userController from "./Controller/UserController.js";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("hello world ");
});

app.post("/users", userController.createUser);

app.listen(process.env.PORT, () => {
  console.log(`App listening Port ${process.env.PORT}`);
});
