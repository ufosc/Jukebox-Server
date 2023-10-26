import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import mainRoutes from "./routes";
import { initializeSwagger } from "./docs/swagger";

const server = express();

server.use(cookieParser());
server.use(mainRoutes);

initializeSwagger().then(() => {
  const swaggerDocument = require("./docs/swagger_output.json");
  server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
});

export default server;
