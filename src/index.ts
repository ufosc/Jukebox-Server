const express = require('express');
require('dotenv').config();

const env   = process.env;
const port  = env.PORT;
const host  = env.HOST;

import { Pool } from 'pg';
const pool = new Pool({
    host: env.DB_HOST,
    user: env.DB_USER,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432")
});

const connectDB = async() => {
    try {
        await pool.connect();
    } catch(err) {
        console.log("Error connecting to database in index.js:")
        console.log(err);
    }
}
connectDB();


const app = express();

app.use('/', (req: any, res: any) => {
    res.send('<h1>App Works</h1>');
})

// app.on('SIGINT', () => {
//     // do all the cleanup, close connections, etc
//     console.log("closing down...");
// })
module.exports = app.listen(port, () => {
    console.log(`Listening on ${host}:${port}`);
});


