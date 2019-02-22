var jsbean=(function(){  
	 function jsBean(){ //该对象里面的属性一定要与表单中每个元素的ID保持一致
	 	this.bname="";
	 	this.bsex="";
	 	this.bcity="";
	 	this.age="";
	 	this.bbirthday="";
	 	this.address="";
	 	this.idcardType="";
	 	this.idcard="";
	 	this.proffession="";
	 	this.relation="";
	 	this.username="";
	 	this.sex="";
	 	this.mobile="";
	 	this.hbirthday="";
	 	this.imageUrl="";
	 }
	  
	 
	 //生成建议书所使用的对象,参数传递
	 function recommenDation(){ 
	 	this.insuredUserName ="";//被保人姓名
	 	this.coverUrl ="";//封面
	 	this.loginUser ="";//登录用户
	 	this.workNumber ="";//工号
	 	this.mobile ="";//电话
	 	this.orgname ="";//所属机构
	 	this.createDate =""; //日期
	 	this.insuredUserAge ="";//被保险人年龄
	 	this.insuredProfession ="";//被保险人职业
	 	this.insuredList =""; //险种设计列表(动态取到险种设计列表Div,该值在生成险种设计列表的时候就要赋值实时的操作)
	 	this.insuredName =""; //险种名称
	 	this.insuredCode ="";//险种编号
	 	this.insuredContent="";//险种内容
	 	this.interestList ="";//利益演示列表(动态取到利益演示列表Div,该值在生成利益演示列表的时候就要赋值实时的操作)
	 }  
	  
	   
	 var orecommenDation = new recommenDation();
	 var listCustomer = new Array();
	 
	  //传入Json格式的字符 //var testJson ={"id":"1","name":"张三","sex":"男","year":"5"}
	 function setJsBean(jsonStr,jsbeans){ //将JSON格式的字符串映射给bean对像
	 	try{ 
	 		var jsonObj = eval(jsonStr);
		 	if(jsonObj){ 
		 		for(pop in jsonObj){
		 			 for(property in jsbeans){ 
		 			 	 if(property == pop){ 
		 			 	 	jsbeans[property] = jsonObj[pop]; 
		 			 	 }
		 			 }
		 		} 
		 		return jsbeans;
		 	}else{
		 		alert("在setJsBean时,传入的Json格式错误");
		 	}
	 	}catch(e){
	 		alert("在setJsBean时，抛出异常！");
	 	}
	 	
	 }
	 
      return { 
        setJsBean:setJsBean,
        listCustomer:listCustomer,
        getRecommenDation:orecommenDation //返回建议书使用参数对象
     }
})();