# fis-deploy-tar

## 说明

将FIS产出进行tar打包

## 使用方法

安装

```bash
npm i fis-deploy-tar -g
```

启用

```javascript
fis.config.set('modules.deploy', ['default', 'tar'])
```

配置

```javascript
fis.config.set('settings.deploy.tar', {
    publish : {
        from : '/',
        to: '/',
        gzip: true,
        level: 0, //压缩质量 0-9，越大压缩比越高
        memLevel: 6, //压缩使用的内存量 1-9， 越大占用内存越多，执行速度越快
        file: './output/output.tar.gz'
    }
});
```

发布

```bash
fis release -Dompd publish
```

**注意**

不支持中文文件名，目前node下未找到中文名支持友好的tar库
