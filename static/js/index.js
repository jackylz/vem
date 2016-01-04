;(function($){

	$(function(){
		function initRem(callback){
	        //适配代码 px->rem
	        var funcRun = false;
	        window.onresize = r;
	        function r(resizeNum){
	            var winW = window.innerWidth;
	            document.getElementsByTagName("html")[0].style.fontSize = winW*0.15625+"px";
	            if(winW > window.screen.width && resizeNum <= 10) {
	                setTimeout(function(){
	                    r(++resizeNum)   
	                }, 100);
	            }
	            else {
	                document.getElementsByTagName("body")[0].style.opacity = 1;
	                if(callback&&!funcRun){
	                    callback();
	                    funcRun = true;
	                } 
	            }
	        }
	        setTimeout(function(){r(0)}, 100);
	    }

	    initRem(function(){
	    	vem.init();
	    })

	    vem = {

	    	init:function(){
	    		vem.getLocation();
	    	},

	    	getLocation:function(){
	    		$.ajax({
	    			url:"http://www.dormstore.cn/getLocation",
	    			type:"get",
	    			dataType:"json",
	    			data:{
	    				nowLoc:"31,111"
	    			},
	    			success:function(r){
	    				console.log(r);
	    				$('.locate-info').text(r.near);
	    			}
	    		});
	    	}
	    }
	});
})(jQuery);