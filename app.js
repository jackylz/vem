/**
 * node app.js
 * for vem
 * lin@2016.01.03
 */
'use strict'

var http = require('http'),
    express = require('express'),
    urltool = require('url'),
    qs = require('querystring');    

function reqEntry(req,res){
    
    if(req.url.substr(0,12) == '/getLocation' ){
    	var mLoc = {
	    	jiao2 : {
	    		name : "教二大厅",
	    		loc  : ['39.98837981','116.37682346']
	    	},
			jiao3 : {
	    		name : "教三大厅",
	    		loc  : ['39.98842723','116.37680759']
			},
			xue4 : {
	    		name : "学四公寓",
	    		loc  : ['39.98841378','116.37683599']
			}
		};

    	var ele = urltool.parse(req.url,true).query;
    	var userLoc = ele.nowLoc.split(",");

    	console.log("userLoc:",userLoc);
    	var tempNear = getNear(mLoc,userLoc) + "-BISTU";
    	res.writeHead(200,{"Content-Type":"application/json"});
    	res.end(JSON.stringify({code:0,near:tempNear}));
    }

}
function getNear(locA,locB,callback){

	var locArr = [],
		nameArr = [],
		disX = null,
		disY = null,
		disLoc = null;

	Object.keys(locA).forEach(function(n,i){
		console.log(locA[n].loc);
		var t = locA[n].loc;
		var n = locA[n].name;
		disX = +t[0] - +locB[0];
		disY = +t[1] - +locB[1];
		disLoc = Math.sqrt(disX*disX + disY*disY);
		locArr.push(disLoc);
		nameArr.push(n);
	});
	console.log(locArr);
	console.log(nameArr);
	var indexArr = 0;
	for(var i=0;i<locArr.length;i++){
		if(locArr[indexArr]>locArr[i]){
			indexArr = i;
		}
	}
	return nameArr[indexArr];
}
var s = http.createServer(reqEntry);
s.listen(8080);
