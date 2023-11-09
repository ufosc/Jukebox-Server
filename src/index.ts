/**
 * @fileoverview Entry point of the application.
 */
import mongoose from "mongoose";
import server from "./server";
import { initializeSwagger } from "./docs/swagger";
import swaggerUi from "swagger-ui-express";

const env = process.env;
const port = env.PORT;
const host = env.HOST;

mongoose
  .connect(`mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}`)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:");
    console.log(err);
  });
  
initializeSwagger().then(() => {
  const swaggerDocument = require("./docs/swagger_output.json");
  server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
});

server.listen(port, () => {
  console.log(`Listening on http://${host == "127.0.0.1" ? "localhost" : host}:${port}`);
});
