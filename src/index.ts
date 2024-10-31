import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT || 5000;
import cors from "cors";
import compression from "compression";
import listEndpoints from "express-list-endpoints";
import { connectDB } from "./config/db";
const cookieParser = require("cookie-parser");
//routers
import authRouter from "./router/authRouter";
import fileuploadRouter from "./router/fileuploadRouter";
import userRouter from "./router/userRouter";

// Enable CORS for all origins
app.use(cors());

// Enable Gzip compression for all routes
app.use(compression());

// JSON body parsing
app.use(express.json());

//cookie parser
app.use(cookieParser());

//routers
app.use("/auth", authRouter);
app.use("/get-signed-url", fileuploadRouter);
app.use("/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  // Print all routes to the console
  console.log(listEndpoints(app));
  res.send("Cultureco Backend Online! 🚀");
});

app.listen(PORT, async () => {
  // Connect to DB
  connectDB();
  // start the server
  console.log(`✅ Server is running on http://localhost:${PORT} ✅`);
});
