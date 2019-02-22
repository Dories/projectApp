var filterModule = angular.module('starter.filters', []);

//若无数据，返回暂无标示
filterModule.filter('showDefaultData', function(){
	var defaultDataFilter = function (data, argOne) {
		argOne = argOne || '';

		return data?data:'' + argOne;
	};
	return defaultDataFilter;
});

filterModule.filter('showNoNum', function() {
	var defaultDataFilter = function (data, argOne) {
		argOne = argOne || '';

		return data?data:'无' + argOne;
	};
	return defaultDataFilter;
});

filterModule.filter('showDefaultDataEmpty', function(){
	var defaultDataFilter = function (data, argOne) {
		argOne = argOne || '';
		return data?data:argOne;
	};
	return defaultDataFilter;
});

//code转化为名称
filterModule.filter('codeToName', ['dataInit', 'CommonFn', function (dataInit, CommonFn) {

	var nationCodeFilter = function (data, argOne) {
		if(data != null){
			if(data){
				if(argOne == 'accounttendency' || argOne == 'incomeway'){
					var arr = data.split(',');
					var newArr = [];

					for(var i = 0; i < arr.length; i++){
						newArr.push(CommonFn.codeToCodeName(dataInit.allCode[argOne].codeMap, arr[i]));
					};

					return newArr.join(',')
				}else{
					if(argOne == 'province' ){
						return data;
					}
					if(argOne == 'city'){
						return data;
					}
					return CommonFn.codeToCodeName(dataInit.allCode[argOne].codeMap, data);	
				};
				
			}else{
				return '';
			};
			
		}else{
			return '';
		};
	};
	return nationCodeFilter;
}]);

//年龄
filterModule.filter('age', ['CommonFn', function(CommonFn) {
	var defaultDataFilter = function (data) {
		
		if(CommonFn.isExist(data)){
			return data+'岁';
		}else{
			return '年龄';
		};
	};
	return defaultDataFilter;
}]);

//年龄数据过滤
filterModule.filter('ageFilter', ['CommonFn', function(CommonFn) {
	var defaultDataFilter = function (data) {
		if(CommonFn.isExist(data)){
			return data + '岁';
		}else{
			return '';
		};
	};
	return defaultDataFilter;
}]);