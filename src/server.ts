import express from "express";
import cookieParser from "cookie-parser";

import mainRoutes from "./routes";

const server = express();

server.use(cookieParser());

const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

server.use(urlencodedParser);
server.use(jsonParser);

server.use(mainRoutes);

export default server;
