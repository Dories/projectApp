var plugs=(function(){  
	
     function queryProffessionByCondition(jsonStr)
     {
        //通过解析JSON讲条件进行封装
     	if(jsonStr){
     		var jsonObj = eval(jsonStr); 
     		//调用数据库 
     	} 
     } 
     
     //表单值重新设置
     function formValueSetFn($scope,jsBean){ 
     	if(jsBean){
     		for(pop in jsBean){  
     			$scope[pop] = jsBean[pop]; 
     		} 
     	}   
     } 
     
     /**
	 * @功能:获取当前页面的信息
	 * @param {}
	 * @Author:Li Jie
	 * @Date 2014-10-24
	*/ 
     function getPageInfo(){
     	var pageName = document.getElementById("pageName").value;
     	var tableName = document.getElementById("tableName").value;
     	var map = {};
     	map["pageName"] = pageName;
     	map["tableName"] = tableName;
     	return map;
     }
     
      /**
	 * @功能:监听当前有网的状态
	 * @param {}
	 * @Author:Li Jie
	 * @Date 2014-11-7
	*/ 
     window.addEventListener('online', function(){
      	 listenerCurrentNetWork();
     }); 
     
     
      /**
	 * @功能:当有网状态立刻监听,后处理事件
	 * @param  
	 * @Author:Li Jie
	 * @Date 2014-11-7
	*/
     function listenerCurrentNetWork(){
     	//数据同步操作	 
     }
     
     
     /**
	 * @功能:检测当前网络状态
	 * @param {当前有网络返回TRUE 无网络返回FALSE}
	 * @Author:Li Jie
	 * @Date 2014-11-7
	*/ 
     function getNetWorkStaus(){  
     	return  navigator.onLine;  
     }
     
      /**
	 * @功能:PDF文件操作
	 * @param {}
	 * @Author:Li Jie
	 * @Date 2014-10-24
	*/ 
     function doPdfListener(domObj){ 
     	var pdf = new jsPDF('p','pt','a4'); 
        pdf.addHTML(domObj,function() {
	          var data = pdf.output('dataurl'); 
	          window.location.href = data;
        }); 
     }
     
     
      /**
	 * @功能:根据身份证号，设置用户出生日期,年龄,身份正是否有效
	 * @param {}
	 * @Author:Li Jie
	 * @Date 2014-10-24
	*/ 
     function setUserBirthday($scope,idCard,birthdayObj,ageObj,idcardStatus){
     	var birthday = "";
		if(idCard != null && idCard != ""){
			if(idCard.length == 15){
				birthday = "19"+idCard.substr(6,6);
			} else if(idCard.length == 18){
				birthday = idCard.substr(6,8);
			}
		
			birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
		} 
		
		 
		var myDate = new Date(); 
		var month = myDate.getMonth() + 1; 
		var day = myDate.getDate(); 
		var age = myDate.getFullYear() - birthday.substring(0, 4) - 1; 
		if ((birthday.substring(4, 6) < month || birthday.substring(4, 6) == month) && birthday.substring(6, 8) <= day) { 
			age++; 
		}  
		var isEffective = false;
		// if(age > 46){ //国家规定四十六周岁以上发长期有效身份证
		// 	isEffective = true;
		// }
		$scope[idcardStatus] = isEffective;
		$scope[birthdayObj] = birthday;
		$scope[ageObj] = age;
     } 
     
      /**
	 * @功能:模糊搜索匹配(条件,数据集合,多个条件或者单个条件)
	 * @Author:Li Jie
	 * @Date 2014-10-24
	*/ 
     function fuzzySearchByCondition($scope,conditions,dataList){
     	 var returnList = [];  
     	 var enCustomExpress =''; //拼音表达式
     	 var chCustomExpress =''; //汉字表达式
     	 var searchValue = conditions["value"]; //输入的搜索的值
     	 var searchTitleArray  = conditions["title"]; //在那几个标题的情况下搜索
     	 if(!searchTitleArray){ 
     	 	return dataList;
     	 }   
     	 if(dataList != null && dataList.length > 0){
     	 	for(var i = 0; i<dataList.length; i++){ 
		     	 enCustomExpress = '';
		     	 chCustomExpress = '';
     	 		 for(var k = 0; k<searchTitleArray.length; k++){ 
     	 			 var popName = searchTitleArray[k]; 
	 	 	    	 var values = dataList[i][popName]; 
		 	 	     //将汉字转成拼音
		 	 	     var enValues=  ConvertPinyin(values); 
		 	 	     if(k == 0){ 
		 	 	    	chCustomExpress = "\""+values+"\""+".indexOf('"+searchValue+"') != -1"; 
		 	 	    	enCustomExpress = "\""+enValues+"\""+".indexOf('"+searchValue+"') != -1";  
		 	 	     }else{ 
		 	 	     	chCustomExpress  += " || "+ "\""+values+"\""+".indexOf('"+searchValue+"') != -1"; 
		 	 	    	enCustomExpress  += " || "+ "\""+enValues+"\""+".indexOf('"+searchValue+"') != -1";   
		 	 	     } 
     	 		 }  
	 	 		 var returnMap = {};   
	 	 	     var custmerFlag = eval(chCustomExpress);
	 	 	     var enCustmerFlag = eval(enCustomExpress);
	 	 	     if(custmerFlag || enCustmerFlag){  
	 	 	    	returnList.push(dataList[i]);
	 	 	     }
     	 	}
     	 }
     	 return returnList;
     }
     
     /**
	 * @功能:表单清空 
	 * @Author:Li Jie
	 * @Date 2014-10-24
	*/ 
	function clearFormValSet($scope,arrayObj){
		//alert(arrayObj)
		if(arrayObj != null && arrayObj.length > 0){
			for(var i = 0; i<arrayObj.length; i++){
				if(arrayObj[i].indexOf(".") != -1){
					var paraArray = arrayObj[i].split(".");
					$scope[paraArray[0]][paraArray[1]] = null;
				}else{
					$scope[arrayObj[i]] = null;
				}
			}
		}
	}
     
    /**
	 * @功能:将JSON格式映射给表单值
	 * @param
	 * @Author:Li Jie
	 * @Date 2014-11-8
	*/ 
     function setFromValueByJson($scope,json){
     	if(json){
     		for(pop in json){
     			$scope[pop] = json[pop];
     		}
     	}
     }
     
      /**
	 * @功能:动态生成PDF文件的内容 
	 * @Author:Li Jie
	 * @Date 2014-10-24
	*/  
     function createPdfDivForHtml(recommenDation){ 
     	var pdf_div = '';
     	if(recommenDation){ //建议书生成
     		//根据HTML样式将内容放到DIV中
     		
     	}
     	return pdf_div;
     }
     
    /**
	 * @功能:数组拷贝
	 * @param 
	 * @Author:Li Jie
	 * @Date 2014-11-10
	*/ 
    function commomCopyArray(fromArray,toArray){
		for(var i=0,j=fromArray.length;i<j;i++){
			toArray[toArray.length] = fromArray[i];
		}
		return toArray;
	}
	
	/**
	 * @功能:精确到两位小数
	 * @param  
	 * @Author:Li Jie
	 * @Date 22014-11-10
	*/ 
	function toDecimal(x) {
	    var f = parseFloat(x);  
	    if (isNaN(f)) {  
	        return false;  
	    }  
	    var f = Math.round(x*100)/100;  
	    var s = f.toString();  
	    var rs = s.indexOf('.');  
	    if (rs < 0) {  
	        rs = s.length;  
	        s += '.';  
	    }  
	    while (s.length <= rs + 2) {  
	        s += '0';  
	    }  
	    return s;   
	} 
	
 	/**
	 * @功能:自定义MAP
	 * @param  
	 * @Author:Li Jie
	 * @Date 2014-11-10
	*/ 
	function customMap() {    
	
		var struct = function(key, value) {
			this.key = key;
			this.value = value;
		}
	
		var put = function(key, value) {
			for (var i = 0; i < this.arr.length; i++) {
				if (this.arr[i].key === key) {
					this.arr[i].value = value;
					return;
				}
			}
			this.arr[this.arr.length] = new struct(key, value);
		}
	
		var get = function(key) {
			for (var i = 0; i < this.arr.length; i++) {
				if (this.arr[i].key === key) {
					return this.arr[i].value;
				}
			}
			return null;
		}
	
		var remove = function(key) {
			var v;
			for (var i = 0; i < this.arr.length; i++) {
				v = this.arr.pop();
				if (v.key === key) {
					continue;
				}
				this.arr.unshift(v);
			}    
	    }
		var size = function() {
			return this.arr.length;
		}
	
		var isEmpty = function() {
			return this.arr.length <= 0;
		}
	
		this.arr = new Array();
		this.get = get;
		this.put = put;
		this.remove = remove;
		this.size = size;
		this.isEmpty = isEmpty;    
	} 
	
	/**
	 * @功能:通过name值获取url请求参数
	 * @param 
	 * @Author:Li Jie
	 * @Date 2014-11-10
	*/
	function JSRequest(name){  
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null){
			return decodeURI((r[2]));
	    }else{
	        return "";
	    }
	}
	
	/**
	 * @功能:将NULL值转换为--
	 * @param 
	 * @Author:Li Jie
	 * @Date 2014-11-10
	*/
	function nvlNullToNbsp(value){
		if(value == null || value == "" || value == "null"){
			return "--";
		}else{
			return value;
		}
	}
	
	/**
	 * @功能:返回当前星期
	 * @param 
	 * @Author:Li Jie
	 * @Date 2014-11-10
	*/
	function formatDatetoXq(date) {
		var week;
		if (date.getDay() == 0)
			week = "星期日"
		if (date.getDay() == 1)
			week = "星期一"
		if (date.getDay() == 2)
			week = "星期二"
		if (date.getDay() == 3)
			week = "星期三"
		if (date.getDay() == 4)
			week = "星期四"
		if (date.getDay() == 5)
			week = "星期五"
		if (date.getDay() == 6)
			week = "星期六"
		return week;
	}
	
	/**
	 * @功能:Str转换成Date类型
	 * @param 
	 * @Author:Li Jie
	 * @Date 2014-11-10
	*/
	function strToDate(str){
	   if(str == "") return "";
	   var dt = str.split(" ");
	   if(dt[1] == null || dt[1] == "" ||dt[1] == undefined){//2007-11-15
	   	   var d = dt[0].split("-");
	   	   var d_date = new Date(d[0],d[1]-1,d[2],0,0,0);
	       return d_date;
	   }else{//2007-11-15 14:28:46
	   	   var d = dt[0].split("-");
	   	   var t = dt[1].split(":");
	   	   var d_date = new Date(d[0],d[1]-1,d[2],t[0],t[1],t[2]);
	       return d_date;
	   }
	}
	
	/**
	 * @功能:格式化时间
	 * @param 
	 * @Author:Li Jie
	 * @Date 2014-10-24
	*/
	function formatDate(time,type){
		 var theCurrentDay ="";
	     if(time == null || time == "" || time == "null") return "";
	     var year = time.getFullYear();//年
	     var month = time.getMonth()+1;//月
	     if(parseInt(month)<10){
	        month = '0'+month;
	     }
	     var date = time.getDate();//日
	     if(parseInt(date)<10){
	        date = '0'+date;
	     }
	     if(type == "date"){
	        theCurrentDay = year + "-" + month + "-" + date;
	     }else if(type == "cndate"){
	         theCurrentDay = year + "年" + month + "月" + date + "日";
	     }else if(type=='yearmonth'){
	        theCurrentDay = year + "-" + month;
	     }else if(type=='year'){
	        theCurrentDay = year;
	     }else{
	        var hours = time.getHours();//时
	        if(parseInt(hours)<10){
	            hours = '0'+hours;
	         }
	        var minutes = time.getMinutes();//分
	        if(parseInt(minutes)<10){
	            minutes = '0'+minutes;
	         }
	        var seconds = time.getSeconds();//秒
	        if(parseInt(seconds)<10){
	            seconds = '0'+seconds;
	         }
	        theCurrentDay = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
	     }
	     return theCurrentDay;
	}
	
	
	/**
	 * @功能:返回当前数据类型
	 * @param  
	 * @Author:Li Jie
	 * @Date 2014-10-24
	*/
	function datagetType(o) {
		var _t;
		return ((_t = typeof(o)) == "object" ? Object.prototype.toString.call(o)
				.slice(8, -1) : _t).toLowerCase();
	}

     /**

	 * @功能:表单验证
	 * @param {oper_type:0,1}input
	 * @Author:Li Jie
	 * @Date 2014-10-24
	*/ 
    function valdateForm($scope,oper_type,formValues,exType,errorMsg,userExpress,maxLength){ 
    	
     	if(oper_type == 0){ //表单离焦事件 
     		
     		if(exType == 0){ //判断是否为空 
     			if(!formValues){
     				if(errorMsg!=null){
     					errorMsg.style.borderColor='#D13F14';
     				}
     				return false;
     			}else{
     				if(errorMsg!=null){
     					errorMsg.style.borderColor='#EEEEEE';
     				} 
     				return true;
     			}
     		}else if(exType == 10){//判断汉字类型1-6位，非空 
     			 var reg = /^[0-9\u4e00-\u9faf]+$/;  
     			 if(formValues && reg.test(formValues) == true && formValues.length <= 6)  
			     {  
			     	if(errorMsg!=null){
				     	errorMsg.style.borderColor='#EEEEEE';
				     	document.getElementById(errorMsg.id+"_error").style.display='none';
			     	} 
			     	return true; 
			     }else{ 
			     	if(errorMsg!=null){
			     		errorMsg.style.borderColor='#D13F14';
			       		document.getElementById(errorMsg.id+"_error").style.display='block';
			     	}
			       return  false;
			     } 
     		}else if(exType == 11){//判断长度不能大于最大值 
     			 if(formValues && formValues.length <= maxLength)  
			     {  
			     	if(errorMsg!=null){
				     	errorMsg.style.borderColor='#EEEEEE';
				     	document.getElementById(errorMsg.id+"_error").style.display='none';
			     	} 
			     	return true; 
			     }else{ 
			     	if(errorMsg!=null){
			     		errorMsg.style.borderColor='#D13F14';
			       		document.getElementById(errorMsg.id+"_error").style.display='block';
			     	}
			       return  false;
			     } 
     		}else if(exType == 1){ //验证身份证号
     			 var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
			     if(formValues && reg.test(formValues) === false)  
			     {  
			     	if(errorMsg!=null){
			     		errorMsg.style.borderColor='#D13F14';
			       		document.getElementById(errorMsg.id+"_error").style.display='block';
			     	}
			       return  false;  
			     }else{ 
			     	if(errorMsg!=null){
				     	errorMsg.style.borderColor='#EEEEEE';
				     	document.getElementById(errorMsg.id+"_error").style.display='none';
			     	}
					
			     	return true;
			     } 
     		}else if(exType == 3){ //手机号码验证
     		 	var reg = /^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/;
     		 	if(formValues && reg.test(formValues) === false)  
			     {  
			     	if(errorMsg!=null){
				       errorMsg.style.borderColor='#D13F14';
				       if(document.getElementById(errorMsg.id+"_error")){
				     		document.getElementById(errorMsg.id+"_error").style.color='#D13F14';
				       } 
			     	}
			       return  false;  
			     }else{
			     	if(errorMsg!=null){
				     	errorMsg.style.borderColor='#EEEEEE';
				     	if(document.getElementById(errorMsg.id+"_error")){
				     		document.getElementById(errorMsg.id+"_error").style.color='#EEEEEE';
				     	} 
			     	}	
					
			     	return true;
			     } 
     		}else if(exType == 4){ //电话号码验证 
     			var patrn = /^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$/;
				if(formValues && !patrn.exec(formValues)){
					if(errorMsg!=null){
						errorMsg.style.borderColor='#D13F14';
						if(document.getElementById(errorMsg.id+"_error")){
				     		document.getElementById(errorMsg.id+"_error").style.color='#D13F14';
				        }
					}
					
			        return  false;  
				}else{
					if(errorMsg!=null){
						errorMsg.style.borderColor='#EEEEEE';
						if(document.getElementById(errorMsg.id+"_error")){
				     		document.getElementById(errorMsg.id+"_error").style.color='#EEEEEE';
				     	} 
					}
					
					return true;
				} 
     		}else if(exType == 6){ //邮箱验证 
     			var patrn = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
				if(formValues && !patrn.exec(formValues)){
					if(errorMsg!=null){
						errorMsg.style.borderColor='#D13F14';
					}
			        return  false;  
				}else{
					if(errorMsg!=null){
						errorMsg.style.borderColor='#EEEEEE';
					}
					return true;
				}
     		}else if(exType == 8){ //必须为数字类型
     			//alert("aaa "+formValues);
     			var patrn = /^[0-9]*$/;
				if(formValues && !patrn.exec(formValues)){
					if(errorMsg!=null){
						errorMsg.style.borderColor='#D13F14';
						document.getElementById(errorMsg.id+"_error").style.display='block';
					}
					
			        return  false;  
				}else{
					if(errorMsg!=null){
						errorMsg.style.borderColor='#EEEEEE';
						document.getElementById(errorMsg.id+"_error").style.display='none';
					}
					return true;
				}
     		}else if(exType == 9){//数字字母类型
     			var patrn = /^[0-9a-zA-Z]*$/g;
				if(!patrn.exec(formValues)){
					if(errorMsg!=null){
						errorMsg.style.borderColor='#D13F14';
					}
			        return  false;  
				}else{
					if(errorMsg!=null){
						errorMsg.style.borderColor='#EEEEEE';
					}
					return true;
				}
     		}else if(exType == 7){ //可以输入为空但不能大于某个长度
     			if(formValues && formValues.length > maxLength){
     				if(errorMsg!=null){
     					errorMsg.style.borderColor='#D13F14';
     				}
			        return  false;  
     			}else{
	     			if(errorMsg!=null){
	     				errorMsg.style.borderColor='#EEEEEE';
	     			}
	     			return true;
     			}
     			
     		}else if(exType == 5){ //用户自定义验证
     			var isPass = false;
     			isPass =  eval(userExpress);
     			if(!isPass){
     				if(errorMsg!=null){
     					errorMsg.style.borderColor='#D13F14';
     				}
     			}else{
     				if(errorMsg!=null){
     					errorMsg.style.borderColor='#EEEEEE';
     				}
     			}
     			
     			
     			return eval(userExpress);
     		} else if(exType == 2){ //邮编
     			var patrn = /^[0-9][0-9]{5}$/
				if(formValues && !patrn.exec(formValues)){
					if(errorMsg!=null){
						errorMsg.style.borderColor='#D13F14';
						document.getElementById(errorMsg.id+"_error").style.display='block';
					} 
			        return  false;  
				}else{
					if(errorMsg!=null){
						errorMsg.style.borderColor='#EEEEEE';
						document.getElementById(errorMsg.id+"_error").style.display='none';
					}
					
					return true;
				}
     		}
     	}else if(oper_type == 1){//表单提交时验证
     		
     		if(formValues != null && formValues.length > 0){
     			var returnFalg = true;
     			for(var i = 0; i<formValues.length; i++){
     				var value = formValues[i]["value"];
     				var exType = formValues[i]["exType"];
     				var errorMsg = formValues[i]["errorMsg"];
     				// var maxLength = formValues[i]["maxLength"];
     				
     				var returnValue = this.valdateForm($scope,0,value,exType,errorMsg,"","");
     										
     				if(!returnValue){
     					returnFalg = false;
     					
     					break;
     				}else{ 
     					returnFalg = true;
     				}
     			}
     			
     			return returnFalg;
     		}
     	}
     }
     
     /**
      * 徐彬 2014-11-27 控制性别报错信息
      */
     function sexerror(){
     	document.getElementById("sex_error").style.display='none';
     }
     
     /**
	 * @功能:生成UUID
	 * @param 
	 * @Author:Li Jie
	 * @Date 2014-11-10
	*/
     function createUUid(){
     	var uuid = new UUID().createUUID();
     	uuid = uuid.replace(/[-]/g, "");  
     	return uuid; 
     }
     
     
     
      return {
        getProffession:queryProffessionByCondition, //查询职业
        formValueSet:formValueSetFn, //表单值重新set值
        setFromValueByJson:setFromValueByJson,//根据传入JOSN格式的值映射给表单
        getPageInfo:getPageInfo, //返回当前页面信息
        getNetWorkStaus:getNetWorkStaus, //实时当前网络状态 
        valdateForm:valdateForm, //表单验证
        doPdfListener:doPdfListener, //生成PDF格式的文件 
        setUserBirthday:setUserBirthday,//根据出生年月设置年龄
        clearFormValSet:clearFormValSet, //清空表单,
        createPdfDivForHtml:createPdfDivForHtml,//动态生成PDF文件所需要的内容，传递给PDF插件
        fuzzySearchByCondition:fuzzySearchByCondition, //模糊搜索查询(支持多条件输入) 
        commomCopyArray:commomCopyArray, //数组拷贝
        toDecimal:toDecimal,//精确到两位小数
        customMap:new customMap(), //自定义map
        JSRequest:JSRequest, //JS获取请求参数
        formatDate:formatDate, //格式化时间
        nvlNullToNbsp:nvlNullToNbsp, //将null值转换成--
        formatDatetoXq:formatDatetoXq, //返回当前星期
        datagetType:datagetType, //返回当前数据类型 
        getUUid:createUUid //生成UUID
      }
})();





