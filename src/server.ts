const express = require("express");
var cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const mainRoutes = require("./routes/routes");
require("dotenv").config();

const env = process.env;
const port = env.PORT;
const host = env.HOST;

import { Pool } from "pg";
const pool = new Pool({
    host: env.DB_HOST,
    user: env.DB_USER,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
});

const connectDB = async () => {
    try {
        await pool.connect();
    } catch (err) {
        console.log("Error connecting to database in index.js:");
        console.log(err);
    }
};
connectDB();

const app = express();

app.use(cookieParser());

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(mainRoutes);

app.listen(port, () => {
    console.log(`Listening on http://${host == "127.0.0.1" ? "localhost" : host}:${port}`);
});
