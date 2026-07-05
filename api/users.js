const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");

// Util
const connect = require("./util/connect");
const { setTkn, getTkn } = require("./util/authentication");

// Models
const { Client } = require("./models/models");


app.use(express.json());

module.exports = app;
