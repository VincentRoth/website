#!/usr/bin/env node

const $http = require("http");
const $express = require("express");

const serverPort = 3000;
const app = $express();
app.use($express.static("dist/fr"));
app.use("/en", $express.static("dist/en"));
app.use("/assets", $express.static("dist/assets"));

const server = $http.Server(app);
server.listen(serverPort);
