var $fs = require('fs');
var $http = require('http');

var $express = require('express');
var $open = require("open");

var serverPort = 3000;
var app = $express();
app.use($express.static('src'));
//app.use('/node_modules', $express.static('node_modules'));

var server = $http.Server(app);
server.listen(serverPort);