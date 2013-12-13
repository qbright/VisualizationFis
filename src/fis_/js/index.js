$(function(){
    var common = require("./js/common"),
        async = require("async"),
        settings = require("./settings"),
        path = require("path"),
        hasUnInstall = false;

   /**
    * 通过命令行检查是否安装了必要的软件
    */
   async.parallel([function(cb){
        common.execCommand(settings.command.checkNode,function(err,stdout,stderr){
            console.log(err);
            var result = 1;
            if(err){
                result = 0;
            }
            cb(null,result);
        });
    },function(cb){
        common.execCommand(settings.command.checkJava,function(err,stdout,stderr){
            var result = 1;
            if(err){
                result = 0;
            }
            cb(null,result);
        });
    },function(cb){
        common.execCommand(settings.command.checkPHP,function(err,stdout,stderr){
            var result = 1;
            if(err){
                result = 0;
            }
            cb(null,result);
        })
    },function(cb){
        common.execCommand(settings.command.checkFis,function(err,stdout,stderr){
            var result = 1;
            if(err){
                result = 0;
            }
            cb(null,result);
        })
    }],function(err,values){//全部检查完成之后的回调
            console.log(values);
       var unsoft = [];
        for(var value in values){
            unsoft.push(values[value]);
            if(!parseInt(values[value])){
                hasUnInstall = true;
            }
        }

       if(hasUnInstall){
            window.location.href = "./install.html?unsoft=" + unsoft.toString();
       }else{
           window.location.href = "./main.html";
       }


    });




});

