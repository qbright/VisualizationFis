var exec = require("child_process").exec,
    mkdirp = require("mkdirp"),
    fs = require("fs"),
    path = require("path");

module.exports = {
    /**
     * 用于执行命令行命令
     * @param  {[type]}   command  命令行命令
     * @param  {[type]}   opt      执行命令行的配置  主要是  cwd参数，用于配置命令行在那个路径下执行
     * @param  {Function} callback 执行完命令行的回调函数
     * @return {[type]}            返回child_process 对象，主要用于获取进程pid
     */
    execCommand:function(command,opt,callback){
        opt = opt || {};
        return exec(command,opt,function(err,stdout,stderr){
            callback && callback(err,stdout,stderr);
        });
    },
    /**
     * 解压zip包
     * @param  {[type]} zipName     解压的zip包路径
     * @param  {[type]} installPath 解压路径
     * 
     */
    unzip:function(zipName,installPath){
        var JSZip = require("node-zip");
        var zipData_ = fs.readFileSync(zipName, "binary"),
            zipData = new JSZip(zipData_, {
                base64: false,
                checkCRC32: true
            }),
            WORKSPACE_PATH = installPath;
        var filenames = Object.getOwnPropertyNames(zipData.files),
            folderName = path.normalize(WORKSPACE_PATH);
        var sep = path.sep;
        filenames.forEach(function(filename) {
            if (filename.substr(filename.length - 1) !== "/") {
                var fileObj = zipData.files[filename],
                    content = fileObj.data,
                    routedName = path.basename(filename);
                if (routedName) {
                    var filepath = path.join(folderName, filename).replace(/\\/,sep),
                        fileDir = path.dirname(filepath);
                    mkdirp(fileDir, function() {
                        fs.writeFile(filepath, content, "binary");
                    }.bind(this));
                }
            }
        }.bind(this));

    }

}