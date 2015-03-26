/**
 * Created by wuyanc on 3/18/2015.
 *
 * 这是一个关于PM2.5的图片应用,当城市空气质量变差时，肉眼能见度受到影响，继而呈现不同的朦胧图片，而当空气质量良好时，则没有图片呈现，这正是这款应用名字的由来。
 * 同时，该应用使用了Html5地理位置功能，在网络状态良好的情况下，可以自动获取用户所在城市的空气质量报告。
 * 最后，借由此应用，希望大家保护环境，真爱地球。
 */
var token = "vcTxhhdD8xUup5TYeSqY";
var weatherUrl = "http://www.pm25.in/api/querys/pm2_5.json?";
var saying=['晴空之下，梦想肆意疯跑，遍地开花。','世间所有的相遇，都是久别重逢。','遗忘，是所有到过的美好。'];
var saying2=['迷雾之中，初心彷徨游走，路在何方。','访问作者首页'];
$(document).ready(function(){
    getAQI();
});
function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

function pickRandomNum(to){
    return Math.floor(Math.random() * to)+1; //get from 1 ->to
}
function getAQI(){

    var city=void 0;//set a default value
    if(localStorage['city']=='undefined'||!localStorage['city']){
        chrome.tabs.create({url:"../option/options.html"});
        return ;
    }
    else{
        city=localStorage['city'];
        //show the old result firstly in case server has not respond
        $('#date').text(localStorage['date']);
        $('#aqi').text(localStorage['aqi']);
        $('#quality').text(localStorage['quality']);
        $('#city').text(city);
    }
    var url = weatherUrl+ "city="+city+"&"+"token="+token;
    httpRequest(url,function(res){
        var result= JSON.parse(res);
        var aqi= void 0;
        var quality=void 0;
        if(result&&!result["error"]){
            aqi =result[result.length-1]["aqi"];
            quality=result[result.length-1]["quality"];
        }
        if(aqi){
            chrome.browserAction.setBadgeBackgroundColor({color:'#000000'});
            chrome.browserAction.setBadgeText({text:aqi.toString()});
            //format page value
            $('#date').text(formatCNDateString(new Date()));
            localStorage['date']=formatCNDateString(new Date());
            $('#city').text(city);

            $('#aqi').text(aqi);
            localStorage['aqi']=aqi;
            $('#quality').text(quality);
            localStorage['quality']=quality;
            if(aqi>50){
                $('#img').attr('src','../images/'+pickRandomNum(16)+'.jpg');
                $('#img').show();
                $('#link').text(saying2[pickRandomNum(saying2.length)-1]);
            }
            else{
                $('#link').text(saying[pickRandomNum(saying.length)-1]);
            }

        }

    });


}

function formatCNDateString(date)
{
    var cn = ["〇","一","二","三","四","五","六","七","八","九"];
    var s = [];

    var MM = date.getMonth()+1;
    if (MM<10)
        s.push(cn[MM]);
    else if (MM<20)
        s.push("十" + cn[MM% 10]);
    s.push("月");
    var DD = date.getDate();
    if (DD<10)
        s.push(cn[DD]);
    else if (DD<20)
        s.push("十" + cn[DD% 10]);
    else
        s.push("二十" + cn[DD% 10]);
    s.push("日");
    return s.join('');
}
