# 使用rollup解析 ES6 & ES6+ 语法
```
npm i rollup -D   #安装rollup
npm i rollup-plugin-babel -D #安装babel 解析ES6语法
npm i @babel/core @babel/preset-env @babel/plugin-proposal-object-rest-spread -D # 安装babel核心模块/预设/解析...解构语法
```
# 解析async/await等高级语法 CDN方式引入babel-polyfill
```
  <script src="https://cdn.bootcss.com/babel-polyfill/6.26.0/polyfill.js"></script>
```
# .babelrc
```
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false   //否则Babel会在Rollup有机会做处理之前，将我们的模块转成 CommonJS，导致Rollup的一些处理失败
    }],
  ],
  "plugins": [
    "@babel/plugin-proposal-object-rest-spread"
  ],
}

```
#开发者模式  生成sourcemap 生成本地服务 引入rollup-plugin-serve
```

import path from 'path';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve'; //引入rollup-plugin-serve

const resolveFile = function(filePath){
    return path.join(__dirname,filePath);
}

export default {
    input:resolveFile('src/main.js'),
    output:{
      file:resolveFile('./dist/bundle.js'),
      format:'iife',
      name:'bundle.js',
      sourcemap: true, // 开发模式，开启sourcemap文件的生成
    },
    plugins:[
      babel(),
      serve({ //配置服务
        port:3001,
        contentBase:[
          resolveFile('example'),
          resolveFile('dist')
        ]
      })
    ]
}

```
手动添加html，并且引入bundle.js
访问 http://localhost:3001/
控制台显示内容
