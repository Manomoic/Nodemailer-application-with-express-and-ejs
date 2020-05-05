'use strict';

const express = require('express');
const path = require('path');
const body_parser = require('body-parser');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

const port = process.env.PORT;

app.use('/', require('./route/route'));

app.listen(port, () => console.log(`Port ${port} Is Active!`));