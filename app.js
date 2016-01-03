/**
 * node app.js
 * for vem
 * lin@2016.01.03
 */

var http = require('http'),
    express = require('express'),
    qs = require('querystring');    

function reqEntry(req,res){
    console.log('aa');

}
var s = http.createServer(reqEntry);
s.listen(8080);
