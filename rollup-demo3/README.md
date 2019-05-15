# 使用rollup  搭建开发模式 & 生产模式
```
npm i rollup -D   #安装rollup
npm i rollup-plugin-babel -D #安装babel 解析ES6语法
npm i @babel/core @babel/preset-env @babel/plugin-proposal-object-rest-spread -D # 安装babel核心模块/预设/解析...解构语法
npm i  rollup-plugin-uglify -D #生产模式压缩代码
```
----------------------
# 公共配置
```
import path from 'path';
import babel from 'rollup-plugin-babel';

const resolveFile = function(filePath){
    return path.join(__dirname,filePath);
}

export default {
    input:resolveFile('../src/main.js'),
    output:{
      format:'umd',
    },
    plugins:[
      babel()
    ]
}

```
----------------------
# 开发模式  
## 生成sourcemap文件
## 生成本地服务引入rollup-plugin-serve localhost:3001
## 生成监听文件变化的功能
```
import path from 'path';
import serve from 'rollup-plugin-serve';
import config from './rollup.config';

const resolveFile = function(filePath){
    return path.join(__dirname,filePath);
}
config.output = {
    ...config.output,
    file:resolveFile('../dist/bundle.dev.js'),
    name:'bundle.dev.js',
    sourcemap: true, // 开发模式，开启sourcemap文件的生成
}
config.plugins = [
  ...config.plugins,
  ...[
    serve({
      port:3001,
      contentBase:[
        resolveFile('example'),
        resolveFile('../dist')  //这里必须对应打包完的路径 如果只是写dist 路径变为build/dist/bundle..
      ]
    })
  ]
]
export default config;
```
----------------------
#生产模式
```
import path from 'path';
import config from './rollup.config';
import { uglify } from 'rollup-plugin-uglify';

const resolveFile = function(filePath){
    return path.join(__dirname,filePath);
}

config.output = {
    ...config.output,
    file:resolveFile('../dist/bundle.js'),
    name:'bundle.js',
    sourcemap: false, // 生产模式，无需sourcemap文件
}
config.plugins = [
  ...config.plugins,
  ...[
    uglify()
  ]
]

export default config;
```
# pageage.json
```
"scripts": {
  "dev": "node_modules/.bin/rollup -w -c ./build/rollup.config.dev.js", //开启watch功能
  "build": "node_modules/.bin/rollup -c ./build/rollup.config.prod.js"
}
```
