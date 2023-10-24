import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger/swagger_output.json";
import mainRoutes from "./routes";

const server = express();

server.use(cookieParser());

server.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
server.use(mainRoutes);

export default server