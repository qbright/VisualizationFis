$(function(){
    var queryString = require("querystring"),
        settings = require("./settings"),
        path = require("path"),
        common = require("./js/common");

    $("#win_mini_btn").click(function(){   //最小化窗口
        win.minimize();
    });

	$("#win_close_btn").click(function(){ // 关闭窗口
        win.close();
    });
    console.log(settings);
    var unsoft = queryString.parse(window.location.href,"?").unsoft.split(",");
    console.log(unsoft);
    for(var i = 0; i < unsoft.length; i ++){//根据参数显示未安装的软件
        if(!parseInt(unsoft[i])){
            var selector = "#install_";
                selector += settings.unsoftMap[i] + "_btn";
            $(selector).attr("hidden",false);
        }
    }



    $("#install_Node").click(function(){ //打开下载链接
        common.execCommand('start "" "' + settings.softwareDownloadPath.Node + '"');
    });

    $("#install_Java").click(function(){
        common.execCommand('start "" "' + settings.softwareDownloadPath.Java + '"');
    });
    $("#install_PHP").click(function(){
        common.execCommand('start "" "' + settings.softwareDownloadPath.PHP + '"');
    });

    

});


