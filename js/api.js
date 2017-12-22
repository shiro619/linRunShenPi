var utoken, uid;
//测试地址 
var host = 'http://test.ifcar99.com/';
var apiu2 = 'http://anjie.ifcar99.com/';
var apiu = /*'http://release-anjie.anjietest-feature.ifcar99.com/';*/"http://sp.zjhbjt.cn/";/*"http://ly.zjhbjt.cn/";*//*'http://test-linrun.anjietest-feature.ifcar99.com/';*//*'http://feature-cfl-img.anjietest-feature.ifcar99.com/';*/
var apiu1 = /*'http://develop.anjietest-feature.ifcar99.com/';*//*'http://pre.anjie.ifcar99.com/';*//*'http://release-anjie.anjietest-feature.ifcar99.com/';*/'http://master-release.anjietest-feature.ifcar99.com/';
var apiu3 = /*'http://test-jcjr.apitest-feature.ifcar99.com/';*/'https://www.ifcar99.com/api_v20/';/*'http://release-jhm-trustee-pay.apitest-feature.ifcar99.com/';*///*'http://feature-jhm-env.apitest-feature.ifcar99.com/';*/ // 验证码
var apiu4 = apiu;/*'http://featrue-cxj-advance.anjietest-feature.ifcar99.com/';*/

var apiurl = apiu + 'Api/'; 
var apiurl_new = 'https://www.ifcar99.com/api_v20/'; // 开通融资账户设置密码


var apiurl2 = 'http://test.ifcar99.com/api.php';
var apiurl3 = 'http://anjie.ifcar99.com/Api/';
var apiurl_new = 'http://apitest.ifcar99.com/';
var api_upload_url = 'http://test.ifcar99.com/api.php?module=upload';
//正式地址   
/*var host = 'https://www.ifcar99.com/';   
var apiurl = 'https://www.ifcar99.com/api.php'; 
var apiurl_new = 'https://www.ifcar99.com/api_v2';
var api_upload_url = 'https://www.ifcar99.com/api.php?module=upload';*/
mui.plusReady(function() {
	if(document.getElementById("main-box")) {
		mui('#main-box').on('tap', 'a[href]', function() {
			var href = this.getAttribute('href');
			if(/^(http\:\/\/|http\:\/\/)/.test(href)) {
				plus.runtime.openURL(href);
				return false;
			}
		})
	}
});

//保存数据
function cache(key, val) {
	if(key == 'clear') {
		localStorage.clear();
	} else if(val === null) {
		window.localStorage.removeItem(key);
	} else if(val) {
		window.localStorage[key] = val;

	} else {
		return window.localStorage[key];
	}
}

//本地存储
var store = {
	set: function(key, val, exp) {
		var obj = plus.storage;
		var nowtime = new Date().getTime() / 1000;

		exp = exp ? exp : 3600 * 24 * 30; //默认有效期*天
		val = JSON.stringify({
			val: val,
			exp: exp,
			time: nowtime
		});
		obj.setItem(key, val);
	},

	get: function(key) {
		var obj = plus.storage;
		var info = obj.getItem(key); //单类模型获取对象方法（java）
		var nowtime = new Date().getTime() / 1000;
		var network = plus.networkinfo.getCurrentType();
		//console.log(network)
		if(!info) {
			return null;
		}
		info = JSON.parse(info);

		//没网络不判断过期时间
		if(network <= 1) {
			return info.val
		}
		if(nowtime - info.time > info.exp) {
			this.delete(key);
			return null;
		}

		return info.val;
	},
	delete: function(key) {
		var obj = plus.storage;
		obj.removeItem(key);
		//this.set(key, null, 0);
	},
	clear: function(key) {
		var obj = plus.storage;
		obj.clear();
	}
}

//获取url参数
function get(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

function alert(msg) {
	plus.nativeUI.alert(msg);
}
//获取图片,优先从缓存获取
function getImg(src) {
	return src;
}
//开始网络请求
function startNetwork() {
	var n = plus.networkinfo.getCurrentType();
	watingSec = 30000;
	if(n <= 1) {
		//alert('请检查网络设置');
		mui.toast("请检查网络设置", {
			"verticalAlign": "center"
		});
		return false;
	}
}
//网络请求结束
function endNetwork() {
	plus.nativeUI.closeWaiting();
}
//判断是否json格式
function isJson(obj) {
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
}
//封装ajax方法
function ajaxGet(url, data, obj) {
	$.get(url, data, obj);
}
var ajax = {
	'post': function(url, data, obj, first) {
		var _url = url;
		startNetwork();
		var _url = url;
		mui.ajax(url, {
			type: 'POST',
			//url: url,
			data: data,
			dataType: 'json',
			timeout: 30 * 1000,
			success: function(objres) {
				//				if(objres.error_no != '200' && objres.error_no != 200){
				if(objres.error_no && (objres.error_no == 401 || objres.error_no == 402 || objres.error_no == 409)) {
					if(first && first == 'first'){
						
					} else {
						console.log('错误代码' + objres.error_no)
						var regU = /ba\/password\/set/g;
						if(regU.exec(_url)){ // 融资账户开通接口，token无效的情况判断
							//  打开开通成功页，关闭设置密码页
							var pwPage = plus.webview.getWebviewById('finacing-password.html');
							
							mui.fire(pwPage, 'closePage', {
								
							});
							mui.openWindow({
								url: 'finacing-show.html',
								id: 'finacing-show.html',
								createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
								show: {
									autoShow: true, //页面loaded事件发生后自动显示，默认为true
									aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
								},
								waiting: {
									autoShow: false, //自动显示等待框，默认为true
								},
								extras: {
								},
							})
						} else {
							mui.toast(objres.error_msg, {
								duration: 'long',
								verticalAlign: 'center'
							})
							user.clear();
							login();
							return;
						}
					}
					
					
				}
				obj(objres)
			},
			complete: function(xhr) {
//				endNetwork();
			},
			error: function(e, type) {
				endNetwork();
				plus.nativeUI.closeWaiting();
				if(type != 'abort' && type != 'parsererror' && type != 'timeout') {
					mui.toast("数据加载失败，请返回重试!(" + type + ")", {
						verticalAlign: 'center'
					});
				}
				console.log('ajax 错误(' + type + '):' + url + data);
				if(type == 'parsererror') {
					console.log(e.responseText);
					//重试
				}
				if(type == 'timeout') { //超时
					mui.toast("请求超时，请检查网络!(" + type + ")", {
						verticalAlign: 'center'
					});
				}
			}
		})
	},
	'get': function(url, data, obj, first) {
		mui.ajax(url, {
			type: 'get',
			//url: url,
			data: data,
			dataType: 'json',
			timeout: 30 * 1000,
			success: function(objres) {
				if(objres.error_msg == '请登陆后操作！'){
//					console.log('Badurl:'+url + '返回:' + JSON.stringify(objres))
				}
				//				if(objres.error_no != '200' && objres.error_no != 200){
				if(objres.error_no && (objres.error_no == 401 || objres.error_no == 402 || objres.error_no == 409)) {
					if(first && first == 'first'){
//						console.log('badError_no:'+objres.error_no)
						return;
					} else {
						mui.toast('登陆过期，请重新登陆' + url, {
							verticalAlign: 'center'
						})
						user.clear();
						login();
						return;
					}
				}
				obj(objres)
			},
			complete: function() {},
			error: function(e, type) {
				plus.nativeUI.closeWaiting();
				console.log('ajax 错误(' + type + '):' + url);
				if(type == 'timeout') { //超时 
					mui.toast("请求超时，请检查网络!(" + type + ")", {
						verticalAlign: 'center'
					});
				} else {
					mui.toast("数据加载失败，请返回重试!(" + type + ")", {
						verticalAlign: 'center'
					});
				}
			}
		})
	}
}

var user = {
	'uid': function() {
		return store.get('uid');
	},
	'uoption': function() {
		return {
			GPS: store.get('uGPS'),
		}
	},
	'setOption': function(opt) {
		store.set('uGPS', opt.Gps, 3600 * 24 * 365);
	},
	'utoken': function() {
		return store.get('utoken');
	},
	'checktoken': function($data, callback) {
		var url = apiurl + 'auth/checktoken';
		ajax.post(url, $data, callback, 'first');
	},
	'deleteCache': function(uid) {
		var uid = uid ? uid : this.uid();
		var key = 'user@info_' + uid;
		store.delete(key);
	},
	'login': function($data, callback) {
		var url = apiurl + 'auth/applogin';
		console.log('url:' + url)
		ajax.post(url, $data, callback);
	},
	'register': function($data, callback) {
		var url = apiurl + 'auth/register';
		ajax.post(url, $data, callback);
	},
	//发送验证码
	'mobilecode': function($data, callback) {
		var url = apiurl + 'auth/sendmessage';
		ajax.post(url, $data, callback);
	},
	// 开通融资账户发送验证码
	'finacingcodeCreate': function($data, callback) {
		var url = apiu3 + 'user/image/code/create';
		ajax.post(url, $data, callback);
	},
	'finacingcodeSend': function($data, callback) {
		var url = apiu3 + 'user/mobile/code/send';
		ajax.post(url, $data, callback);
	},
	// 修改密码时验证码确认
	'checkmessage': function($data, callback) {
		var url = apiurl + 'auth/checkmessage';
		ajax.post(url, $data, callback);
	},
	// 修改密码
	'resetPW': function($data, callback) {
		var url = apiurl + 'auth/resetpasswd';
		ajax.post(url, $data, callback);
	},
	// 修改密码2
	'rewritePW': function($data, callback) {
		var url = apiurl + 'auth/changepasswordpost';
		ajax.post(url, $data, callback);
	},
	//发送验证码
	'yycode': function($data, callback) {
		var url = apiurl + '?module=user&action=yycode';
		ajax.post(url, $data, callback);
	},
	'logout': function($data, callback) {
		var uid = this.uid();
		var url = apiurl + '?module=user&action=logout'; //获取登录客户端
		//		clientInfo = plus.push.getClientInfo();
		ajax.post(url, {
			uid: uid,
			//			push_clientid:clientInfo.clientid,
			utoken: user.utoken()
		}, callback);
		user.deleteCache(uid); //清空缓存 
		store.delete('uid');
		store.delete('utoken');
		store.delete('username');
		store.delete('uGPS');
		store.delete('haschild');
		ore.delete('highest');
		//		store.delete('integral_notice'); //退出后删除签到提醒标识 
		//store.delete('username'); 
		var auth = auths[0];
		if(auth) {
			var w = null;
			if(plus.os.name == "Android") {
				w = plus.nativeUI.showWaiting();
			}
			document.addEventListener("pause", function() {
				setTimeout(function() {
					w && w.close();
					w = null;
				}, 2000);
			}, false);
			auth.logout(function(e) {
				//alert('注销认证成功')
			}, function() {
				//console.log('error'+e)
			});
		}

	},
	'getUserInfo': function($data, callback) {
		var url = apiurl + 'auth/userinfo/';
		ajax.post(url, $data, callback);
	},
	'setAdd': function($data, callback) {
		var url = apiurl + 'auth/setaddress/';
		ajax.post(url, $data, callback);
	},
	'getInfo': function(callback) {
		var uid = this.uid();
		var key = 'user@info_' + uid;
		var url = apiurl + '?module=user&action=UserInfo';
		ajax.post(url, {
			request: {
				'user_id': uid
			}
		}, function(res) {
			if(res) {
				info = res;
				info.host = host;
				store.set(key, info);
				callback(info);
				return info;
			} else {
				return null;
			}
		});
	},
	'setInfo': function(callback) {
		var res = callback
		store.set('uid', res.user.id, 3600 * 24 * 365);
		store.set('utoken', res.token.token, 3600 * 24 * 365);
		store.set('username', res.user.account, 3600 * 24 * 365);
		store.set('haschild', res.haschild, 3600 * 24 * 365);
		store.set('highest', res.highest_charge, 3600 * 24 * 365);
		store.set('uname', res.user.name, 3600 * 24 * 365);
		if(res.role_type == 1) {
			if(res.haschild == 2) {
				store.set('roletype', 3, 3600 * 24 * 365); // res.result.role_type
			} else {
				store.set('roletype', res.role_type, 3600 * 24 * 365); // res.result.role_type
			}
		} else if(res.role_type == 2){
			store.set('roletype', res.role_type, 3600 * 24 * 365); // res.result.role_type
		} else {
			
		}
		// 1家访有下属  2销售  3  家访无下属

	},
	"tender": function($data, callback) {
		var url = apiurl2 + '?module=borrow&action=GetList';
		ajax.post(url, $data, callback);
	},
	"GetUsers": function($data, callback) {
		var url = apiurl + '?module=user&action=GetUsers';
		ajax.post(url, $data, callback);
	},
	'clear': function() {
		store.delete('uid');
		store.delete('utoken');
		store.delete('username');
		store.delete('uGPS');
	},
	"SetGPS": function($data, callback) {
		var url = apiurl + 'workplatform/setvisitlocation';
		console.log('url是'+ url)
		ajax.post(url, $data, callback);
	},
	"setRole": function($data, callback) {
		var url = apiurl + 'role/addapprole';
		ajax.post(url, $data, callback);
	},
	"setFinacingToken": function($uId,$uToken){
		if(store.get('finacingTokens') == null){
			var newTokens = {};
			newTokens[$uId] = $uToken;
			store.set('finacingTokens',JSON.stringify(newTokens),3600*24*365);
		} else {
			var $fTokens = JSON.parse(store.get('finacingTokens'));
			$fTokens[$uId] = $uToken;
			store.set('finacingTokens',JSON.stringify($fTokens),3600*24*365);
		}
		return true;
	},
	"getFinacingToken": function($uId){
		if(store.get('finacingTokens') == null){
			console.log('no finacing tokens');
			return false;
		}
		var $fTokens = JSON.parse(store.get('finacingTokens'));
		console.log($fTokens)
		var $l = $fTokens.length;
		var $sum = 0;
		for(var $i in $fTokens){
			$sum++;
			if($i == $uId){
				return $fTokens[$i];
			}
			if($sum == $l){
				console.log('no this token')
				return false;
			}
		}
	},
}
//上传
var uploader = {
	"make": function($data, callback) {
		var url = apiurl + 'file/make';
		ajax.get(url, $data, callback);
	},
	"getuploadfile": function($data, callback) {
		var url = apiurl_new + 'file/getuploadfile';
		ajax.get(url, $data, callback);
	},
	"getfiletypes": function($data, callback) {
		var url = apiurl + 'file/listimagetype';
		ajax.post(url, $data, callback);
	},
	"getimgs": function($data, callback) {
		var url = apiurl + 'file/listimages';
		ajax.post(url, $data, callback);
	},
	'uploadfile': function($data, callback) {
		var url = apiurl + 'file/upload';
		//		ajax.post(url, $data, callback);
		$.ajax({
			url: url,
			//							async: true,
			type: "POST",
			data: $data,
			processData: false, // 不处理数据
			contentType: false, // 不设置内容类型
			success: callback,
		});
	},
	"uploadavatar": function($data, callback) {
		var url = apiurl + 'auth/setheadportrait';
		ajax.post(url, $data, callback);
	},
	'submitfile': function($data, callback) {
		var url = apiurl + 'file/addimage';
		ajax.post(url, $data, callback);
	},
	'submitarrive': function($data, callback) {
		var url = apiurl + 'workplatform/beginendvisit';
		ajax.post(url, $data, callback);
	},
	'submitconstractno': function($data, callback) {
		var url = apiurl + 'workplatform/setconstractno';
		ajax.post(url, $data, callback);
	},
	'submitdescrip': function($data, callback) {
		var url = apiurl + 'workplatform/setvisitdescrip';
		ajax.post(url, $data, callback);
	},
	'submitcollect': function($data, callback) {
		var url = apiurl + 'workflow/completesupplement';
		ajax.post(url, $data, callback);
	},
	'submitfinacing': function($data, callback) { // 开通融资账户
		var url = apiu3 + 'wechat.mp.account.open';
		ajax.post(url, $data, callback);
	},
	'backvisit': function($data, callback) {
		var url = apiurl + 'workflow/backvisit';
		ajax.post(url, $data, callback);
	},
	'refusevisit': function($data, callback) {
		var url = apiurl + 'workflow/refusevisit';
		ajax.post(url, $data, callback);
	},
	'deleteImg': function($data, callback) {
		var url = apiurl + 'file/deleteimage';
		ajax.post(url, $data, callback);
	},
	'submitNew': function($data, callback) {
		var url = apiurl + 'workplatform/creditrequestsubmit';
		ajax.post(url, $data, callback);
	},
	'submitCredit': function($data, callback) {
		var url = apiu4 + 'advance/manager/creditsubmit/';
		ajax.post(url, $data, callback);
	},
}
//用户
var newUser = {
	"login": function($data, callback) {
		var url = apiurl_new + '/user/login';
		ajax.get(url, $data, callback);
	},
	"get": function($data, callback) {
		var url = apiurl_new + '/user/get';
		ajax.post(url, $data, callback);
	},
	'setInfo': function(res) {
		store.set('uid', res.user.user_id, 3600 * 24 * 365);
		store.set('utoken', res.token.token, 3600 * 24 * 365);
		store.set('username', res.user.loginname, 3600 * 24 * 365);
	}
}
var system = {
	'get': function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	},
	'open': function(url, id, extras) {
		mui.openWindow({
			id: id,
			url: url,
			show: {
				autoShow: false,
				duration: 1
			},
			waiting: {
				autoShow: false
			},
			extras: extras
		});
	},
	'allCHN': function(str) {
		var reg = /^[\u0391-\uFFE5]{1,8}$/;
		if(!reg.test(str)) {
			return false;
		} else {
			return true;

		}
	},
	'sendDeviceInfo': function(obj) {
		var url = apiurl + 'updateDeviceInfo';
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
		types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
		types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
		types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
		types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
		clientInfo = plus.push.getClientInfo();
		var network = types[plus.networkinfo.getCurrentType()];
		var uid = user.uid();
		var key = 'user@info_' + uid;
		var u = store.get(key);
		var mobile = u ? u.username : '';
		//console.log(clientInfo.clientid)
		setTimeout(function() {
			ajax.post(url, {
				uid: uid,
				utoken: user.utoken(),
				mobile: mobile,
				appid: appinfo.appid,
				app_name: appinfo.name,
				app_version: appinfo.version,
				device_model: plus.device.model, //设备型号
				device_vendor: plus.device.vendor, //厂商
				device_imei: plus.device.imei,
				device_uuid: plus.device.uuid,
				device_screen: plus.screen.resolutionWidth * plus.screen.scale + "x" + plus.screen.resolutionHeight * plus.screen.scale, //分辨率
				os_name: plus.os.name,
				os_version: plus.os.version,
				os_language: plus.os.language,
				os_vendor: plus.os.vendor,
				network: network,
				push_clientid: clientInfo.clientid
			}, obj);
		}, 400);
	},
	'isJson': function(obj) {
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		return isjson;
	}
}
// 列表数据
var listInfo = {
	'getApply': function($data, callback) {
		var url = apiurl + 'workflow/lists';
		ajax.post(url, $data, callback);
	},
	'getFinacingList': function($data, callback) {
		var url = apiu4 + 'advance/manager/lists';
		ajax.get(url, $data, callback, 'first');
	},
	'getApplyCredit': function($data, callback) {
		var url = apiurl + 'workflow/listinquire';
		ajax.post(url, $data, callback);
	},
	'getmessage': function($data, callback) {
		var url = apiurl + 'workflow/listmessage';
		ajax.post(url, $data, callback);
	},
	'getCustomerInfo': function($data, callback) {
		var url = apiurl + 'workflow/getworkinfo';
		ajax.post(url, $data, callback);
	},
	'getCreditInfo': function($data, callback) {
		var url = apiu4 + 'advance/manager/getinfo';
		ajax.get(url, $data, callback);
	},
	// 销售组申请件流程信息
	'getCreditFlow_manager': function($data, callback) {
		var url = apiu4 + 'advance/manager/getworkflow';
		ajax.get(url, $data, callback);
	},
	// 获取用户是否开通融资账户
	'getCustomerFinacing': function($data, callback) {
		var url = apiu3 + 'ba/account/is/open';
		ajax.post(url, $data, callback);
	},
	'finacingSetPassword':function($data, callback){//设置交易密码
		var url = apiu3 + 'ba/password/set';
		ajax.post(url, $data, callback); 
	},
	'finacingGetPassword':function($data, callback){//获取交易密码
		var url = apiu4 + 'ucenter/user/settransaction';
		ajax.post(url, $data, callback); 
	},
	'setCustomerAdd': function($data, callback) {
		var url = apiurl + 'workplatform/setcustomeraddress';
		ajax.post(url, $data, callback);
	},
	'getMonthMission': function($data, callback) {
		var url = apiurl + 'workflow/getaccountlist';
		ajax.post(url, $data, callback);
	},
	'getsubordinates': function($data, callback) {
		var url = apiurl + 'role/listsubordinate';
		ajax.post(url, $data, callback);
	},
	'getNewsubordinates': function($data, callback) {
		var url = apiurl + 'role/listnoidentify';
		ajax.post(url, $data, callback);
	},
	'getsubordinatesInfo': function($data, callback) {
		var url = apiurl + 'role/getsubordinateinfo';
		ajax.post(url, $data, callback);
	},
	'getsubordinatesMission': function($data, callback) {
		var url = apiurl + 'workplatform/listsubordinatetask';
		ajax.post(url, $data, callback);
	},
	'getsubordinatesRole': function($data, callback) {
		var url = apiurl + 'role/listsubordinaterole';
		ajax.post(url, $data, callback);
	},
	'setsubordinatesRole': function($data, callback) {
		var url = apiurl + 'role/addsubordinate';
		ajax.post(url, $data, callback);
	},
	'claimApply': function($data, callback) {
		var url = apiurl + 'workflow/pickupvisit';
		ajax.post(url, $data, callback);
	},
	'allotApply': function($data, callback) {
		var url = apiurl + 'workflow/assignvisit';
		ajax.post(url, $data, callback);
	},
}

//common
var isOpenLogin;

function login() {
	user.setOption({
		Gps: 'true'
	})
	plus.nativeUI.closeWaiting();
	//防止重复点击
	if(isOpenLogin == 1) {
		return;
	}

	// 获取所有Webview窗口
	//	var curr = plus.webview.currentWebview();
	//	var indexPage = plus.webview.getLaunchWebview();
	//	var wvs = plus.webview.all();
	//	for(var i = 0, len = wvs.length; i < len; i++) {
	//		//关闭除setting页面外的其他页面
	//		if(wvs[i].getURL() == curr.getURL() || wvs[i].getURL() == indexPage.getURL())
	//			continue;
	//		plus.webview.close(wvs[i]);
	//	}
	//	//打开login页面后再关闭setting页面
	//	plus.webview.open('login.html');
	//	curr.close();

	loginWebView = mui.openWindow({
		url: '/login.html',
		id: 'login.html',
		show: {
			autoShow: true,
			duration: 300,
			aniShow: 'pop-in'
		},
		waiting: {
			autoShow: false
		}
	});
	isOpenLogin = 1;
	setTimeout(function() {
		isOpenLogin = 0;
	}, 1000);
}

// 判断版本号是否ver1小于ver2
function verCompare(ver1, ver2) {
	var ver1s = ver2.split('.');
	var ver2s = ver1.split('.');
	console.log('ver')
	var verLen = Math.max(ver1s.length, ver2s.length);
	for(var vi = 0; vi < verLen; vi++) {
		if(parseInt(ver1s[vi]) < parseInt(ver2s[vi])) {
			return false;
		} else if(parseInt(ver1s[vi]) > parseInt(ver2s[vi])) {
			return true;
		} else {
			if(vi == verLen - 1) {
				return true;
			} else {
				continue;
			}
		}
	}
}
function telExchange(tel) {
	var str1 = tel.substring(0, 3);
	var str2 = tel.substring(3, 7);
	var str3 = tel.substring(7, 11);
	return str1 + '-' + str2 + '-' + str3;
}

//银行卡号码检测
function luhnCheck(bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array(); //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9
    var arrOuShu = new Array(); //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) { //奇数位
            if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
            else arrJiShu2.push(parseInt(newArr[j]) * 2);
        } else //偶数位
        arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算luhn值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhn = 10 - k;

    if (lastNum == luhn) {
        return true;
    } else {
        return false;
    }
}

// 取url中的文件名
function getFilenameInUrl(url){
	var arr = url.split('/');
	return (arr[arr.length-1]);
}
