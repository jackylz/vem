;(function($){
	$.extend({
	    toast: function(_text, callback, time) {
	        $(".toast").remove();
	        $("body").append("<div class='toast'><p>" + _text + "</p></div>");
	        return setTimeout(function() {
	            $(".toast").remove();
	            if (callback) {
	                return callback();
	            }
	        }, time || 4000);
	    }
	});
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
	    		vem.checkGood();
	    		vem.updateBill()
	    	},

	    	getLocation:function(){
	    		var nowLoc = "";
	    		if(navigator.geolocation){
        			navigator.geolocation.getCurrentPosition(function (position) {
        				var lat = position.coords.latitude;
            			var lon = position.coords.longitude;
            			console.log(lat+","+lon);
            			nowLoc = lat.toFixed(8) + "," + lon.toFixed(8);
            			$.ajax({
			    			url:"http://www.dormstore.cn/getLocation",
			    			type:"get",
			    			dataType:"json",
			    			data:{
			    				nowLoc:nowLoc
			    			},
			    			success:function(r){
			    				console.log(r);
			    				$('.locate-info').text(r.near);
			    			}
			    		});
        			});
        		}
	    	},

	    	//调整物品选中态以及提交按钮状态
	    	checkGood:function(){
	    		$('.goods-box').on('click',function(){
	    			self = $(this);
	    			if(self.hasClass('checked')){
	    				self.find('.icon-checked').remove();
	    				self.removeClass('checked');
	    			}else if(!self.hasClass('checked')){
	    				$('.goods-box').find('.icon-checked').remove();
						$('.goods-box').removeClass('checked');
	    				self.append("<i class=\"icon-checked\"></i>");
	    				self.addClass('checked');
	    			}
	    			vem.updateBill();
	    		});
	    	},

	    	updateBill:function(){

	    		if($('.checked')[0]){
    				$('.b-buy-btn').addClass('enable')
					.on('click',function(){
						_self = $(this);
						$.toast('发送请求中，请稍侯..');
						_self.removeClass('enable').off('click');
						var gName = $('.checked').data('id');
						var locName = $('.locate-info').text();
						$.ajax({
							url:'http://www.dormstore.cn/submitBill',
							type:'post',
							dataType:'json',
							data:{
								gName:gName,
								locName:locName
							},
							success:function(r){
								if(r.code == '0'){
									$.toast('请求成功！');
									$('.goods-box').find('.icon-checked').remove();
									$('.goods-box').removeClass('checked');
									vem.updateBill();
								}else{
									$.toast('请求失败！');
									$('.goods-box').find('.icon-checked').remove();
									$('.goods-box').removeClass('checked');
									vem.updateBill();
								}
							}
						});
						
					})
    			}else{
    				$('.b-buy-btn').removeClass('enable')
    				.off('click')
    			}
	    	}			
	    }
	});
})(jQuery);