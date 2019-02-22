;(function(){

	window.formCheckHandle = asyncValidateFn;

	/***
	 * @author: Li Jie
	 * @date 2015-1-14
	 * 说明 :解析验证规则xml
	 * @param:xmlUrl文件路径,formElementID表单ID，formElementValue表单值
	 */
	function asyncValidateFn(xmlUrl,formElementID,formElementValue,formEl2,formElVal2){
		 var xmlDoc = getDomByUrl(xmlUrl);  
		 var formElementValueEx = formElementValue;
		 var formElVal2Ex = formElVal2;
		 var returnFalg = false;
		 var message = '';

		 //解析通用xml验证规则
		 if(xmlDoc != null){
		 	var fieldList = xmlDoc.getElementsByTagName("field"); 

		 	if(fieldList != null && fieldList.length > 0){ 

		 		for(var i = 0; i<fieldList.length; i++){  
		 			var name = fieldList[i].getAttribute("name"); 
		 			if(name == formElementID){ 
		 				var rulesList = fieldList[i].getElementsByTagName("rules");
		 				if(rulesList != null && rulesList.length > 0){
		 					for(var j = 0; j<rulesList.length; j++){ 
		 						var rule = rulesList[j].getElementsByTagName("rule")[0].childNodes[0].nodeValue;
		 						rule = rule.replaceAll(formElementID, "formElementValueEx");
		 						if(formElVal2Ex){
		 							rule = rule.replaceAll(formEl2, "formElVal2Ex");
		 						}     
		 						message = rulesList[j].getElementsByTagName("message")[0].childNodes[0].nodeValue; 

		 						if(eval(rule)){ 
									returnFalg = false;
		 							break;
		 						}else{
		 							message = '';
									returnFalg = true;
								};
		 					}
		 				};
		 			} 
		 		}
		 	};

			return {
				Falg: returnFalg,
				msg: message
			};
		 }else{
		 	alert("XML文件对象获取失败，请确认路径是否正确！")
		 }
	}


	Date.prototype.Format = function(formatStr)   
	{   
	    var str = formatStr;   
	    var Week = ['日','一','二','三','四','五','六'];  
	  
	    str=str.replace(/yyyy|YYYY/,this.getFullYear());   
	    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));   
	  
	    str=str.replace(/MM/,this.getMonth()>9?this.getMonth().toString():'0' + this.getMonth());   
	    str=str.replace(/M/g,this.getMonth());   
	  
	    str=str.replace(/w|W/g,Week[this.getDay()]);   
	  
	    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());   
	    str=str.replace(/d|D/g,this.getDate());   
	  
	    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());   
	    str=str.replace(/h|H/g,this.getHours());   
	    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());   
	    str=str.replace(/m/g,this.getMinutes());   
	  
	    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());   
	    str=str.replace(/s|S/g,this.getSeconds());   
	  
	    return str;   
	}   

	/**
	 * @功能: 字符串替换
	 * @param {}
	 * @Author:Li Jie
	 * @Date 2014-10-27
	*/
	String.prototype.replaceAll = function (AFindText,ARepText){
		raRegExp = new RegExp(AFindText,"g");
		return this.replace(raRegExp,ARepText);
	}

	function getDomByUrl(xmlUrl){
	   var xmlDoc; 
	   if (window.ActiveXObject) {
	        xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE浏览器
	        xmlDoc.async = false;
	        xmlDoc.load(xmlUrl);
	    }
	    else if (isFirefox=navigator.userAgent.indexOf("Firefox")>0) { //火狐浏览器 
	        xmlDoc = document.implementation.createDocument('', '', null);
	        xmlDoc.load(xmlUrl);
	    }
	    else{ //谷歌浏览器
	           var xmlhttp = new window.XMLHttpRequest();  
	            xmlhttp.open("GET",xmlUrl,false);  
	            xmlhttp.send(null);  
	            xmlDoc = xmlhttp.responseXML;
	        }  
		return xmlDoc;
	}
})();