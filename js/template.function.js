var staticpicroot = 'https://ifcar99.b0.upaiyun.com///' //'http://www.ifcar99.com/';

template.helper('month2day', function (data) {
	res = Math.round(parseFloat(data) * 30);
	return res;
});

template.helper('toThousandsint', function (data) {
	data = parseInt(data);	
	var result = [ ], counter = 0;
	    data = (data || 0).toString().split('');
	    for (var i = data.length - 1; i >= 0; i--) { 
	        counter++;
	        result.unshift(data[i]);
	        if (!(counter % 3) && i != 0) { result.unshift(','); }
	    }
	    return result.join('');
});

template.helper('getpic', function (data) {
	res =  staticpicroot + data;
	//console.log(res)
	return res;
});

template.helper('echojson', function (data) {
	res = isJson(data) ? JSON.stringify(data) : data;
	return res;
});

template.helper('updateimgpath', function (data) {
	// <img\\b[^<>]*?\\bsrc\\s*=\\s*(?:([\"'])(?<src>[^\"']+)\\1|(?<src>[^\\s>]+))
	//<img\b[^>]*src\s*=\s*"[^>"]*\.(?:png|jpg|bmp|gif)"[^>]*>
	//  /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim
	//res = data;
	res = data.replace(/<img\b[^<>]*?\bsrc\s*=\s*([\"']([^"']+)[\"']|[^\s>]+)/g, function(all, t , w){
		w = w || t;
		if(/^(http\:\/\/|https\:\/\/)/.test(w)){
			return all;
		}else{
			return all.replace(t,'"' + staticpicroot + w + '"');
		}
		return all;
	});
	return res;
});

// 小数两位
template.helper('toFixed', function (data,num) {
	if(isNaN(data)) return data;
	num = num || 2;
	data = new Number(data);
	res =  data.toFixed(num);
	return res;
});

// 除100
template.helper('toFixed2', function (data,num) {
	if(isNaN(data)) return data;
	num = num || 100;
	data = new Number(data);
	res =  data/100;
	if(data%100 == 0){
		res = res.toFixed(1)
	}else{
		
	}
	return res;
});

// 除100
template.helper('expireTime', function (date,num) {
	//date = new Date(date*1000);
	var nowDate = new Date() 
	nowDate = (nowDate.getTime())/1000
	var expireTime = parseInt(date) - nowDate 
	if( expireTime > 86400){
		res = parseInt(expireTime/86400) + 1
	}else{ 
		res = 1
	}
	return res;
});
template.helper('substr', function (data,num1,num2) {
	res = data.substr(num1,num2)
	return res;
});
// * 对日期进行格式化， 
// * @param date 要格式化的日期 
// * @param format 进行格式化的模式字符串
template.helper('dateFormat', function (date, format) {
    date = new Date(date*1000);
    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});

// template帮助函数 转换时间格式
//template.helper('telExchange', function(tel) {
//	var str1 = tel.substring(0, 3);
//	var str2 = tel.substring(3, 7);
//	var str3 = tel.substring(7, 11);
//	return str1 + '-' + str2 + '-' + str3;
//})

// template帮助函数 转换时间格式
template.helper('timeExchange',function(time){
	var time1 = new Date();
	var time2 = new Date(time * 1000);
	return numZero(time2.getFullYear()) + "-" + numZero(time2.getMonth() + 1) + '-' + numZero(time2.getDate()) + ' ' + numZero(time2.getHours()) + ':'+ numZero(time2.getMinutes()) + ':' + numZero(time2.getSeconds());
	function numZero(num){
		return (num >= 10 ? num : '0' + num);
	}
})

// 获取当前流程
template.helper('flowExchange', function (flow) {
	var flowStr = '';
	if(flow.length && flow.length > 0){
		for(var fl in flow){
			if(flow[fl].task_status == 'null' || flow[fl].task_status == null){
				if(flowStr != ''){
					flowStr = flowStr + '、' + flow[fl].task_title;
				} else {
					flowStr = flow[fl].task_title;
				}
			} else if(flow[fl].task_status == 2){
				return '已拒件';
			}
		}
		return flowStr;
	} else {
		return '无';
	}
});
// 删除空格
template.helper('spaceDel', function (content) {
	if(/<[^>]+>/g.test(content)){
		return content.replace(/<[^>]+>/g,"<br />");
	} else {
		return content;
	}
});
