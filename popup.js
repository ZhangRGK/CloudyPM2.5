/**
 * Created by wuyanc on 3/18/2015.
 */
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
function getPM(){

    if(localStorage['city']=='undefined'||!localStorage['city']){
        //chrome.tabs.create({url:"options.html"});
        city='beijing';
    }
    else{
        city=localStorage['city'];
    }
    var url = weatherUrl+ "city="+city+"&"+"token="+token;
    httpRequest(url,function(res){
        var result= JSON.parse(res);
        var pm= void 0;
        if(result&&!result["error"]){
            pm =result[result.length-1]["pm2_5"];
        }
        if(pm){
            chrome.browserAction.setBadgeBackgroundColor({color:'#000000'});
            chrome.browserAction.setBadgeText({text:pm.toString()});
        }

    });


}
