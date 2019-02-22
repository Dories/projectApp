var AppController = angular.module('starter.controllers', [])
function changefn(){
  //alert("idValue==>"+document.getElementById('idNumber').value);
  document.getElementById('idNumber').value = '';
}
//获取客户列表 
AppController.controller('MyCustomerListCtrl', ['$scope', '$rootScope', '$state', 'CommonFn', 'UsrData', 'Variables', 'synchronizeData', 'dataInitRequest','setVariables', function ($scope, $rootScope, $state, CommonFn, UsrData, Variables, synchronizeData, dataInitRequest,setVariables) {
  //显示右侧顶部头部
  CommonFn.showBarFn();
  
  //搜索框样式设置
  $scope.searchStyle = (brows().iphone) ? "searchBoxOfIphone" : "searchBoxOfAndroid";
  
  //获取客户列表
  document.addEventListener('deviceready', function(){
    //根据url存储一些常量
    setVariables.setVariablesData();
    //获取本地客户
      UsrData.getList({
        getStaticData: false,
        scope: $scope
      },function () {
        dataInitRequest.getAllCodeMsg(function(){
          if(Variables.editCustom == 'true'){
            if(!CommonFn.isExist(Variables.insurancerId)){
              CommonFn.myAlert('缺少客户ID');
              CommonFn.closeWebViewFn({});
              return;
            };
            
            if(UsrData.hasUsrFn(Variables.insurancerId)){
              $rootScope.commonModule.CustomerHide = true;
              $state.go('app.CustomerMain.usrDetailJump',{usrListId: Variables.insurancerId});
            }else{
              UsrData.getUsrDetailNewFn(Variables.insurancerId, function(data) {
                if(!data){
                  CommonFn.myAlert('你没创建过此客户');
                  CommonFn.closeWebViewFn({});
                }else{
                  $rootScope.commonModule.CustomerHide = true;
                  $state.go('app.CustomerMain.usrDetailJump',{usrListId: Variables.insurancerId});
                };
              });
            };

          };
        });
      });
  }, false);


  //同步客户列表
  $rootScope.syncCustomerList = function(){
      CommonFn.showLoading('正在从服务器同步数据,请等待...');
      //同步数据
      synchronizeData.commonTableAsyncDataFn(function() {
        CommonFn.hideLoading();
        //localStorage.customSynchronized = '0';//记录是否已经同步过数据
        UsrData.getList({
          getStaticData: false,
          scope: $scope
        },function () {
          dataInitRequest.getAllCodeMsg(function(){
            if(Variables.editCustom == 'true'){
              if(!CommonFn.isExist(Variables.insurancerId)){
                CommonFn.myAlert('缺少客户ID');
                CommonFn.closeWebViewFn({});
                return;
              };
              
              if(UsrData.hasUsrFn(Variables.insurancerId)){
                $rootScope.commonModule.CustomerHide = true;
                $state.go('app.CustomerMain.usrDetailJump',{usrListId: Variables.insurancerId});
              }else{
                UsrData.getUsrDetailNewFn(Variables.insurancerId, function(data) {
                  if(!data){
                    CommonFn.myAlert('你没创建过此客户');
                    CommonFn.closeWebViewFn({});
                  }else{
                    $rootScope.commonModule.CustomerHide = true;
                    $state.go('app.CustomerMain.usrDetailJump',{usrListId: Variables.insurancerId});
                  };
                });
              };
              
            };
          });
        });
      });
  }
  var searchUsrList = function () {
    UsrData.searchUsr($scope);
  };

  //接口导出
  $scope.MyCustomerListCtrlModule = {
    data:{
      keyWord: ''
    },
    connection: window.navigator.onLine,
    fn: {
      searchUsrFn: searchUsrList
    }
  };

}]);

//获取客户详情 
AppController.controller('CustomerDetailCtrl', ['$scope', '$stateParams', '$rootScope', '$ionicPopover', '$state', '$ionicActionSheet', 'CommonFn', 'UsrData', 'relationshipData', 'Variables', 'manuScriptServer', 'synchronizeData', function ($scope, $stateParams, $rootScope, $ionicPopover, $state, $ionicActionSheet, CommonFn, UsrData, relationshipData, Variables, manuScriptServer, synchronizeData) {

  if($rootScope.commonModule.isPad){
    //如果是pad显示右侧顶部头部
    CommonFn.showBarFn();
  };

  //获取客户id
  var id = $stateParams.usrListId;

  //scope接口导出
  $scope.CustomerDetailModule = {
    attr: {
      tabIndex      : "basicMsg",
      buttonText    : '',
      create        : '',
      recommend     : '',
      relationIndex : null,
      closeDetailBtn: Variables.editCustom
    },
    data: null,//UsrData.getUsrDetail({ID: id, tanslateCode:false}),
    connection: window.navigator.onLine,
    relationList: [],
    fn  : {
      openPopoverFn   : openPopover,
      closePopoverFn  : closePopover,
      deleteUsrFn     : deleteUsr,
      setPlatformFn   : setPlatform,
      appJumpFn       : appJump,
      chooseRelationFn: chooseRelation,
      showActionsheet : showActionsheet,
      goEditPage      : goEditPage
    }
  };
  //获取客户详情
  UsrData.getUsrDetailNewFn({ID: id, tanslateCode:false}, function(data) {
    var organCode='';
    organCode = window.localStorage.getItem('organCode');
    $scope.CustomerDetailModule.data = data;
    //针对山西机构把4，5级地址放到address
    if(organCode.substr(0,4) == '8614'){
      var COMPANY_ADDRESS = $scope.CustomerDetailModule.data.COMPANY_ADDRESS;
      var s_COMPANY_ADDRESS='';
      var lastStr = COMPANY_ADDRESS.split('@%@');
          for(i=0;i<lastStr.length;i++){
            s_COMPANY_ADDRESS+=lastStr[i];
          }
          $scope.CustomerDetailModule.data.COMPANY_ADDRESS=s_COMPANY_ADDRESS; // 单位地址
      var HOME_ADDRESS = $scope.CustomerDetailModule.data.HOME_ADDRESS;
      var s_HOME_ADDRESS = '';
      var lastStr = HOME_ADDRESS.split('@%@');
          for(i=0; i< lastStr.length;i++){
            s_HOME_ADDRESS += lastStr[i];
          }
          $scope.CustomerDetailModule.data.HOME_ADDRESS=s_HOME_ADDRESS;  // 家庭住址
    }
    // 日期时间戳和日期转换  add by renxiaomin 2016.11.23
    if((typeof $scope.CustomerDetailModule.data.ID_END_DATE == 'string') && $scope.CustomerDetailModule.data.ID_END_DATE != '长期有效' ){
      var R=new Date();
      var newY=R.getFullYear();
      $scope.validity=$scope.CustomerDetailModule.data.ID_END_DATE;
      var oldY=Number($scope.validity.substr(0,4));
     if((oldY-newY)>=90 || oldY==9999){
        $scope.CustomerDetailModule.data.ID_END_DATE='长期有效';
     }else{
        $scope.CustomerDetailModule.data.ID_END_DATE=$scope.validity;
     }     
    }
    //年龄0岁的转换
    var birthday = $scope.CustomerDetailModule.data.BIRTHDAY;
    var age="";
    if(CommonFn.isExist(birthday)){
      var birthdayArr = birthday.split('-');
      var birthdayDate = new Date();
      var dateNow = new Date();

      birthdayDate.setFullYear(parseInt(birthdayArr[0], 10));
      birthdayDate.setMonth(parseInt(birthdayArr[1], 10) - 1);
      birthdayDate.setDate(parseInt(birthdayArr[2], 10));

      dateNow.setFullYear(parseInt(birthdayArr[0], 10));
      var newDateNow = new Date();
      if(dateNow.getTime() >= birthdayDate.getTime()){        
        age= newDateNow.getFullYear() - parseInt(birthdayArr[0], 10);   
      }else{        
        age= (newDateNow.getFullYear() - parseInt(birthdayArr[0], 10)) - 1;   
      };

      if(age == 0){
        $scope.CustomerDetailModule.data.AGE=0;
      }
        $scope.CustomerDetailModule.data.AGE = age;
    }
    
    $scope.$apply($scope.CustomerDetailModule.data);
  });   

  //跳转到编辑界面
  function goEditPage () {
    if(CommonFn.isExist($scope.CustomerDetailModule.data.TYPE) && $scope.CustomerDetailModule.data.TYPE == '01'){
      CommonFn.ionicAlert('该客户已投保，移动端不允许再次更改客户信息。如原客户信息有误，请重新添加客户。');
      return;
    };
    CommonFn.showLoading('表单加载中...');
    $rootScope.commonModule.CustomerHide = true;
    setTimeout(function(){
      $state.go('app.CustomerMain.editUsr',{usrListId: id});
    },200);
  };

  //上传头像
  function showActionsheet () {
    var hideSheet = $ionicActionSheet.show({
      titleText: '上传头像',
      buttons: [
        {
          text: '拍照'
        },
        {
          text: '从相册中选取'
        },
      ],
      cancelText: '取消',
      cancel: function () {
        console.log('CANCELLED');
      },
      buttonClicked: function (index) {
        hideSheet();
        //CommonFn.myAlert('暂不支持修改头像功能!');
        if(index == 0){
          CommonFn.checkConnection(function(bOnline) {
            if(bOnline){
              getPhotoFromCamera(function (imageURL){
                var dateNow           = CommonFn.getTimeNowFn();
                var dateUpdate        = dateNow.timeMs;

                uploadImage(Variables.ip + '/app/agent/uploadphoto', imageURL, id, '', dateUpdate, function (webImgUrl) {
                  synchronizeData.updateLocalUsrIconFn(id, webImgUrl.url, dateUpdate, function() {
                    UsrData.updateUsrIconFn(id, webImgUrl.url);
                    $scope.CustomerDetailModule.data.ICON = imageURL;
                    $scope.$apply($scope.CustomerDetailModule.data.ICON);
                  });
                }, function () {
                  CommonFn.myAlert('头像上传失败!');
                });
              }, function () {
                alert('拍照失败');
              });
            }else{
              CommonFn.myAlert('离线不能修改头像!');
            };
          });

        }else if(index == 1){
          CommonFn.checkConnection(function(bOnline) {
            if(!bOnline){
              CommonFn.myAlert('离线不能修改头像!');
              return;
            };

            getPhotoFromAlbum(1, function (imageURL) {
              var dateNow           = CommonFn.getTimeNowFn();
              var dateUpdate        = dateNow.timeMs;

              uploadImage(Variables.ip + '/app/customer/uploadphoto', imageURL, id, '', dateUpdate, function (webImgUrl) {
                //alert(JSON.stringify(webImgUrl));
                synchronizeData.updateLocalUsrIconFn(id, webImgUrl.url, dateUpdate, function() {
                  UsrData.updateUsrIconFn(id, webImgUrl.url);
                  $scope.CustomerDetailModule.data.ICON = imageURL;
                  $scope.$apply($scope.CustomerDetailModule.data.ICON);
                });
              }, function () {
                CommonFn.myAlert('头像上传失败!');
              });
            }, function () {
              alert('选择照片失败');
            });
          });
        };
      },
      destructiveButtonClicked: function () {
        console.log('DESTRUCT');
        return true;
      }
    });
  };

  //tab切换
  function setPlatform (indexValue) {
    $scope.CustomerDetailModule.attr.tabIndex = indexValue;
  };
  
  //初始化模态框
  var popoverObj = null;
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope,
    bgClick: true
  }).then(function(popover) {
    popoverObj = popover;
  });

  function openPopover ($event) {
    popoverObj.show($event);
  };

  function closePopover () {
    popoverObj.hide();
  };

  $scope.$on('$destroy', function() {
    popoverObj.remove();
  });

  //删除客户
  function deleteUsr () {
    if(Variables.editCustom == 'true'){
      CommonFn.ionicAlert('编辑状态下不能进行此操作');
      return;
    };

    //CommonFn.showLoading('删除中,请等待...');
    UsrData.deleteUsrList({
      ID: id,
      useStaticData: false
    }, function(){
     // CommonFn.hideLoading();
      if($rootScope.commonModule.isPad){
        $scope.commonModule.hideBar();
        $state.go('app.CustomerMain');
      }else{
        $rootScope.commonModule.goBack();
      };
    });
  };

  //判断当前建议书按钮状态
  var recommend = Variables.recommend;

  $scope.CustomerDetailModule.attr.recommend = recommend;

  var jumpSwitch = {
    "1": function(){
      $scope.CustomerDetailModule.attr.buttonText = "选为投保人";
    },

    "2": function() {
      $scope.CustomerDetailModule.attr.buttonText = "选为被保人";
    },

    "3": function() {
      $scope.CustomerDetailModule.attr.favoreetype = Variables.favoreetype;
      $scope.CustomerDetailModule.attr.buttonText = "选为受益人";
    },

    "other": function() {
      $scope.CustomerDetailModule.attr.buttonText = "创建建议书";
      $scope.CustomerDetailModule.attr.create = true;
      $scope.CustomerDetailModule.attr.recommend = '1';
      recommend = 1;
    }
  };

  if(recommend in jumpSwitch){
    jumpSwitch[recommend]();
  }else{
    jumpSwitch.other();
  };

  //如果为编辑状态
  if(Variables.editCustom == 'true'){
    $scope.CustomerDetailModule.attr.buttonText = "编辑完成";//编辑客户
    $scope.CustomerDetailModule.attr.create = false;
  };

  //跳转应用
  function appJump(){
    var selectedRelationIndex = $scope.CustomerDetailModule.attr.relationIndex;
    var sendMsg = null;

    if($scope.CustomerDetailModule.attr.create){
      //创建建议书
      if(!CommonFn.isExist($scope.CustomerDetailModule.data.AGE)){
        CommonFn.ionicAlert('创建建议书时年龄不能为空，请点击编辑按钮前去修改');
        return;
      };
      if(!CommonFn.isExist($scope.CustomerDetailModule.data.IDNO) && !CommonFn.isExist($scope.CustomerDetailModule.data.OCCUPATION_CODE_NAME)){
        CommonFn.ionicAlert('创建建议书时证件号码和职业不能为空');
        return;
      };
      if($scope.CustomerDetailModule.data.AGE >=16 && $scope.CustomerDetailModule.data.IDTYPE=='4'){
        CommonFn.ionicAlert('户口簿仅限16周岁以下中国公民使用，请点击编辑按钮修改客户证件类型！');
        return;
      }
      if($scope.CustomerDetailModule.data.IDTYPE=='7'){
        CommonFn.ionicAlert('证件类型不可为出生证，请点击编辑按钮修改！');
        return;
      }
      manuScriptServer.createMsgFn($scope, $scope.CustomerDetailModule.data, function (sendMsg) {
        manuScriptServer.createManuscriptFn(sendMsg);
      });
    }else{
      if($scope.CustomerDetailModule.data.IDTYPE=='7'){
        CommonFn.ionicAlert('证件类型不可为出生证，请点击编辑按钮修改！');
        return;
      }
      if($scope.CustomerDetailModule.data.AGE >=16 && $scope.CustomerDetailModule.data.IDTYPE=='4'){
        CommonFn.ionicAlert('户口簿仅限16周岁以下中国公民使用，请点击编辑按钮修改客户证件类型！');
        return;
      }
      //选择投保人或者被保人
       if(recommend == '1' || Variables.editCustom == 'true' || recommend == '3'){
        //选择投保人(投保人只能选择客户)
        if(!CommonFn.isExist($scope.CustomerDetailModule.data.AGE)){
          CommonFn.ionicAlert('投保人年龄不能为空，请点击编辑按钮前去修改');
          return;
        };
		 if((Variables.editCustom == 'true' || recommend == '3') && Variables.mustNeedData.length){
          //编辑时校验必填信息
          //alert('检查必填字段');
			for(var i = 0; i < Variables.mustNeedData.length; i++){
           		 if(!(Variables.mustNeedData[i] in $scope.CustomerDetailModule.data) || !CommonFn.isExist($scope.CustomerDetailModule.data[Variables.mustNeedData[i]])){
              		CommonFn.ionicAlert('带*的为必填信息，用户必填信息不能为空');
             		 return;
            };
          };
        };
        manuScriptServer.createMsgFn($scope, $scope.CustomerDetailModule.data, function (sendMsg) {
          manuScriptServer.selectCustomFn(sendMsg);
        });
      }else if(recommend == '2'){
        //选择被保人
        if(!CommonFn.isExist($scope.CustomerDetailModule.data.AGE)){
          CommonFn.ionicAlert('被保人年龄不能为空，请点击编辑按钮前去修改');
          return;
        };
        if(selectedRelationIndex != null){
          manuScriptServer.createMsgFn($scope, $scope.CustomerDetailModule.relationList[selectedRelationIndex], function (sendMsg) {
            manuScriptServer.selectCustomFn(sendMsg);
          });
        }else{
          manuScriptServer.createMsgFn($scope, $scope.CustomerDetailModule.data, function (sendMsg) {
            manuScriptServer.selectCustomFn(sendMsg);
          });
        };
      };
      //选择投保人或者被保人(投保人只能是客户，被保人既可以是客户也可以是家属)
    };
  };

  //选择家属
  function chooseRelation (index) {
    if(recommend != '2'){
      return;
    };
    if($scope.CustomerDetailModule.attr.relationIndex == index){
      $scope.CustomerDetailModule.attr.relationIndex = null;
    }else{
      $scope.CustomerDetailModule.attr.relationIndex = index;
    };
  };

  //获取客户的关系信息
  relationshipData.getRelation({
    id: id
  },function(arr){
    $scope.CustomerDetailModule.relationList = arr;

      //填加家属关系后，详情页面关系信息一栏零岁显示
      for(var i=0;i<arr.length;i++){
        var birthday =  $scope.CustomerDetailModule.relationList[i].BIRTHDAY;
        var age="";
        if(birthday != ""){
          var birthdayArr = birthday.split('-');
          var birthdayDate = new Date();
          var dateNow = new Date();

          birthdayDate.setFullYear(parseInt(birthdayArr[0], 10));
          birthdayDate.setMonth(parseInt(birthdayArr[1], 10) - 1);
          birthdayDate.setDate(parseInt(birthdayArr[2], 10));

          dateNow.setFullYear(parseInt(birthdayArr[0], 10));
          var newDateNow = new Date();
          if(dateNow.getTime() >= birthdayDate.getTime()){        
            age= newDateNow.getFullYear() - parseInt(birthdayArr[0], 10);   
          }else{        
            age= (newDateNow.getFullYear() - parseInt(birthdayArr[0], 10)) - 1;  
          };
          //为避免过滤器过滤掉0，强制赋值0
          if(age == 0){
            $scope.CustomerDetailModule.relationList[i].AGE=0;
          }
        }
      } 
  });

}]);

//加载空白页面 
AppController.controller('blankPageCtrl', ['$scope', '$rootScope', 'CommonFn', function ($scope, $rootScope, CommonFn) {
  //隐藏右侧顶部头部
  CommonFn.hideBarFn();
}]);

//添加新客户 
AppController.controller('addUsrCtrl', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', '$ionicScrollDelegate', '$ionicModal', 'CommonFn', 'UsrData', 'searchOccupationServer', 'relationshipData', 'dataInit', 'checkFormHandle','$ionicActionSheet', function ($scope, $rootScope, $stateParams, $state, $timeout, $ionicScrollDelegate, $ionicModal, CommonFn, UsrData, searchOccupationServer, relationshipData, dataInit, checkFormHandle,$ionicActionSheet) {
  //如果是山西机构显示4，5级详细地址
  var organCode='';
  organCode = window.localStorage.getItem('organCode');
  if(organCode.substr(0,4) == '8614'){
     $scope.isShow = true;    
  }else{
     $scope.isShow = false;
  }

  if($rootScope.commonModule.isPad){
    //如果是pad显示右侧顶部头部
    CommonFn.showBarFn();
  };

  //检测表单是否加载完毕
  var addFormBox = $('#addCustom');
  var timer = setInterval(function(){
    if(!addFormBox.hasClass('ng-enter')){
      CommonFn.hideLoading();
      clearInterval(timer);
    };
  },20);

  //tab切换方法
  function setPlatform(indexValue) {
    $scope.addUsrModule.attr.tabIndex = indexValue;
  };

  //新增客户时收入大于1000万元时弹出确认窗口--add by wangzj
  function checkIncom(event){
    var currentElemen = event.target;
    if(Number(currentElemen.value)>1000){
      currentElemen.blur();
      CommonFn.showConfirm({
        title:"确认",
        content:"您录入客户每年固定收入为"+currentElemen.value+"万元，请再次确认？",
        sure:function(){
        },
        notSure:function(){
          currentElemen.value='';
          $scope.addUsrModule.data.INCOME='';
        }
      });
    }
  }

  //点击保存按钮,添加客户
  function addUsr() {
    //未成年人默认未婚
    if($scope.addUsrModule.data.AGE<18)
    {
      $scope.addUsrModule.data.MARRI_STATUS="未婚";
    }

    var textInput = $('input[type="text"]');
    for(var i = 0; i < textInput.length; i++){
      textInput.get(i).blur();
    };   

    var textInput = $('input[type="number"]');
    for(var i = 0; i < textInput.length; i++){
      textInput.get(i).blur();
    }; 

    //整理客户倾向选择数据
    $scope.addUsrModule.data.ACCOUNT_TENDENCY = UsrData.straightenCustomFn($scope.addUsrModule.staticData.testACCOUNT_TENDENCY);
    //整理客户收入信息选择数据
    $scope.addUsrModule.data.INCOME_WAY = UsrData.straightenCustom_INCOME_WAY_Fn($scope.addUsrModule.staticData.testcompanyType);
  
    //延迟校验
    setTimeout(function(){
      //判断是否选择了性别
      if(!$scope.addUsrModule.data.SEX){
        $('.sexErrorMsg').addClass('my-show');
      };
      //判断用户名是否为空
      if($scope.addUsrModule.data.REAL_NAME == "" || !$scope.addUsrModule.data.REAL_NAME){
        $('.usrNameErrorMsg').addClass('my-show');
        $('.usrNameErrorMsg').text('用户姓名不能为空');

        document.getElementById('relNameWrap').style.border = '1px solid red';

        CommonFn.ionicAlert("用户姓名不能为空");
          return;
      };

      document.getElementById('relNameWrap').style.border = '1px solid #ddd';

      
      //根据身份证号验证客户所选性别是否正确   add   2017.3.27
      var usersex = $scope.addUsrModule.data.SEX;
      var idCard = document.getElementById("idNumber").value;
      var userIdtype = $scope.addUsrModule.data.IDTYPE;
      var beginOne = idCard.charAt(0);
      var beginTwo = idCard.substring(0,2); 
      var ID_END_DATE = $scope.addUsrModule.data.ID_END_DATE;
      var birthdays = $scope.addUsrModule.data.BIRTHDAY;      

      if(typeof birthdays != 'undefined' && birthdays != undefined){
        if(birthdays.indexOf('NaN')>-1){
          CommonFn.ionicAlert('出生日期不符合规范，请返回确认！');
          return;
        }
      }

      if(typeof ID_END_DATE != 'undefined' && ID_END_DATE != undefined){
        if(ID_END_DATE.indexOf('NaN') > -1){
          CommonFn.ionicAlert('证件有效期不符合规范，请返回确认！');
          return;
        }
        var currentData = new Date();
        var currentTime = currentData.getFullYear()+'/'+(currentData.getMonth()+1)+'/'+currentData.getDate();
        if(ID_END_DATE!= '长期有效'){
          var d = new Date(ID_END_DATE.replace(/-/g,"\/"));
          var c = new Date(currentTime);
          if(d<=c){
            CommonFn.ionicAlert('证件有效期不得小于等于当前日期，请返回确认！');
            return;
          }
        }
      }

      if(userIdtype == "居民身份证"){
        if(idCard.length==18){
          var num=idCard.charAt(16);
           if(((num%2==0)&& usersex=="男") || (num%2!=0 && usersex=="女")){
                CommonFn.ionicAlert("您输入的身份证号与所选性别不符！");
                return;
           }           
           if(beginOne == '0' || beginOne == '7' || beginOne == '8' || beginOne == '9'){
            CommonFn.ionicAlert("身份证号不得以"+beginOne+"开头，请仔细核对！");
            return;
           }
           if(beginTwo == '10'){
            CommonFn.ionicAlert("身份证号不得以"+beginTwo+"开头，请仔细核对！");
            return;
           }
           if(!CommonFn.IdentityCodeValid(idCard)){
            CommonFn.ionicAlert("您输入的身份证号有误，请仔细核对！");
            return;
           }
        }else if(idCard.length==15){
          var num1=idCard.charAt(14);
          if(((num1%2==0) && usersex=="男") || (num1%2!=0 && usersex=="女")){
                CommonFn.ionicAlert("您输入的身份证号与所选性别不符！");
                return;
           }
        }
      }else if(userIdtype == "外国人永久居留证"){
        var userName = $scope.addUsrModule.data.REAL_NAME;
        var UserNameReg = /^[A-Z\u4E00-\u9FA5,]+$/;   
        if(!UserNameReg.test(userName)){
          CommonFn.ionicAlert("外国人永久居留证的姓名只能为中文或英文大写字母，姓和名支持逗号隔开！");
          return;
        }
      }else if(userIdtype == "居民户口簿"){
        if(idCard.length==18){
            if($scope.addUsrModule.data.AGE>=16 && CommonFn.isExist($scope.addUsrModule.data.AGE) ){
                CommonFn.ionicAlert("户口簿仅限16周岁以下中国公民使用，请更换证件类型！");
                return;
            }
            if(beginOne == '0' || beginOne == '7' || beginOne == '8' || beginOne == '9'){
                CommonFn.ionicAlert("居民户口簿号码不得以"+beginOne+"开头，请仔细核对！");
                return;
            }
            if(beginTwo == '10'){
                CommonFn.ionicAlert("居民户口簿号码不得以"+beginTwo+"开头，请仔细核对！");
                return;
            }
            if(!CommonFn.IdentityCodeValid(idCard)){
                CommonFn.ionicAlert("您输入的居民户口簿号码有误，请仔细核对！");
                return;
            }
        }
        if(!CommonFn.isExist($scope.addUsrModule.data.ID_END_DATE)){  //校验居民户口簿有效期
            CommonFn.ionicAlert("请填写居民户口簿的有效期，居民户口簿的有效期为长期有效！");
            return;
        }
        if(CommonFn.isExist($scope.addUsrModule.data.ID_END_DATE) && $scope.addUsrModule.data.ID_END_DATE!="长期有效"){  //校验居民户口簿有效期为长期有效
            CommonFn.ionicAlert("居民户口簿的有效期为长期有效！");
            return;
        }
      }
      //判断年纪是否为空 
      if($scope.addUsrModule.data.AGE == undefined || typeof $scope.addUsrModule.data.AGE == 'undefined'){
        CommonFn.ionicAlert('请确认年龄是否为空');
        return;
      }

      if(typeof $scope.addUsrModule.data.SEX == 'undefined' || $scope.addUsrModule.data.SEX == ''){
        CommonFn.ionicAlert('性别为必选项');
        return;
      };

      
      //判断职业是否为空
      if($scope.addUsrModule.attr.occupationSelected==false){
        document.getElementById('custom_input_wrap').style.border = "1px solid red";
        CommonFn.ionicAlert('请确认职业是否为空');
        return;
      }
      document.getElementById('custom_input_wrap').style.border = "1px solid #ddd";
          
      //判断其他收入来来源是否为空
      var addINCOME_WAY=$scope.addUsrModule.staticData.testcompanyType;
      var other_income_way=$scope.addUsrModule.data.OTHER_INCOME_WAY;
      for(var s =0 ; s<addINCOME_WAY.length;s++ ){
        // if((addINCOME_WAY[s].type =="其他" && addINCOME_WAY[s].checked==true) && (other_income_way==undefined || other_income_way=='')){
        //   CommonFn.ionicAlert('请把其他收入来源填写完整');
        //   return;        
        // }
        if(addINCOME_WAY[s].type == "其他" && addINCOME_WAY[s].checked==true && !CommonFn.isExist(other_income_way)){
          CommonFn.ionicAlert('请把其他收入来源填写完整');
          return;        
        }
        // if(addINCOME_WAY[s].type =="其他" && addINCOME_WAY[s].checked==false && other_income_way!=undefined && other_income_way!=''){
        //   CommonFn.ionicAlert('若存在其他收入来源，请选中“其他”按钮，再进行填写');
        //   return;    
        // }
        if(addINCOME_WAY[s].type == "其他" && addINCOME_WAY[s].checked==false && CommonFn.isExist(other_income_way)){
          CommonFn.ionicAlert('若存在其他收入来源，请选中“其他”按钮，再进行填写');
          return;  
        }
      }
      if(((typeof $scope.addUsrModule.data.IDTYPE) != 'undefined' && $scope.addUsrModule.data.IDTYPE != "") && ((typeof $scope.addUsrModule.data.ID_END_DATE) == 'undefined' || $scope.addUsrModule.data.ID_END_DATE == "")){
          checkFormHandle.commonCheck($scope.addUsrModule.data.IDTYPE, "idEndDate1", function(json){
            if(!json.Falg){
               $('.idEndErrorMsg').addClass('my-show');
               $('.idEndErrorMsg').text(json.msg);
            }else{
              if($('.idEndErrorMsg').hasClass('my-show')){
                $('.idEndErrorMsg').removeClass('my-show');
              }
            }
          })
      }else{
          if($('.idEndErrorMsg').hasClass('my-show')){
            $('.idEndErrorMsg').removeClass('my-show');
          }
      }

      //增加4，5级城市地址一但没输入信息就校验
      if(organCode.substr(0,4)=="8614"){
          var COMPANY_fourVILLAGE=$scope.addUsrModule.data.COMPANY_fourVILLAGE;
          var COMPANY_fourAreaType=$scope.addUsrModule.data.COMPANY_fourAreaType;
          var COMPANY_fiveVILLAGE=$scope.addUsrModule.data.COMPANY_fiveVILLAGE;
          var COMPANY_fiveAreaType=$scope.addUsrModule.data.COMPANY_fiveAreaType;          

          var HOME_fourVILLAGE=$scope.addUsrModule.data.HOME_fourVILLAGE;
          var HOME_fourAreaType=$scope.addUsrModule.data.HOME_fourAreaType;
          var HOME_fiveVILLAGE=$scope.addUsrModule.data.HOME_fiveVILLAGE;
          var HOME_fiveAreaType=$scope.addUsrModule.data.HOME_fiveAreaType;          

          if(typeof COMPANY_fourVILLAGE == 'undefined' || COMPANY_fourVILLAGE == 'undefined' || COMPANY_fourVILLAGE == '' || typeof COMPANY_fourAreaType == 'undefined' || COMPANY_fourAreaType == ''||
            typeof COMPANY_fiveVILLAGE == 'undefined' || COMPANY_fiveVILLAGE == '' || typeof COMPANY_fiveAreaType == 'undefined' || COMPANY_fiveAreaType == ''
            ){
              CommonFn.ionicAlert('请把通信地址的4级，5级填写完整');  
              return;
          }else{
            if(COMPANY_fourVILLAGE.length < 2 || COMPANY_fiveVILLAGE.length < 2){
              CommonFn.ionicAlert('通信地址的4级，5级不能少于2个字');
              return;
            }
          }
          if(typeof HOME_fourVILLAGE == 'undefined' || HOME_fourVILLAGE == 'undefined' || HOME_fourVILLAGE == '' || typeof HOME_fourAreaType == 'undefined' || HOME_fourAreaType == '' ||
           typeof HOME_fiveVILLAGE == 'undefined' || HOME_fiveVILLAGE == '' || typeof HOME_fiveAreaType == 'undefined' || HOME_fiveAreaType == ''
            ){
              CommonFn.ionicAlert('请把家庭住址的4级，5级填写完整');
              return;
          }else{
            if(HOME_fourVILLAGE.length < 2 || HOME_fiveVILLAGE.length < 2){
              CommonFn.ionicAlert('家庭住址的4级，5级不能少于2个字');
              return;
            }
          }          
      }
      //判断联系方式中的移动电话是否为空
      if(!$scope.addUsrModule.data.MOBILE){
        $('.phoneErrorMsg').addClass('my-show');
        $('.phoneErrorMsg').text('移动电话不能为空!');
        CommonFn.ionicAlert('移动电话不能为空');
        return;
      }


      //验证身高

      // if($scope.addUsrModule.data.HEIGHT == "" || !$scope.addUsrModule.data.HEIGHT){
      //   $('.heightErrorMsg').addClass('my-show');
      //   $('.heightErrorMsg').text('身高不能为空');

      //   document.getElementById('height_wrap').style.border = "1px solid red";
      //   CommonFn.ionicAlert("身高不能为空");
      //   return;
      // };

      // document.getElementById('height_wrap').style.border = "1px solid #ddd";


      if(CommonFn.isExist($scope.addUsrModule.data.HEIGHT) && parseInt( $scope.addUsrModule.data.AGE)>=18 && $scope.addUsrModule.data.HEIGHT<100){
          CommonFn.ionicAlert("身高不合常理，请检查后重新录入!");
          return;
      }

      //体重不能为空
      // if($scope.addUsrModule.data.WEIGHT == "" || !$scope.addUsrModule.data.WEIGHT){
      //   $('.weightErrorMsg').addClass('my-show');
      //   $('.weightErrorMsg').text('体重不能为空');

      //   document.getElementById('weight_wrap').style.border = "1px solid red";
      //   CommonFn.ionicAlert("体重不能为空");
      //   return;
      // };

      // document.getElementById('weight_wrap').style.border = "1px solid #ddd";

      //判断国籍是否为空
      if(!CommonFn.isExist($scope.addUsrModule.data.NATIVE_PLACE)){
          CommonFn.ionicAlert("国籍不能为空!");
          return;
      }

      //校验通信邮编6位数字
        if(CommonFn.isExist($scope.addUsrModule.data.COMPANY_ZIP_CODE)){
            var reg = /^[0-9]{6}$/;
            if(!reg.test($scope.addUsrModule.data.COMPANY_ZIP_CODE)){
                CommonFn.ionicAlert("通信地址邮编只能为6位数字，请重新输入！");
                return;
            }
        }
        //校验住址邮编6位数字
        if(CommonFn.isExist($scope.addUsrModule.data.HOME_ZIP_CODE)){
            var reg = /^[0-9]{6}$/;
            if(!reg.test($scope.addUsrModule.data.HOME_ZIP_CODE)){
                CommonFn.ionicAlert("住址邮编只能为6位数字，请重新输入！");
                return;
            }
        }


      if($('.normalForm .error-font.my-show').length){

        var addErrInfo = $('.normalForm .error-font.my-show').text().split("!");
       // CommonFn.ionicAlert('表单验证不通过,姓名，性别，手机号为必填项，请查看是否填写正确');
        // CommonFn.ionicAlert('表单验证不通过,请确认必填项“*”是否填写，以及非必填项格式是否正确');
        if(addErrInfo.length > 0){
          CommonFn.ionicAlert(addErrInfo[0])
          return;
        }else{
          CommonFn.ionicAlert('表单验证不通过,请确认必填项“*”是否填写，以及非必填项格式是否正确');
          return;
        }     
      }else{
          // 针对山西机构四，五级城市拼到address后面
          if(organCode.substr(0,4)=="8614"){          
            if($scope.addUsrModule.data.COMPANY_ADDRESS == 'undefined' || typeof $scope.addUsrModule.data.COMPANY_ADDRESS == 'undefined' ||  $scope.addUsrModule.data.COMPANY_ADDRESS == ''){
                 $scope.addUsrModule.data.COMPANY_ADDRESS = $scope.addUsrModule.data.COMPANY_fourVILLAGE+"@%@"+$scope.addUsrModule.data.COMPANY_fourAreaType+"@%@"+$scope.addUsrModule.data.COMPANY_fiveVILLAGE+"@%@"+$scope.addUsrModule.data.COMPANY_fiveAreaType;
            }else{
                 $scope.addUsrModule.data.COMPANY_ADDRESS = $scope.addUsrModule.data.COMPANY_fourVILLAGE+"@%@"+$scope.addUsrModule.data.COMPANY_fourAreaType+"@%@"+$scope.addUsrModule.data.COMPANY_fiveVILLAGE+"@%@"+$scope.addUsrModule.data.COMPANY_fiveAreaType+"@%@"+$scope.addUsrModule.data.COMPANY_ADDRESS;
            }        
            if($scope.addUsrModule.data.HOME_ADDRESS == 'undefined' || typeof $scope.addUsrModule.data.HOME_ADDRESS == 'undefined' || $scope.addUsrModule.data.HOME_ADDRESS == ''){
                $scope.addUsrModule.data.HOME_ADDRESS = $scope.addUsrModule.data.HOME_fourVILLAGE+"@%@"+$scope.addUsrModule.data.HOME_fourAreaType+"@%@"+$scope.addUsrModule.data.HOME_fiveVILLAGE+"@%@"+$scope.addUsrModule.data.HOME_fiveAreaType;
            }else{
                $scope.addUsrModule.data.HOME_ADDRESS = $scope.addUsrModule.data.HOME_fourVILLAGE+"@%@"+$scope.addUsrModule.data.HOME_fourAreaType+"@%@"+$scope.addUsrModule.data.HOME_fiveVILLAGE+"@%@"+$scope.addUsrModule.data.HOME_fiveAreaType+"@%@"+$scope.addUsrModule.data.HOME_ADDRESS;
            }
         }
        restoreTheData();     
      };
    },100);


  };

  //添加客户及其关系人
  function restoreTheData() {
    
    if(UsrData.checkCustomHasFn($scope.addUsrModule.data.REAL_NAME)){
      CommonFn.showConfirm({
        title: '提示',
        content: '已存在此姓名用户，确定提交吗?',
        sure: function(){
          //新增客户
          CommonFn.showLoading('保存中,请稍后...');

          UsrData.setUsr({
            data        : $scope.addUsrModule.data,
            test        : false,
            add         : true,
            formName    : 'T_CUSTOMER'
          },function (SCOPE, data){
            //新增客户成功后，添加与他有关系的客户;
            addCustomRelationCustom(data.ID, function(){
              //关系客户添加完了，再跳转到主客户的详情界面
              CommonFn.hideLoading();
              UsrData.addCustomSuccessFn(data, true);
            });
          });
        },
        notSure: function() {
          $scope.addUsrModule.data.REAL_NAME = '';   //同名取消后清空姓名
          $scope.addUsrModule.data.COMPANY_ADDRESS = ''; //同名取消后清空地址
          $scope.addUsrModule.data.HOME_ADDRESS = '';
        }
      });
    }else{
      CommonFn.showLoading('保存中,请稍后...');
      //新增客户
      UsrData.setUsr({
        data        : $scope.addUsrModule.data,
        test        : false,
        add         : true,
        formName    : 'T_CUSTOMER'
      },function (SCOPE, data){
        //新增客户成功后，添加与他有关系的客户;
        addCustomRelationCustom(data.ID, function(){
          //关系客户添加完了，再跳转到主客户的详情界面
          CommonFn.hideLoading();
          UsrData.addCustomSuccessFn(data, true);
        });
      });
    };
  };

  //添加新增客户的关系客户
  function addCustomRelationCustom (firstCustomId, fn) {
    var arrRelation = $scope.addUsrModule.attr.newRelationShip;

    //如果添加了关系信息
    if(arrRelation.length){
      relationshipData.addCustomRelationShip(arrRelation, firstCustomId, fn, arrRelation.length);
    }else{
      //如果没有新增关系信息，则直接跳转到此新增客户的详情界面
      fn && fn();
    };
  };

  //选择身份证截止日期
  function useDatePlugin() {
    CommonFn.getDateFn(function (data) {
      var selectDateTime = CommonFn.strToDateFn(data).getTime();
      var nowDateTime = new Date().getTime();
      if(selectDateTime<nowDateTime){  //验证身份证的有效期
          CommonFn.ionicAlert('证件已过期，选择的有效期应在当前日期之后！');
          return false;
      }
      $scope.addUsrModule.data.ID_END_DATE = data;
      $scope.addUsrModule.attr.idCardLongTime = false;
      $scope.$apply($scope.addUsrModule.data.ID_END_DATE);
    });
  };
  //选择特殊纪念日
  function chooseMyDate() {
    CommonFn.getDateFn(function (data) {
      $scope.addUsrModule.data.ANNIVERSARY = data;
      $scope.$apply($scope.addUsrModule.data.ANNIVERSARY);
    });
  };

  function idCardFnResert() {
    $scope.addUsrModule.attr.idCardPassDontPass = false;
  };

  //城市联动处理
  var allProvince = dsy.Items['0'];

  //基本信息中的地址联动处理
  CommonFn.adressSelect('addUsrModule', allProvince, $scope, dsy, 'RGT_PROVINCE', 'RGT_CITY', 'basicAfress');

  //联系方式中的地址联动处理
  CommonFn.adressSelect('addUsrModule', allProvince, $scope, dsy, 'HOME_PROVINCE', 'HOME_CITY', 'homeAddress');

  //单位地址联动
  CommonFn.adressSelect('addUsrModule', allProvince, $scope, dsy, 'COMPANY_PROVINCE', 'COMPANY_CITY', 'companyAddress');

  //身份证是否长期使用
  $scope.$watch('addUsrModule.attr.idCardLongTime', function (){
    if($scope.addUsrModule.attr.idCardLongTime){
      $scope.addUsrModule.data.ID_END_DATE = '长期有效';
	  //add  ww 2016-5-9
	  $('.my-checkbox-font-cardtime').css('color','#fff');
    }else{
      if($scope.addUsrModule.data.ID_END_DATE == '长期有效'){
        $scope.addUsrModule.data.ID_END_DATE = '';
		$('.my-checkbox-font-cardtime').css('color','#000');
      };
    };
  });

  var modalAnimation;

  if($rootScope.commonModule.isPad){
    modalAnimation = 'false';
  }else{
    modalAnimation = 'slide-in-up';
  };

  $ionicModal.fromTemplateUrl('professionalModal.html', {
    scope: $scope,
    animation: modalAnimation,
    bgClick: false
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  function openModal(occupationKind) {
     //1:职业；2：兼职   modify by yangjialin
    $scope.addUsrModule.attr.occupationKind=occupationKind;
    $scope.modal.show();
    $('.serach-box .items_content').click(function(ev){
      var oTarget = $(ev.target);  
      var itemNow = oTarget.closest('.table_items');

      $('.serach-box .table_items').removeClass('itemActive');
      if(itemNow.length){
        var indexNow = parseInt($('.serach-box .table_items').index(itemNow), 10);
        oTarget.closest('.table_items').addClass('itemActive');
        chooseOccupation(indexNow);
      };
    });
  };
  function openOCR(type){
    var method;
    var idtype = CommonFn.translateIdype($scope.addUsrModule.data.IDTYPE);
    var isCallBackFlag = false;
    if(idtype == "none"){
      CommonFn.ionicAlert('请先选择证件类型');
      return;
    }else if(idtype == "other"){
      CommonFn.ionicAlert('本证件类型暂不支持OCR数据识别');
      return;
    }
    if(type == "back" && idtype == "2"){
      idtype = "3";
    }else if(type == "back" && idtype != "2"){
      CommonFn.ionicAlert('您所选证件类型暂不支持OCR证件有效期识别，请手动选择');
      return;
    }
    
    $ionicActionSheet.show({
      buttons: [
        {
          text: '拍照'
        }
        ,
        {
          text: '从相册中选取'
        }
      ],  
      cancelText: '取消',
      cancel: function () {
        console.log('CANCELLED');
      },
      buttonClicked: function (index) { 
          if(type == "front"){
            $scope.addUsrModule.data.IDNO = '';
          }
          method = index == "0" ? "photo" : "album";
          CommonFn.showLoading('请稍后...');
          CommonFn.invoateOCR({
            idtype:idtype,
            method:method,
            callBackFun:function(data){
              CommonFn.hideLoading();
              isCallBackFlag = true;
              data = eval('('+data+')');
              if(data.message.status !="-1"){
                if(type == "front"){
                  $scope.$apply(function(){
                    $scope.addUsrModule.data.IDNO = data.cardsinfo.cardNo;
                    checkPersonId($scope.addUsrModule.data.IDNO, 'idnoErrorMsg');
                  }) 
                }else if(type == "back" && idtype == "3"){
                  $scope.addUsrModule.data.ID_END_DATE = "";
                  $scope.$apply(function(){
                    if(data.cardsinfo.idEndDate == "长期"){
                      data.cardsinfo.idEndDate = "长期有效";
                    }
                    $scope.addUsrModule.data.ID_END_DATE = data.cardsinfo.idEndDate;
                  })
                }           
              }else{
                CommonFn.ionicAlert(data.message.value);
                return false;
              }
            }
          })
          setTimeout(function(){
            if(isCallBackFlag == false){
              CommonFn.hideLoading();
              CommonFn.ionicAlert('请求超时，请稍后再试');
              return;
            }
          },120000)
          return true;
      }
    })    
  }

  function closeModal() {
    $('.serach-box .items_content').unbind('click');
    $scope.modal.hide();
  };
   //删除兼职 add by lishuang 2016-3-01
  function deleteModal() {
      $scope.addUsrModule.attr.pluralityOccupationSelected    =  false;
      $scope.addUsrModule.data.PLURALITY_OCCUPATION_CODE       =  '';
      $scope.addUsrModule.data.PLURALITY_OCCUPATION_CODE_NAME  =  '';
      $scope.addUsrModule.data.PLURALITY_OCCUPATION_CODE_TYPE  =  '';
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  //添加关系信息到新增客户信息中
  function addRelationShip () {

    if(typeof $scope.addUsrModule.attr.relationShipDataCache.SEX == 'undefined' || $scope.addUsrModule.attr.relationShipDataCache.SEX == ''){
      CommonFn.showFormError('relationSexErrorMsg', '性别为必选项');
    };
    if(typeof $scope.addUsrModule.attr.relationShipDataCache.relationShipType == 'undefined' || $scope.addUsrModule.attr.relationShipDataCache.relationShipType == ''){
      CommonFn.showFormError('relationTypeErrorMsg', '请选择关系');
    };
	// add 6.14 wuwei 
    var sex2 = $scope.addUsrModule.data.SEX;
    var relationSEX2 =$scope.addUsrModule.attr.relationShipDataCache.SEX;
    var relationShipType2 =$scope.addUsrModule.attr.relationShipDataCache.relationShipType.CODE_NAME;
    if(typeof sex2 == "undefined"){
      CommonFn.ionicAlert('投保人性别未选择！');
      return;      
    }
    if(sex2=="男" &&
      (relationShipType2=="丈夫"||relationShipType2=="妻子"||relationShipType2=="母亲"||relationShipType2=="女儿"
      ||relationShipType2=="祖母"||relationShipType2=="孙女"||relationShipType2=="外祖母"||relationShipType2=="外孙女"
      ||relationShipType2=="姐姐"||relationShipType2=="妹妹"||relationShipType2=="婆婆"||relationShipType2=="岳母"
      ||relationShipType2=="儿媳"
      )
      && relationSEX2=="男" )
      {
         CommonFn.ionicAlert('关系选择有误，请重新确认！');
         return;
      }
    if(sex2=="男" &&
      (relationShipType2=="丈夫"||relationShipType2=="父亲"||relationShipType2=="儿子"||relationShipType2=="祖父"
      ||relationShipType2=="孙子"||relationShipType2=="外祖父"||relationShipType2=="外孙"||relationShipType2=="哥哥"
      ||relationShipType2=="弟弟"||relationShipType2=="公公"||relationShipType2=="岳父"||relationShipType2=="女婿"
      )
      && relationSEX2=="女" )
      {
         CommonFn.ionicAlert('关系选择有误，请重新确认。');
         return;
      }
    if(sex2=="女" &&
      (relationShipType2=="丈夫"||relationShipType2=="妻子"||relationShipType2=="父亲"||relationShipType2=="儿子"||relationShipType2=="祖父"
      ||relationShipType2=="孙子"||relationShipType2=="外祖父"||relationShipType2=="外孙"||relationShipType2=="哥哥"
      ||relationShipType2=="弟弟"||relationShipType2=="公公"||relationShipType2=="岳父"||relationShipType2=="女婿"
      )
      && relationSEX2=="女" )
      {
         CommonFn.ionicAlert('关系选择有误，请重新确认。');
         return;
      }
    if(sex2=="女" &&
      (relationShipType2=="妻子"||relationShipType2=="母亲"||relationShipType2=="女儿"
      ||relationShipType2=="祖母"||relationShipType2=="孙女"||relationShipType2=="外祖母"||relationShipType2=="外孙女"
      ||relationShipType2=="姐姐"||relationShipType2=="妹妹"||relationShipType2=="婆婆"||relationShipType2=="岳母"
      ||relationShipType2=="儿媳"
      )
      && relationSEX2=="男" )
      {
         CommonFn.ionicAlert('关系选择有误，请重新确认。');
         return;
      }
	
    if(typeof $scope.addUsrModule.attr.relationShipDataCache.REAL_NAME == 'undefined' || $scope.addUsrModule.attr.relationShipDataCache.REAL_NAME == ''){
      CommonFn.showFormError('relationUsrNameErrorMsg', '客户姓名未告知，请告知');
    };
    if(typeof $scope.addUsrModule.attr.relationShipDataCache.AGE == 'string' ){
      CommonFn.ionicAlert('请选择出生日期');
      return;
    };
    if($('.addRelationForm .error-font.my-show').length){
      return;
    };

    $scope.addUsrModule.attr.newRelationShip.push(angular.copy($scope.addUsrModule.attr.relationShipDataCache));
    $ionicScrollDelegate.resize();
    relationResert();
  };

  var tempRelationShip = [];

  function clickRelation(){
    //alert(JSON.stringify($scope.addUsrModule.staticData.Relationship));
    if(tempRelationShip.length == 0){
      tempRelationShip = $scope.addUsrModule.staticData.Relationship;
    }
    var relationShipList = [];
    tempRelationShip.map(function(item, index){
      var relationShipType2 = item.CODE_NAME;
      if($scope.addUsrModule.data.SEX == "男"){
        if(relationShipType2=="丈夫"){
          
        }else{
          relationShipList.push(item);
        }
      }else if($scope.addUsrModule.data.SEX == "女"){
        if(relationShipType2=="妻子"){
          
        }else{
          relationShipList.push(item);
        }
      }else{

      }
        
    });

    $scope.addUsrModule.staticData.Relationship = relationShipList;
  }

  //展开关系下拉菜单选择关系时触发
  function selectRelation () {
    var relationShipType2 =$scope.editUsrModule.attr.relationShipDataCache.relationShipType.CODE_NAME;
    if(
      relationShipType2=="丈夫"||relationShipType2=="父亲"||relationShipType2=="儿子"||relationShipType2=="祖父"
      ||relationShipType2=="孙子"||relationShipType2=="外祖父"||relationShipType2=="外孙"||relationShipType2=="哥哥"
      ||relationShipType2=="弟弟"||relationShipType2=="公公"||relationShipType2=="岳父"||relationShipType2=="女婿"
       )
      {
        $scope.editUsrModule.attr.relationShipDataCache.SEX = "男";
      }
    else if(relationShipType2=="妻子"||relationShipType2=="母亲"||relationShipType2=="女儿"
    ||relationShipType2=="祖母"||relationShipType2=="孙女"||relationShipType2=="外祖母"||relationShipType2=="外孙女"
    ||relationShipType2=="姐姐"||relationShipType2=="妹妹"||relationShipType2=="婆婆"||relationShipType2=="岳母"
    ||relationShipType2=="儿媳" )
      {
        $scope.editUsrModule.attr.relationShipDataCache.SEX = "女";
      }
      
    if($scope.addUsrModule.attr.relationShipDataCache.relationShipType){
      CommonFn.hideFormError('relationTypeErrorMsg');
    }else{
      CommonFn.showFormError('relationTypeErrorMsg', '请选择关系');
    };
  };

  //性别选择是触发
  $scope.$watch('addUsrModule.attr.relationShipDataCache.SEX', function(){
    CommonFn.hideFormError('relationSexErrorMsg');
  });

  //重置关系表单
  function relationResert () {
    $scope.addUsrModule.attr.relationShipDataCache = {
        relationShipType: '',
        SEX             : '',
        BIRTHDAY        : '',
        AGE             : '',
        REAL_NAME       : ''
    }
  };

  function serchOccupationStart() {
    var searchOccupationKeyWord = $scope.addUsrModule.attr.WORD;
    var searchMatchAll = $scope.addUsrModule.attr.searchOccupationMacth;

    CommonFn.showLoading('查询中...');

    $timeout(function(){
      searchOccupationServer.searchOccupation({
        keyWord : searchOccupationKeyWord,
        ruler   : searchMatchAll,
        page    : $scope.addUsrModule.professionalPage,
        callBack: function(data){
          CommonFn.hideLoading();
          if(data.length){
            $scope.addUsrModule.professionalPageTotal = Math.ceil(data[0].totalnumber/10);
            $ionicScrollDelegate.scrollTo(0, 0, false);
          };
          $scope.addUsrModule.searchOccupationModel = data;
          $scope.$apply($scope.addUsrModule);
        }
      });
    }, 500);
  };

  //搜索职业
  function searchOccupation () {
    $scope.addUsrModule.professionalPage = 1;
    serchOccupationStart();
  };

  //上一页
  function getPreProfessional() {
    $scope.addUsrModule.professionalPage--;
    serchOccupationStart();
  };

  //下一页
  function getNextProfessional() {
    $scope.addUsrModule.professionalPage++;
    serchOccupationStart();
  };

  function checkTheSearch () {
    $scope.addUsrModule.attr.searchOccupationMacth = !$scope.addUsrModule.attr.searchOccupationMacth;
  };

  function chooseOccupation (index) {
    $scope.addUsrModule.attr.chooseOccupationNow = $scope.addUsrModule.searchOccupationModel[index];
  }

  function occupationSelect () {
    if($scope.addUsrModule.attr.chooseOccupationNow == null || !CommonFn.isExist($scope.addUsrModule.attr.chooseOccupationNow.OCCUPATION_NAME)){
      CommonFn.ionicAlert('请选择职业');
      return;
    };
  //对客户选择的职业进行筛选判断
    var occupationCode = $scope.addUsrModule.attr.chooseOccupationNow.OCCUPATION_CODE;
    var occupationName = $scope.addUsrModule.attr.chooseOccupationNow.OCCUPATION_NAME;
    var customerSex = $scope.addUsrModule.data.SEX;
    // var customerAge = $scope.addUsrModule.data.AGE;
    if($scope.addUsrModule.data.BIRTHDAY!=undefined || typeof $scope.addUsrModule.data.BIRTHDAY!='undefined'){
      var customerAge =CommonFn.birthdayToAgeFn($scope.addUsrModule.data.BIRTHDAY);
    }    
    if((occupationCode == "8010104" || occupationName == "家庭主妇") && customerSex == "男"){
      CommonFn.ionicAlert("客户性别为男性，职业不可以选择家庭主妇！");
      return;
    }
    if((occupationCode == "8010103" || occupationName == "学龄前儿童") && customerAge >= 18){
      CommonFn.ionicAlert("客户年龄大于等于18周岁，职业不可以选择学龄前儿童！");
      return;
    }
    if((occupationCode == "8010104" || occupationName == "家庭主妇") && customerAge <= 15){
      CommonFn.ionicAlert("客户年龄小于等于15周岁，职业不可以选择家庭主妇！");
      return;
    }
    if(customerAge <= 3 && (!(occupationCode == "8010103" || occupationName == "学龄前儿童"))){
      CommonFn.ionicAlert("客户年龄小于等于3周岁，职业只能选择学龄前儿童！");
      return;
    }
  //modify by yangjialin 2015-08-25
    if($scope.addUsrModule.attr.occupationKind=='1'){
      $scope.addUsrModule.attr.occupationSelected    = true;
      $scope.addUsrModule.data.OCCUPATION_CODE       = $scope.addUsrModule.attr.chooseOccupationNow.OCCUPATION_CODE;
      $scope.addUsrModule.data.OCCUPATION_CODE_NAME  = $scope.addUsrModule.attr.chooseOccupationNow.OCCUPATION_NAME;
      $scope.addUsrModule.data.OCCUPATION_CODE_TYPE  = $scope.addUsrModule.attr.chooseOccupationNow.OCCUPATION_TYPE;
    }else{
      $scope.addUsrModule.attr.pluralityOccupationSelected    = true;
      $scope.addUsrModule.data.PLURALITY_OCCUPATION_CODE       = $scope.addUsrModule.attr.chooseOccupationNow.OCCUPATION_CODE;
      $scope.addUsrModule.data.PLURALITY_OCCUPATION_CODE_NAME  = $scope.addUsrModule.attr.chooseOccupationNow.OCCUPATION_NAME;
      $scope.addUsrModule.data.PLURALITY_OCCUPATION_CODE_TYPE  = $scope.addUsrModule.attr.chooseOccupationNow.OCCUPATION_TYPE;
    }
    //若职业为“农民、无业人员，家庭主妇”，工作单位默认为“无”，不必录入    modify by gudandie 2017-12-18
    if(occupationCode == "8010104" || occupationCode == "8010102" || occupationCode == "8010101" || occupationCode == "5010101"){
        $(".addWorkUnit").attr("placeholder","无").attr("readonly",true).css("background-color","#fff");
    }else {
        $(".addWorkUnit").attr("placeholder","现工作单位名称").attr("readonly",false);
    }
    closeModal();
  };

  //从收入来源中把其他删除
 
  // CommonFn.deleteElementInArr(dataInit.allCode.incomeway.codeName, '其他');
  // $scope.$watch('addUsrModule.attr.incomeOtherWay', function () {
  //   if(!$scope.addUsrModule.attr.incomeOtherWay){
  //     $scope.addUsrModule.data.OTHER_INCOME_WAY = '';
  //   };
  // });
  
  //点击收入信息
  $scope.choicePrint = function ($event){
  if($event.target.checked == true){
    
    if($scope.addUsrModule.data.INCOME_WAY=="undefined" || $scope.addUsrModule.data.INCOME_WAY == undefined){
      $scope.addUsrModule.data.INCOME_WAY = '';
    }
    $scope.addUsrModule.data.INCOME_WAY = addStr($event.target.value,$scope.addUsrModule.data.INCOME_WAY);
    
  }else{
    
    $scope.addUsrModule.data.INCOME_WAY = removeStr($event.target.value,$scope.addUsrModule.data.INCOME_WAY);
    
  }
  }


  //选择邮寄地址
  $scope.$watch('addUsrModule.attr.mailingAddress', function () {
    $scope.addUsrModule.data.MAILING_ADDRESS = $scope.addUsrModule.attr.mailingAddress;
  });
  $scope.isAddress = false;
  //添加投保人 地址同步
  function copyAddress(){
    if($scope.isAddress == false){
      $scope.isAddress = true;
      $scope.addUsrModule.data.HOME_PROVINCE = $scope.addUsrModule.data.COMPANY_PROVINCE;
      $scope.addUsrModule.data.HOME_CITY = $scope.addUsrModule.data.COMPANY_CITY;
      $scope.addUsrModule.data.HOME_COUNTY = $scope.addUsrModule.data.COMPANY_COUNTY;
      $scope.addUsrModule.data.HOME_ADDRESS = $scope.addUsrModule.data.COMPANY_ADDRESS;
      $scope.addUsrModule.data.HOME_PHONE = $scope.addUsrModule.data.COMPANY_PHONE;
      $scope.addUsrModule.data.HOME_ZIP_CODE = $scope.addUsrModule.data.COMPANY_ZIP_CODE;
      $scope.addUsrModule.data.HOME_fourVILLAGE = $scope.addUsrModule.data.COMPANY_fourVILLAGE;
      $scope.addUsrModule.data.HOME_fourAreaType = $scope.addUsrModule.data.COMPANY_fourAreaType;
      $scope.addUsrModule.data.HOME_fiveVILLAGE = $scope.addUsrModule.data.COMPANY_fiveVILLAGE;
      $scope.addUsrModule.data.HOME_fiveAreaType = $scope.addUsrModule.data.COMPANY_fiveAreaType;
    }else{
      $scope.isAddress = false;
      $scope.addUsrModule.data.HOME_PROVINCE = '';
      $scope.addUsrModule.data.HOME_CITY = '';
      $scope.addUsrModule.data.HOME_COUNTY = '';
      $scope.addUsrModule.data.HOME_ADDRESS = '';
      $scope.addUsrModule.data.HOME_PHONE = '';
      $scope.addUsrModule.data.HOME_ZIP_CODE = '';
      $scope.addUsrModule.data.HOME_fourVILLAGE = '';
      $scope.addUsrModule.data.HOME_fourAreaType = '';
      $scope.addUsrModule.data.HOME_fiveVILLAGE ='';
      $scope.addUsrModule.data.HOME_fiveAreaType = '';
    }
    
  }
  function showAddRelationForm () {
    $scope.addUsrModule.attr.relationForm = true;
    $ionicScrollDelegate.resize();
  };
  //取消家属关系添加
  function returnRelationForm () {
    $scope.addUsrModule.attr.relationForm = false;
    $ionicScrollDelegate.resize();
  };

  //通过xml校验表单部分
  
  //校验用户名
  function checkUsrName(str, className) {
    checkFormHandle.checkUsrName(str, function(json) {
      if(!json.Falg){
        CommonFn.showFormError(className, json.msg);
      }else{
        CommonFn.hideFormError(className);
      };
    });
	
	//add   5.15  ww
	//暂时取消新增客户重名不能录入验证。
    //checkFormHandle.mysearchUsr(str, function(json){     
    //}); 
	
  };

  //校验性别
  $scope.$watch('addUsrModule.data.SEX', function(){
    $('.sexErrorMsg').removeClass('my-show');
  });

  //居住详细地址验证
  function checkAddress(str, className) {
    if((typeof str != 'undefined') && str != ''){
      checkFormHandle.checkAddress(str, function(json) {
        if(!json.Falg){
          CommonFn.showFormError(className, json.msg);
        }else{
		  //add   6.8  wuwei
          var strl= str.length;
          if(strl = "" || strl < 5){
              CommonFn.ionicAlert("详细地址不能少于5个字符");
              return;                                   
          }else{
            var flag=1;
            for(var i=0; i< str.length-1;i++){
              if (str.charAt(i)==str.charAt(i+1)){
                  flag++;
                  if(flag>=5){
                    CommonFn.ionicAlert("不能连续重复5次的相同字符,请重新输入");
                    return;
                  }
                }else{
                  flag=1;
                }
             }   
          }
          CommonFn.hideFormError(className);
        };
      });
    }else{
      CommonFn.hideFormError(className);
    };
  };

    //验证成人身高
    function checkHeight() {
        if($scope.addUsrModule.data.BIRTHDAY!=undefined || typeof $scope.addUsrModule.data.BIRTHDAY!='undefined'){
           var age = CommonFn.birthdayToAgeFn($scope.addUsrModule.data.BIRTHDAY);
           var height = $scope.addUsrModule.data.HEIGHT;
           if(parseInt(age)>=18 && height<100){
               CommonFn.ionicAlert("身高不合常理，请检查后重新录入!");
               return;
           }
        }
    }

  //验证证件号码
  function checkPersonId(idCard, className) {

    //判断证件类型
    switch($scope.addUsrModule.data.IDTYPE){
      case "居民身份证":
        idType = "idNo";
        break;

      case "中国护照":
        idType = "chinesepassport";
        break;

      case "军官证":
        idType = "officerpassport";
        break;

      case "士兵证":
        idType = "officerpassport";
        break;

      case "出生证":
        idType = "born";
        break;

      case "台湾居民来往大陆通行证":
        idType = "taiwanpass";
        break;

      case "外国护照":
        idType = "foreignpassport";
        break;

      case "港澳居民来往内地通行证":
        idType = "gobackpass";
        break;
        
      case "外国人永久居留证":
        idType = "foreignerpermanent";
        break;

      case "居民户口簿":
        idType = "householdregister";
        break;

      default:
        idType = "otheridtype";
    };

    //判断是否为港澳居民来往内地通行证
    // if(typeof $scope.addUsrModule.data.IDTYPE != 'undefined' && $scope.addUsrModule.data.IDTYPE.indexOf('港澳居民来往内地通行证') != -1){
    //   idType = "gobackpass";
    // };

    //如果没有没有选择证件类型
    if(typeof $scope.addUsrModule.data.IDTYPE == 'undefined' || $scope.addUsrModule.data.IDTYPE == null){
      idType = "";
    };
    if(typeof idCard != 'undefined' && idCard != ''){
      if(idType == ""){
        CommonFn.showFormError('idtypeErrorMsg', "请选择证件类型!");
        return;
      };

      if(idType == "otheridtype"){
        CommonFn.hideFormError(className);
        return;
      };

      //根据证件类型验证
      checkFormHandle.checkPersonIdCard(idCard, idType, function(json) {
        if(!json.Falg){
          CommonFn.showFormError(className, json.msg);
        }else{
          //身份证号码验证通过
          CommonFn.hideFormError(className);
          if($scope.addUsrModule.data.IDTYPE == '居民身份证' || $scope.addUsrModule.data.IDTYPE == '居民户口簿'){
            calculateAge(idCard);
            getSex(idCard)
          };
        };
      });
    }else{
          if(typeof idType != 'undefined' && idType != '' && idType != null){
            CommonFn.hideFormError(className);
            document.getElementById('idno_input_wrap').style.border = '1px solid #ddd';
          }else {
            
            document.getElementById('idno_input_wrap').style.border = '1px solid red';
             CommonFn.showFormError('idnoErrorMsg', "请输入证件号!");
             CommonFn.ionicAlert("请输入证件号!");

          }
    };

  };

  //监听证件类型
  $scope.$watch('addUsrModule.data.IDTYPE', function () {
    if(!$scope.addUsrModule.data.IDTYPE){
      return;
    }
    if($scope.addUsrModule.data.IDTYPE != "证件类型"){
      CommonFn.hideFormError('idtypeErrorMsg');
      checkPersonId($scope.addUsrModule.data.IDNO, 'idnoErrorMsg');
    };
    // if($scope.addUsrModule.data.IDTYPE == '居民户口簿'){   //居民户口簿默认长期有效
    //     $scope.addUsrModule.attr.idCardLongTime = true;
    // }else{
    //     $scope.addUsrModule.attr.idCardLongTime = false;
    // }
  });
  $scope.$watch('addUsrModule.data.IDNO', function () {
    if($scope.addUsrModule.data.IDNO.charAt(17)=='x' && ($scope.addUsrModule.data.IDTYPE == "居民身份证" || $scope.addUsrModule.data.IDTYPE == "居民户口簿")){
      $scope.addUsrModule.data.IDNO = $scope.addUsrModule.data.IDNO.toUpperCase();
    }

    
  });

  $scope.$watch('editUsrModule.data.AGE', function(){
    if($scope.editUsrModule.data.AGE < 18){
      $scope.editUsrModule.data.MARRI_STATUS = "未婚";
    }
  })
  
  //根据身份证号码计算年龄 编辑客户
  function calculateAge(_idCard) {
    var usrAgeMsg = CommonFn.getUserAge(_idCard);
    $scope.addUsrModule.data.AGE = usrAgeMsg.age;
    $scope.addUsrModule.data.BIRTHDAY = usrAgeMsg.birthday;
    //$scope.addUsrModule.attr.idCardLongTime = usrAgeMsg.isEffective;

    if(usrAgeMsg.age < 0){
      $scope.addUsrModule.attr.agePass = false;
    }else{
      $scope.addUsrModule.attr.agePass = CommonFn.checkDate(usrAgeMsg.birthday);
    };

    //年龄大于4岁时，证件类型中的出生证类型不显示
  var idtypeSelect = document.getElementById("idtypeOfSelect");
//  alert("1."+idtypeSelect.outerHTML);
  if(idtypeSelect){
    var idtypeOptions = idtypeSelect.options;
      if($scope.addUsrModule.data.AGE > 4){
      for(var i = 0 ; i < idtypeOptions.length ; i++){
        if(idtypeOptions[i].text == "出生证"){
          idtypeSelect.remove(i);
          break;
        }
      }
      }
      /*else{
        if(idtypeOptions[tempIndex].text != "出生证"){
          
          idtypeSelect.options.add($scope.idtypeOfcsz);
          alert("2."+idtypeSelect.outerHTML);
        }
      }*/
  }
  };

  //根据身份证号码得出性别 编辑客户
  function getSex(_idCard)
  {
    if (parseInt(_idCard.substr(16, 1)) % 2 == 1) {
      $scope.addUsrModule.data.SEX="男";
    } else {
      $scope.addUsrModule.data.SEX="女";
    }
  }

  //简单规则校验校验(除证件号码之外,普通输入框里的字符)
  function checkCommon(num, type, className) {
    if((typeof num) != 'undefined' && num != ""){
      checkFormHandle.commonCheck(num, type, function(json) {
        if(!json.Falg){
          CommonFn.showFormError(className, json.msg);
        }else{
          CommonFn.hideFormError(className);
        };
      });
    }else{
      CommonFn.hideFormError(className);
    };
  };

  //校验联系方式
  function checkContanct(type, num, fn) {
    type = $scope.addUsrModule.attr.contactTypeKey[type];

    if((typeof num) != 'undefined' && num != ""){
      checkFormHandle.checkContact(num, type, function(json) {
        if(!json.Falg){
          CommonFn.ionicAlert(json.msg);
        }else{
          fn && fn();
        };
      });
    }else{
      CommonFn.ionicAlert('不能为空');
    };
  };

  //添加联系方式
  function addContactType(type, num) {
    checkContanct(type, num, function() {
      var newJson = angular.copy($scope.addUsrModule.attr.contactMsg);
      var contactKey = $scope.addUsrModule.attr.contactTypeKey[newJson.type];
      CommonFn.deleteElementInArr($scope.addUsrModule.staticData.Number, newJson.type);
      if(!$scope.addUsrModule.staticData.Number.length){
        $scope.addUsrModule.attr.showContactSlect = false;
      };
      $scope.addUsrModule.attr.otherContactMethod.push(newJson);
      $scope.addUsrModule.data[contactKey] = newJson.value;
      $ionicScrollDelegate.resize();
      $scope.addUsrModule.attr.contactMsg = {
        type : '',
        value: ''
      };
    });
  };

  //删除联系方式
  function deleteContact (index) {
    var contactKey = $scope.addUsrModule.attr.contactTypeKey[$scope.addUsrModule.attr.otherContactMethod[index].type];

    $scope.addUsrModule.staticData.Number.push($scope.addUsrModule.attr.otherContactMethod[index].type);
    $scope.addUsrModule.attr.showContactSlect = true;
    $scope.addUsrModule.data[contactKey] = '';
    $scope.addUsrModule.attr.otherContactMethod.splice(index, 1);
    $ionicScrollDelegate.resize();
  };

  //关系类型过滤
  function getRelationType(arr) {
    for(var i = 0; i < arr.length; i++){
      if(arr[i].CODE_NAME == '本人'){
        arr.splice(i, 1);
      };
    };

    return arr;
  };

  //客户类型过滤
  function getCustomType(arr) {
    for(var i = 0; i < arr.length; i++){
      if(arr[i] == '客户'){
        arr.splice(i, 1);
      }
    };

    return arr;
  };

  //多选项数据整理
  function straightenData(arr) {
    var newArr = [];

    for(var i = 0; i < arr.length; i++){
      var json = {
        type: arr[i],
        checked: false
      };

      newArr.push(json);
    };

    return newArr;
  };

  //$scope接口导出
  $scope.addUsrModule = {
    attr: {
      tabIndex             : "basicMsg",
      basicMsgFormPass     : '',
      addressMsgFormPass   : '',
      otherContactMethod   : [],
      idCardPassDontPass   : false,
      idCardLongTime       : false,
      relationTypePass     : true,
      relationForm         : false,
      sexPass              : true,
      agePass              : true,
      relationAgePass      : true,
      showContactSlect     : true,
      contactTypeKey       : {
        "QQ": "QQ",
        "微博": "WEIBO_NO",
        "邮箱": "EMAIL"
      },
      contactMsg           : {
        type : '',
        value: ''
      },
      relationShipDataCache: {
        relationShipType: '',
        SEX             : '',
        BIRTHDAY        : '',
        AGE             : '',
        REAL_NAME       : ''
      },
      newRelationShip      : [],
      chooseOccupationNow  : null,
      activeNow            : '',
      occupationSelected   : false,
      searchOccupationMacth: false,
      incomeOtherWay       : false,
      mailingAddress       : 1
    },
    professionalPage       : 1,
    professionalPageTotal  : '',
    searchOccupationModel: [],
    data: {
      "NATIVE_PLACE": "中国",
      "NATIONALITY" :  "汉族",
      "TYPE"   :  "准客户",
      "RGT_PROVINCE" : "",
      "RGT_CITY"  : ""
    },
    staticData: {
      "ClientType"         : getCustomType(dataInit.allCode.customertype.codeName),
      "ClientSource"       : dataInit.allCode.customersource.codeName,
      "ClientNation"       : dataInit.allCode.nationality.codeName,
      "Nationality"        : dataInit.allCode.nativeplace.codeName,
      "CertificateType"    : dataInit.allCode.idtype.codeName,
      "EducationBackground": dataInit.allCode.degree.codeName,
      "MARRI_STATUS"       : dataInit.allCode.marriage.codeName,
      "companyType"        : dataInit.allCode.incomeway.codeName,
      "testcompanyType"    : straightenData(dataInit.allCode.incomeway.codeName),
      "ACCOUNT_TENDENCY"   : dataInit.allCode.accounttendency.codeName,
      "testACCOUNT_TENDENCY": straightenData(dataInit.allCode.accounttendency.codeName),
      "sites"              : ["家庭地址","单位地址"],
      "Relationship"       : getRelationType(dataInit.allCode.relation.codeMap),
      "Number"             : ['邮箱', '微博', 'QQ']
    },
    adress: {
      basicAfress: {
        province: allProvince,
        city    : null,
        county  : null
      },
      homeAddress: {
        province: allProvince,
        city    : null,
        county  : null
      },
      companyAddress: {
        province: allProvince,
        city    : null,
        county  : null
      }
    },
    fn: {
      checkIncomFn     : checkIncom,
      addUsrFn         : addUsr,
      copyAddressFn    : copyAddress,
      setPlatformFn    : setPlatform,
      useDatePluginFn  : useDatePlugin,
      idCardFnResertFn : idCardFnResert,
      addContactType   : addContactType,
      deleteContact    : deleteContact,
      openModal        : openModal,
      openOCR          : openOCR,
      closeModal       : closeModal,
      deleteModal      : deleteModal,
      addRelationShipFn: addRelationShip,
      relationResertFn : relationResert,
      searchOccupation : searchOccupation,
      chooseOccupation : chooseOccupation,
      occupationSelect : occupationSelect,
      chooseMyDate     : chooseMyDate,
      selectRelationFn : selectRelation,
      clickRelationFn : clickRelation,
      showAddRelationForm:showAddRelationForm,
      returnRelationForm: returnRelationForm,
      checkTheSearch   : checkTheSearch,
      getPreProfessional: getPreProfessional,
      getNextProfessional: getNextProfessional
    },
    formCheckFn: {
      checkUsrName: checkUsrName,
      checkPersonId: checkPersonId,
      checkCommon: checkCommon,
      checkAddress: checkAddress,
      checkHeight: checkHeight
    }
  };
}]);

//编辑客户 
AppController.controller('editUsrCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicScrollDelegate', '$ionicModal', '$timeout', 'UsrData', 'CommonFn', 'searchOccupationServer', 'dataInit', 'relationshipData', 'Variables', 'checkFormHandle','$ionicActionSheet', function ($scope, $rootScope, $state, $stateParams, $ionicScrollDelegate, $ionicModal, $timeout, UsrData, CommonFn, searchOccupationServer, dataInit, relationshipData, Variables, checkFormHandle,$ionicActionSheet) {


  $scope.edit=false; //判断是从03或05编辑客户跳转过来的一些必填项是否显示
 //如果是山西机构显示4，5级详细地址
  var organCode='';
  organCode = window.localStorage.getItem('organCode');
  if(organCode.substr(0,4) == '8614'){
     $scope.isShow = true;    
  }else{
     $scope.isShow = false;
  }
  //在线投保跳转到客户管理根据路径来设置一些项目不可编辑
  if (window.location.search.split('&')[1].split('=')[0] == 'recommend' && window.location.search.split('&')[1].split('=')[1] != 3){
    $scope.edit=true;
    var x = document.getElementsByName('onlineGender');
    for (var i = 0; i < x.length; i++) {
      x[i].disabled = true;
    }
  }
  //建议书跳转到客户管理根据路径来设置一些项目不可编辑 add by renxiaomin 2017.6.8
  if(window.location.search.split('&')[1].split('=')[0] == "oper" && window.location.search.split('&')[1].split('=')[1] == "1"){
    $scope.edit=true;
  //   var x = document.getElementsByName('onlineGender');
  //   for (var i = 0; i < x.length; i++) {
  //     x[i].disabled = true;
  //   }
  //   CommonFn.ionicAlert('必填项不允许修改，如必填项录入有误，请返回删除此建议书，进入客户管理模块修改保存后，再重新制作建议书！');
   }
   //约保姓名电话不可编辑 add by gudandie
   if(Variables.orderNo!='' && Variables.recommend==1){
       $(".yuebao").css("background-color","#fff");
       $(".yuebao").attr("readOnly",true);
   }
  //tab切换
  var setPlatform = function (indexValue) {
    $scope.editUsrModule.attr.tabIndex = indexValue;
  };

  //修改客户时收入大于1000万元时弹出确认窗口--add by wangzj
  function checkIncom(event){
    var currentElemen = event.target;
    if(Number(currentElemen.value)>1000){
      currentElemen.blur();
      CommonFn.showConfirm({
        title:"确认",
        content:"您录入客户每年固定收入为"+currentElemen.value+"万元，请再次确认？",
        sure:function(){
        },
        notSure:function(){
          currentElemen.value='';
          $scope.editUsrModule.data.INCOME='';
        }
      });
    }
  }

  //检测表单是否加赞完毕
  var editPage = $('#editPage');
  var timer = setInterval(function(){
    if(!editPage.hasClass('ng-enter')){
      CommonFn.hideLoading();
      clearInterval(timer);
      timer = null;
    };
  },20);

  //获取客户id
  var id = $stateParams.usrListId;
  //提交内容
  var submitData = function(){
    //整理客户倾向选择数据
      $scope.editUsrModule.data.ACCOUNT_TENDENCY = UsrData.straightenCustomFn($scope.editUsrModule.staticData.ACCOUNT_TENDENCY);
    //整理客户收入信息选择数据
     $scope.editUsrModule.data.INCOME_WAY = UsrData.straightenCustom_INCOME_WAY_Fn($scope.editUsrModule.staticData.INCOME_WAY);
   //根据身份证号验证客户所选性别是否正确   add   2016.7.8  wuwei
    var usersex = $scope.editUsrModule.data.SEX;
    var idCard = document.getElementById("idNumber").value;
    var userIdtype = $scope.editUsrModule.data.IDTYPE;
    var beginOne = idCard.charAt(0);
    var beginTwo = idCard.substring(0,2);
    var ID_END_DATE = $scope.editUsrModule.data.ID_END_DATE;
    var birthdays = $scope.editUsrModule.data.BIRTHDAY;   
    
    // alert(idCard)
    // if(!$scope.editUsrModule.data.IDNO){
    //   CommonFn.ionicAlert('请填写证件号码!');
    //     return;
    // }

    if(typeof birthdays != 'undefined' && birthdays != undefined){
      if(birthdays.indexOf('NaN')>-1){
        CommonFn.ionicAlert('出生日期不符合规范，请返回确认！');
        return;
      }
    }

    if(typeof ID_END_DATE != 'undefined' && ID_END_DATE != undefined){
      if(ID_END_DATE.indexOf('NaN') > -1){
        CommonFn.ionicAlert('证件有效期不符合规范，请返回确认！');
        return;
      }
      var currentData = new Date();
      var currentTime = currentData.getFullYear()+'/'+(currentData.getMonth()+1)+'/'+currentData.getDate();
      if(ID_END_DATE!= '长期有效'){
        var d = new Date(ID_END_DATE.replace(/-/g,"\/"));
        var c = new Date(currentTime);
        if(d<=c){
          CommonFn.ionicAlert('证件有效期不得小于等于当前日期，请返回确认！');
          return;
        }
      }
    }
    if(userIdtype == "居民身份证"){
      if(idCard.length==18){
        var num=idCard.charAt(16);
         if(((num%2==0)&& usersex=="男") || (num%2!=0 && usersex=="女")){
              CommonFn.ionicAlert("您输入的身份证号与所选性别不符！");
              return;
         }         
          if(beginOne == '0' || beginOne == '7' || beginOne == '8' || beginOne == '9'){
            CommonFn.ionicAlert("身份证号不得以"+beginOne+"开头，请仔细核对！");
            return;
          }
          if(beginTwo == '10'){
            CommonFn.ionicAlert("身份证号不得以"+beginTwo+"开头，请仔细核对！");
            return;
          }
         if(!CommonFn.IdentityCodeValid(idCard)){
            CommonFn.ionicAlert("您输入的身份证号有误，请仔细核对！");
            return;
         }
      }else if(idCard.length==15){
        var num1=idCard.charAt(14);
        if(((num1%2==0) && usersex=="男") || (num1%2!=0 && usersex=="女")){
              CommonFn.ionicAlert("您输入的身份证号与所选性别不符！");
              return;
         }
      }
    }else if(userIdtype == "外国人永久居留证"){
        var userName = $scope.editUsrModule.data.REAL_NAME;
        var UserNameReg = /^[A-Z\u4E00-\u9FA5,]+$/;   
        if(!UserNameReg.test(userName)){
          CommonFn.ionicAlert("外国人永久居留证的姓名只能为中文或英文大写字母，姓和名支持逗号隔开！");
          return;
        }
      }else if(userIdtype == "居民户口簿"){
        if(idCard.length==18){
          if($scope.editUsrModule.data.AGE>=16 && CommonFn.isExist($scope.editUsrModule.data.AGE) ){
                CommonFn.ionicAlert("户口簿仅限16周岁以下中国公民使用，请更换证件类型！");
                return;
            }
          if(beginOne == '0' || beginOne == '7' || beginOne == '8' || beginOne == '9'){
            CommonFn.ionicAlert("居民户口簿号码不得以"+beginOne+"开头，请仔细核对！");
            return;
          }
          if(beginTwo == '10'){
            CommonFn.ionicAlert("居民户口簿号码不得以"+beginTwo+"开头，请仔细核对！");
            return;
          }
          if(!CommonFn.IdentityCodeValid(idCard)){
            CommonFn.ionicAlert("您输入的居民户口簿号码有误，请仔细核对！");
            return;
          }
        }
        if(!CommonFn.isExist($scope.editUsrModule.data.ID_END_DATE)){  //校验居民户口簿有效期
            CommonFn.ionicAlert("请填写居民户口簿的有效期，居民户口簿的有效期为长期有效！");
            return;
        }
        if(CommonFn.isExist($scope.editUsrModule.data.ID_END_DATE) && $scope.editUsrModule.data.ID_END_DATE!="长期有效"){  //校验居民户口簿有效期为长期有效
            CommonFn.ionicAlert("居民户口簿的有效期为长期有效！");
            return;
        }
     }
    //校验必填信息
    if(Variables.editCustom == 'true' && Variables.mustNeedData.length){
      for(var i = 0; i < Variables.mustNeedData.length; i++){
        if(!(Variables.mustNeedData[i] in $scope.editUsrModule.data) || !CommonFn.isExist($scope.editUsrModule.data[Variables.mustNeedData[i]])){     
          //alert(Variables.mustNeedData[i]);
          CommonFn.ionicAlert('*为必填信息不能为空');
          for(var attr in Variables.tabData){
            if(CommonFn.inArr(Variables.mustNeedData[i], Variables.tabData[attr])){
              setPlatform(attr);
            };
          };
          return;
        };
      };
    };
    // if(($scope.editUsrModule.data.AGE == undefined || $scope.editUsrModule.data.AGE=='' || typeof $scope.editUsrModule.data.AGE == 'undefined') && $scope.editUsrModule.data.AGE !='0' ){
    //   CommonFn.ionicAlert('请确认年龄是否为空');
    //   return;
    // }
   //增加4，5级城市地址一但没输入信息就校验
    if(organCode.substr(0,4)=="8614"){
        var COMPANY_fourVILLAGE=$scope.editUsrModule.data.COMPANY_fourVILLAGE;
        var COMPANY_fourAreaType=$scope.editUsrModule.data.COMPANY_fourAreaType;
        var COMPANY_fiveVILLAGE=$scope.editUsrModule.data.COMPANY_fiveVILLAGE;
        var COMPANY_fiveAreaType=$scope.editUsrModule.data.COMPANY_fiveAreaType;          

        var HOME_fourVILLAGE=$scope.editUsrModule.data.HOME_fourVILLAGE;
        var HOME_fourAreaType=$scope.editUsrModule.data.HOME_fourAreaType;
        var HOME_fiveVILLAGE=$scope.editUsrModule.data.HOME_fiveVILLAGE;
        var HOME_fiveAreaType=$scope.editUsrModule.data.HOME_fiveAreaType;          
        if(typeof COMPANY_fourVILLAGE == 'undefined' || COMPANY_fourVILLAGE == 'undefined' || COMPANY_fourVILLAGE == '' || typeof COMPANY_fourAreaType == 'undefined' || COMPANY_fourAreaType == ''||
          typeof COMPANY_fiveVILLAGE == 'undefined' || COMPANY_fiveVILLAGE == '' || typeof COMPANY_fiveAreaType == 'undefined' || COMPANY_fiveAreaType == ''
          ){
            CommonFn.ionicAlert('请把通信地址的4级，5级填写完整');  
            return;
        }else{
          if(COMPANY_fourVILLAGE.length < 2 || COMPANY_fiveVILLAGE.length < 2){
            CommonFn.ionicAlert('通信地址的4级，5级不能少于2个字');
            return;
          }
        }
        if(typeof HOME_fourVILLAGE == 'undefined' || HOME_fourVILLAGE == 'undefined' || HOME_fourVILLAGE == '' || typeof HOME_fourAreaType == 'undefined' || HOME_fourAreaType == '' ||
         typeof HOME_fiveVILLAGE == 'undefined' || HOME_fiveVILLAGE == '' || typeof HOME_fiveAreaType == 'undefined' || HOME_fiveAreaType == ''
          ){
            CommonFn.ionicAlert('请把家庭住址的4级，5级填写完整');
            return;
        }else{
          if(HOME_fourVILLAGE.length < 2 || HOME_fiveVILLAGE.length < 2){
            CommonFn.ionicAlert('家庭住址的4级，5级不能少于2个字');
            return;
          }
        }          
    }

    //校验必填信息
    /*if(Variables.editCustom == 'true'){
      alert($scope.editUsrModule.data.MOBILE);
      if(!$scope.editUsrModule.data.MOBILE){
            CommonFn.ionicAlert('移动电话不能为空');
            return;
      }
    }*/

    //校验必填信息
    if(!$scope.editUsrModule.data.MOBILE){
      CommonFn.ionicAlert('移动电话不能为空');
      return;
    }


    var editINCOME_WAY=$scope.editUsrModule.staticData.INCOME_WAY;
    var other_income_way=$scope.editUsrModule.data.OTHER_INCOME_WAY;
    for(var k =0 ; k<editINCOME_WAY.length;k++ ){
      // if(editINCOME_WAY[k].type =="其他" && editINCOME_WAY[k].checked==true && (other_income_way==""|| other_income_way==null)){
      //   CommonFn.ionicAlert('请把其他收入来源填写完整');
      //   return;
      // }
      if(editINCOME_WAY[k].type =="其他" && editINCOME_WAY[k].checked==true && !CommonFn.isExist(other_income_way)){
        CommonFn.ionicAlert('请把其他收入来源填写完整');
        return;
      }
      // if(editINCOME_WAY[k].type =="其他" && editINCOME_WAY[k].checked==false && other_income_way!=''){
        
      // }
      // if(editINCOME_WAY[k].type =="其他" && editINCOME_WAY[k].checked==false && other_income_way!="" && other_income_way!=null){
      //   $scope.editUsrModule.data.OTHER_INCOME_WAY='';
      //   CommonFn.ionicAlert('若存在其他收入来源，请选中“其他”按钮，再进行填写');
      //   return; 
      // }
      if(editINCOME_WAY[k].type =="其他" && editINCOME_WAY[k].checked==false && CommonFn.isExist(other_income_way)){
        // $scope.editUsrModule.data.OTHER_INCOME_WAY='';
        CommonFn.ionicAlert('若存在其他收入来源，请选中“其他”按钮，再进行填写');
        return; 
      }
    }
    var textInput = $('input[type="text"]');
    for(var i = 0; i < textInput.length; i++){
      textInput.get(i).blur();
    };


    // alert($scope.editUsrModule.data.HEIGHT);
    // alert(CommonFn.isExist($scope.editUsrModule.data.HEIGHT));

      //验证身高
    if(CommonFn.isExist($scope.editUsrModule.data.HEIGHT) && parseInt( $scope.editUsrModule.data.AGE)>=18 && $scope.editUsrModule.data.HEIGHT<100){
        CommonFn.ionicAlert("身高不合常理，请检查后重新录入!");
        return;
    }

    // if($scope.editUsrModule.data.HEIGHT == "" || !$scope.editUsrModule.data.HEIGHT){
    //   $('.heightErrorMsg').addClass('my-show');
    //   $('.heightErrorMsg').text('身高不能为空');
    //   CommonFn.ionicAlert("身高不能为空");
    //   return;
    // };


    //体重不能为空
    // if($scope.editUsrModule.data.WEIGHT == "" || !$scope.editUsrModule.data.WEIGHT){
    //   $('.weightErrorMsg').addClass('my-show');
    //   $('.weightErrorMsg').text('体重不能为空');
    //   CommonFn.ionicAlert("体重不能为空");
    //   return;
    // };

     //判断国籍是否为空
    if(!CommonFn.isExist($scope.editUsrModule.data.NATIVE_PLACE)){
        CommonFn.ionicAlert("国籍不能为空!");
        return;
    }
    //校验通信邮编6位数字
    if(CommonFn.isExist($scope.editUsrModule.data.COMPANY_ZIP_CODE)){
        var reg = /^[0-9]{6}$/;
        if(!reg.test($scope.editUsrModule.data.COMPANY_ZIP_CODE)){
            CommonFn.ionicAlert("通信地址邮编只能为6位数字，请重新输入！");
            return;
        }
    }
    //校验住址邮编6位数字
    if(CommonFn.isExist($scope.editUsrModule.data.HOME_ZIP_CODE)){
        var reg = /^[0-9]{6}$/;
        if(!reg.test($scope.editUsrModule.data.HOME_ZIP_CODE)){
            CommonFn.ionicAlert("住址邮编只能为6位数字，请重新输入！");
            return;
        }
    }
    //延迟校验
    setTimeout(function(){
      if($('.normalForm .error-font.my-show').length){
        // CommonFn.ionicAlert('表单验证不通过,请确认必填项“*”是否填写，以及非必填项格式是否正确');
        var editErrInfo = $('.normalForm .error-font.my-show').text().split("!");
        if(editErrInfo.length > 0){
          CommonFn.ionicAlert(editErrInfo[0]);
          return;
        }else{
          CommonFn.ionicAlert('表单验证不通过,请确认必填项“*”是否填写，以及非必填项格式是否正确');
          return;
        }
      }else{
         // 针对山西机构四，五级城市拼到address后面
          if(organCode.substr(0,4)=="8614"){          
            if($scope.editUsrModule.data.COMPANY_ADDRESS == 'undefined' || typeof $scope.editUsrModule.data.COMPANY_ADDRESS == 'undefined' ||  $scope.editUsrModule.data.COMPANY_ADDRESS == ''){
                 $scope.editUsrModule.data.COMPANY_ADDRESS = $scope.editUsrModule.data.COMPANY_fourVILLAGE+"@%@"+$scope.editUsrModule.data.COMPANY_fourAreaType+"@%@"+$scope.editUsrModule.data.COMPANY_fiveVILLAGE+"@%@"+$scope.editUsrModule.data.COMPANY_fiveAreaType;
            }else{
                 $scope.editUsrModule.data.COMPANY_ADDRESS = $scope.editUsrModule.data.COMPANY_fourVILLAGE+"@%@"+$scope.editUsrModule.data.COMPANY_fourAreaType+"@%@"+$scope.editUsrModule.data.COMPANY_fiveVILLAGE+"@%@"+$scope.editUsrModule.data.COMPANY_fiveAreaType+"@%@"+$scope.editUsrModule.data.COMPANY_ADDRESS;
            }        
            if($scope.editUsrModule.data.HOME_ADDRESS == 'undefined' || typeof $scope.editUsrModule.data.HOME_ADDRESS == 'undefined' || $scope.editUsrModule.data.HOME_ADDRESS == ''){
                $scope.editUsrModule.data.HOME_ADDRESS = $scope.editUsrModule.data.HOME_fourVILLAGE+"@%@"+$scope.editUsrModule.data.HOME_fourAreaType+"@%@"+$scope.editUsrModule.data.HOME_fiveVILLAGE+"@%@"+$scope.editUsrModule.data.HOME_fiveAreaType;
            }else{
                $scope.editUsrModule.data.HOME_ADDRESS = $scope.editUsrModule.data.HOME_fourVILLAGE+"@%@"+$scope.editUsrModule.data.HOME_fourAreaType+"@%@"+$scope.editUsrModule.data.HOME_fiveVILLAGE+"@%@"+$scope.editUsrModule.data.HOME_fiveAreaType+"@%@"+$scope.editUsrModule.data.HOME_ADDRESS;
            }
         }       
        restoreTheData();
      };
    },100);
  };

  //保存数据
  function restoreTheData() {
    CommonFn.showLoading('数据保存中...');
    UsrData.editUsrData({
      ID      : id,
      data    : $scope.editUsrModule.data,
      test    : false,
      add     : false,
      formName: 'T_CUSTOMER'
    }, function (SCOPE, data) {
      //新增客户成功后，添加与他有关系的客户;
      addCustomRelationCustom(data.ID, function(){
        CommonFn.hideLoading();
        //关系客户添加完了，再跳转到主客户的详情界面
        UsrData.editSeccessFn(data);
      });
    });
  };
  

  //添加新增客户的关系客户
  function addCustomRelationCustom (firstCustomId, fn) {
    var arrRelation = $scope.editUsrModule.attr.newRelationShip;

    //如果添加了关系信息
    if(arrRelation.length){
      relationshipData.addCustomRelationShip(arrRelation, firstCustomId, fn, arrRelation.length);
    }else{
      //如果没有新增关系信息，则直接跳转到此新增客户的详情界面
      fn && fn();
    };
  };

  //城市联动处理
  var allProvince = dsy.Items['0'];

  //基本信息中的地址联动处理
  CommonFn.adressSelect('editUsrModule', allProvince, $scope, dsy, 'RGT_PROVINCE', 'RGT_CITY', 'basicAfress');

  //联系方式中的地址联动处理
  CommonFn.adressSelect('editUsrModule', allProvince, $scope, dsy, 'HOME_PROVINCE', 'HOME_CITY', 'homeAddress');

  //单位地址联动
  CommonFn.adressSelect('editUsrModule', allProvince, $scope, dsy, 'COMPANY_PROVINCE', 'COMPANY_CITY', 'companyAddress');

  function idCardFnResert() {
    $scope.editUsrModule.attr.idCardPassDontPass = false;
  };

  //选择身份证截止日期
  function useDatePlugin() {
    CommonFn.getDateFn(function (data) {
        var selectDateTime = CommonFn.strToDateFn(data).getTime();
        var nowDateTime = new Date().getTime();
        if(selectDateTime<nowDateTime){  //验证身份证的有效期
            CommonFn.ionicAlert('证件已过期，选择的有效期应在当前日期之后！');
            return false;
        }
      $scope.editUsrModule.data.ID_END_DATE = data;
      $scope.editUsrModule.attr.idCardLongTime = false;
      $scope.$apply($scope.editUsrModule.data.ID_END_DATE);
    });
  };

  //选择特殊纪念日
  function chooseMyDate() {
    CommonFn.getDateFn(function (data) {
      $scope.editUsrModule.data.ANNIVERSARY = data;
      $scope.$apply($scope.editUsrModule.data.ANNIVERSARY);
    });
  };

  //身份证是否长期使用
  $scope.$watch('editUsrModule.attr.idCardLongTime', function (){
    if($scope.editUsrModule.attr.idCardLongTime){
      $scope.editUsrModule.data.ID_END_DATE = '长期有效';
    }else{
      if($scope.editUsrModule.data.ID_END_DATE == '长期有效'){
        $scope.editUsrModule.data.ID_END_DATE = '';
      };
    };
  });

  //重置添加关系表单
  function relationResert () {
    $scope.editUsrModule.attr.relationShipDataCache = {
        relationShipType: '',
        SEX             : '',
        BIRTHDAY        : '',
        AGE             : '',
        REAL_NAME       : ''
    }
  };

  //添加一个关系到临时缓存
  function addRelationShip () {
    if(typeof $scope.editUsrModule.attr.relationShipDataCache.SEX == 'undefined' || $scope.editUsrModule.attr.relationShipDataCache.SEX == ''){
      CommonFn.showFormError('relationSexErrorMsg', '性别为必选项');
    };

    if(typeof $scope.editUsrModule.attr.relationShipDataCache.relationShipType == 'undefined' || $scope.editUsrModule.attr.relationShipDataCache.relationShipType == ''){
      CommonFn.showFormError('relationTypeErrorMsg', '请选择关系');
    };

   //add.  4.26  wuwei 
    var sex2 = $scope.editUsrModule.data.SEX;
    var relationSEX2 =$scope.editUsrModule.attr.relationShipDataCache.SEX;
    var relationShipType2 =$scope.editUsrModule.attr.relationShipDataCache.relationShipType.CODE_NAME;
    if(typeof sex2 == "undefined"){
      CommonFn.ionicAlert('投保人性别未选择！');
      return;      
    }
    if(sex2=="男" &&
      (relationShipType2=="丈夫"||relationShipType2=="妻子"||relationShipType2=="母亲"||relationShipType2=="女儿"
      ||relationShipType2=="祖母"||relationShipType2=="孙女"||relationShipType2=="外祖母"||relationShipType2=="外孙女"
      ||relationShipType2=="姐姐"||relationShipType2=="妹妹"||relationShipType2=="婆婆"||relationShipType2=="岳母"
      ||relationShipType2=="儿媳"
      )
      && relationSEX2=="男" )
      {
         CommonFn.ionicAlert('关系选择有误，请重新确认。');
         return;
      }
    if(sex2=="男" &&
      (relationShipType2=="丈夫"||relationShipType2=="父亲"||relationShipType2=="儿子"||relationShipType2=="祖父"
      ||relationShipType2=="孙子"||relationShipType2=="外祖父"||relationShipType2=="外孙"||relationShipType2=="哥哥"
      ||relationShipType2=="弟弟"||relationShipType2=="公公"||relationShipType2=="岳父"||relationShipType2=="女婿"
      )
      && relationSEX2=="女" )
      {
         CommonFn.ionicAlert('关系选择有误，请重新确认。');
         return;
      }
    if(sex2=="女" &&
      (relationShipType2=="丈夫"||relationShipType2=="妻子"||relationShipType2=="父亲"||relationShipType2=="儿子"||relationShipType2=="祖父"
      ||relationShipType2=="孙子"||relationShipType2=="外祖父"||relationShipType2=="外孙"||relationShipType2=="哥哥"
      ||relationShipType2=="弟弟"||relationShipType2=="公公"||relationShipType2=="岳父"||relationShipType2=="女婿"
      )
      && relationSEX2=="女" )
      {
         CommonFn.ionicAlert('关系选择有误，请重新确认。');
         return;
      }
    if(sex2=="女" &&
      (relationShipType2=="妻子"||relationShipType2=="母亲"||relationShipType2=="女儿"
      ||relationShipType2=="祖母"||relationShipType2=="孙女"||relationShipType2=="外祖母"||relationShipType2=="外孙女"
      ||relationShipType2=="姐姐"||relationShipType2=="妹妹"||relationShipType2=="婆婆"||relationShipType2=="岳母"
      ||relationShipType2=="儿媳"
      )
      && relationSEX2=="男" )
      {
         CommonFn.ionicAlert('关系选择有误，请重新确认。');
         return;
      }

    if(typeof $scope.editUsrModule.attr.relationShipDataCache.REAL_NAME == 'undefined' || $scope.editUsrModule.attr.relationShipDataCache.REAL_NAME == ''){
      CommonFn.showFormError('relationUsrNameErrorMsg', '客户姓名未告知，请告知');
    };

    if(typeof $scope.editUsrModule.attr.relationShipDataCache.AGE == 'string'){
      CommonFn.ionicAlert('请选择出生日期');
      return;
    };

    if($('.addRelationForm .error-font.my-show').length){
      CommonFn.ionicAlert('表单验证不通过,查看是否填写正确');
      return;
    };

    var bCopyRelation = angular.copy($scope.editUsrModule.attr.relationShipDataCache);
    $scope.editUsrModule.attr.newRelationShip.push(bCopyRelation);

    var relationByCode = angular.copy($scope.editUsrModule.attr.relationShipDataCache);
    relationByCode.SEX = CommonFn.codeNameToCode(dataInit.allCode.sex.codeMap, relationByCode.SEX);//把性别转为code
    $scope.editUsrModule.relationList.push(relationByCode);
    $ionicScrollDelegate.resize();
    relationResert();
	//add 5.10  ww
	$scope.editUsrModule.attr.relationForm = false;
    $ionicScrollDelegate.resize();
  };

  var tempRelationShip = [];
  function clickRelation(){
    //alert(JSON.stringify($scope.addUsrModule.staticData.Relationship));
    if(tempRelationShip.length == 0){
      tempRelationShip = $scope.editUsrModule.staticData.Relationship;
    }
    var relationShipList = [];
    tempRelationShip.map(function(item, index){
      var relationShipType2 = item.CODE_NAME;
      if($scope.editUsrModule.data.SEX == "男"){
        if(relationShipType2=="丈夫"){
          
        }else{
          relationShipList.push(item);
        }
      }else if($scope.editUsrModule.data.SEX == "女"){
        if(relationShipType2=="妻子"){
          
        }else{
          relationShipList.push(item);
        }
      }else{

      }
        
    });

    $scope.editUsrModule.staticData.Relationship = relationShipList;
  }

  //选择关系触发的事件
  function selectRelation () {

    var relationShipType2 =$scope.editUsrModule.attr.relationShipDataCache.relationShipType.CODE_NAME;
    if(
      relationShipType2=="丈夫"||relationShipType2=="父亲"||relationShipType2=="儿子"||relationShipType2=="祖父"
      ||relationShipType2=="孙子"||relationShipType2=="外祖父"||relationShipType2=="外孙"||relationShipType2=="哥哥"
      ||relationShipType2=="弟弟"||relationShipType2=="公公"||relationShipType2=="岳父"||relationShipType2=="女婿"
       )
      {
        $scope.editUsrModule.attr.relationShipDataCache.SEX = "男";
      }
    else if(relationShipType2=="妻子"||relationShipType2=="母亲"||relationShipType2=="女儿"
    ||relationShipType2=="祖母"||relationShipType2=="孙女"||relationShipType2=="外祖母"||relationShipType2=="外孙女"
    ||relationShipType2=="姐姐"||relationShipType2=="妹妹"||relationShipType2=="婆婆"||relationShipType2=="岳母"
    ||relationShipType2=="儿媳" )
      {
        $scope.editUsrModule.attr.relationShipDataCache.SEX = "女";
      }


    if($scope.editUsrModule.attr.relationShipDataCache.relationShipType){
      CommonFn.hideFormError('relationTypeErrorMsg');
    }else{
      CommonFn.showFormError('relationTypeErrorMsg', '请选择关系');
    };
  };

  //性别选择是触发
  $scope.$watch('editUsrModule.attr.relationShipDataCache.SEX', function(){
    CommonFn.hideFormError('relationSexErrorMsg');
  });

  //搜索职业
  $ionicModal.fromTemplateUrl('professionalModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  //modify by yangjialin 2015-08-25
  function openModal(occupationKind) {
    //1:职业；2：兼职   modify by yangjialin
    $scope.editUsrModule.attr.occupationKind=occupationKind;
    $scope.modal.show();
    $('.serach-box .items_content').click(function(ev){
      var oTarget = $(ev.target);  
      var itemNow = oTarget.closest('.table_items');

      $('.serach-box .table_items').removeClass('itemActive');
      if(itemNow.length){
        var indexNow = parseInt($('.serach-box .table_items').index(itemNow), 10);
        oTarget.closest('.table_items').addClass('itemActive');
        chooseOccupation(indexNow);
      };
    });
  };
  function openOCR(type){
    var method;
    var isCallBackFlag = false;
    var idtype = CommonFn.translateIdype($scope.editUsrModule.data.IDTYPE);
    if(idtype == "none"){
      CommonFn.ionicAlert('请先选择证件类型');
      return;
    }else if(idtype == "other"){
      CommonFn.ionicAlert('本证件类型暂不支持OCR数据识别');
      return;
    }
    if(type == "back" && idtype == "2"){
      idtype = "3";
    }else if(type == "back" && idtype != "2"){
      CommonFn.ionicAlert('您所选证件类型暂不支持OCR证件有效期识别，请手动选择');
      return;
    }
    $ionicActionSheet.show({
      buttons: [
        {
          text: '拍照'
        }
        ,
        {
          text: '从相册中选取'
        }
      ],  
      cancelText: '取消',
      cancel: function () {
        console.log('CANCELLED');
      },
      buttonClicked: function (index) {
        if(type == "front"){
          $scope.editUsrModule.data.IDNO = '';
        }
        method = index == "0" ? "photo" : "album";
        CommonFn.showLoading('请稍后...');
        CommonFn.invoateOCR({
          idtype:idtype,
          method:method,
          callBackFun:function(data){
            CommonFn.hideLoading();
            isCallBackFlag = true;
            data = eval('('+data+')');
            if(data.message.status !="-1"){
              if(type == "front"){
                $scope.$apply(function(){
                  $scope.editUsrModule.data.IDNO = data.cardsinfo.cardNo;
                  checkPersonId($scope.editUsrModule.data.IDNO, 'idnoErrorMsg');
                }) 
              }else if(type == "back" && idtype == "3"){
                $scope.editUsrModule.data.ID_END_DATE = "";
                $scope.$apply(function(){
                  if(data.cardsinfo.idEndDate == "长期"){
                    data.cardsinfo.idEndDate = "长期有效";
                  }
                  $scope.editUsrModule.data.ID_END_DATE = data.cardsinfo.idEndDate;
                })
              }
            }else{
              CommonFn.ionicAlert(data.message.value);
              return;
            }
          }
        })
        setTimeout(function(){
          if(isCallBackFlag == false){
            CommonFn.hideLoading();
            CommonFn.ionicAlert('请求超时，请稍后再试');
            return;
          }
        },120000)
        return true;
      }
    })
  }
  function closeModal() {
    $('.serach-box .items_content').unbind('click');
    $scope.modal.hide();
  };
 //删除兼职 add by lishuang 2016-3-01
  function deleteModal() {
    $scope.editUsrModule.attr.pluralityOccupationSelected    = false;
      $scope.editUsrModule.data.PLURALITY_OCCUPATION_CODE       =  null;
      $scope.editUsrModule.data.PLURALITY_OCCUPATION_CODE_NAME  =  null;
      $scope.editUsrModule.data.PLURALITY_OCCUPATION_CODE_TYPE  =  null;
  };


  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  //搜索职业
  function serchOccupationStart() {
    var searchOccupationKeyWord = $scope.editUsrModule.attr.WORD;
    var searchMatchAll = $scope.editUsrModule.attr.searchOccupationMacth;

    CommonFn.showLoading('查询中...');

    $timeout(function(){
      searchOccupationServer.searchOccupation({
        keyWord : searchOccupationKeyWord,
        ruler   : searchMatchAll,
        page    : $scope.editUsrModule.professionalPage,
        callBack: function(data){
          CommonFn.hideLoading();
          if(data.length){
            $scope.editUsrModule.professionalPageTotal = Math.ceil(data[0].totalnumber/10);
          };
          $scope.editUsrModule.searchOccupationModel = data;
          $ionicScrollDelegate.scrollTo(0, 0, false);
          $scope.$apply($scope.editUsrModule);
        }
      });
    }, 500);
  };

  //搜索职业
  function searchOccupation () {
    $scope.editUsrModule.professionalPage = 1;
    serchOccupationStart();
  };

  //上一页
  function getPreProfessional() {
    $scope.editUsrModule.professionalPage--;
    serchOccupationStart();
  };

  //下一页
  function getNextProfessional() {
    $scope.editUsrModule.professionalPage++;
    serchOccupationStart();
  };

  function chooseOccupation (index) {
    $scope.editUsrModule.attr.chooseOccupationNow = $scope.editUsrModule.searchOccupationModel[index];
  }
    //modify by yangjialin 2015-08-25
  function occupationSelect () {
    if($scope.editUsrModule.attr.chooseOccupationNow == null || !CommonFn.isExist($scope.editUsrModule.attr.chooseOccupationNow.OCCUPATION_NAME)){
      CommonFn.ionicAlert('请选择职业');
      return;
    };
    //对客户选择的职业进行筛选判断
    var occupationCode = $scope.editUsrModule.attr.chooseOccupationNow.OCCUPATION_CODE;
    var occupationName = $scope.editUsrModule.attr.chooseOccupationNow.OCCUPATION_NAME;
    var customerSex = $scope.editUsrModule.data.SEX;
    // var customerAge = $scope.editUsrModule.data.AGE;
    if($scope.editUsrModule.data.BIRTHDAY!=undefined || typeof $scope.editUsrModule.data.BIRTHDAY!='undefined'){
      var customerAge =CommonFn.birthdayToAgeFn($scope.editUsrModule.data.BIRTHDAY);
    } 
    if((occupationCode == "8010104" || occupationName == "家庭主妇") && customerSex == "男"){
      CommonFn.ionicAlert("客户性别为男性，职业不可以选择家庭主妇！");
      return;
    }
    if((occupationCode == "8010103" || occupationName == "学龄前儿童") && customerAge >= 18){
      CommonFn.ionicAlert("客户年龄大于等于18周岁，职业不可以选择学龄前儿童！");
      return;
    }
    if((occupationCode == "8010104" || occupationName == "家庭主妇") && customerAge <= 15){
      CommonFn.ionicAlert("客户年龄小于等于15周岁，职业不可以选择家庭主妇！");
      return;
    }
    if(customerAge <= 3 && (!(occupationCode == "8010103" || occupationName == "学龄前儿童"))){
      CommonFn.ionicAlert("客户年龄小于等于3周岁，职业只能选择学龄前儿童！");
      return;
    }
    //modify by yangjialin 2015-08-25 
  if($scope.editUsrModule.attr.occupationKind=='1'){
      $scope.editUsrModule.attr.occupationSelected    = true;
      $scope.editUsrModule.data.OCCUPATION_CODE       = $scope.editUsrModule.attr.chooseOccupationNow.OCCUPATION_CODE;
      $scope.editUsrModule.data.OCCUPATION_CODE_NAME  = $scope.editUsrModule.attr.chooseOccupationNow.OCCUPATION_NAME;
      $scope.editUsrModule.data.OCCUPATION_CODE_TYPE  = $scope.editUsrModule.attr.chooseOccupationNow.OCCUPATION_TYPE;
    }else{
      $scope.editUsrModule.attr.pluralityOccupationSelected    = true;
      $scope.editUsrModule.data.PLURALITY_OCCUPATION_CODE       = $scope.editUsrModule.attr.chooseOccupationNow.OCCUPATION_CODE;
      $scope.editUsrModule.data.PLURALITY_OCCUPATION_CODE_NAME  = $scope.editUsrModule.attr.chooseOccupationNow.OCCUPATION_NAME;
      $scope.editUsrModule.data.PLURALITY_OCCUPATION_CODE_TYPE  = $scope.editUsrModule.attr.chooseOccupationNow.OCCUPATION_TYPE;
    }
      //若职业为“农民、无业人员，家庭主妇”，工作单位默认为“无”，不必录入    modify by gudandie 2017-12-18
      if(occupationCode == "8010104" || occupationCode == "8010102" || occupationCode == "8010101" || occupationCode == "5010101"){
          $scope.editUsrModule.data.WORK_UNIT = "";
          $(".editWorkUnit").attr("placeholder","无").attr("readonly",true).css("background-color","#fff");
      }else {
          $(".editWorkUnit").attr("placeholder","现工作单位名称").attr("readonly",false);
      }
    closeModal();
  };

  //从收入来源中把其他删除
  // CommonFn.deleteElementInArr(dataInit.allCode.incomeway.codeName, '其他');

  // $scope.$watch('editUsrModule.attr.incomeOtherWay', function () {
  //   if(!$scope.editUsrModule.attr.incomeOtherWay){
  //     $scope.editUsrModule.data.OTHER_INCOME_WAY = '';
  //   };
  // });

  //显示新增关系表单
  function showAddRelationForm () {
    $scope.editUsrModule.attr.relationForm = true;
    $ionicScrollDelegate.resize();
  };
  //取消家属关系添加
  function returnRelationForm () {
    $scope.editUsrModule.attr.relationForm = false;
    $ionicScrollDelegate.resize();
  };

  function checkTheSearch () {
    $scope.editUsrModule.attr.searchOccupationMacth = !$scope.editUsrModule.attr.searchOccupationMacth;
  };

  //校验用户名
  function checkUsrName(str, className) {
    checkFormHandle.checkUsrName(str, function(json) {
      if(!json.Falg){
        CommonFn.showFormError(className, json.msg);
      }else{
        CommonFn.hideFormError(className);     
      };
    });
  };



  //验证证件号码 编辑客户信息
  function checkPersonId(idCard, className) {
    //判断证件类型
    switch($scope.editUsrModule.data.IDTYPE){
      case "居民身份证":
        idType = "idNo";
        break;

      case "中国护照":
        idType = "chinesepassport";
        break;

      case "军官证":
        idType = "officerpassport";
        break;

      case "士兵证":
        idType = "officerpassport";
        break;

      case "出生证":
        idType = "born";
        break;

      case "台湾居民来往大陆通行证":
        idType = "taiwanpass";
        break;

      case "外国护照":
        idType = "foreignpassport";
        break;

      case "港澳居民来往内地通行证":
        idType = "gobackpass";
        break;

      case "外国人永久居留证":
        idType = "foreignerpermanent";
        break;

      case "居民户口簿":
        idType = "householdregister";
        break;

      default:
        idType = "otheridtype";
    };

    //判断是否为港澳居民来往内地通行证
    // if(typeof $scope.editUsrModule.data.IDTYPE != 'undefined' && $scope.editUsrModule.data.IDTYPE.indexOf('港澳居民来往内地通行证') != -1){
    //   idType = "gobackpass";
    // };

    //如果没有选择证件类型
    if(typeof $scope.editUsrModule.data.IDTYPE == 'undefined' || $scope.editUsrModule.data.IDTYPE == ''){
      idType = "";
    };
    
    if(typeof idCard != 'undefined' && idCard != '' && idCard != null){
      if(idType == ""){
        CommonFn.showFormError('idtypeErrorMsg', "请选择证件类型!");
        return;
      };

      if(idType == "otheridtype"){
        CommonFn.hideFormError(className);
        return;
      };

      //根据证件类型验证
      checkFormHandle.checkPersonIdCard(idCard, idType, function(json) {
        if(!json.Falg){
          CommonFn.showFormError(className, json.msg);
        }else{
          //身份证号码验证通过
          CommonFn.hideFormError(className);
          if($scope.editUsrModule.data.IDTYPE == '居民身份证' || $scope.editUsrModule.data.IDTYPE == '居民户口簿'){
            calculateAge(idCard);
            getSex(idCard);
          };
        };
      });
    }else{
        if(typeof idType != 'undefined' && idType != '' && idType != null){
          CommonFn.hideFormError(className);
          }else {
            //alert("2562: ");
             CommonFn.showFormError('idnoErrorMsg', "请输入证件号!");
          }
      
    };

  };


  //监听证件类型
  $scope.$watch('editUsrModule.data.IDTYPE', function () {
    if(typeof $scope.editUsrModule.data.IDTYPE != 'undefined' && $scope.editUsrModule.data.IDTYPE != "证件类型"){
      CommonFn.hideFormError('idtypeErrorMsg');
      checkPersonId($scope.editUsrModule.data.IDNO, 'idnoErrorMsg');
    };
    // if($scope.editUsrModule.data.IDTYPE == '居民户口簿'){  //居民户口簿默认长期有效
    //     $scope.editUsrModule.attr.idCardLongTime = true;
    // } else{
    //     $scope.editUsrModule.attr.idCardLongTime = false;
    // }
  });
  $scope.$watch('editUsrModule.data.IDNO', function () {
    if($scope.editUsrModule.data.IDNO.charAt(17)=='x' && ($scope.editUsrModule.data.IDTYPE == "居民身份证" || $scope.editUsrModule.data.IDTYPE == "居民户口簿")){
      $scope.editUsrModule.data.IDNO = $scope.editUsrModule.data.IDNO.toUpperCase();
    }
  });

  $scope.$watch('editUsrModule.data.AGE', function(){
    if($scope.editUsrModule.data.AGE < 18){
      $scope.editUsrModule.data.MARRI_STATUS = "未婚";
    }
  })

  //根据身份证号码计算年龄 编辑客户信息
  function calculateAge(_idCard) {
    var usrAgeMsg = CommonFn.getUserAge(_idCard);

    $scope.editUsrModule.data.AGE = usrAgeMsg.age;
    $scope.editUsrModule.data.BIRTHDAY = usrAgeMsg.birthday;
    //$scope.editUsrModule.attr.idCardLongTime = usrAgeMsg.isEffective;

    if(usrAgeMsg.age < 0){
      $scope.editUsrModule.attr.agePass = false;
    }else{
      $scope.editUsrModule.attr.agePass = CommonFn.checkDate(usrAgeMsg.birthday);
    };

  };


  //根据身份证号码得出性别 编辑客户
  function getSex(_idCard)
  {
    if (parseInt(_idCard.substr(16, 1)) % 2 == 1) {
      $scope.editUsrModule.data.SEX="男";
    } else {
      $scope.editUsrModule.data.SEX="女";
    }
  }

  //居住详细地址验证
  function checkAddress(str, className) {
    if((typeof str != 'undefined') && str != ''){
      checkFormHandle.checkAddress(str, function(json) {
        if(!json.Falg){
          CommonFn.showFormError(className, json.msg);
        }else{
		  //add   6.8  wuwei
          var strl= str.length;
          if(strl = "" || strl < 5){
              CommonFn.ionicAlert("详细地址不能少于5个字符");
              return;                                   
          }else{
            var flag=1;
            for(var i=0; i< str.length-1;i++){
              if (str.charAt(i)==str.charAt(i+1)){
                  flag++;
                  if(flag>=5){
                    CommonFn.ionicAlert("不能连续重复5次的相同字符,请重新输入");
                    return;
                  }
                }else{
                  flag=1;
                }
             }   
          }
          CommonFn.hideFormError(className);
        };
      });
    }else{
      CommonFn.hideFormError(className);
    };
  };

    //验证成人身高
    function checkHeight() {
        if($scope.editUsrModule.data.BIRTHDAY!=undefined || typeof $scope.editUsrModule.data.BIRTHDAY!='undefined'){
            var age = CommonFn.birthdayToAgeFn($scope.editUsrModule.data.BIRTHDAY);
            var height = $scope.editUsrModule.data.HEIGHT;
            if(parseInt(age)>=18 && height<100){
                CommonFn.ionicAlert("身高不合常理，请检查后重新录入!");
                return;
            }
        }
    }

  //简单规则校验校验(除证件号码之外,普通输入框里的字符)
  function checkCommon(num, type, className) {
    if((typeof num) != 'undefined' && num != "" && num != null){
      checkFormHandle.commonCheck(num, type, function(json) {
        if(!json.Falg){
          CommonFn.showFormError(className, json.msg);
        }else{
          CommonFn.hideFormError(className);
        };
      });
    }else{
      CommonFn.hideFormError(className);
    };
  };

 //更改之前的校验方式  备份于6.27
 /*function checkContanct(type, num, fn) {
    type = $scope.editUsrModule.attr.contactTypeKey[type];

    if((typeof num) != 'undefined' && num != ""){
      checkFormHandle.checkContact(num, type, function(json) {
        if(!json.Falg){
          CommonFn.ionicAlert(json.msg);
        }else{
          fn && fn();
        };
      });
    }else{
      CommonFn.ionicAlert('不能为空');
    };
  };*/

 //校验联系方式
 function checkContanct(type, num, fn) {
    type = $scope.editUsrModule.attr.contactTypeKey[type];
    //add  增加‘其他’非空条件判断   6.27  wuwei
    if((typeof num != undefined && num != "")||(type!=""&&type!=undefined)){
      checkFormHandle.checkContact(num, type, function(json) {
        if(!json.Falg){
          if(type==undefined){
              CommonFn.ionicAlert("类型不能为空");
          }else{
            if((type=="QQ"||type=="EMAIL")&&num==""){
               CommonFn.ionicAlert(type+"账号不能为空"); 
             }else{
              CommonFn.ionicAlert(json.msg); 
             }          
          }   
        }else{
          if(type=="WEIBO_NO" &&num==""){
              CommonFn.ionicAlert("微博账号不能为空");
              return;
          }
          fn && fn();
        };
      });
    }else{
      CommonFn.ionicAlert('类型或账号不能为空');
    };
  };

  //添加联系方式
  function addContactType(type, num) {
    checkContanct(type, num, function() {
      var newJson = angular.copy($scope.editUsrModule.attr.contactMsg);
      var contactKey = $scope.editUsrModule.attr.contactTypeKey[newJson.type];

      CommonFn.deleteElementInArr($scope.editUsrModule.staticData.Number, newJson.type);
      if(!$scope.editUsrModule.staticData.Number.length){
        $scope.editUsrModule.attr.showContactSlect = false;
      };
      $scope.editUsrModule.attr.otherContactMethod.push(newJson);
      $scope.editUsrModule.data[contactKey] = newJson.value;
      $ionicScrollDelegate.resize();
      $scope.editUsrModule.attr.contactMsg = {
        type : '',
        value: ''
      };
    });
  };

  //删除联系方式
  function deleteContact (index) {
    var contactKey = $scope.editUsrModule.attr.contactTypeKey[$scope.editUsrModule.attr.otherContactMethod[index].type];

    $scope.editUsrModule.staticData.Number.push($scope.editUsrModule.attr.otherContactMethod[index].type);
    $scope.editUsrModule.data[contactKey] = '';
    $scope.editUsrModule.attr.showContactSlect = true;
    $scope.editUsrModule.attr.otherContactMethod.splice(index, 1);
    $ionicScrollDelegate.resize();
  };

  //整理其他联系方式列表
  function straightenContact(json) {
    angular.forEach($scope.editUsrModule.attr.contactTypeKey, function(value, key) {
      if(json[value]){
        $scope.editUsrModule.attr.otherContactMethod.push({
          type: key,
          value: json[value]
        });
        CommonFn.deleteElementInArr($scope.editUsrModule.staticData.Number, key);
      };

      if(!$scope.editUsrModule.staticData.Number.length){
        $scope.editUsrModule.attr.showContactSlect = false;
      };
    });
  };

  function getRelationType(arr) {
    for(var i = 0; i < arr.length; i++){
      if(arr[i].CODE_NAME == '本人'){
        arr.splice(i, 1);
      };
    };

    return arr;
  };

  //接口导出
  $scope.editUsrModule = {
    attr: {
      tabIndex             : 'basicMsg',
      basicMsgFormPass     : '',
      addressMsgFormPass   : '',
      idCardPassDontPass   : false,
      idCardLongTime       : false,
      agePass              : true,
      relationForm         : false,
      relationTypePass     : true,
      relationAgePass      : true,
      searchOccupationMacth: false,
      showContactSlect     : true,
      bEdit                : Variables.editCustom,
      otherContactMethod   : [],
      contactTypeKey       : {
        "QQ": "QQ",
        "微博": "WEIBO_NO",
        "邮箱": "EMAIL"
      },
      contactMsg           : {
        type : '',
        value: ''
      },
      relationShipDataCache: {
        relationShipType: '',
        SEX             : '',
        BIRTHDAY        : '',
        AGE             : '',
        REAL_NAME       : ''
      },
      newRelationShip      : [],
      chooseOccupationNow  : null,
      activeNow            : '',
      occupationSelected   : false,
      searchOccupationMacth: false,
      incomeOtherWay       : false,
      mailingAddress       : ''
    },
    relationList: [],
    mustNeedData: Variables.mustNeedData,
    professionalPage       : 1,
    professionalPageTotal  : '',
    staticData: {
      //"ClientType"         : dataInit.allCode.customertype.codeName,
	  "ClientType"         : ["准客户"],
      "ClientSource"       : dataInit.allCode.customersource.codeName,
      "ClientNation"       : dataInit.allCode.nationality.codeName,
      "Nationality"        : dataInit.allCode.nativeplace.codeName,
      "CertificateType"    : dataInit.allCode.idtype.codeName,
      "EducationBackground": dataInit.allCode.degree.codeName,
      "MARRI_STATUS"       : dataInit.allCode.marriage.codeName,
      "companyType"        : dataInit.allCode.incomeway.codeName,
      "ACCOUNT_TENDENCY"   : [],
      "sites"              : ["家庭地址","单位地址"],
      "Relationship"       : getRelationType(dataInit.allCode.relation.codeMap),
      "Number"             : ['邮箱', '微博', 'QQ']
    },
    adress: {
      basicAfress: {
        province: allProvince,
        city    : null,
        county  : null
      },
      homeAddress: {
        province: allProvince,
        city    : null,
        county  : null
      },
      companyAddress: {
        province: allProvince,
        city    : null,
        county  : null
      }
    },
    data: null,//UsrData.getUsrDetail({ID: id, tanslateCode:true, copy: true}),
    fn  : {
      copyAddressFn    : copyAddress,
      checkIncomFn     : checkIncom,
      submitDataFn     : submitData,
      setPlatformFn    : setPlatform,
      idCardFnResertFn : idCardFnResert,
      useDatePluginFn  : useDatePlugin,
      relationResertFn : relationResert,
      addRelationShipFn: addRelationShip,
      closeModal       : closeModal,
      openModal        : openModal,
      openOCR          : openOCR,
      deleteModal      : deleteModal,
      occupationSelect : occupationSelect,
      searchOccupation : searchOccupation,
      chooseMyDate     : chooseMyDate,
      showAddRelationForm: showAddRelationForm,
      selectRelationFn : selectRelation,
      clickRelationFn : clickRelation,
      returnRelationForm: returnRelationForm,
      checkTheSearch   : checkTheSearch,
      deleteContact    : deleteContact,
      addContactType   : addContactType,
      getPreProfessional: getPreProfessional,
      getNextProfessional: getNextProfessional
    },
    formCheckFn: {
      checkUsrName: checkUsrName,
      checkPersonId: checkPersonId,
      checkCommon: checkCommon,
      checkAddress: checkAddress,
      checkHeight:checkHeight
    }
  };
  //客户倾向回写
  function straightenData(arr) {
    var isExistDataArr = [];
    var arrResult = [];

    if(CommonFn.isExist($scope.editUsrModule.data.ACCOUNT_TENDENCY)){
      isExistDataArr = $scope.editUsrModule.data.ACCOUNT_TENDENCY.split(',');
    };

    for(var i = 0; i < arr.length; i++){
      var json = {
        type: arr[i],
        checked: false
      };

      if(CommonFn.inArr(CommonFn.codeNameToCode(dataInit.allCode.accounttendency.codeMap, arr[i]), isExistDataArr)){
        json.checked = true;
      };

      arrResult.push(json);
    };

    return arrResult;
  };
  
  //收入信息回写
  function straightenData_INCOME_WAY(arr) {
    var isExistDataArr = [];
    var arrResult = [];

    if(CommonFn.isExist($scope.editUsrModule.data.INCOME_WAY)){
      isExistDataArr = $scope.editUsrModule.data.INCOME_WAY.split(',');
    };

    for(var i = 0; i < arr.length; i++){
      var json = {
        type: arr[i],
        checked: false
      };

      if(CommonFn.inArr(CommonFn.codeNameToCode(dataInit.allCode.incomeway.codeMap, arr[i]), isExistDataArr)){
        json.checked = true;
      };
    
      arrResult.push(json);
    };

    return arrResult;
  };

  //获取客户详情
  UsrData.getUsrDetailNewFn({ID: id, tanslateCode:true}, function(getData) {

    $scope.editUsrModule.data = getData;

        //针对山西机构把address放到4，5级地址里
        if(organCode.substr(0,4) == '8614'){
        // 单位地址
          var COMPANY_ADDRESS = $scope.editUsrModule.data.COMPANY_ADDRESS;
          var lastStr = COMPANY_ADDRESS.split('@%@');
          var Company_length=lastStr.length;
            for(i=0;i<lastStr.length;i++){
              if(i == 0){
                $scope.editUsrModule.data.COMPANY_fourVILLAGE=lastStr[i];
              }else if(i==1){
                $scope.editUsrModule.data.COMPANY_fourAreaType=lastStr[i];
              }else if(i==2){
                $scope.editUsrModule.data.COMPANY_fiveVILLAGE=lastStr[i];
              }else if(i==3){
                $scope.editUsrModule.data.COMPANY_fiveAreaType=lastStr[i];
              }else if(i==4){
                $scope.editUsrModule.data.COMPANY_ADDRESS=lastStr[i];
              }      
            }
            if(Company_length == 4){
                $scope.editUsrModule.data.COMPANY_ADDRESS='';
              }

           // 家庭住址 
          var HOME_ADDRESS = $scope.editUsrModule.data.HOME_ADDRESS;
          var lastStr = HOME_ADDRESS.split('@%@');
          var HOME_length=lastStr.length;
            for(i=0; i< lastStr.length;i++){       
              if(i == 0){
                $scope.editUsrModule.data.HOME_fourVILLAGE=lastStr[i];
              }else if(i==1){
                $scope.editUsrModule.data.HOME_fourAreaType=lastStr[i];
              }else if(i==2){
                $scope.editUsrModule.data.HOME_fiveVILLAGE=lastStr[i];
              }else if(i==3){
                $scope.editUsrModule.data.HOME_fiveAreaType=lastStr[i];
              }else if(i==4){
                $scope.editUsrModule.data.HOME_ADDRESS=lastStr[i];
              }
            }
            if(HOME_length == 4){
                $scope.editUsrModule.data.HOME_ADDRESS='';
              }
        }
        // 日期时间戳和日期转换  add by renxiaomin 2016.11.23

        if((typeof $scope.editUsrModule.data.ID_END_DATE == 'string') && $scope.editUsrModule.data.ID_END_DATE != '长期有效'){
          var R=new Date();
          var newY=R.getFullYear();
          $scope.validity=$scope.editUsrModule.data.ID_END_DATE;
          var oldY=Number($scope.validity.substr(0,4));
         if((oldY-newY)>=90 || oldY==9999){
            $scope.editUsrModule.data.ID_END_DATE='长期有效';
            $scope.editUsrModule.attr.idCardLongTime = true;
         }else{
            $scope.editUsrModule.data.ID_END_DATE=$scope.validity;
            $scope.editUsrModule.attr.idCardLongTime = false;
         }
       }
       //零岁的显示
       var birthday = $scope.editUsrModule.data.BIRTHDAY;
       var age="";
       if(CommonFn.isExist(birthday)){
          var birthdayArr = birthday.split('-');
          var birthdayDate = new Date();
          var dateNow = new Date();

          birthdayDate.setFullYear(parseInt(birthdayArr[0], 10));
          birthdayDate.setMonth(parseInt(birthdayArr[1], 10) - 1);
          birthdayDate.setDate(parseInt(birthdayArr[2], 10));

          dateNow.setFullYear(parseInt(birthdayArr[0], 10));
          var newDateNow = new Date();
          if(dateNow.getTime() >= birthdayDate.getTime()){        
            age= newDateNow.getFullYear() - parseInt(birthdayArr[0], 10);   
          }else{        
            age= (newDateNow.getFullYear() - parseInt(birthdayArr[0], 10)) - 1;  
          };

          if(age == 0){
            $scope.editUsrModule.data.AGE=0;
          }
        }

    straightenContact($scope.editUsrModule.data);

    if($scope.editUsrModule.data.OCCUPATION_CODE_NAME){
      $scope.editUsrModule.attr.occupationSelected = true;
    };
  
  //add by yangjialin 2015-08-25
    if($scope.editUsrModule.data.PLURALITY_OCCUPATION_CODE_NAME){
      $scope.editUsrModule.attr.pluralityOccupationSelected = true;
    };
  
    if($scope.editUsrModule.data.OTHER_INCOME_WAY){
      $scope.editUsrModule.attr.incomeOtherWay = true;
    };

    //判断是否长期有效
    if($scope.editUsrModule.data.ID_END_DATE == '长期有效'){
      $scope.editUsrModule.attr.idCardLongTime = true;
    };

    //判断邮寄地址
    if(CommonFn.isExist($scope.editUsrModule.data.MAILING_ADDRESS)){
      $scope.editUsrModule.attr.mailingAddress = $scope.editUsrModule.data.MAILING_ADDRESS;
    }else{
      $scope.editUsrModule.attr.mailingAddress = '';
    };

    $scope.editUsrModule.staticData.ACCOUNT_TENDENCY = straightenData(dataInit.allCode.accounttendency.codeName);
  $scope.editUsrModule.staticData.INCOME_WAY = straightenData_INCOME_WAY(dataInit.allCode.incomeway.codeName);
    $scope.$apply(function(){
    $scope.editUsrModule.staticData.ACCOUNT_TENDENCY;
    $scope.editUsrModule.staticData.INCOME_WAY;
  });
  
  });

  //选择邮寄地址
  $scope.$watch('editUsrModule.attr.mailingAddress', function () {
    $scope.editUsrModule.data.MAILING_ADDRESS = $scope.editUsrModule.attr.mailingAddress;
  });
  $scope.isAddress = false;
  //编辑投保人地址同步
  function copyAddress(){
    if($scope.isAddress == false){
      $scope.isAddress = true;
      $scope.editUsrModule.data.HOME_PROVINCE = $scope.editUsrModule.data.COMPANY_PROVINCE;
      $scope.editUsrModule.data.HOME_CITY = $scope.editUsrModule.data.COMPANY_CITY;
      $scope.editUsrModule.data.HOME_COUNTY = $scope.editUsrModule.data.COMPANY_COUNTY;
      $scope.editUsrModule.data.HOME_ADDRESS = $scope.editUsrModule.data.COMPANY_ADDRESS;
      $scope.editUsrModule.data.HOME_PHONE = $scope.editUsrModule.data.COMPANY_PHONE;
      $scope.editUsrModule.data.HOME_ZIP_CODE = $scope.editUsrModule.data.COMPANY_ZIP_CODE;
      $scope.editUsrModule.data.HOME_fourVILLAGE = $scope.editUsrModule.data.COMPANY_fourVILLAGE;
      $scope.editUsrModule.data.HOME_fourAreaType = $scope.editUsrModule.data.COMPANY_fourAreaType;
      $scope.editUsrModule.data.HOME_fiveVILLAGE = $scope.editUsrModule.data.COMPANY_fiveVILLAGE;
      $scope.editUsrModule.data.HOME_fiveAreaType = $scope.editUsrModule.data.COMPANY_fiveAreaType;
    }else{
      $scope.isAddress = false;
      $scope.editUsrModule.data.HOME_PROVINCE = '';
      $scope.editUsrModule.data.HOME_CITY = '';
      $scope.editUsrModule.data.HOME_COUNTY = '';
      $scope.editUsrModule.data.HOME_ADDRESS = '';
      $scope.editUsrModule.data.HOME_PHONE = '';
      $scope.editUsrModule.data.HOME_ZIP_CODE = '';
      $scope.editUsrModule.data.HOME_fourVILLAGE = '';
      $scope.editUsrModule.data.HOME_fourAreaType = '';
      $scope.editUsrModule.data.HOME_fiveVILLAGE = '';
      $scope.editUsrModule.data.HOME_fiveAreaType = '';
    }
    
  }
  //获取客户的关系信息
  relationshipData.getRelation({
    id: id
  },function(arr){
      $scope.editUsrModule.relationList = arr;

      //填加家属关系零岁显示
      for(var i=0;i<arr.length;i++){
        var birthday =  $scope.editUsrModule.relationList[i].BIRTHDAY;
        var age="";
        if(birthday != ""){
          var birthdayArr = birthday.split('-');
          var birthdayDate = new Date();
          var dateNow = new Date();

          birthdayDate.setFullYear(parseInt(birthdayArr[0], 10));
          birthdayDate.setMonth(parseInt(birthdayArr[1], 10) - 1);
          birthdayDate.setDate(parseInt(birthdayArr[2], 10));

          dateNow.setFullYear(parseInt(birthdayArr[0], 10));
          var newDateNow = new Date();
          if(dateNow.getTime() >= birthdayDate.getTime()){        
            age= newDateNow.getFullYear() - parseInt(birthdayArr[0], 10);   
          }else{        
            age= (newDateNow.getFullYear() - parseInt(birthdayArr[0], 10)) - 1;  
          };
          //为避免过滤器过滤掉0，强制赋值0
          if(age == 0){
            $scope.editUsrModule.relationList[i].AGE=0;
          }
        }
    }    
  });

}]);
