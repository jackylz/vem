/**
 * node app.js
 * for vem
 * lin@2016.01.03
 */

var http = require('http'),
    express = require('express'),
    urltool = require('url'),
    qs = require('querystring');    

function reqEntry(req,res){
    
    if(req.url.substr(0,12) == '/getLocation' ){
    	var loc = ["111","121"];
    	var ele = urltool.parse(req.url,true).query;
    	var userLoc = ele.nowLoc.split(",");

    	console.log(userLoc);
    	getNear(loc,userLoc);
    	res.writeHead(200,{"Content-Type":"application/json"});
    	res.end(JSON.stringify({code:0,near:"JIAO 2 - BISTU"}));
    }

}
function getNear(locA,locB,callback){

	var disX = +locA[0] - +locB[0];
	var disY = +locA[1] - locB[1];
	var disLoc = Math.sqrt(disX*disX + disY*disY);
	console.log((+disLoc).toFixed(2)) ;
}
var s = http.createServer(reqEntry);
s.listen(8080);
