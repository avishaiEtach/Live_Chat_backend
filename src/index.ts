import express from "express";
import mongoose from "mongoose";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { GlobalTypes } from "./types/globalTypes";
import http from "http";
import { connectSockets } from "./socket/socket";

const path = require("path");
require("./db/models");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL ?? "")
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log(error));

const app = express();

const server = http.createServer(app);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")));
} else {
  const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.use(express.json());
app.use(cookieParser());

app.use(process.env.NODE_ENV === "production" ? "/api" : "/", ...routes);

connectSockets(server);

const port = process.env.PORT || 8080;

app.get("/**", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(port, () => {
  console.log(`sever running on http://localhost:${port}`);
});
