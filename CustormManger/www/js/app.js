var MyApp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters', 'starter.directive']);

//app启动后需要立即执行的操作
MyApp.run(function ($ionicPlatform, $rootScope, $state, $ionicLoading, CommonFn, dataInitRequest, setVariables) {

  //资源加载完毕后需要做的一些事情，例如把服务器上一些常用的静态数据缓存到内存中，例如少数名族种类，客户收入来源，关系种类等；
  $ionicPlatform.ready(function() {
    /*if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }*/
    if(window.StatusBar) {
      StatusBar.styleDefault();
    };

    localStorage.customSynchronized = '1';

    //根据url存储一些常量
    setVariables.setVariablesData();
    
  });

  //点击最左侧的导航时，判断跳转模块
  function toUsrManage(menuName) {
	//alert("menuName:"+menuName);
    var stateName = $state.current.name;
    if(menuName == "localCustomer"){
    	if(stateName.indexOf('CustomerMain') == -1){
    		$state.go('app.CustomerMain');
    	};
    }else if(menuName == "syncCustomer"){
    	//$state.go('app.CustomerMain');
    	$rootScope.syncCustomerList();
    }
  };

  function showLoading () {
    $ionicLoading.show({
        template: 'Loading...'
    });
  };

  function hideLoading () {
    $ionicLoading.hide();
  };

  //隐藏右侧顶部栏
  function hideBar () {
    CommonFn.hideBarFn();
    $rootScope.commonModule.CustomerHide = false;
  };

  //返回上一历史记录
  function goBack(bEdit) {
    window.history.back();
    if(!bEdit){
      $rootScope.commonModule.CustomerHide = false;
    };
  };

  $rootScope.$watch('commonModule.CustomerHide', function() {
    $rootScope.commonModule.enableSlide = !$rootScope.commonModule.CustomerHide;
  });

  //退出应用
  function gohomeFun (){
    CommonFn.closeWebViewFn('');
  };

// 建议书模块编辑客户，点击返回退回之前的页面，而不用再点击编辑完成  ---wangzj
  function toBack(){
    var toBackFlag = getQueryStringByName('toBackFlag');
    var url = window.location.href;
    var lastStr = url.split('?')[1];
    var dataArr = lastStr.split('&');
    var resultJson = {};
    for(var i = 0; i<dataArr.length; i++){
      var newArr = dataArr[i].split('=');
      resultJson[newArr[0]] = newArr[1]
    };
    if('toBackFlag' in resultJson){
      CommonFn.closeWebViewFn('');
    }else{
      window.history.back();
    };
  };

  function goAddCustomForm () {
    if($('#addCustom').length){
      return;
    };
    $rootScope.commonModule.CustomerHide = true;
    CommonFn.showLoading('表单加载中...');
    setTimeout(function(){
      $state.go('app.CustomerMain.addUsr');
    },200);
  };

  //判断设备类型
  function getQueryStringByName(name){
    return true;
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

  //建立$rootScope命名空间
  $rootScope.commonModule = {
    /**
     *   $rootScope上的公共属性说明
     *
     * * hideRightViewTopBar 右侧view导航栏是否隐藏
     *    @true {bolean} 隐藏状态
     *    @false {bolean} 显示状态
     *
     * * toUsrManage 点击最左侧的导航时，判断跳转模块
     */

    hideRightViewTopBar : true,
    isPad               : true, 
    isIos               : ionic.Platform.platform() == 'ios',
    toUsrManage         : toUsrManage,
    hideBar             : hideBar,
    goBack              : goBack,
    isAndroid           : ionic.Platform.isAndroid(),
    showLoading         : showLoading,
    hideLoading         : hideLoading,
    gohomeFun           : gohomeFun,
    CustomerHide        : false,
    goAddCustomForm     : goAddCustomForm,
    toBack              : toBack
  };
});

//路由配置
MyApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/app/CustomerMain');
    
    //判断设备类型
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
    //设备类型（phone:手机；pad:平板）
    //var pctype = getQueryStringByName('pctype');
    if(getQueryStringByName('pctype') == '' || getQueryStringByName('pctype') == 'pad'){
      $stateProvider
        .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "templates/pad/menu.html"
        })

        .state('app.CustomerMain', {
          url: "/CustomerMain",
          views: {
            'menuContent' :{
              templateUrl: "templates/pad/CustomerMain.html"
            },
            'pageRightView@app.CustomerMain': {
              templateUrl: "templates/pad/pageRightView.html"
            },
            'RightViewContent@app.CustomerMain': {
              templateUrl: "templates/pad/blankPage.html",
              controller: 'blankPageCtrl'
            }
          }
        })

        .state('app.CustomerMain.usrDetailJump', {
          url: '/usrDetailJump/:usrListId',
          views: {
            'RightViewContent@app.CustomerMain': {
              templateUrl: 'templates/pad/usrDetail.html',
              controller: 'CustomerDetailCtrl'
            }
          }
        })

        .state('app.CustomerMain.addUsr', {
          url: '/addUsr',
          views: {
            'RightViewContent@app.CustomerMain': {
              templateUrl: 'templates/pad/addUsr.html',
              controller: 'addUsrCtrl'
            }
          }
        })

        .state('app.CustomerMain.editUsr', {
          url: '/editUsr/:usrListId',
          views: {
            'RightViewContent@app.CustomerMain': {
              templateUrl: 'templates/pad/editUsr.html',
              controller: 'editUsrCtrl'
            }
          }
        });

    }else{
      $stateProvider
        //侧滑
        .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "templates/phone/menu.html"
        })

        //客户列表
        .state('app.CustomerMain', {
          url: "/CustomerMain",
          views: {
            'menuContent@app' :{
              templateUrl: "templates/phone/CustomerMain.html"
            }
          }
        })

        //客户详情
        .state('app.CustomerMain.usrDetailJump', {
          url: '/usrDetailJump/:usrListId',
          views: {
            'menuContent@app': {
              templateUrl: 'templates/phone/usrDetail.html',
              controller: 'CustomerDetailCtrl'
            }
          }
        })

        //编辑客户
        .state('app.CustomerMain.editUsr', {
          url: '/editUsr/:usrListId',
          views: {
            'menuContent@app': {
              templateUrl: 'templates/phone/editUsr.html',
              controller: 'editUsrCtrl'
            }
          }
        })

        //新增客户
        .state('app.CustomerMain.addUsr', {
          url: '/addUsr',
          views: {
            'menuContent@app': {
              templateUrl: 'templates/phone/addUsr.html',
              controller: 'addUsrCtrl'
            }
          }
        })
    };
  
}]);

