(function( $ ){
$.fn.calenderFun = function( options ) { 
	var defaults = {
      	'minYear'     : '2000',//年最小值
        'maxYear'     : '2100',//年最大值
      	'dateFormat'  : 'yyyy-mm-dd',  // yyyy-mm || yyyy-mm-dd
      	'callBackFun' : function (data){}//返回值
    };
    if(options){ 
        $.extend( defaults, options );
    }
	//设置默认值为当前日期
	var minYear = defaults.minYear;
	var maxYear = defaults.maxYear;
	var valueFun = defaults.callBackFun;
	var myDate = new Date();
	var yearText= myDate.getFullYear();
	var monthText= myDate.getMonth()+1;
	var dayText= myDate.getDate();
	var yearStart = parseInt(yearText) - minYear + 1;
	var monthStart = parseInt(monthText);
	var dayStart = parseInt(dayText);
/**************************************初始化iscroll***************************************************************************/
	function loaded () {
		//初始化年iscroll
		var myScrollYear = new iScroll('wrapperYear', { 
			hScrollbar: false,
			vScrollbar: false,
			hideScrollbar: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			bounce: false,//
			fixedScrollbar: true,
			onScrollStart: function (){
				myScrollYear.scrollEnd = false;
			},
			onScrollEnd:function(data){
				chooseDateYear(data, myScrollYear);
				addDayList();
			}
		});
		//滚动条定位到年开始位置
		myScrollYear.scrollToElement('#year li:nth-child('+yearStart+')',10);
		//初始化月iscroll
		var myScrollMonth = new iScroll('wrapperMonth', { 
			hScrollbar: false,
			vScrollbar: false,
			hideScrollbar: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			bounce: false,
			fixedScrollbar: true,
			onScrollStart: function (){
				myScrollMonth.scrollEnd = false;
			},
			onScrollEnd:function(data){
				chooseDateMonth(data,myScrollMonth);
				addDayList();
			}
		});
		//滚动条定位到月开始位置
		myScrollMonth.scrollToElement('#month li:nth-child('+monthStart+')',10);
		//初始化天iscroll
		var myScrollDay = new iScroll('wrapperDay', { 
			hScrollbar: false,
			vScrollbar: false,
			hideScrollbar: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			bounce: false,
			fixedScrollbar: true,
			onScrollStart: function (){
				myScrollDay.scrollEnd = false;
			},
			onScrollEnd:function(data){
				chooseDateDay(data,myScrollDay);
				// addDayList();
			}
		});
		//滚动条定位到日开始位置
		myScrollDay.scrollToElement('#day li:nth-child('+dayStart+')',10);
	}
/********************************************初始化iscroll结束******************************************************************/

	var yearList,monthList,dayList;

	if(!$('#mask_div').length){
		$('body').append('<div id="mask_div"></div>');
	};

	$('#mask_div').empty();
	//日期自定义结构
	var calenderDiv = '<div id="calender_content">';
		//header
        calenderDiv += '<div id="calender_header"><input id="cancle" type="button" value="关闭">日期选择<input id="submit" type="button" value="确定"></div>';
        //yyyy--mm--dd
        calenderDiv += '<div id="calender_list"><div id="wrapperYear"><div id = "scrollYear"><ul id="year"></ul></div></div><div id="wrapperMonth"><div id = "scrollMonth"><ul id="month"></ul></div></div><div id="wrapperDay"><div id = "scrollDay"><ul id="day"></ul></div></div>';
        //标尺
        calenderDiv += '<p id="currentdate"><span class="arrow_left"></span><span class="arrow_right"></span></p></div></div>';

	$('#mask_div').append(calenderDiv);

	//显示yyyy-mm 隐藏dd
	if( defaults.dateFormat.length < 10 ) {
		$('#wrapperDay').hide();
		$('#wrapperMonth, #wrapperYear').width('50%');
		$('#wrapperMonth').css('left','50%');
	}
	//年
    for(var i = minYear; i <= maxYear; i++) {
    	yearList = '<li>'+i+'年</li>';
    	$('#year').append(yearList);
    }
    //月
    for(var j = 1; j <= 12; j++) {
    	monthList = '<li>'+j+'月</li>';
    	$('#month').append(monthList);
	}
	// //月    2016.10.22  wuwei
 //    for(var m = 11; m > 0; m--) {
 //    	monthLists = '<li>'+m+'月</li>';
 //    	$('#month').append(monthLists);
	// }
    //日
    for(var k = 1; k <= 31; k++) {
		dayList = '<li>'+k+'日</li>';
		$('#day').append(dayList);
    }
    //添加空白li
    $('#calender_content ul').prepend('<li></li><li></li>');
    $('#calender_content ul').append('<li></li><li></li>');
    //显示日历面板
	$('#mask_div').show();

	//调用iscroll
	loaded();

	//获取滑动的距离
	function getTransLateY( obj ){
		return parseFloat(obj.css('-webkit-transform').split(',')[5]);
	};
			
	//iscroll停止时设置年停靠位置上下居中
	function chooseDateYear( data,myScrollYear ){
		var objYear = $("#year li");
		if(myScrollYear.scrollEnd){
			return;
		};
		var yearPoTop = getTransLateY($('#scrollYear'));
		yearPoTop = - yearPoTop;
		var yearCurrent = Math.round((yearPoTop + 84.5)/36); 
		var currentPo = parseFloat((yearPoTop + 84.5)/36)-yearCurrent;
		currentPo = (currentPo-0.35)*36;

		if(!myScrollYear.scrollEnd){
			if (currentPo > 0) {
				myScrollYear.scrollTo(0,currentPo,1000,true);
				myScrollYear.scrollEnd = true;
			}else {
				myScrollYear.scrollTo(0,-currentPo,1000,true);
				myScrollYear.scrollEnd = true;
			}
			yearTextVal = $(objYear[yearCurrent]).text();
			yearText = parseInt(yearTextVal);
		};					
	};
	//iscroll停止时设置月停靠位置上下居中
	function chooseDateMonth( data,myScrollMonth ){
		var objMonth = $("#month li");
		if(myScrollMonth.scrollEnd){
			return;
		};
		var monthPoTop = getTransLateY($('#scrollMonth'));
		monthPoTop = - monthPoTop;
		var monthCurrent = Math.round((monthPoTop + 84.5)/36); 
		var currentPo = parseFloat((monthPoTop + 84.5)/36)-monthCurrent;
		currentPo = (currentPo-0.35)*36;

		if(!myScrollMonth.scrollEnd){
			if (currentPo > 0) {
				myScrollMonth.scrollTo(0,currentPo,1000,true);
				myScrollMonth.scrollEnd = true;
			}else {
				myScrollMonth.scrollTo(0,-currentPo,1000,true);
				myScrollMonth.scrollEnd = true;
			}
			monthTextVal = $(objMonth[monthCurrent]).text();
			monthText = parseInt(monthTextVal);
		};						
	};
	//iscroll停止时设置日停靠位置上下居中
	function chooseDateDay( data,myScrollDay ){
		var objDay = $("#day li");
		if(myScrollDay.scrollEnd){
			return;
		};
		var dayPoTop = getTransLateY($('#scrollDay'));
		dayPoTop = - dayPoTop;
		var dayCurrent = Math.round((dayPoTop + 84.5)/36); 
		var currentPo = parseFloat((dayPoTop + 84.5)/36)-dayCurrent;
		currentPo = (currentPo-0.35)*36;

		if(!myScrollDay.scrollEnd){
			if (currentPo > 0) {
				myScrollDay.scrollTo(0,currentPo,1000,true);
				myScrollDay.scrollEnd = true;
			}else {
				myScrollDay.scrollTo(0,-currentPo,1000,true);
				myScrollDay.scrollEnd = true;
			}
			dayText = $(objDay[dayCurrent]).text();
			dayText = parseInt(dayText);
		};						
	};

	function numToDuble(num) {
		if(num < 10){
			num = '0' + num;
		};

		return num;
	};

	function addDayList(){
		var yearNumber = parseInt(yearText);
		var monthNumber = parseInt(monthText);

		if((yearNumber%4 == 0 && yearNumber%100 != 0) || yearNumber%400 == 0) {
			// 闰年
			if(monthNumber == 2){
				$('#day').empty();
		 	    for(var k = 1; k <= 29; k++) {
			    	dayList = '<li>'+k+'日</li>';
			    	$('#day').append(dayList);
		 	    }
		 	    $('#day').prepend('<li></li><li></li>');
				$('#day').append('<li></li><li></li>');
			};
		}else {
			// 平年
			if(monthNumber == 2){
				$('#day').empty();
				for(var k = 1; k <= 28; k++) {
			    	dayList = '<li>'+k+'日</li>';
			    	$('#day').append(dayList);
		 	    }
		 	    $('#day').prepend('<li></li><li></li>');
				$('#day').append('<li></li><li></li>');
			};
		};
		if((monthNumber <= 7 && monthNumber != 2 && monthNumber%2 == 0) || (monthNumber >= 8 && monthNumber%2 == 1)) {
			$('#day').empty();
			for(var k = 1; k <= 30; k++) {
	    		dayList = '<li>'+k+'日</li>';
	    		$('#day').append(dayList);
 	    	}
 	    	$('#day').prepend('<li></li><li></li>');
			$('#day').append('<li></li><li></li>');
		}else if(monthNumber != 2){
			$('#day').empty();
			for(var k = 1; k <= 31; k++) {
		    	dayList = '<li>'+k+'日</li>';
		    	$('#day').append(dayList);
	 	    }
	 	    $('#day').prepend('<li></li><li></li>');
			$('#day').append('<li></li><li></li>');
		}	
	}	 	    	
	//关闭
	$('#cancle').on('click', function() {
		setTimeout(function(){//add by dcr 16/12/15 不加延时点击关闭的同时遮罩层下面select选择框也会被触发
			$('#mask_div').hide();
			$('#mask_div').remove();
		},400)
	});
	//确定
	$('#submit').on('click', function() {
		setTimeout(function(){
			$('#mask_div').hide();
			$('#mask_div').remove();
			var data = {
				'yyyy': yearText,
				'mm'  : monthText,
				'dd'  : dayText
			};
			if($.isFunction(valueFun)){
				valueFun(yearText+'-'+numToDuble(monthText)+'-'+numToDuble(dayText));
			}
		}, 400);
	});
	}	
})( jQuery );
