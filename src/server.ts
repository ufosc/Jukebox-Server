import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

const swaggerFile = require("./swagger_output.json");
const mainRoutes = require("./routes/routes");
require("dotenv").config();

const env = process.env;
const port = env.PORT;
const host = env.HOST;

// import { Pool } from "pg";
// const pool = new Pool({
//     host: env.DB_HOST,
//     user: env.DB_USER,
//     database: env.DB_NAME,
//     password: env.DB_PASSWORD,
//     port: parseInt(process.env.DB_PORT || "5432"),
// });

// const connectDB = async () => {
//     let connected = false;
//     while (!connected) {
//         setTimeout(() => {
//             try {
//                 pool.connect();
//                 connected = true;
//             } catch (err) {
//                 console.log("Error connecting to database:");
//                 console.log(err);
//                 console.log("Retrying in 1 second...")
//             }
//         }, 1000);
//     }
// };
// connectDB();

const app = express();

app.use(cookieParser());

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(mainRoutes);
// app.use("/", mainRoutes);

app.listen(port, () => {
    console.log(`Listening on http://${host == "127.0.0.1" ? "localhost" : host}:${port}`);
});
