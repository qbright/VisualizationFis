/**
 * Created with JetBrains WebStorm.
 * User: zhengqiguang
 * Date: 13-12-9
 * Time: 下午3:04
 * To change this template use File | Settings | File Templates.
 */

$(function(){
    var common = require("./js/common"),
        settings = require("./settings"),
        isClickStop = false,
        fs = require("fs"),
        path = require("path");
    var SERVICE={
        stopService:function(fn){
            var handler =  common.execCommand(settings.command.server_stop,{},function(err){
               /* if(err) {
                    console.log(err);
                    alert("关闭服务器失败");
                }
                if(Window.execHandler&&Window.execHandler.pid){
                    common.execCommand(settings.command.release_stop + Window.execHandler.pid,{},function(err,stdout,stderr){
                        if(err){
                            alert("停止失败!");
                            console.log(stdout);
                            console.log(stderr);
                            console.log(err);
                        }
                        fn&&fn();
                    });
                }else{
                    fn&&fn();
                }*/
            });
            handler.stdout.on("data",function(data){
                console.log(data.toString());
            });
            handler.stderr.on("data",function(data){
                console.log(data.toString());
            });
            handler.on("close",function(code){
                if(code != 0){
                    alert("关闭服务器失败");
                }else{
                    if(Window.execHandler&&Window.execHandler.pid){
                        common.execCommand(settings.command.release_stop + Window.execHandler.pid,{},function(err,stdout,stderr){
                            if(err){
                                alert("停止失败!");
                                console.log(stdout);
                                console.log(stderr);
                                console.log(err);
                            }
                            fn&&fn();
                        });
                    }else{
                        fn&&fn();
                    }
                }

            });
            handler.on("exit",function(code){
                console.log("exit with code " + code);
            });
            handler.on("error",function(code){
                console.log("error with code " + code);
            });

        }
    };

    gui.Window.get().on("close",function(){
        isClickStop = true;
        this.hide();
        SERVICE.stopService(function(){
           win.close(true);
        })
    });



    $("#win_mini_btn").click(function(){
        win.minimize()
    });

    $("#win_close_btn").click(function(){
        isClickStop = true;
         win.close();
        
    });

    $("#server_open").click(function(){//打开目录
        common.execCommand(settings.command.server_open);
    });



    common.execCommand(settings.command.server_info,{},function(err,stdout){//获取调试服务器信息 ,存入localStorage
            if(!err){
                var infos = stdout.split("\n"),
                    infoObj = {};

                for(var i = infos.length; i >= 0; i --){
                    if(infos[i]){
                        var temp = infos[i].split("=");
                        infoObj[temp[0]] = temp[1];
                    }

                }
                window.ServerInfos = infoObj;

                $("#server_port").val(ServerInfos.port);
                $("#release_root").val(localStorage.release_root);
                $("#release_dest").val(localStorage.release_dest);
            }
    });

    $("#server_start").click(function(){ //启动调试服务器
        var startCommand = settings.command.server_start + $("#server_port").val();
        var target = $(this);
        target.button("loading");
        common.execCommand(settings.command.server_stop,{},function(err){
            if(!err){
                common.execCommand(startCommand,{},function(err){
                    target.button("reset");
                    if(err){
                        console.log(err);
                       alert("服务启动失败,请检查端口是否被占用");
                    }else{
                        changeServerBtnStatus(true);
                    }

                })
            }else{
                console.log(err);
                alert("服务启动失败");
            }

        });
    });

    $("#server_stop").click(function(){ //关闭调试服务器
      var target = $(this);
          target.button("loading");
        common.execCommand(settings.command.server_stop,{},function(err){
            target.button("reset");
             if(err) {
                 console.log(err);
                 alert("关闭服务器失败");
             }else{
                 changeServerBtnStatus(false);
             }

        });

    });

    $("#server_restart").click(function(){//重启调试服务器
        var target = $(this) ;
        target.button("loading");
        common.execCommand(settings.command.server_restart,{},function(err){
            target.button("reset");
            if(err){
                console.log(err);
                alert("服务器重启失败");
                changeServerBtnStatus(false);
            }else{
                changeServerBtnStatus(true);
            }
        });
    });

    $("#server_clean").click(function(){ //清理调试服务器
        var target = $(this);
        target.button("loading");
        common.execCommand(settings.command.server_clean,{},function(err){
            if(!err){
                common.execCommand(settings.command.server_install_smarty,{},function(err){ //清理完调试服务器后安装php  smarty
                    target.button("reset");
                    if(err){
                        console.log(err) ;
                        alert("清理目录失败");
                    }
                });
            }
        });
    });


    $("#release_root_chooser").change(function(){ //选择被发布的文件路径

        $("#release_root").val($(this).val() + "\\");
        localStorage.release_root = $(this).val() + "\\";
    });



    $("#release_root_btn").click(function(){ 
        $("#release_root_chooser").click();
    });

    $("#release_dest_chooser").change(function(){ //选择发布到的文件路径,可以为远程地址

        $("#release_dest").val($(this).val());
        $("#release_dest").change();
    });

    $("#release_dest").change(function(){ 
        localStorage.release_dest = $(this).val();
    });


    $("#release_dest_btn").click(function(){
        $("#release_dest_chooser").click();
    });

    $("#install_repos_cwd_chooser").change(function(){
        $("#install_repos_cwd").val($(this).val() + "\\");
    });

    $("#install_repos_cwd_btn").click(function(){
        $("#install_repos_cwd_chooser").click();
    });

    $("#install_repos_btn").click(function(){
        var target = $(this);
        var form = $("#install_form").serializeArray(),
            formObj = arrayToObj(form);
        if(!formObj.cwd || !formObj.url){
            alert("请填写安装路径和URL!");
            return false;
        }
        target.button("loading");
        common.execCommand(settings.command.install_repos + formObj.url,function(err,stdout,stderr){
            target.button("reset");
            if(err){
                alert("安装失败!!");
                console.log(err);
                console.log(stdout);
                console.log(stderr);
            }else{

            }

        })

        console.log(formObj);

    });

    $("#release_btn").click(function(){ //发布按钮

        var form = $("#release_form").serializeArray();
        var formObj = arrayToObj(form);

        if(!formObj.cwd){
            alert("请选择项目路径!");
            return false;
        }else if($("#release_dest_on_btn").hasClass("active") && !$("#release_dest").val()){
            alert("请选择项目发布路径!");
            return false;
        }

        var command = getReleaseCommand(formObj,settings);
        var target = $(this);
        target.button("loading");

        if(formObj.watch || formObj.live){
            target.button("reset");
            $("#release_watch_stop").parent("div").attr("hidden",false);
        }

        Window.execHandler = common.execCommand(command,{ //进行 watch 和 live时命令行程序是挂起的，需要记录 进程的pid，用于关闭 监控
            cwd:formObj.cwd
        },function(err,stdout,stderr){
            target.button("reset");
            if(err){
                console.log(stdout);
                console.log(stderr);
                console.log(err);
                if(!isClickStop){
                    alert("发布失败!");
                }else{
                    isClickStop = false;
                }
            }else{

            }
        });



    });

    $("#release_watch_stop").click(function(){ //获取pid之后结束进程树
        isClickStop = true;
        common.execCommand(settings.command.release_stop + Window.execHandler.pid,{},function(err,stdout,stderr){
            if(err){
                alert("停止失败!");
                console.log(stdout);
                console.log(stderr);
                console.log(err);
            }else{
                $("#release_watch_stop").parent("div").attr("hidden",true);
            }

        });
        console.log("release_watch_stop");
    });

    if(fs.existsSync(path.join(settings.fisTmp,"server/pid"))){//打开时检查测试服务器的状态
        changeServerBtnStatus(true);
    }
});

function getReleaseCommand(formObj,settings){ //获取release命令
    var command = settings.command.release;
    for(var option in formObj){
        if(option != "dest" && option != "cwd"){
            command += settings.command[option];
        }
    }
    if($("#release_dest_on_btn").hasClass("active")){
        command += settings.command["dest"] + formObj["dest"];
    }
    return command;
}

function arrayToObj(array){ //将 form数组值序列哈成为 对象
    var obj = {};
    for(var i = 0,node;node = array[i];i ++){
        obj[node.name] = node.value;
    }
    return obj;

}

function changeServerBtnStatus(status){ //修改调试服务器启动显示状态
    $("#server_status_stop").attr("hidden",status);
    $("#server_status_start").attr("hidden",!status);
   /* if(status){
        $("#server_start").attr("disabled",status);
        $("#server_stop").attr("disabled",!status);
    }else{
        $("#server_start").removeClass("disabled").attr("disabled",status);
        $("#server_stop").addClass("disabled").attr("disabled",!status);
    }*/

}