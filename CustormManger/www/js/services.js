var AppServices = angular.module('starter.services', []);

//所有controller公用的常量
AppServices.factory('Variables', ['CommonFn', function (CommonFn) {
	//'IDNO','ID_END_DATE','INCOME','INCOME_WAY','OCCUPATION_CODE','COMPANY_ADDRESS','MOBILE','MARRI_STATUS','NATIVE_PLACE','RGT_PROVINCE','IDTYPE','BIRTHDAY','COMPANY_PHONE','COMPANY_ZIP_CODE','HOME_ADDRESS'
	return {
        platform          : 'pad',
        appId   		  : '10002',//客户管理的id
        recommend_appId   : '10003',//建议书id
        recommend         : '',
        insurancerId      : '',//投保人id
        dataBaseName      : "esales.sqlite",
        occupationBaseName: "t_code.sqlite",
        professionalBase  : "t_occupation.sqlite",
        agentCode         : '8611018517',
        agentPassword     : '96E7921895EB72C92A549DD5A330112',
        editCustom        : '',
        withoutDataSynchronize: 'false',//默认需要同步数据
        customId		  : '018611018517130821233806827393',
        mustNeedData      : [],
        ip                : 'http://10.0.22.112:7003',//test
        // ip                : 'http://esales2.minshenglife.com:8001',//pro
        productCode         :'',//约保产品代码约保姓名和电话不可编辑  1:不可编辑 gudandie 2017-10-31
		orderNo          :'',//约保订单号
        translateDataArr  : [
        	{
	        	codeType: 'nationality',
	        	beTranslatedKey: 'NATIONALITY'
	        },
	        {
	        	codeType: 'customertype',
	        	beTranslatedKey: 'TYPE'
	        },
	        {
        		beTranslatedKey: 'SOURCE',
        		codeType: 'customersource'
        	},
        	{
        		beTranslatedKey: 'MARRI_STATUS',
        		codeType: 'marriage'
        	},
        	{
        		beTranslatedKey: 'EDUCATION',
        		codeType: 'degree'
        	},
        	{
        		beTranslatedKey: 'IDTYPE',
        		codeType: 'idtype'
        	},
        	{
        		beTranslatedKey: 'NATIVE_PLACE',
        		codeType: 'nativeplace'
        	},
        	{
        		beTranslatedKey: 'INCOME_WAY',
        		codeType: 'incomeway'
        	},
        	{
        		beTranslatedKey: 'SEX',
        		codeType: 'sex'
        	}
        ],
        tabData: {
        	basicMsg: ['MARRI_STATUS', 'NATIVE_PLACE', 'RGT_PROVINCE', 'IDTYPE', 'IDNO', 'BIRTHDAY', 'ID_END_DATE', 'INCOME', 'INCOME_WAY', 'OCCUPATION_CODE', 'HEIGHT', 'WEIGHT', 'RGT_CITY', 'HOUSEHOLD_COUNTY', 'HOUSEHOLD_ADRESS', 'WORK_UNIT'],
        	contact : ['HOME_ADDRESS', 'COMPANY_ADDRESS', 'COMPANY_PHONE', 'COMPANY_ZIP_CODE', 'MOBILE', 'HOME_PROVINCE', 'HOME_CITY', 'HOME_COUNTY', 'COMPANY_PROVINCE', 'COMPANY_CITY', 'COMPANY_COUNTY','HOME_ZIP_CODE']
        }
    }
}]);

AppServices.factory('dataInit', [function () {
	var dataJson = {
		allCode: {}
	};
	return dataJson;
}]);

AppServices.factory('setVariables', ['$rootScope', 'Variables', 'CommonFn', function ($rootScope, Variables, CommonFn) {

	function setVariablesDataFn () {
		Variables.appId              = CommonFn.getQueryStringByName("proid");
		Variables.platform           = CommonFn.getQueryStringByName("pctype");
		Variables.recommend          = CommonFn.getQueryStringByName("recommend");
		Variables.dataBaseName       = "promodel/"+Variables.appId+"/www/db/esales.sqlite";
		Variables.occupationBaseName = "promodel/"+Variables.appId+"/www/db/t_code.sqlite";
		Variables.professionalBase   = "promodel/"+Variables.appId+"/www/db/t_occupation.sqlite";
		Variables.insurancerId       = CommonFn.getQueryStringByName("applicant_id");
		Variables.agentCode          = CommonFn.getQueryStringByName("agentCode");
		Variables.editCustom         = CommonFn.getQueryStringByName("editCustom");
		Variables.mustNeedData       = CommonFn.getQueryStringByName("mustNeedKey");
		Variables.agentPassword      = localStorage.agentPassword;
		Variables.favoreetype        = CommonFn.getQueryStringByName('favoreetype');
        Variables.productCode        = CommonFn.getQueryStringByName("productCode");//gudandie 2017-10-31
        Variables.orderNo        	   = CommonFn.getQueryStringByName("orderNo");//gudandie 2017-10-31

		if(Variables.platform == 'pad' || Variables.platform == ''){
			$rootScope.commonModule.isPad = true;
		}else{
			$rootScope.commonModule.isPad = false;
		};
		
		var mustNeedKey = CommonFn.getQueryStringByName("mustNeedKey");

		if(mustNeedKey){
			Variables.mustNeedData = mustNeedKey.split('#')[0].split(',');
		};

		if(CommonFn.getQueryStringByName('withoutDataSynchronize') == ''){
			Variables.withoutDataSynchronize = false;
		}else{
			Variables.withoutDataSynchronize = eval(CommonFn.getQueryStringByName('withoutDataSynchronize'));
		};
	};

	return {
		setVariablesData: function () {
			setVariablesDataFn();
		}
	};

}]);

AppServices.factory('dataInitRequest', ['Variables', 'dataInit', function (Variables, dataInit) {

	function getAllCodeMsgFn(fn) {
		getAllCodeMsg(function (arrData) {

			var dataCount = 0;

			for(var attr in dataInit.allCode){
				dataCount++;
			};

			if(dataCount){
				fn && fn();
				return;
			};

			for(var i=0; i<arrData.length; i++){
				var codeType = arrData[i].CODE_TYPE;

				if(!(codeType in dataInit.allCode)){
					dataInit.allCode[codeType] = {
						codeMap: [],
						codeName: []
					};
				};

				dataInit.allCode[codeType].codeMap.push(arrData[i]);
				dataInit.allCode[codeType].codeName.push(arrData[i].CODE_NAME);
			};
			fn && fn();
		});
	};

	//获取所有的code表
	function getAllCodeMsg (fn) {
		queryAllTableData({
			"databaseName": Variables.occupationBaseName,
	        "tableName": "T_CODE"
		},function (CallBackData) {
			fn && fn(CallBackData);
		},function(){
			alert('获取code失败');
		});
	};

	return {
		getAllCodeMsg: getAllCodeMsgFn
	}
}]);

//表单各种校验规则
AppServices.factory('checkFormHandle', ['$rootScope', '$state', '$timeout', '$ionicPopup', 'Variables', 'CommonFn', 'dataInit', 'synchronizeData',function($rootScope, $state, $timeout, $ionicPopup,Variables, CommonFn, dataInit, synchronizeData) {

	//校验用户名
	function checkUsrNameFn(usrname, fn) {
		var xmlUrl = "validators/CustomerDetail-validation.xml";
		var formElementID = "realName";
		var formElementValue = usrname;
		var checkResult = formCheckHandle(xmlUrl, formElementID, formElementValue);

		fn && fn(checkResult);
	};
	
	//add  5.15  ww  
	function mysearchUsrFn(usrname,fn) {
		var SCOPE ="";
		var sysusrname = usrname;
	    var sql = "select * from T_CUSTOMER";
	     if("" != sysusrname){
	    	sql+=" where REAL_NAME = '"+sysusrname+"' and AGENT_CODE = "+Variables.agentCode;
	    }
	    var json = {
	        "databaseName":Variables.dataBaseName,
	        "sql": sql
	    };
		queryTableDataUseSql(json,function(CallBackData){ 
            if(CallBackData.length){
                CommonFn.ionicAlert('客户名已存在，请重新输入！');
                document.getElementById('realName').value= "";
                return false;
			}
		},function(){
			console.log('查询出错！');
		});      
		fn && fn(checkResult);
	};

	
	

	//校验详细地址
	function checkAddressFn(address, fn) {
		var REGEXP = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/g;
		if(REGEXP.test(address)){
			fn && fn({
				Falg: true,
				msg: ''
			})
		}else{
			// fn && fn({
			// 	Falg: false,
			// 	msg: '地址不能含有标点符号'
			// })
		};
	};

	//校验身份证
	function checkPersonIdCardFn(idNum, idType, fn) {
		var xmlUrl = "validators/CustomerDetail-validation.xml";
		var formElementID = idType;
		var formElementValue = idNum;
		var checkResult = formCheckHandle(xmlUrl, formElementID, formElementValue);

		fn && fn(checkResult);
	};

	function commonCheckFn(num, type, fn) {
		var xmlUrl = "validators/CustomerDetail-validation.xml";
		var formElementID = type;
		var formElementValue = num;
		var checkResult = formCheckHandle(xmlUrl, formElementID, formElementValue);

		fn && fn(checkResult);
	};

	function checkContactFn(num, type, fn) {
		if(type == 'WEIBO_NO'){
			fn && fn({
				Falg: true
			});
			return;
		};
		var xmlUrl = "validators/CustomerDetail-validation.xml";
		var formElementID = type;
		var formElementValue = num;
		var checkResult = formCheckHandle(xmlUrl, formElementID, formElementValue);

		fn && fn(checkResult);
	};

	return {
		checkUsrName: function(usrname, fn) {
			checkUsrNameFn(usrname, fn);
		},

		//add   ---  5.15 ww 
		mysearchUsr: function (scope) {
			mysearchUsrFn(scope);
		},
		
		checkAddress: function(address, fn) {
			checkAddressFn(address, fn);
		},

		checkPersonIdCard: function(idNum, idType, fn) {
			checkPersonIdCardFn(idNum, idType, fn);
		},

		commonCheck: function(num, type, fn) {
			commonCheckFn(num, type, fn);
		},

		checkContact: function(num, type, fn) {
			checkContactFn(num, type, fn);
		}
	}
}]);

//公共方法
AppServices.factory('CommonFn', ['$rootScope', '$ionicLoading', '$timeout', '$ionicPopup', function ($rootScope, $ionicLoading, $timeout, $ionicPopup) {
	var hideBarFn = function () {
		$rootScope.commonModule.hideRightViewTopBar = true;
	};

	var showBarFn = function () {
		$rootScope.commonModule.hideRightViewTopBar = false;
	};

	//从一个数组中查找出一个元素
	function findIndex (arr, n) {
		if(!angular.isArray(arr)){
			return null;
		};
		for(var i=0; i<arr.length; i++){
			if(arr[i] === n){
				return i;
			};
		};

		return null;
	};

	function pushToViewCtrl (jsonKey) {
		pushToViewController(jsonKey, function (){
		  console.log("创建建议书跳转成功！");
		},function (){
		  ionicAlert('跳转失败!');
		});
	};

	function closeWebViewFn (arg) {
		closeWebView(arg,function (){
		  console.log('客户选择成功！');
		},function (){
		  console.log('客户选择失败！');
		}); 
	};

	function getQueryStringByName(name){
		var url = window.location.href;
		var lastStr = url.split('?')[1];
		if(!lastStr){
			return '';
		};
		var dataArr = lastStr.split('&');
		var resultJson = {};
	
		for(var i = 0; i<dataArr.length; i++){
			var newArr = dataArr[i].split('=');
			resultJson[newArr[0]] = newArr[1]
		};

		if(name in resultJson){
			return resultJson[name].split('#')[0];
		}else{
			return '';
		};
	}

	//根据身份证算年龄
	var getUserAge = function (idCard) {
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
		};
		age = birthdayToAge(birthday);
		var isEffective = false;
		// if(age > 46){ //国家规定四十六周岁以上发长期有效身份证
		// 	isEffective = true;
		// };

		return {
			"age" 		 : age,
			"birthday"   : birthday,
			"isEffective": isEffective
		};
	};

	//城市联动
	var adressSelect = function (module, allProvince, scope, dsy, provinceKey, cityKey, adressType) {
		var groupCity = null,
	        groupCounty = null,
	        groupCityKey;

	    scope.$watch(module + '.data.' + provinceKey, function () {
	      var provinceNow = scope[module].data[provinceKey];
	      
	      if(provinceNow){
	        var provinceIndex = findIndex(allProvince, provinceNow);

	        if(provinceIndex != null){
	        	groupCityKey = '0_' + provinceIndex;
		        groupCity = dsy.Items[groupCityKey];
		        scope[module].adress[adressType].city = groupCity;
		        scope[module].adress[adressType].county = [];
	        };
	      };
	    });

	    scope.$watch(module + '.data.' + cityKey, function () {
	      var cityNow = scope[module].data[cityKey];

	      if(cityNow){
	        var cityIndex = findIndex(groupCity, cityNow);

	        if(cityIndex != null){
	        	var CountyKey = groupCityKey + '_' + cityIndex;
		        groupCounty = dsy.Items[CountyKey];
		        scope[module].adress[adressType].county = groupCounty;
	        };
	      };
	    });
	};

	//根据时间选择器获得时间
	var getDateObject = function (fn) {
		if(!$.fn.calenderFun){
			return;
		};
		
		$.fn.calenderFun({
          'minYear' : '1900',
          'maxYear' : '2100',
          'dateFormat'  : 'yyyy-mm-dd',
          'callBackFun':function (data){
          	fn && fn(data);
          }
	    });
	};

	//根据生日算年龄
	var birthdayToAge = function (birthday) {
		var birthdayArr = birthday.split('-');
		var birthdayDate = new Date();
		var dateNow = new Date();

		birthdayDate.setFullYear(parseInt(birthdayArr[0], 10));
		birthdayDate.setMonth(parseInt(birthdayArr[1], 10) - 1);
		birthdayDate.setDate(parseInt(birthdayArr[2], 10));

		dateNow.setFullYear(parseInt(birthdayArr[0], 10));

		if(dateNow.getTime() >= birthdayDate.getTime()){
			var newDateNow = new Date();

			return newDateNow.getFullYear() - parseInt(birthdayArr[0], 10); 	
		}else{
			var newDateNow = new Date();

			return (newDateNow.getFullYear() - parseInt(birthdayArr[0], 10)) - 1; 	
		};
	};

	//单位数转两位数
	var toDouble = function (num) {
		if(num < 10){
			return "0"+num;
		}
		else{
			return ""+num;
		};
	};

	//获取当前时间
	var getTimeNow = function () {
		var json = {};
		var oDate = new Date();

		json.year = oDate.getFullYear();
		json.month = toDouble(oDate.getMonth()+1);
		json.date  = toDouble(oDate.getDate());
		json.hours = oDate.getHours();
		json.minutes = oDate.getMinutes();
		json.timeMs = oDate.getTime();

		return json;
	};

	var jsonClone = function (json){
		var newJson = {};

		for(var attr in json){
			newJson[attr] = json[attr];
		};

		return newJson;
	};

	function createUUid(){
		var uuid = new UUID().createUUID();
		uuid = uuid.replace(/[-]/g, "");  
		return uuid; 
	};

	//把codeName转化为code
	function codeNameToCode (form, codeName) {
		for(var i=0; i<form.length; i++){
			if(form[i].CODE_NAME == codeName){
				return form[i].CODE;
			};
		};

		return undefined;
	};

	//把code转化为codeName
	function codeToCodeName (form, code) {
		for(var i=0; i<form.length; i++){
			if(form[i].CODE == code){
				return form[i].CODE_NAME;
			};
		};

		return undefined;
	};

	function deleteElementInArr (arr, ele) {
		for(var i=0; i<arr.length; i++){
			if(arr[i] == ele){
				arr.splice(i,1);
			};
		};
	};

	function checkeOnline() {
		var networkState;
		if(navigator.connection == undefined){
			networkState = "WiFi connection";
		}else{
			networkState = navigator.connection.type;
			
			if(networkState == 0){
				networkState = "WiFi connection";
			}
		}
		
		return networkState;
	};

	// function checkConnection(fnScc) {

	// 	setTimeout(function() {
	// 		fnScc && fnScc((checkeOnline().indexOf("No") != 0) || (checkeOnline().indexOf("unknown") != 0));
	// 	}, 1000);
	// 	//return window.navigator.onLine;
	// };

	// function checkeOnline() {
	// 	var networkState = navigator.connection.type;
    //     var states = {};

	// 	states[Connection.UNKNOWN] = 'Unknown connection';
	// 	states[Connection.ETHERNET] = 'Ethernet connection';
	// 	states[Connection.WIFI] = 'WiFi connection';
	// 	states[Connection.CELL_2G] = 'Cell 2G /Users/sushujuan/Downloads/www/js/plugin.jsconnection';
	// 	states[Connection.CELL_3G] = 'Cell 3G connection';
	// 	states[Connection.CELL_4G] = 'Cell 4G connection';
	// 	states[Connection.CELL] = 'Cell generic connection';
	// 	states[Connection.NONE] = 'No network connection';

	// 	return states[networkState];
	// };

	function checkConnection(fnScc) {
		setTimeout(function() {
			fnScc && fnScc(checkeOnline().indexOf("none") != 0);
		}, 2000);
		//return window.navigator.onLine;
	};

	function myAlert (str) {
		$ionicLoading.show({
          template: str,
          duration: 1000
        });
	};

	function showConfirm (opts) {
		$ionicPopup.confirm({
			title: opts.title,
			content: opts.content,
			okText:'确定',
   			cancelText: '取消',
   			okType: 'myokbutton'
		}).then(function (res) {
			if (res) {
				opts.sure();
			}else{
				opts.notSure && opts.notSure();
			};
		});
	};

	function cloneArr (arr) {
		var newArr = [];

		for(var i=0; i<arr.length; i++){
			newArr.push(arr[i]);
		};

		return newArr;
	};

	function ionicAlert (str) {
		$ionicPopup.alert({
			title: '提示',
			content: str,
			okText:'确定',
			okType: 'myokbutton'
		}).then(function (res) {
			//console.log('Thank you for not eating my delicious ice cream cone');
		});
	};

	function showLoading (str) {
		$ionicLoading.show({
	      template: '<div class="pop_up_box"><span class="myloading"></span>'+str+'</div>'
	    });
	};

	function hideLoading () {
		$ionicLoading.hide();
	};

	function showFormError(className, msg) {
		$('.'+className).addClass('my-show');
      	$('.'+className).text(msg);
	};

	function hideFormError(className) {
		$('.'+className).removeClass('my-show');
      	$('.'+className).text('');
	};

	function isExist(value) {
		if(typeof value == 'undefined' || value == null || value === ''){
			return false;
		}else{
			return true;
		};
	};
	/*  
		OCR-需要的证件类型;other-暂不支持或不开放开放 none-证件类型空 
	*/
	function translateIdype (idtype){
		var idCode;
		switch(idtype){
	      case "居民身份证":
	        idCode = "2";
	        break;

	      case "军官证":
	        idCode = "other";//7
	        break;

	      case "居民户口簿"://16
	        idCode = "other";
	        break;

	      case "港澳居民来往内地通行证":
	        idCode = "other";//14
	        break;

	      case "台湾居民来往大陆通行证":
	        idCode = "other";//10
	        break;

	      case "外国护照":
	        idCode = "other";//13
	        break;
	      case "士兵证":
	        idCode = "other";
	        break;
	      case "警官证":
	        idCode = "other";
	        break;
	        case "外国人永久居留证":
	        idCode = "other";
	        break;
	      default:
	        idCode = "none";
    	};
    	return idCode;
	}
	function inArr(target, arr) {
		for(var i = 0; i < arr.length; i++){
			if(arr[i] == target){
				return true;
			};
		};

		return false;
	};

	//根据年月获取当月的天数  2017-08-01
	function getDaysInMonth(year,month){ 

		year = parseInt(year,10);
		month = parseInt(month,10);
		var oDate = new Date(year,month,0); 
		return oDate.getDate(); 
	}

	function checkDate(dateStr) {
		var dateArr = dateStr.split('-');

		if(dateArr[1] < 1 || dateArr[1] > 12){
			return false;
		}else{
			// var oDate = new Date();

			// oDate.setFullYear(parseInt(dateArr[0], 10));
			// oDate.setMonth(parseInt(dateArr[1], 10));
			// oDate.setDate(0);

			// var dayCount = oDate.getDate();
			var dayCount = getDaysInMonth(dateArr[0],dateArr[1]); 
			//return (parseInt(dateArr[2], 10) < dayCount && parseInt(dateArr[2], 10) > 0);
			return (parseInt(dateArr[2], 10) <=dayCount && parseInt(dateArr[2], 10) > 0);
		};
	};

	/**
	 * 格式化日期
	 * @param date：日期（如：new Date()）
	 * @param format：日期格式（如：'yyyy-MM-dd hh:mm:ss SSS'）
	 * @return
	 */
	function formatDate(date,format){
		var z = {y:date.getFullYear(),M:date.getMonth()+1,d:date.getDate(),h:date.getHours(),m:date.getMinutes(),s:date.getSeconds(),S:date.getMilliseconds()};
		return format.replace(/(y+|M+|d+|h+|m+|s+|S+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2))});
	};
	/**
	 * 生成指定位数的随机整数
	 * @param count：随机数的位数
	 * @return
	 */
	function generateRandomNumOfCount(count){
		var randomNum = "";
		for(var i = 0 ; i < count ; i++){
			var tempNum = Math.floor(Math.random()*10);
			randomNum += tempNum;
		}
		return randomNum;
	};
	/**
	 * 生成主键ID
	 * @return
	 */
	function generatePrimaryKey(){
		//主键ID
		var primaryKey = "";
		//客户端类型（ios系统为04、android为05）
		var clientType = brows().iphone ? "04" : "05";
		//当前指定格式的时间
		var formatTime = formatDate(new Date(),"yyMMddhhmmssSSS");
		//三位随机数
		var randomNum = generateRandomNumOfCount(3);
		//业务员编码
		var agentCode = getQueryStringByName("agentCode");
		
		primaryKey = clientType + agentCode + formatTime + randomNum;
		return primaryKey;
	};
	/**
	 * 校验身份证最后一位
	 * @return
	 */
	function IdentityCodeValid(id){			  
		/*1、从第一位到第十七位的系数分别为：
		   7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2 
		    将这17位数字和系数相乘的结果相加。
		*/
		var arr = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
		var sum = 0;
		for(var i=0; i<arr.length; i++){
			sum += parseInt(id.charAt(i)) * arr[i];
		}
		//2、用加出来和除以11，看余数，
		var c = sum%11;
		//3、分别对应的最后一位身份证的号码为：1－0－X－9－8－7－6－5－4－3－2
		var ch = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
		var code = ch[c];
		var last = id.charAt(17);
		last = last=='x' ? 'X': last;
		return last==code;
	};
    //功能：格式化时间,string转date
    function strToDate(str){
        if(str == null || str == "") return "";
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
    };
    function invoateOCR (opts){
		var idCodeNum = opts.idtype;
		var method = opts.method;
		var json = {'idtype':idCodeNum,'method':method}
  		invoateOCRPlugin(json,function(data){
    		opts.callBackFun && opts.callBackFun(data);
  		},function(err){
  			opts.callBackFun && opts.callBackFun(err);
  		})
    }
    function invoateOCRPlugin(key,success_callback,failed_callback){
    	//iOS
	    if(brows().iphone){
	        cordova.exec(success_callback, failed_callback, "MSOCRPlugin", "invocateOCRPlugin", [key]);
	    }
	    //Android
	    else if(brows().android){
	        return cordova.exec(success_callback, failed_callback, "MSOCRPlugin", "invocateOCRPlugin", key);
	    }
	}
	return {
		hideBarFn           : hideBarFn,
		showBarFn           : showBarFn,
		findIndex           : findIndex,
		adressSelect        : adressSelect,
		getUserAge          : getUserAge,
		getDateFn	        : getDateObject,
		birthdayToAgeFn     : birthdayToAge,
		getTimeNowFn        : getTimeNow,
		jsonClone           : jsonClone,
		createUUid          : createUUid,
		getQueryStringByName: getQueryStringByName,
		pushToViewCtrl      : pushToViewCtrl,
		closeWebViewFn      : closeWebViewFn,
		codeNameToCode      : codeNameToCode,
		codeToCodeName      : codeToCodeName,
		deleteElementInArr  : deleteElementInArr,
		checkConnection     : checkConnection,
		myAlert             : myAlert,
		cloneArr            : cloneArr,
		showConfirm         : showConfirm,
		ionicAlert          : ionicAlert,
		showLoading         : showLoading,
		hideLoading         : hideLoading,
		showFormError       : showFormError,
		hideFormError       : hideFormError,
		isExist             : isExist,
		inArr               : inArr,
		checkDate           : checkDate,
		generatePrimaryKey	: generatePrimaryKey,
		IdentityCodeValid   :IdentityCodeValid,
        strToDateFn         :strToDate,
        translateIdype      :translateIdype,
        invoateOCR          :invoateOCR

	};
}]);


//数据同步
AppServices.factory('synchronizeData', ['$ionicPopup', 'Variables', 'CommonFn', function($ionicPopup, Variables, CommonFn) {
	
	var asyncTableMapLength,
		synchronizeCount = 0,
		asyncTableMap = null;

	function commonTableAsyncData(fn){ 

		clearTime = false;
		setTimeout(function(){
			if(!clearTime){
				CommonFn.hideLoading();
				CommonFn.ionicAlert("网络信号不稳定，请换个网络环境操作!");
			}
		}, 10000);

		//是否需要数据同步并且是否已经同步过数据
		if(Variables.withoutDataSynchronize && localStorage.customSynchronized == '0'){
			//alert('跳过数据同步功能');
			fn && fn();
			return;
		};

		CommonFn.checkConnection(function(bOnline) {
			if(!bOnline){
				fn && fn();
				clearTime = true;
				return;
			}else{
				asyncTableMap = [
					{
						"dataBaseName"        :Variables.dataBaseName,
						"tableName"           :"T_CUSTOMER",
						"orderColm"           :"UPDATE_TIME",
						"asyncFlag"           :"FLAG",
						"downloadInterfaceUrl":Variables.ip+"/app/customer/downloadCustomers",
						"uploadInterfaceUrl"  :Variables.ip+"/app/customer/uploadCustomers",
						"historyInterfaceUrl" :Variables.ip+"/app/proposal/deleteProposals",
						"operType"            :"common",
						"historyBase"         :"RECOMMEDN_ID",
						"isHistory"           :"false",
						"historyRequestParam" :"proposalIds"
					},
					{
						"dataBaseName"        :Variables.dataBaseName,
						"tableName"           :"T_CUSTOMER_FAMILY",
						"orderColm"           :"UPDATE_TIME",
						"asyncFlag"           :"FLAG",
						"downloadInterfaceUrl":Variables.ip+"/app/customer/downloadCustomerFamily",
						"uploadInterfaceUrl"  :Variables.ip+"/app/customer/uploadCustomerFamily",
						"historyInterfaceUrl" :Variables.ip+"/app/proposal/deleteProposals",
						"operType"            :"common",
						"historyBase"         :"RECOMMEDN_ID",
						"isHistory"           :"false",
						"historyRequestParam" :"proposalIds"
					}
				];

				if(asyncTableMap != null && asyncTableMap.length > 0){
					dataSynchronizeStart(asyncTableMap, fn);
				}else{
					CommonFn.ionicAlert("系统没有检测到数据同步的数据配置，请联系管理员！");
					clearTime = true;
					return;
				};
			};
		});
	};

	function dataSynchronizeStart(arr, callBack) {
		//alert(arr.length);
		if(!arr.length){
			callBack && callBack();
			return;
		};

		var synchronizeNow = arr.pop();
		var newArrData = arr;

		var dataBaseName 	     = synchronizeNow["dataBaseName"]; //数据库名称
	 	var tableName            = synchronizeNow["tableName"]; //表名
	 	var orderColm            = synchronizeNow["orderColm"]; //排序字段
	 	var asyncFlag            = synchronizeNow["asyncFlag"]; //数据同步标识字段
	 	var downloadInterfaceUrl = synchronizeNow["downloadInterfaceUrl"]; //下载数据地址
	 	var uploadInterfaceUrl   = synchronizeNow["uploadInterfaceUrl"]; //上传数据接口地址
	 	var historyInterfaceUrl  = synchronizeNow["historyInterfaceUrl"]; //历史数据同步接口
	 	var operType             = synchronizeNow["operType"];   //操作类型 common：为普通数据操作 ,speImg:对图片的上传下载操作
	 	var historyBase          = synchronizeNow["historyBase"]; //历史数据上传依据该字段
	 	var isHistory            = synchronizeNow["isHistory"]; //历史数据是否上传
	 	var historyRequestParam  = synchronizeNow["historyRequestParam"]; //历史数据请求参数
	 	var saveImagePath        = synchronizeNow["saveImagePath"];//图片保存路径
	 	var imageBase            = synchronizeNow["imageBase"]; //图片下载基础 
	 	var ImagefromHttpUrl     = synchronizeNow["ImagefromHttpUrl"]; //图片外网地址

	 	if('common' == operType){ 
		    //判断本地表里是否有数据
	    	theDbHasData(synchronizeNow, function(data) {
	    		//alert("alert"+"ddddd");
		    	if(data.length > 0){
		    		//如果有数据，则获取本地最新数据的时间点去服务器查找大于此时间点的数据
		    		getLocalNewDataTime(synchronizeNow, data, function(returnJson) {
		    			//alert(3);
		    			var downLoadList = returnJson.dataList; 
	  				  	//alert("需要更新插入本地数据库的数据条数为:" + downLoadList.length);
	  				  	if(downLoadList && downLoadList.length > 0){
	  				  		//如果服务器有新数据，则将其插入到本地表
	  				  		downloadDataFromeSerevr(synchronizeNow, downLoadList, function() {
	  				  			//alert(5);
	  				  			//上传本地离线状态下提交的数据
	  				  			uploadLocalDataToSerevr(synchronizeNow, newArrData, callBack);
	  				  		}, newArrData, callBack);
	  				  	}else{
	  				  		//alert(4);
	  				  		//上传本地离线状态下提交的数据
	  				  		uploadLocalDataToSerevr(synchronizeNow, newArrData, callBack);
	  				  	};
		    		}, newArrData, callBack);
		    	}else{
		    		//alert(2);
		    		//如果没有数据 则从服务器获取数据,插入到本地表
		    		//alert('本地没有数据');
		    		getDataFirst(synchronizeNow, newArrData, callBack);
		    	};
		    }, function() {
		    	alert('第一次查询数据失败');
		    });

	 	}else{
	 		CommonFn.ionicAlert("数据同步操作类型没有配置，请联系管理员！");	
	 	};
	};

	//判断此表是否是第一次填充数据
	function theDbHasData(asyncTableMap, callBack) {
		var firstSql = "select  *  from " + asyncTableMap.tableName + " where AGENT_CODE = " + Variables.agentCode + " order by " + asyncTableMap.orderColm + " desc limit 1"; 
	    var json = {
	        "databaseName": asyncTableMap.dataBaseName,
	                 "sql": firstSql
	    };

	    queryTableDataUseSql(json, function(data) {
	    	callBack(data);
	    });
	};

	//第一次下载数据
	function getDataFirst(asyncTableMap, newArr, callBack) {
		//第一次进行下载数据 
    	var downLoadJson ={
    		"url":asyncTableMap.downloadInterfaceUrl,
		    "parameters":{}
    	};

    	//调用插件下载接口下载数据
    	httpRequestByGet(downLoadJson,function(resultObj){ 
		  	var returnJson=eval('('+resultObj+')'); 
		  	if(returnJson.status.code == 0){ 
		  		//正常成功
		  		var downLoadList = returnJson.dataList;
		  		if(downLoadList != null && downLoadList.length > 0){

		  			resertData(downLoadList, {
						'DELETE_FLAG': '0',
						'FLAG': 'Y'
					});

	  				var moreInsertJson ={
		        		"databaseName":asyncTableMap.dataBaseName,
		        		"tableName":asyncTableMap.tableName,
		        		"data":downLoadList
	        		};
	        		
		        	//批量网本地数据库插入数据
		        	syncInsertTableData(moreInsertJson,function(totalIndex){
		        		//CommonFn.myAlert('同步成功');
		        		dataSynchronizeStart(newArr, callBack);
		        	}, function() {
		        		alert('插入本地数据库出错');
		        	});
		        	
		  		}else{
		  			//alert('服务器无数据');
		  			dataSynchronizeStart(newArr, callBack);
		  		};
		  	}else{
		  		alert("初次下载数据失败，请联系管理员!");
		  		dataSynchronizeStart(newArr, callBack);
		  	};
    	}, function() {
			//alert('插件报错');
			clearTime = false;
    	});
	};

	//如果不是第一次下载数据,需要在本地拿到最新数据时间点
	function getLocalNewDataTime(asyncTableMap, data, getDataFn, newArrData, callBack) {
		//alert('此用户存在数据，需要获取最新数据时间点');
		//拿最近一条数据的时间点
    	var updateTimeStr = data[0][asyncTableMap.orderColm];
    	//alert('最新时间点为:' + updateTimeStr);
    	var downLoadJson = {
    		"parameters":{
    			"updateTime":updateTimeStr
    		},
    		"url":asyncTableMap.downloadInterfaceUrl
    	};

    	httpRequestByGet(downLoadJson, function(resultObj) {
    		var returnJson = eval('('+resultObj+')');  

    		if(returnJson.status.code == 0){
    			getDataFn(returnJson);
    		}else{
    			alert("数据下载接口出现异常,请联系管理员！");
		      	dataSynchronizeStart(newArrData, callBack);
    		};
    	}, function() {
    		dataSynchronizeStart(newArrData, callBack);
    	});
	};

	//把本地离线状态下的数据提交到服务器
	function uploadLocalDataToSerevr(asyncTableMap, newArrData, callBack) {
		var asyncSql ="select  *  from "+asyncTableMap.tableName+"  where "+asyncTableMap.asyncFlag+" = 'N' and AGENT_CODE = " + Variables.agentCode; 
		var upJson = {
			"databaseName":asyncTableMap.dataBaseName,
			"sql": asyncSql
		};

		queryTableDataUseSql(upJson,function(dataList){
	    	if(dataList != null && dataList.length  > 0){ 
	    		//调用插件进行数据上传
				var updaloadJson={"url":asyncTableMap.uploadInterfaceUrl,"parameters":{"dataJson":dataList}};
				//alert('需要上传的数据:' + dataList.length);
				httpRequestByPost(updaloadJson,function (upResult){ 
					var upObj=eval('('+upResult+')'); 
					clearTime = true;
					if(upObj.status.code == 0){ //数据上传成功
						//上传成功后调用更新掉之前上传的数据状态(此插件需要提供暂时未提供) 
						var executeUpdateJson = {
							"databaseName":asyncTableMap.dataBaseName, 
							"tableName": asyncTableMap.tableName,
							"sql":"update "+ asyncTableMap.tableName +" set " + asyncTableMap.asyncFlag + " = 'Y' where AGENT_CODE = " + Variables.agentCode
						};
						executeUpdateSql(executeUpdateJson,function(){
							dataSynchronizeStart(newArrData, callBack);
						});
					}else{
						//数据上传失败
						dataSynchronizeStart(newArrData, callBack);
					}
					
				}); 
	    	}else{
	    		//alert('没有需要上传的数据');
				dataSynchronizeStart(newArrData, callBack);
				clearTime = true;
	    	}
	     });
	};

	//更新本地头像路径
	function updateLocalUsrIcon(id, iconUrl, dateUpdate, fnScc) {
		var executeUpdateJson = {
			"databaseName":Variables.dataBaseName, 
			"tableName": "T_CUSTOMER",
			"sql":"update T_CUSTOMER set ICON = '"+iconUrl+"' , UPDATE_TIME = '" + dateUpdate + "' where ID = '" + id + "'"
		};
		executeUpdateSql(executeUpdateJson,function(){
			fnScc();
		});
	};

	//从服务器上下载最新数据
	function downloadDataFromeSerevr(asyncTableMap, downLoadList, doLatter, newArrData, callBack) {
		resertData(downLoadList, {
			'DELETE_FLAG': '0',
			'FLAG': 'Y'
		});

		var conditionIdArr = [];
		for(var i = 0; i < downLoadList.length; i++){
			var bPushJson = {
				"ID": downLoadList[i].ID
			};
			conditionIdArr.push(bPushJson);
		};

		var moreInsertJson = {
    		"databaseName": asyncTableMap.dataBaseName,
    		   "tableName": asyncTableMap.tableName,
    		  "conditions": conditionIdArr,
    				"data": downLoadList
    	}; 
    	
    	//批量网本地数据库更新或插入数据
    	updateORInsertTableDataByConditions(moreInsertJson, function(totalIndex){
    		doLatter();
    	},function(){
    		alert('批量插入数据失败');
    		dataSynchronizeStart(newArrData, callBack);
    	});
	};

	//同步完成之后删除本地delete_flag值为1的数据
	/*function deleteOfFlagInLocal(formName, fnScc) {

		deleteTableData({
			"databaseName": Variables.dataBaseName,
			"tableName": formName,
			"conditions": [{
				"DELETE_FLAG": '1'
			}]
		},function(arr){
			if(1 == arr[0]){	
				fnScc();
			}else{
				fnScc();
				alert('删除失败');
			}
	    },function(){
	    	fnScc();
	        alert("数据删除异常！");
	    });
	};*/

	//向服务器新增客户
	function addUsrToServer(json, fnScc, fnFail) {
		var updaloadJson={"url":Variables.ip+"/app/customer/uploadCustomers","parameters":{"dataJson":[json]}};
		//alert('需要上传的数据条数:' + dataList.length);
		//alert("server" + updaloadJson)

		httpRequestByPost(updaloadJson,function (upResult){
			var upObj = eval('('+upResult+')');
			if(upObj.status.code == 0){ //数据上传成功
				//上传成功后调用更新掉之前上传的数据状态(此插件需要提供暂时未提供) 
				//alert('新增用户到服务器成功');
				fnScc();
			}else{
				//数据上传失败
				alert("数据上传失败，出现异常！");
				fnFail();
			};
		});
	};

	//向服务器新增关系数据
	function addCustormRelation(json, fnScc) {
		var updaloadJson={"url":Variables.ip+"/app/customer/uploadCustomerFamily","parameters":{"dataJson":[json]}};
		//console.log(json);
		//alert('需要上传的数据条数:' + dataList.length);
		httpRequestByPost(updaloadJson,function (upResult){
			var upObj = eval('('+upResult+')');
			if(upObj.status.code == 0){ //数据上传成功
				//上传成功后调用更新掉之前上传的数据状态(此插件需要提供暂时未提供) 
				//alert('新增关系到服务器成功');
				fnScc();
			}else{
				//数据上传失败
				alert("数据上传失败，出现异常！");
				fnFail();
			};
		}, function(err) {
			alert(JSON.stringify(err));
		});
	};

	//从服务器上删除数据
	function deleteDataInCloud(id, fnScc, fnFail) {
		var updaloadJson={"url":Variables.ip+"/app/customer/deleteCustomers","parameters":{"customerIds":id}};
		//alert('需要上传的数据条数:' + dataList.length);
		httpRequestByPost(updaloadJson,function (upResult){
			var upObj = eval('('+upResult+')');
			if(upObj.status.code == 0){ //数据上传成功
				//上传成功后调用更新掉之前上传的数据状态(此插件需要提供暂时未提供) 
				//alert('新增关系到服务器成功');
				//alert('删除数据成功');
				fnScc();
			}else{
				//数据上传失败
				//alert("服务器数据删除失败，出现异常！");
				$ionicPopup.alert({
					title: '提示',
					template: '服务器数据删除失败，出现异常！'
				});
				fnFail();
			};
		}, function(err) {
			alert(JSON.stringify(err));
			fnFail();
		});
	};

	//重置json中的数据
	function resertData(dataList, json) {
		for(var attr in json){
			for(var i = 0; i < dataList.length; i++){
				dataList[i][attr] = json[attr];
			};
		};
	};

	return {
		commonTableAsyncDataFn: function(fn) {
			commonTableAsyncData(fn);
		},

		addUsrToServerFn: function(json, fnScc, fnFail) {
			addUsrToServer(json, fnScc, fnFail);
		},

		addCustormRelationFn: function(json, fnScc) {
			addCustormRelation(json, fnScc);
		},

		deleteDataInCloudFn: function(id, fnScc, fnFail) {
			deleteDataInCloud(id, fnScc, fnFail);
		},

		updateLocalUsrIconFn: function(id, iconUrl, dateUpdate, fnScc) {
			updateLocalUsrIcon(id, iconUrl, dateUpdate, fnScc);
		}
	}

}]);

//创建建议书
AppServices.factory('manuScriptServer', ['Variables', 'CommonFn', 'relationshipData', 'dataInit', function (Variables, CommonFn, relationshipData, dataInit) {

	var appId = Variables.recommend_appId;
	var platform = Variables.platform;

	//创建建议书
	function createManuscript (sendMsg){
		var url = "promodel/"+appId+"/www/index.html#/customer/none/Y?pctype="+platform+"&proid="+appId+"&agentCode="+Variables.agentCode;
		var jsonKey ={
		  "serviceType":"LOCAL",
		  "URL": url,
		  "key":sendMsg,
		  "closePrev":"yes"
		};
		
		CommonFn.pushToViewCtrl(jsonKey);
	};

	//组装数据
	function createMsg (scope, detailData, fn) {
	    var key             = {};
	    for(var attr in detailData){
	    	if(!CommonFn.isExist(detailData[attr])){
	    		detailData[attr] = '';
	    	};
	    	detailData[attr] = detailData[attr] + '';
	    };
	    if(Variables.orderNo!='' && Variables.orderNo!=null && Variables.orderNo!="undefined"){  //由约保编辑客户跳转过来的
	    	detailData.PRODUCT_CODE = Variables.productCode;
	    	detailData.orderNo = Variables.orderNo;
		}
	    var array           = detailData;

	    key["recommend"]    = scope.CustomerDetailModule.attr.recommend;
	    key["favoreetype"]    = scope.CustomerDetailModule.attr.favoreetype;//在线投保专用(受益人类型判断)
	    
	    if("2" == scope.CustomerDetailModule.attr.recommend){
	    	//选择的时被保人时，把与投保人得关系传过去
	    	if(Variables.insurancerId){
	    		if(detailData.ID == Variables.insurancerId){
	    			array["relation"] = '00';
	    			key["info"] = array;
					fn && fn(key);
	    		}else{
	    			relationshipData.getRelation({
						id: Variables.insurancerId
					},function(arr){
						var relationCode = '';
						arr.forEach(function(obj){
							if(obj.ID == detailData.ID){
								relationCode = CommonFn.codeNameToCode(dataInit.allCode.relation.codeMap, obj.relationName);
								//relationCode = obj.relationName;
							};
						});
						array["relation"] = relationCode;
						key["info"] = array;
						fn && fn(key);
					});
	    		};
	    	}else{
	    		array["relation"] = '';
    			key["info"] = array;
				fn && fn(key);
	    	};
	    }else{
	    	array['HOME_ADDRESS'] = array['HOME_PROVINCE']+array['HOME_CITY']+array['HOME_COUNTY']+array['HOME_ADDRESS'];
	    	key["info"] = array;
	    	fn && fn(key);
	    };
	};

	return {
		createManuscriptFn: function (sendMsg){
			createManuscript(sendMsg);
		},

		createMsgFn: function (scope, detailData, fn) {
			createMsg(scope, detailData, fn);
		},

		selectCustomFn: function (sendMsg) {
			CommonFn.closeWebViewFn(sendMsg);
		}
	};
}]);

//职业搜索
AppServices.factory('searchOccupationServer', ['Variables', function (Variables) {

	function searchOccupationFn (opts) {

		/*if(typeof opts.keyWord == 'undefined' || opts.keyWord == ''){
			queryAllTableData({
				"databaseName": Variables.professionalBase,
		        "tableName": "T_OCCUPATION"
			},function (CallBackData) {
				opts.callBack && opts.callBack(CallBackData);
			},function(){
				alert('搜索失败');
			});
			return;
		};*/

		/*var keyWord = opts.keyWord;
		var page = opts.page;
		//add 查询条件  5.11 ww
		// var sql = "select (select count(1) from  T_OCCUPATION where OCCUPATION_VER='002' and (OCCUPATION_CODE like '%"+keyWord+"%' or OCCUPATION_NAME like '%"+keyWord+"%')) as totalnumber, a.*  from T_OCCUPATION  a where a.OCCUPATION_VER='002' ";

	    if("" != keyWord && typeof opts.keyWord != 'undefined'){
	    	if(opts.ruler){
	    		sql+=" and (OCCUPATION_CODE = '"+keyWord+"' or OCCUPATION_NAME = '"+keyWord+"')";
	    	}else{
	    		sql+=" and (OCCUPATION_CODE like '%"+keyWord+"%' or OCCUPATION_NAME like '%"+keyWord+"%')";
	    	};
	    };*/

	    //modify by wangzj 20160827
	    var keyWord = opts.keyWord;
		var page = opts.page;
		var whereSql = '';
		var sql = '';

		if("" != keyWord && typeof opts.keyWord != 'undefined'){
	    	if(opts.ruler){
	    		whereSql+=" and (OCCUPATION_CODE = '"+keyWord+"' or OCCUPATION_NAME = '"+keyWord+"')";
	    	}else{
	    		whereSql+=" and (OCCUPATION_CODE like '%"+keyWord+"%' or OCCUPATION_NAME like '%"+keyWord+"%')";
	    	};
	    };
	    sql = "select (select count(1) from  T_OCCUPATION where OCCUPATION_VER='002'"+whereSql+" ) as totalnumber, a.*  from T_OCCUPATION  a where a.OCCUPATION_VER='002' "+whereSql;
	    

//	    var countStart = (page-1)*10+1;
	    var countStart = (page-1)*10;

	    var json = {
	        "databaseName":Variables.professionalBase,
	        "sql": sql+" order by OCCUPATION_CODE asc limit " + countStart + ",10"
	    };
		queryTableDataUseSql(json,function(data){ 
			//调用成功
			opts.callBack && opts.callBack(data);
		},function(){
			console.log('查询出错！');
		});
	};

	return {
		searchOccupation: function (opts) {
			searchOccupationFn(opts);
		}
	}
}]);

//客户增、删、改、查
AppServices.factory('UsrData', ['$rootScope', '$state', '$timeout', '$ionicPopup', 'Variables', 'CommonFn', 'dataInit', 'synchronizeData', function ($rootScope, $state, $timeout, $ionicPopup,Variables, CommonFn, dataInit, synchronizeData) {
	//静态数据用于测试
	var staticData = [];
	var SCOPE = null;
	var customListCache = null; //此登陆用户的所有客户

	//获取客户列表
	var getListFn = function (opts, fn) {
		SCOPE = opts.scope;

		if(opts.getStaticData){
			//取静态数据
			SCOPE.CustomerLists = staticData;
		}else{
			//从服务器上取得新数据
			var reg = /undefined/g;
			if(reg.test(Variables.dataBaseName)){
				alert('数据库路径错误，缺少appId');
				return;
			};
			
			//alert(Variables.dataBaseName);
			queryTableDataByConditions({
				"databaseName": Variables.dataBaseName,
	            "tableName": "T_CUSTOMER",
	            "conditions": {
	            	"AGENT_CODE": Variables.agentCode,
	            	"DELETE_FLAG": "0"
	            }
			},function (CallBackData) {
				customListCache = CommonFn.cloneArr(CallBackData).reverse();
				SCOPE.CustomerLists = CallBackData.reverse();
				SCOPE.$apply(SCOPE.CustomerLists);
				fn && fn();
			},function(){
				alert('获取客户列表失败');
			});
		};
	};

	//更新用户头像
	function updateUsrIcon(id, url) {
		for(var j=0; j<customListCache.length; j++){
			if(customListCache[j].ID == id){
				customListCache[j].ICON = url;
				break;
			};
		};

		//从model列表中编辑
		for(var i=0; i<SCOPE.CustomerLists.length; i++){
			if(SCOPE.CustomerLists[i].ID == id){
				SCOPE.CustomerLists[i].ICON = url;
				break;
			};
		};

		SCOPE.$apply(SCOPE.CustomerLists);
	};

	//从内存中获取客户详情
	var getUsrDetailFn = function (opts) {

		var dataSearch = {};
		var dataResult = {};
		var translateDataArr = Variables.translateDataArr;

		for(var i=0; i<customListCache.length; i++){
			if(customListCache[i].ID == opts.ID){
				dataSearch = customListCache[i];
				break;
			};
		};

		if(opts.copy){
			angular.forEach(dataSearch, function (value, key) {
				dataResult[key] = value;
			});
		}else{
			dataResult = dataSearch;
		};
		
		//是否把code转化为名称
		if(opts.tanslateCode){
			//把code值转化为名称
			var codeType,
				codeKey;

			if(translateDataArr.length){
				for(var i=0; i<translateDataArr.length; i++){
					codeKey = translateDataArr[i].beTranslatedKey;
					codeType = translateDataArr[i].codeType;
					dataResult[codeKey] = CommonFn.codeToCodeName(dataInit.allCode[codeType].codeMap, dataResult[codeKey]);
				};
			};
		};

		if('$$hashKey' in dataResult){
			delete dataResult.$$hashKey;
		};

		return dataResult;
	};

	//从数据库里获取客户详情
	function getUsrDetailNew(opts, callBack) {
		queryTableDataByConditions({
			"databaseName": Variables.dataBaseName,
            "tableName": "T_CUSTOMER",
            "conditions": {
            	"ID": opts.ID
            }
		},function (CallBackData) {
			var dataSearch = CallBackData[0];
			var dataResult = {};
			var translateDataArr = Variables.translateDataArr;

			if(opts.copy){
				angular.forEach(dataSearch, function (value, key) {
					dataResult[key] = value;
				});
			}else{
				dataResult = dataSearch;
			};
			
			//是否把code转化为名称
			if(opts.tanslateCode){
				//把code值转化为名称
				var codeType,
					codeKey;

				if(translateDataArr.length){
					for(var i=0; i<translateDataArr.length; i++){
						codeKey = translateDataArr[i].beTranslatedKey;
						codeType = translateDataArr[i].codeType;
						/*
							xiaohuiyang - 收入信息取出的时候，不需要转换
						*/
						if(codeKey == "INCOME_WAY"){
							dataResult[codeKey] = dataResult[codeKey];
						}else{
							dataResult[codeKey] = CommonFn.codeToCodeName(dataInit.allCode[codeType].codeMap, dataResult[codeKey]);
						}
					};
				};
			};
			callBack && callBack(dataResult);
		},function(){
			alert('获取客户列表失败');
		});
	};

	//判断是否有此客户
	function hasUsr(id) {
		for(var i=0; i<customListCache.length; i++){
			if(customListCache[i].ID == id){
				return true;
			};
		};
		return false;
	};

	//编辑客户资料
	var editUsrDataFn = function (newData, fn) {
		if(newData.test){
			editSeccess (newData);
		}else{
			setUsrFn(newData, fn);
		};
	};

	//编辑成功
	function editSeccess (newData) {
		//从缓存列表中编辑
		for(var j=0; j<customListCache.length; j++){
			if(customListCache[j].ID == newData.ID){
				customListCache.splice(j,1);
				customListCache.unshift(newData);
				break;
			};
		};

		//从model列表中编辑
		for(var i=0; i<SCOPE.CustomerLists.length; i++){
			if(SCOPE.CustomerLists[i].ID == newData.ID){
				SCOPE.CustomerLists.splice(i,1);
				SCOPE.CustomerLists.unshift(newData);
				break;
			};
		};
		$rootScope.commonModule.goBack(Variables.editCustom);
	};

	//提交表单时，把名称转化为code
	function translateTheNameToCode (dataSorce, arrRule) {
		var modelKey = '';
		var codeMapName = '';

		for(var i=0; i<arrRule.length; i++){
			modelKey = arrRule[i].beTranslatedKey;
			codeMapName = arrRule[i].codeType;
			/**
				xiaohuiyang - 对收入信息进行多选修改
			*/
			if(modelKey == "INCOME_WAY"){
				if(dataSorce[modelKey]){
					/**
					var str_arr = dataSorce[modelKey].split(",");
					dataSorce[modelKey] = "";//清空一下
					
					for(var j = 0 ; j < str_arr.length ; j ++ ){
						dataSorce[modelKey] += CommonFn.codeNameToCode(dataInit.allCode[codeMapName].codeMap, str_arr[j]) + ",";
					}
					if(dataSorce[modelKey]!=""){
						dataSorce[modelKey] = dataSorce[modelKey].substr(0,dataSorce[modelKey].length - 1);
					}
					**/
					
				};
			}else{
				if(dataSorce[modelKey]){
					dataSorce[modelKey] = CommonFn.codeNameToCode(dataInit.allCode[codeMapName].codeMap, dataSorce[modelKey]);
				};
			}
		};
	};

	var clearTime = false;
	//添加或编辑客户
	var setUsrFn = function (opts, fn) {
		clearTime = false;
		setTimeout(function(){
			if(!clearTime){
				CommonFn.hideLoading();
				CommonFn.ionicAlert("网络信号不稳定，请换个网络环境操作!");
			}
		}, 10000);
	
		opts.data = angular.copy(opts.data);

		var dateNow           = CommonFn.getTimeNowFn();
		var dateCreate        = dateNow.timeMs;

		if(opts.add){
//			opts.data.ID      = CommonFn.createUUid();
			opts.data.ID      = CommonFn.generatePrimaryKey();
		};
		
		if(!CommonFn.isExist(opts.data.CREATE_TIME)){
			opts.data.CREATE_TIME = dateCreate;
		};

		opts.data.UPDATE_TIME = dateCreate;
        opts.data.AGENT_CODE  = Variables.agentCode;

        //提交数据到数据库时，把名称转化为code
        translateTheNameToCode(opts.data, Variables.translateDataArr);

        //去除一些ionic框架添加的额外字段
        if('$$hashKey' in opts.data){
        	delete opts.data['$$hashKey'];
		};

		//不允许提交value为null的值
		angular.forEach(opts.data, function (value, key) {
			if(value == null || value == ''){
				opts.data[key] = '';
			};
		});

		
		if(opts.test){
			//addCustomSuccess(opts.data, opts.jumpToDetail);
			fn && fn(SCOPE, opts.data);
		}else{
			var ManipulateJson = {
				"databaseName": Variables.dataBaseName,
				"tableName"   : opts.formName,
				"conditions"  : [{"ID": opts.data.ID}],
				"data"        : [opts.data]
			};
			//保存数据时需判断网络状态
			CommonFn.checkConnection(function(bOnline) {
				if(bOnline){
					if(Variables.withoutDataSynchronize){
						//alert('不同步数据到服务器,只保存在本地数据库');
						ManipulateJson.data[0].FLAG = 'N';
						saveUsrToLocalDB();
						return;
					};

					//上传到服务器前，去掉FLAG字段
					ManipulateJson.data[0].FLAG = 'Y';

					
					//先向服务器保存数据
					synchronizeData.addUsrToServerFn(opts.data, function() {
						
						ManipulateJson.data[0].FLAG = 'Y';
						saveUsrToLocalDB();
						clearTime = true;
					}, function() {
						ManipulateJson.data[0].FLAG = 'N';
						saveUsrToLocalDB();
						clearTime = true;
					});
				}else{

					
					//alert('无网状态下保存');
					ManipulateJson.data[0].FLAG = 'N';
					saveUsrToLocalDB();
					clearTime = true;
				};
			});

			//插入数据到本地数据库
			function saveUsrToLocalDB() {
				//插入数据到本地数据库
				ManipulateJson.data[0].DELETE_FLAG = '0';
				 delete ManipulateJson.data[0].COMPANY_fourVILLAGE;
				 delete ManipulateJson.data[0].COMPANY_fourAreaType;
				 delete ManipulateJson.data[0].COMPANY_fiveVILLAGE;
				 delete ManipulateJson.data[0].COMPANY_fiveAreaType;
				 delete ManipulateJson.data[0].HOME_fourVILLAGE;
				 delete ManipulateJson.data[0].HOME_fourAreaType;
				 delete ManipulateJson.data[0].HOME_fiveVILLAGE;
				 delete ManipulateJson.data[0].HOME_fiveAreaType;

				// alert(JSON.stringify(ManipulateJson.data[0]));

				updateORInsertTableDataByConditions(ManipulateJson,function(str){
					if(1 == str[0]){
						//addCustomSuccess(opts.data, opts.jumpToDetail);
						fn && fn(SCOPE, opts.data, customListCache);
					}else{
						alert('新增客户失败');
					}
				},function(){
					alert("数据插入异常！");
				})
			};

		};
	};

	//添加客户成功
	var addCustomSuccess = function (data, jump) {
		customListCache.unshift(data);
		SCOPE.CustomerLists.unshift(data);
		//SCOPE.$apply(SCOPE.CustomerLists);
		if($rootScope.commonModule.isPad){
			if(jump){
				//如果是pad，则添加完新客户后，跳转到此客户的详情展示页；
	      		$state.go('app.CustomerMain.usrDetailJump',{usrListId: data.ID});
	      		$rootScope.commonModule.CustomerHide = false;
			};
	    }else{
	      //如果是手机，则返回列表
	      $rootScope.commonModule.goBack();
	    };
	};

	//删除客户
	var deleteUsrFn = function (opts, fnScc) {
		//是否只从静态数据中删除
		if(opts.useStaticData){
			deleteUsrInStaticData(opts, fnScc);
		}else{
			//判断网路
			CommonFn.checkConnection(function(bOnline) {
				if(bOnline){
					//在服务器上删除数据
					//alert('在线删除');
					$ionicPopup.confirm({
						title: '提示',
						content: '在线删除',
						okText:'确定',
			   			cancelText: '取消',
			   			okType: 'myokbutton',
			   			cancelType:'mycancelbutton'
					}).then(function (res) {
						if (res) {
							synchronizeData.deleteDataInCloudFn(opts.ID, function() {
								//从本地数据库删除客户
								//alert('删除成功');
								deleteCustomInLocal(opts, fnScc);
							}, function() {
								//alert('删除插件出错');
								$ionicPopup.alert({
								    title: '提示',
								    template: '删除插件出错'
								});
								setDeleteFlagInLocal(opts, fnScc);
							});
						};
					});
					
				}else{
					//没网情况下，直接删除本地数据
					//alert('离线删除');
					$ionicPopup.confirm({
						title: '提示',
						content: '离线删除',
						okText:'确定',
			   			cancelText: '取消',
			   			okType: 'myokbutton',
			   			cancelType:'mycancelbutton'
					}).then(function (res) {
						if (res) {
							setDeleteFlagInLocal(opts, fnScc);
						};
					});
				};
			});
		};
	};

	//在本地数据库中删除客户
	function deleteCustomInLocal(opts, fnScc) {
		//alert('调用插件删除本地数据');
		var executeUpdateJson = {
			"databaseName":Variables.dataBaseName, 
			"tableName": "T_CUSTOMER",
			"sql":"update "+ 'T_CUSTOMER' +" set " + "FLAG" + " = 'Y' , DELETE_FLAG = '1' where ID = '" + opts.ID + "'"
		};
		executeUpdateSql(executeUpdateJson,function(){
			//alert('本地数据删除成功');
			$ionicPopup.alert({
				title: '提示',
				template: '数据删除成功',
				okText:'确定',
				okType: 'myokbutton'
			});
			deleteUsrInStaticData(opts, fnScc);
		},function() {
			alert('插件调用失败');
		});
	};

	//离线情况下删除客户
	function setDeleteFlagInLocal(opts, fnScc) {
		var executeUpdateJson = {
			"databaseName":Variables.dataBaseName, 
			"tableName": "T_CUSTOMER",
			"sql":"update "+ 'T_CUSTOMER' +" set " + "FLAG" + " = 'N' , DELETE_FLAG = '1' where ID = '" + opts.ID + "'"
		};
		executeUpdateSql(executeUpdateJson,function(){
			deleteUsrInStaticData(opts, fnScc);
		});
		$ionicPopup.alert({
				title: '提示',
				template: '离线数据删除成功',
				okText:'确定',
				okType: 'myokbutton'
		});
	};

	//从本地数据库删除客户
	/*function deleteCustomInLocal(opts, fnScc) {
		//调用原生插件删除
		deleteTableData({
			"databaseName": Variables.dataBaseName,
			"tableName": "T_CUSTOMER",
			"conditions": [{
				"ID": opts.ID
			}]
		},function(arr){
			if(1 == arr[0]){	
				deleteUsrInStaticData(opts, fnScc);
			}else{
				alert('删除失败');
			}
	    },function(){
	        alert("数据删除异常！");
	    });
	};*/

	//从scope上删除客户
	var deleteUsrInStaticData = function (opts, fnScc) {
		//从缓存列表中删除
		for(var j=0; j<customListCache.length; j++){
			if(customListCache[j].ID == opts.ID){
				customListCache.splice(j,1);
			};
		};

		//从model列表里删除
		for(var i=0; i<SCOPE.CustomerLists.length; i++){
			if(SCOPE.CustomerLists[i].ID == opts.ID){
				SCOPE.CustomerLists.splice(i,1);
				fnScc && fnScc();
			};
		};
	};

	//搜索客户
	var searchUsrFn = function (scope) {
		var keyWord = scope.MyCustomerListCtrlModule.data.keyWord;
		var sql = "select * from T_CUSTOMER";
	    if("" != keyWord){
	    	sql+=" where REAL_NAME like '%"+keyWord+"%' and AGENT_CODE = "+Variables.agentCode+" and  DELETE_FLAG ='0' ";
	    }else{
	    	getListFn({
		      getStaticData: false,
		      scope: scope
		    });
	    	return;
	    };

	    var json = {
	        "databaseName":Variables.dataBaseName,
	        "sql": sql
	    };

		queryTableDataUseSql(json,function(CallBackData){ //调用成功
			SCOPE.CustomerLists = CallBackData.reverse();
			SCOPE.$apply(SCOPE.CustomerLists);
		},function(){
			console.log('查询出错！');
		});
	};

	function checkCustomHas (name) {

		for(var i=0; i<customListCache.length; i++){
			if(customListCache[i].REAL_NAME == name){
				return true;
			};
		};

		return false;
	};

	//整理客户倾向性选择数据
	function straightenCustom(arr) {
		var arrResult = [];

		for(var i = 0; i < arr.length; i++){
			if(arr[i].checked){
				arrResult.push(CommonFn.codeNameToCode(dataInit.allCode.accounttendency.codeMap, arr[i].type));
			};
		};

		return arrResult.join(',');
	};
	
	//整理客户收入信息选择数据
	function straightenCustom_INCOME_WAY(arr) {
		var arrResult = [];

		for(var i = 0; i < arr.length; i++){
			if(arr[i].checked){
				arrResult.push(CommonFn.codeNameToCode(dataInit.allCode.incomeway.codeMap, arr[i].type));
			};
		};

		return arrResult.join(',');
	};
	
	//接口导出
	return {
		//获取客户列表
		getList: function (opts, fn) {
			getListFn(opts, fn);
		},

		//获取客户个人详情
		getUsrDetail: function (opts) {
			return getUsrDetailFn(opts);
		},

		getUsrDetailNewFn: function(opts, callBack) {
			getUsrDetailNew(opts, callBack);
		},

		//新增客户
		setUsr: function (opts, fn) {
			setUsrFn(opts, fn);
		},

		//编辑客户
		editUsrData: function (opts, fn) {
			editUsrDataFn(opts, fn);
		},

		//删除客户
		deleteUsrList: function (opts, fnScc) {
			deleteUsrFn(opts, fnScc);
		},

		//查找客户
		searchUsr: function (opts) {
			searchUsrFn(opts);
		},

		addCustomSuccessFn: function(data, jump){
			addCustomSuccess(data, jump);
		},

		editSeccessFn: function (data) {
			editSeccess(data);
		},

		checkCustomHasFn: function (name) {
			return checkCustomHas(name);
		},

		hasUsrFn: function(id) {
			return hasUsr(id);
		},

		updateUsrIconFn: function(id, url) {
			updateUsrIcon(id, url);
		},

		straightenCustomFn: function(opts) {
			return straightenCustom(opts);
		},
		
		straightenCustom_INCOME_WAY_Fn: function(opts) {
			return straightenCustom_INCOME_WAY(opts);
		}
	}
}]);

//获取客户关系信息
AppServices.factory('relationshipData', ['Variables', 'UsrData', 'CommonFn', 'dataInit', 'synchronizeData', function (Variables, UsrData, CommonFn, dataInit, synchronizeData) {
	var familyData = null;//RELATION
	var relationData = dataInit.allCode.relation.codeMap;//关系代码CODE
	var resultRelationMsg = [];
	
	function getFamilyDataFn(opts, fn) {
		//根据客户id查询此客户的所有家属信息(relation)
		queryTableDataByConditions({
			"databaseName": Variables.dataBaseName,
            "tableName": "T_CUSTOMER_FAMILY",
            "conditions": {
            	"FIRST_CUSTOMER_ID": opts.id
            }
		},function (CallBackData) {
			familyData = CallBackData;
			sortTheRelation(familyData, fn);
		},function(){
			alert('获取关系信息失败');
		});
	};

	//以关系code为字段分类客户的所有关系信息
	function sortTheRelation (arrFamily, fn) {
		resultRelationMsg.length = 0;
		
		for(var i=0; i<arrFamily.length; i++){
			var relationKey  = arrFamily[i].RELATION;
			var secondCode   = arrFamily[i].SECOND_CUSTOMER_ID;
			var relationName = getRelationNameFromCode(relationKey, relationData);
			var familyMsg    = UsrData.getUsrDetail({ID: secondCode});

			if('ID' in familyMsg){
				familyMsg.relationName = relationName;
				resultRelationMsg.push(familyMsg);
			};
		};

		fn && fn(resultRelationMsg);
	};

	//根据关系code查找关系名称
	function getRelationNameFromCode (code, codeArr) {
		for(var i=0; i<codeArr.length; i++){
			if(codeArr[i].CODE == code){
				return codeArr[i].CODE_NAME;
			};
		};
	};


	var count = 0;

	//插入客户的关系信息
	function addCustomRelationShipFn (arr, id, fn, countRelation) {
		if(!arr.length){
			return;
		};

		var newCustomData       = {};
	    var relationShipDataNow = arr.pop();

	    (function (relationShipData) {
	    	newCustomData.SEX       = relationShipData.SEX;
		    newCustomData.REAL_NAME = relationShipData.REAL_NAME;
		    newCustomData.BIRTHDAY  = relationShipData.BIRTHDAY;
		    newCustomData.AGE       = relationShipData.AGE;

		    UsrData.setUsr({
				data        : newCustomData,
				test        : false,
				add         : true,
				formName    : 'T_CUSTOMER'
			},function (SCOPE, data, customListCache){
				customListCache.unshift(data);
				SCOPE.CustomerLists.unshift(data);
				addFamily(data, relationShipData.relationShipType, id, function(){

					//添加关系信息成功后再添加下一个关系信息
					addCustomRelationShipFn(arr, id, fn, countRelation);

					count++;
					if(count == countRelation){
						fn && fn();
						//重置count
						count = 0;
					};
				});
			});

	    })(relationShipDataNow);
	};

	//向家庭表里插入客户
	function addFamily (data, relationType, id, fn) {

        //去除一些ionic框架添加的额外字段
        if('$$hashKey' in data){
        	delete data['$$hashKey'];
		};

		//不允许提交value为null的值
		angular.forEach(data, function (value, key) {
			if(value == null){
				value = '';
			};
		});

		var familyKey = CommonFn.createUUid();
		var sendJson = {
			"ID": familyKey, //家庭信息ID
			"FIRST_CUSTOMER_ID": id,//主客户id
			"SECOND_CUSTOMER_ID": data.ID,//从客户id
			"RELATION": relationType.CODE,//关系
			"CREATE_TIME":data.CREATE_TIME,//创建时间
			"UPDATE_TIME":data.UPDATE_TIME,
			"AGENT_CODE": Variables.agentCode,
			"FLAG": 'Y'
		};

		//先向服务器提交关系数据
		synchronizeData.addCustormRelationFn(sendJson, function() {
			sendJson.FLAG = 'Y';
			restoreRelationToLocal(sendJson, familyKey, fn);
		}, function() {
			sendJson.FLAG = 'N';
			restoreRelationToLocal(sendJson, familyKey, fn);
		});
		
	};

	//插入关系到本地数据库
	function restoreRelationToLocal(sendJson, familyKey, fn) {
		var relationJson = {
			"databaseName": Variables.dataBaseName,
			"tableName"   : 'T_CUSTOMER_FAMILY',
			"conditions"  : [{"ID": familyKey}],
			"data"        : [sendJson]
		};
		
		//插入数据到本地数据库
		updateORInsertTableDataByConditions(relationJson,function(str){
			if(1 != str[0]){	
				alert('失败');
			}else{
				fn && fn();
			};
		},function(){
			alert("数据插入异常！");
			fn && fn();
		})
	};

	return {
		//根据ID获取客户关系信息
		getRelation: function (opts, fn) {
			getFamilyDataFn(opts, fn);
		},

		addCustomRelationShip: function (arr, id, fn, countRelation) {
			count = 0;
			addCustomRelationShipFn(arr, id, fn, countRelation);
		}
	};
}]);