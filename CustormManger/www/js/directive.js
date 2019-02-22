var directiveModule = angular.module('starter.directive', []);

//用户姓名和性别选择
directiveModule.directive("usrname", function() {
    return {
        restrict: 'E',
        templateUrl: 'widgetTemplate/usrnameTamplate.html',
        replace: true,
        scope: {
            childScopeUsrName: "=parentScopeUsrName",
            childScopeSex: "=parentScopeSex"
        },
        link: function (scope, elm, attrs) {
            var eleUsrname = elm.find('.usrname');

            eleUsrname.bind('blur', function(){
                var xmlUrl ="validators/CustomerDetail-validation.xml";
                var formElementID="occupationCode";
                var formElementValue="8010104";

                //formCheckHandle(xmlUrl,formElementID,formElementValue)
            });
        }
    }
});

//身份证验证
directiveModule.directive('personId', function () {
    return {
        require: "ngModel",
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (value) {
                var REGEXP = '';

                switch(attrs.idtype){
                    case '居民身份证':
                        REGEXP = /^[1-9](\d{13}|\d{16})[\dx]$/g;
                        break;

                    case '中国护照':
                        REGEXP = /^(P\d{7}|G\d{8}|S\d{7,8}|D\d+|1[4,5]\d{7})$/g;
                        break;

                    case '军官证':
                        REGEXP = /^[0-9]{8}$/g;
                        break;

                    default:
                         REGEXP = /^[0-9]{8}$/g;
                };
                
                if( !value || REGEXP.test(value) ){
                    ctrl.$setValidity('ID', true);
                    ctrl.$invalid = false;
                    return value;
                }else{
                    ctrl.$invalid = true;
                    ctrl.$setValidity('ID', false);
                    return undefined;    
                };
            });
        }
    };
});

//地址验证
directiveModule.directive('checkAddress', function () {
    return {
        require: "ngModel",
        restrict: "A",
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (value) {
                var REGEXP = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/g;

                if( !value || REGEXP.test(value) ){
                    ctrl.$setValidity('address', true);
                    ctrl.$invalid = false;
                    return value;
                }else{
                    ctrl.$invalid = true;
                    ctrl.$setValidity('address', false);
                    return undefined;  
                };
            });
        }
    };
});

//数字验证
directiveModule.directive('number', function () {
    return {
        require: "ngModel",
        restrict: "A",
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (value) {
                var REGEXP = /^\d+$/g;

                if( !value || REGEXP.test(value) ){
                    ctrl.$setValidity('numberCheck', true);
                    ctrl.$invalid = false;
                    return value;
                }else{
                    ctrl.$setValidity('numberCheck', false);
                    ctrl.$invalid = true;
                    return undefined;  
                };
            });
        }
    };
});

//邮编验证
directiveModule.directive('postalCode', function () {
    return {
        require: "ngModel",
        restrict: "A",
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (value) {
                var REGEXP = /^[1-9]\d{5}(?!\d)$/g;

                if( !value || REGEXP.test(value) ){
                    ctrl.$setValidity('postal', true);
                    ctrl.$invalid = false;
                    return value;
                }else{
                    ctrl.$setValidity('postal', false);
                    ctrl.$invalid = true;
                    return undefined;  
                };
            });
        }
    };
});

directiveModule.directive('myrequired', function () {
    return {
        require: "ngModel",
        restrict: "A",
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$invalid = true;
            ctrl.$parsers.unshift(function (value) {
                if(value == ''){
                    ctrl.$invalid = true;
                    return undefined;  
                }else{
                    $('#relationError p').addClass('ng-hide');
                    ctrl.$invalid = false;
                    return value;
                };
            });
        }
    };
});

directiveModule.directive('usrnamerequired', function () {
    return {
        require: "ngModel",
        restrict: "A",
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$invalid = true;
            ctrl.$parsers.unshift(function (value) {
                if(value == ''){
                    ctrl.$setValidity('usrname', false);
                    ctrl.$invalid = true;
                    return undefined;  
                }else{
                    $('.usrNameError').removeClass('error');
                    ctrl.$setValidity('usrname', true);
                    ctrl.$invalid = false;
                    return value;
                };
            });
        }
    };
});

//生日验证
directiveModule.directive('birthday', ['CommonFn', function (CommonFn) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: 'templates/pad/datePickerTemplate.html',
        scope: {
            childScopeBirthday: '=parentScopeBirthay',
            childScopeAge: '=parentScopeAge',
            childScopeId: '=parentScopeId',
            childScopeIdCardPassDontPass: '=parentScopeIdCardPassDontPass',
            childScopeParentScopeFormPass: '=parentScopeFormPass',
            childScopeIdCardLongTime: '=parentScopeIdcardlongtime',
            childScopeAgePass: '=parentScopeAgepass',
            childScopeIdType: '=parentScopeIdtype',
            childScopeMustNeedData: '=parentScopeMustneeddata',
            childScopeIsPad: '=parentScopeIspad'
        },
        link: function (scope, elm, attrs) {
            // var button = elm.find('a');
            var button = elm.find('.clickbtn');
            if(window.location.search.split('&')[1].split('=')[0] == 'recommend' && window.location.search.split('&')[1].split('=')[1] != 3) {
                return;//在线投保跳转过来不允许点击修改
            }
            // if(window.location.search.split('&')[1].split('=')[0] == "oper" && window.location.search.split('&')[1].split('=')[1] == "1"){
            //     return;//建议书跳转过来不允许点击修改
            // }
            button.bind('click', function () {
                CommonFn.getDateFn(function (birthday) {

                    scope.childScopeBirthday = birthday;
                    scope.childScopeAge = CommonFn.birthdayToAgeFn(birthday);

                    if(scope.childScopeAge < 0){
                        scope.childScopeAgePass = false;
                    }else{
                        scope.childScopeAgePass = true;
                    };

                    if(scope.childScopeIdType != '居民身份证'){
                        scope.$apply(scope);
                        return;
                    };

                    if(scope.childScopeId){
                        if(CommonFn.getUserAge(scope.childScopeId).birthday != scope.childScopeBirthday){
                            CommonFn.showFormError('idnoErrorMsg', '身份证号码与生日不匹配，请确认!');
                        };
                    };
                    if(scope.childScopeAge < 0){
                        scope.childScopeParentScopeFormPass = false;
                    }else{
                        if(scope.childScopeAge > 46){
                            scope.childScopeIdCardLongTime = true;
                        };
                    };
                    scope.$apply(scope);
                });
            });
        }
    };
}]);

//电话号码验证
directiveModule.directive('phoneNumber', function () {
    return {
        require: "ngModel",
        restrict: "A",
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (value) {
                var REGEXP = /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(13\d{9}$)|(15[0135-9]\d{8}$)|(18[267]\d{8}$)/g;

                if( !value || REGEXP.test(value) ){
                    ctrl.$setValidity('phone', true);
                    ctrl.$invalid = false;
                    return value;
                }else{
                    ctrl.$setValidity('phone', false);
                    ctrl.$invalid = true;
                    return undefined;  
                };
            });
        }
    };
});