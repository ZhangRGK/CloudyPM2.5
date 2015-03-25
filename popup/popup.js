/**
 * Created by wuyanc on 3/18/2015.
 */
var IMAGENUMBER=16;
$(document).ready(function(){
    getPM();

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
var token = "vcTxhhdD8xUup5TYeSqY";
var weatherUrl = "http://www.pm25.in/api/querys/pm2_5.json?";
function getRandomInteger(){
    return Math.floor(Math.random() * IMAGENUMBER) + 1
}
function getPM(){

    var city=void 0;//set a default value
    if(localStorage['city']=='undefined'||!localStorage['city']){
        chrome.tabs.create({url:"../option/options.html"});
        return ;
    }
    else{
        city=localStorage['city'];
    }
    var url = weatherUrl+ "city="+city+"&"+"token="+token;
    httpRequest(url,function(res){
        var result= JSON.parse(res);
        var pm= void 0;
        var quality=void 0;
        if(result&&!result["error"]){
            pm =result[result.length-1]["aqi"];
            quality=result[result.length-1]["quality"];
        }
        if(pm){
            chrome.browserAction.setBadgeBackgroundColor({color:'#000000'});
            chrome.browserAction.setBadgeText({text:pm.toString()});
            //format page value
            $('#date').text(formatCNDateString(new Date()));
            $('#city').text(city);
            $('#aqi').text(pm);
            $('#quality').text(quality);
            if(pm>50){

                $('#img').attr('src','../images/'+getRandomInteger()+'.jpg');
                $('#img').show();
                $('#link').text('访问作者主页');
                $('#link').click(function(){

                    chrome.tabs.create({url:"http://www.magicwu.com"});
                });
            }
            else{
                $('#link').text('世间所有的相遇，都是久别重逢,而我总在你眼睛模糊时出现。');
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
