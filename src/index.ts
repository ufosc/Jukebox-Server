/**
 * @fileoverview Entry point of the application.
 */
import mongoose from "mongoose";
import server from "./server";
import { initializeSwagger } from "./docs/swagger";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";
import config from "./config";

// const env = process.env;
const port = config.PORT
const host = config.HOST
const MONGO_URI = config.MONGO_URI
const BASE_ROUTE = config.BASE_ROUTE

mongoose
  .connect(MONGO_URI || "")
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:");
    console.log(err);
  });
  
initializeSwagger().then(() => {
  const swaggerDocument = require("./docs/swagger_output.json");
  server.use(BASE_ROUTE + "/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
});

server.listen(port, () => {
  console.log(`Listening on http://${host == "127.0.0.1" ? "localhost" : host}:${port}`);
});
