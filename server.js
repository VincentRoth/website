#!/usr/bin/env node

var $http = require('http');
var $express = require('express');

var serverPort = 3000;
var app = $express();
app.use($express.static('dist/fr'));
app.use('/en', $express.static('dist/en'));

var server = $http.Server(app);
server.listen(serverPort);