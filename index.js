//Enable module aliasing to allow easier requires
require('module-alias/register');
require('dotenv').load();

const express = require('express');
const routes = require('./routes');
const app = express();

app.use('/', routes);

app.listen(
    3000,
    () => console.log('Example app listening on port 3000!')
);