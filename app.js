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

var mongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	objectId = require('mongodb').ObjectID,
	dbUrl = 'mongodb://127.0.0.1:27017/vem',
	moment = require('moment');    

function reqEntry(req,res){
    
    //获取定位接口 get
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

    //购买接口 post
    if(req.url.substr(0,11) == '/submitBill'){
    	var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));		
			var gName = param['gName'],
				locName = param['locName'],
				uIp = req.headers['x-forwarded-for'];
			updateTradeInfo(res,gName,locName,uIp);
		});
    }


}

//获取最近售货机名称，地点
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

//将购买信息更新到数据库
function updateTradeInfo(res,gName,locName,uIp){

	var insertDocument = function(db,callback){
		db.collection('bill').insertOne({
			"gName":gName,
			"locName":locName,
			"uIp":uIp,
			"dateTime":moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
		},function(err,r){
			console.log('result',r.result.ok);
			if(r.result.ok == '1'){
				res.writeHead(200,{"Content-Type":"application/json"});
    			res.end(JSON.stringify({code:0}));
			}
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			send_failure(res,500,err);
		}else{
			assert.equal(err,null);
			insertDocument(db);
		}
	});
}

//返回错误信息 code:500
function send_failure(res,code,err){
	var code = (err.code) ? err.code : err.name;
	res.writeHead(code,{"Content-Type":"application/json"});
	res.end(JSON.stringify({error:code,message:err.message}) + "\n");
}

var s = http.createServer(reqEntry);
s.listen(8080);
