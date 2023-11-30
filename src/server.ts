import express from "express";
import cookieParser from "cookie-parser";

import mainRoutes from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import config from "./config";

const server = express();
/** 
 * @const BASE_ROUTE, string
 * Base URL route for the api. 
 */
// export const BASE_ROUTE = "/api";

server.use(cookieParser());

const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

server.use(urlencodedParser);
server.use(jsonParser);
// server.use(express.bodyParser()); 
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));


server.use(cors());

server.use(config.BASE_ROUTE, mainRoutes);

export default server;
