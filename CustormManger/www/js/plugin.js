/**   ============================================ 根据sql查询表单数据   ============================================= */
/**
 *  @brief  根据sql查询表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 字典的集合
 */
function queryTableDataUseSql (key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableDataPlugin","queryTableDataUseSql",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableDataPlugin","queryTableDataUseSql",key);
    }
}

/**  定位
 *
 *  返回值:   locationArray [纬度, 精度] (array)
 */
function getLocation(success_callback, failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback, failed_callback, "MapPlugin", "getCurrentLocation", []);
    }
    
    // Android
    else if(brows().android) {
        return cordova.exec(success_callback, failed_callback,"GetLocationPlugin","getlocation","");
    }
}

/**
 *  日期选择器
 */
function datePicker(date,success_callback,failed_callback){
    //iOS
    if(brows().iphone){
        cordova.exec(success_callback, failed_callback, "DatePickerDialogPlugin", "getDateOrTime", [date]);
    }
    
    //Android
    else if(brows().android){
        return cordova.exec(success_callback, failed_callback, "DatePickerDialogPlugin", "getDateOrTime", date);
    }
}

/**
 *  OCR识别数据
 */
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

/**   ========================= 打开PDF文件   ====================== */
/**
 *  @brief
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function openPDF(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "TransformPDFPlugin", "openPDF", [key]);
    }
    // Android
    else if(brows().android) { 
        return cordova.exec(success_callback, failed_callback, "TransformPDFPlugin", "openPDF", key);
    }
}

/**   ========================= 转换为PDF文件   ====================== */
/**
 *  @brief
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function transformPDF(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "TransformPDFPlugin", "transformPDF", [key]);
    }
    // Android
    else if(brows().android) { 
        return cordova.exec(success_callback, failed_callback, "TransformPDFPlugin", "transformPDF", key);
    }
}

/**   ========================= Http请求  Get方式   ====================== */
/**
 *  @brief
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function httpRequestByGet(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        cordova.exec(success_callback, failed_callback, "HttpRequestPlugin", "get", [key]);
    }
    // Android
    else if(brows().android) {
        return cordova.exec(success_callback, failed_callback, "HttpRequestPlugin", "get", key);
    }
}
/**   ========================= Http请求  Post方式   ====================== */
/**
 *  @brief
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function httpRequestByPost(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "HttpRequestPlugin", "post", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "HttpRequestPlugin", "post", key);
    }
}

/**   ========================= 控制界面横屏   ====================== */
/**
 *  @brief
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function setScreenLandscape(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "ScreenOrientationPlugin", "landscape", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "ScreenOrientationPlugin", "landscape", key);
    }
}

/**   ========================= 控制界面竖屏   ====================== */
/**
 *  @brief
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function setScreenPortrait(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "ScreenOrientationPlugin", "portrait", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "ScreenOrientationPlugin", "portrait", key);
    }
}

/**   ========================= 删除目录下所有的文件   ====================== */
/**
 *  @brief   文件地址
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function deleteFilePath(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "DeleteAllFilePlugin", "deleteFilePath", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "DeleteAllFilePlugin", "deleteFilePath", key);
    }
}

/**   ========================= 判断应用运行的设备   ====================== */
/**
 *  @brief
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function currentDeviceModel(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "DeviceModelPlugin", "currentDeviceModel", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "DeviceModelPlugin", "currentDeviceModel", key);
    }
}

/**   ========================= 上传图片   ====================== */
/**
 *  @brief   上传图片
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function uploadProfilePhoto(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "UploadPlugin", "uploadProfilePhoto", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "UploadPlugin", "uploadProfilePhoto", key);
    }
}

/**   ========================= 开始发送消息   ====================== */
/**
 *  @brief   开始发送消息
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function beginSendingMessage(key, success_callback, failed_callback) {
    //ioss
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "NQCommonPlugin", "beginSendingMessage", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "NQCommonPlugin", "beginSendingMessage", key);
    }
}
/**   ========================= 结束发送消息   ====================== */
/**
 *  @brief   结束发送消息
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function endSendingMessage(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "NQCommonPlugin", "endSendingMessage", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "NQCommonPlugin", "endSendingMessage", key);
    }
}

/**   ========================= 发送消息   ====================== */
/**
 *  @brief   发送消息
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function sendMessage(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "ContactsPlugin", "sendMessage", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "ContactsPlugin", "sendMessage", key);
    }
}
/**   ========================= 打电话  ====================== */

/**
 *  @brief   打电话
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function callNumber(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "ContactsPlugin", "callNumber", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "ContactsPlugin", "callNumber", key);
    }
}

/**   ========================= 跳转页面   ====================== */

/**
 *  @brief   跳转页面
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function pushToViewController(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "ViewControllerPlugin", "pushToViewController", [key]);
    }
    // Android
    else if(brows().android) { 
        return cordova.exec(success_callback, failed_callback, "ViewControllerPlugin", "pushToViewController", key);
    }
}


/**   ========================= 关闭当前应用   ====================== */

/**
 *  @brief   跳转页面
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function closeWebView(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "ViewControllerPlugin", "closeWebView", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "ViewControllerPlugin", "closeWebView", key);
    }
}


/**
 *  @brief   聊天页面pad版加载一个webview
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function pushToWebViewController(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "ViewControllerPlugin", "loadWebView", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "ViewControllerPlugin", "loadWebView", key);
        
    }
}

/**   =================== 用户退出登陆   ====================== */
/**
 *  @brief   用户退出登陆
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回iPad/iPhone  失败返回0
 */
function userLogout(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        cordova.exec(success_callback, failed_callback, "XMPPPushPlugin", "logOffXMPP", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "XMPPPushPlugin", "logOffXMPP", key);
    }
}

/**   =================== 用户登陆   ====================== */
/**
 *  @brief   用户登陆
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */
function userLogin(key, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "XMPPPushPlugin", "registerXMPP", [key]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "XMPPPushPlugin", "registerXMPP", key);
    }
}

/**   ======================== 应用跳转   ======================== */


/**
 *  @brief   应用跳转
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function openApp(schemeUrl, params, success_callback, failed_callback) {
    
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "NQCommonPlugin", "openApp", [schemeUrl, params]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "NQCommonPlugin", "openApp", [schemeUrl, params]);
    }
}
/**   ======================== 判断应用是否存在原生App   ======================== */


/**
 *  @brief   判断应用是否存在原生App
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */

function canOpenApp (schemeUrl, success_callback, failed_callback) {
    //ios
    if(brows().iphone) {
        
        cordova.exec(success_callback, failed_callback, "NQCommonPlugin", "canOpenApp", [schemeUrl]);
    }
    // Android
    else if(brows().android) {
        
        return cordova.exec(success_callback, failed_callback, "NQCommonPlugin", "canOpenApp", schemeUrl);
    }
}

/**   =================== 下载原生应用   ===================== */


/**
 *  @brief   下载原生应用
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 */
function downloadNavtiveApp (key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"DownloadPlugin","downloadNavtiveApp",[key]);
    }
    // Android
    else if(brows().android) {
        
        return  cordova.exec(success_callback,failed_callback,"DownloadPlugin","downloadNavtiveApp",key);
    }
}

/**   =================== 更新ZIP包   ===================== */

/**
 *  @brief   更新ZIP包
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 更新成功返回1  更新失败返回0
 */
function updateZip(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"DownloadPlugin","updateZip",[key]);
    }
    // Android
    else if(brows().android) {
        
        return  cordova.exec(success_callback,failed_callback,"DownloadPlugin","updateZip",key);
    }
}

/**   =================== 下载ZIP包   ===================== */

/**
 *  @brief   下载ZIP包
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 增加数据库成功返回1  增加数据库失败返回0
 */
function downloadZip(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"DownloadPlugin","downloadZip",[key]);
    }
    // Android
    else if(brows().android) {
        
        return  cordova.exec(success_callback,failed_callback,"DownloadPlugin","downloadZip",key);
    }
}

/**   ============================================ 增加数据库   ============================================= */


/**
 *  @brief   增加数据库
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 增加数据库成功返回1  增加数据库失败返回0
 */
function createDatabase(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"DatabasePlugin","createDatabase",[key]);
    }
    // Android
    else if(brows().android) {
        
        return  cordova.exec(success_callback,failed_callback,"DatabasePlugin","createDatabase",key);
    }
}
/**   ============================================ 删除数据库   ============================================= */
/**
 *  @brief   删除数据库
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function deleteDatabase(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"DatabasePlugin","deleteDatabase",[key]);
    }
    // Android
    else if(brows().android) {
        
        return  cordova.exec(success_callback,failed_callback,"DatabasePlugin","deleteDatabase",key);
    }
}

/**   ============================================ 增加表单   ============================================= */
/**
 *  @brief   增加表单
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 增加数据库成功返回1  增加数据库失败返回0
 */
function createTable(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"TablePlugin","createTable",[key]);
    }
    // Android
    else if(brows().android) {
        
        return  cordova.exec(success_callback,failed_callback,"TablePlugin","createTable",key);
    }
}

/**   ============================================ 删除表单   ============================================= */
/**
 *  @brief   删除表单
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function deleteTable(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"TablePlugin","deleteTable",[key]);
    }
    // Android
    else if(brows().android) {
        
        return  cordova.exec(success_callback,failed_callback,"TablePlugin","deleteTable",key);
    }
}

/**   ============================================ 添加表单字段   ============================================= */
/**
 *  @brief   添加表单字段
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function insertTableStructure(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"TableStructurePlugin","insertTableStructure",[key]);
    }
    // Android
    else if(brows().android) {
        
        return  cordova.exec(success_callback,failed_callback,"TableStructurePlugin","insertTableStructure",key);
    }
}

/**   ============================================ 删除表单字段   ============================================= */
/**
 *  @brief 删除表单字段
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function deleteTableStructure(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableStructurePlugin","deleteTableStructure",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableStructurePlugin","deleteTableStructure",key);
    }
}

/**   ============================================ 修改表单字段   ============================================= */
/**
 *  @brief 修改表单字段
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1 删除数据库失败返回0
 */
function updateTableStructure(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableStructurePlugin","updateTableStructure",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableStructurePlugin","updateTableStructure",key);
    }
}

/**   ============================================ 查询表单字段   ============================================= */
/**
 *  @brief 查询表单字段
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function queryTableStructure(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableStructurePlugin","queryTableStructure",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableStructurePlugin","queryTableStructure",key);
    }
}

/**   ============================================ 插入表单数据   ============================================= */
/**
 *  @brief 插入表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function insertTableData(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableDataPlugin","insertTableData",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableDataPlugin","insertTableData",key);
    }
}

/**   ============================================ 更新表单数据   ============================================= */
/**
 *  @brief 更新表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function updateTableData(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableDataPlugin","updateTableData",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableDataPlugin","updateTableData",key);
    }
}

/**   ============================================ 删除表单数据   ============================================= */
/**
 *  @brief 删除表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function deleteTableData(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableDataPlugin","deleteTableData",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableDataPlugin","deleteTableData",key);
    }
}

/**   ============================================ 查询全部表单数据   ============================================= */
/**
 *  @brief 查询全部表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function queryAllTableData(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableDataPlugin","queryAllTableData",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableDataPlugin","queryAllTableData",key);
    }
}

/**   ============================================ 条件查询表单数据   ============================================= */
/**
 *  @brief 条件查询表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function queryTableDataByConditions(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableDataPlugin","queryTableDataByConditions",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableDataPlugin","queryTableDataByConditions",key);
    }
}

/**   ============================================ 更新/插入表单数据   ============================================= */
/**
 *  @brief 更新/插入表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 删除数据库成功返回1  删除数据库失败返回0
 */
function updateORInsertTableDataByConditions(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableDataPlugin","updateORInsertTableDataByConditions",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableDataPlugin","updateORInsertTableDataByConditions",key);
    }
}

/**   ============================= 模糊查询表单数据   ==================== */
/**
 *  @brief 模糊查询表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 返回集合
 */
function fuzzyQueryTableDataByConditions(key,success_callback,failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"TableDataPlugin","fuzzyQueryTableDataByConditions",[key]);
    }
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"TableDataPlugin","fuzzyQueryTableDataByConditions",key);
    }
}


/**   =============================================== 跳到聊天页面插件   ============================================= */


/**
 *  @brief  跳到聊天页面
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 修改成功返回1  修改失败返回0
 */
function leapchatview(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"ChatViewPlugin","leapchatview",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ChatViewPlugin","leapchatview",key);
    }
}
/**   =============================================== 跳出聊天页面插件   ============================================= */


/**
 *  @brief  跳出聊天页面
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 修改成功返回1  修改失败返回0
 */
function popchatview(success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"ChatViewPlugin","popchatview",[]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ChatViewPlugin","popchatview","");
    }
}


/**   =============================================== 登录插件   ============================================= */


/**
 *  @brief  登录
 *
 *  @param  key     json字符串
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 登录成功返回1  登录失败返回0
 */
function login_user(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) { 
        cordova.exec(success_callback,failed_callback,"LoginPlugin","login",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"LoginPlugin","login",key);
    }
}

/**
 *  @brief  修改密码
 *
 *  @param  key     json字符串
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 修改成功返回1  修改失败返回0
 */
function modifypassword(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"ModifyPasswordPlugin","modifypassword",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ModifyPasswordPlugin","modifypassword",key);
    }
}

/**   =============================================== 用户表 user_info ============================================= */

/**
 *  @brief  添加
 *
 *  @param  key     字段 json字符串，要添加的数据
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回 插入成功  失败返回 插入失败
 */
function add_user(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"UserPlugin","addUser",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"UserPlugin","addUser",key);
    }
}

/**
 *  @brief  更新
 *
 *  @param  key     json字符串
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回 更新成功  失败返回 更新失败
 */
function update_user(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"UserPlugin","upDateUser",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"UserPlugin","upDateUser",key);
    }
}

/**
 *  @brief  查询(按照条件查询)
 *
 *  @param  key     json字符串
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果,为一个对象
 */
function query_user(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"UserPlugin","queryUser",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"UserPlugin","queryUser",key);
    }
}

/**
 *  @brief  查询所有字段
 *
 *  @param  key     json字符串
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果 为一个集合
 */
function query_user_all(success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"UserPlugin","queryUserAll",[]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"UserPlugin","queryUserAll","");
    }
}


/**
 *  @brief  判断user表是否有新数据保存
 *
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 0或1
 */
function newrecord_user(success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"NewRecordPlugin","newRecord",[]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"NewRecordPlugin","newRecord","");
    }
}

/**   =============================================== 会话表 conversation_info  ============================================= */


/**
 *  @brief  添加
 *
 *  @param  key     字段 json字符串，要添加的数据
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回 插入成功  失败返回 插入失败
 */
function add_conversation(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"ConversationPlugin","addConversation",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ConversationPlugin","addConversation",key);
    }
}
/**
 *  @brief  更新
 *
 *  @param  key     json字符串
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回 更新成功  失败返回 更新失败
 */
function update_conversation(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"ConversationPlugin","upDateConversation",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ConversationPlugin","upDateConversation",key);
    }
}

/**
 *  @brief  查询 (根据查询条件进行查询)
 *
 *  @param  key     json字符串 做为查询条件的字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果
 */
function query_conversation(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"ConversationPlugin","queryConversation",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ConversationPlugin","queryConversation",key);
    }
}
/**
 *  @brief  查询所有
 *
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果
 */
function query_conversation_all(success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"ConversationPlugin","queryConversationAll",[]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ConversationPlugin","queryConversationAll","");
    }
}
/**
 *  @brief  查询会话列表，包括未读消息的个数
 *
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果
 */
function query_conversation_count(success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"ConversationPlugin","queryConversationCount",[]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ConversationPlugin","queryConversationCount","");
    }
}

/**
 *  @brief  删除会话列表
 *
 *  @param  key    根据id字段删除
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 删除结果
 */
function delete_conversation(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"ConversationPlugin","deleteConversation",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ConversationPlugin","deleteConversation",key);
    }
}

/**
 *  @brief      根据用户查询会话表
 *
 *  @param  key    查询用户字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果
 */
function queryConversationByUser(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"ConversationPlugin","queryConversationByUser",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"ConversationPlugin","queryConversationByUser",key);
    }
}
/**   =============================================== 聊天表 message_info   ============================================= */
/**
 *  @brief  添加
 *
 *  @param  key     字段 json字符串，要添加的数据
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回 插入成功  失败返回 插入失败
 */
function add_message(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","addMessage",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","addMessage",key);
    }
}

/**
 *  @brief  查询(根据条件查询)
 *
 *  @param  key     json字符串 做为查询条件的字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果 为一个对象
 */
function query_message(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessage",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessage",key);
    }
}

/**
 *  @brief  查询message_info表里某一个user_info_id,某个status共有多少条数据
 *
 *  @param  key     json字符串 做为查询条件的字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果 为一个对象
 */
function query_message_count(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageCount",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageCount",key);
    }
}

/**
 *  @brief  查询status为0的数据条数
 *
 *  @param  key     json字符串 做为查询条件的字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果 为一个对象
 */
function query_message_status_count(success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageStatusCount",[""]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageStatusCount","");
    }
}

/**
 *  @brief  查询所有，有条件,为聊天记录页面
 *
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果，为一个集合
 */
function query_message_all_where_user(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageAllWhereUser",[key]);
    }
    
    // Android
    else if(brows().android) { 
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageAllWhereUser",key);
    }
}

/**
 *  @brief  分页查询
 *
 *  @param  key     json字符串 做为查询条件的字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果
 */
function query_message_by_size(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageBySize",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageBySize",key);
    }
}
/**
 *  @brief  查询(根据条件查询)
 *
 *  @param  key     json字符串 做为查询条件的字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果
 */
function query_message_where(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessage",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessage",key);
    }
}

/**
 *  @brief  查询所有
 *
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果
 */
function query_message_all(success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageAll",[]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageAll","");
    }
}
/**
 *  @brief  分页查询
 *
 *  @param  key     json字符串 做为查询条件的字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果
 */
function query_message_all_where(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessage",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageBySize",key);
    }
}


/**
 *  @brief  查询message_info表里某一个user_info_id,在createtime后的所有数据
 *
 *  @param  key     json字符串 做为查询条件的字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果 为一个对象
 */
function query_message_createtime(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageCreatetime",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageCreatetime",key);
    }
}

/**
 *  @brief  查询message_info表里某一个user_info_id,在createtime前（包括）的数据，并一次查15条
 *
 *  @param  key     json字符串 做为查询条件的字段
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果 为一个对象
 */
function query_message_createtime_bysize(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageCreatetimeBySize",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","queryMessageCreatetimeBySize",key);
    }
}

/**
 *  @brief  删除聊天记录
 *
 *  @param  key    根据id字段删除
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 删除结果
 */
function delete_message(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","deleteMessage",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","deleteMessage",key);
    }
}
/**
 *  @brief  清除聊天记录
 *
 *  @param  key    根据userid清除掉改用户的信息
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 清除结果
 */
function clean_message(key,success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","cleanMessage",[key]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","cleanMessage",key);
    }
}

/**
 *  @brief  清空聊天记录  无参数，只需要把当前message_info 内容清空即可
 *
 *  @param  success_callback     成功回调
 *  @param  failed_callback"   失败回调
 *
 *  @return 查询结果
 */
function delete_null_message(success_callback,failed_callback){
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback,failed_callback,"MessagePlugin","deleteNullMessage",[]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback,failed_callback,"MessagePlugin","deleteNullMessage","");
    }
}
/**   =============================================== 其它功能性插件   ============================================= */


/**  录音
 *
 */
function getAudio(success_callback, failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback, failed_callback, "RecordPlugin", "audio", "");
    }
    
    // Android
    else if(brows().android) {
        return cordova.exec(success_callback, failed_callback, "RecordPlugin", "audio", "");
    }
}

/**  发送短信插件
 *
 *   number:     短信接收号码
 *   content:    短信内容
 */

function sendSMS(number, content, success_callback, failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback, failed_callback, "ContactPlugin", "sendMessage", [number, content]);
    }
    
    // Android
    else if(brows().android) {
        return cordova.exec(success_callback, failed_callback, "MessagePlugin", "sendMessageEvent", [number, content]);
    }
}


/**  拨打电话插件
 *
 *  number:     拨通电话号码
 */
function getCall(number, success_callback, failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback, failed_callback, "ContactPlugin", "getCall", [number]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback, failed_callback, "PhonePlugin", "callPhoneEvent", [number]);
    }
}


/**  拍照
 *
 *  返回值:    图片的地址URL    (string)
 */
function getPhotoFromCamera(success_callback, failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback, failed_callback, "PhotoPlugin", "photoCamera", []);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback, failed_callback, "PhotoPlugin", "photoCamera", []);
    }
}


/**  相册
 *
 *  参数:     maxNumber    多选相册最大图片数
 *
 *  返回值:   图片得地址URL
 *           如果单选照片    (string)
 *           如果多选照片    (array 数组内部内容为URL)
 */
function getPhotoFromAlbum(maxNumber, success_callback, failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback, failed_callback, "PhotoPlugin", "photoLib", [maxNumber]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback, failed_callback, "PhotoPlugin", "photoLib", [maxNumber]);
    }
}

/** 上传图片
 *
 *  参数:     uploadURL: 上传图片的链接
 *           filePath:  本地文件的路径     (类型数组)
 *           basePath:  存在服务器上的图片路径
 *           height:    缩略图的高
 *           width:     缩略图的宽
 *
 *  返回值:   Json
 *           内有2个数组, 成功上传的本地图片路径, 失败上传的本地路径
 */
function uploadImageFn(uploadURL, filePath, agentCode, pwd, success_callback, failed_callback) {
    // iOS
    if(brows().iphone) {
        cordova.exec(success_callback, failed_callback, "PhotoPlugin", "uploadImage", [uploadURL, filePath, agentCode, pwd]);
    }
    
    // Android
    else if(brows().android) {
        return  cordova.exec(success_callback, failed_callback, "UpLoadImagePlugin", "uploadimage", [uploadURL, filePath, agentCode, pwd]);
    }
};

/**
 *  判断当前设备是 iOS || Andriod
 */
function brows(){
    var brows = navigator.userAgent;
    return {
    iphone: brows.indexOf('Mac') > -1,
    android: brows.indexOf('Android') > -1
    }
}