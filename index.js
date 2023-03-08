const express = require('express');
require('dotenv').config();

const env   = process.env;
const port  = env.PORT;

const app = express();

app.use('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

