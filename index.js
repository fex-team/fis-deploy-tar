var os = require('os');
var path = require('path');
var fs = require('fs');
var tar = require('tar-stream');
var zlib = require('zlib');

var cwd = process.cwd();

function normalizePath(to, root){
    if (!to){
        to = '/';
    }else if(to[0] === '.'){
        to = fis.util(cwd + '/' +  to);
    } else if(/^output\b/.test(to)){
        to = fis.util(root + '/' +  to);
    }else {
        to = fis.util(to);
    }
    return to;
}

module.exports = function(files, settings, callback) {
    if (!fis.util.is(settings, 'Array')){
        settings = [settings];
    }
    var conf = {};
    settings.forEach(function(setting){
        fis.util.merge(conf, setting);
    });
    if (!conf.file){
        fis.log.error('[fis-deploy-tar] need specify the tar file path with option [file]')
    }
    var pack = tar.pack() // create tar pack stream

    var targetPath = normalizePath(conf.file, fis.project.getProjectPath());
    if(!fis.util.exists(targetPath)){
        fis.util.mkdir(fis.util.pathinfo(targetPath).dirname);
    }
    var target = fs.createWriteStream(targetPath);
    if (conf.gzip){
        pack.pipe(zlib.createGzip({
            level: conf.level,
            memLevel: conf.memLevel
        })).pipe(target);
    }else{
        pack.pipe(target);
    }

    files.forEach(function(fileInfo){
        var file = fileInfo.file;
        if(!file.release){
            fis.log.error('unable to get release path of file['
                + file.realpath
                + ']: Maybe this file is neither in current project or releasable');
        }
        var name = ((fileInfo.dest.to || '/') + fileInfo.dest.release).replace(/^\/*/g, '');
        pack.entry({ name: name }, fileInfo.content);
        fis.log.debug('[fis-deploy-tar] pack file [' + name + ']');
    });

    pack.finalize();

    target.on('close', function(){
        fis.log.debug('[fis-deploy-tar] tar end');
        callback && callback();
    });
}

module.exports.fullpack = true;