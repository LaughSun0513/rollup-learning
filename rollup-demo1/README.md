#rollup语法
```
 rollup -c rollup.config.js 等价 rollup --config rollup.config.js
```

#简单配置rollup
```
## commonjs 写法
const buble = require('rollup-plugin-buble'); //简易版babel

const resolve = function(filePath){
    return path.join(__dirname,filePath);
}
module.exports = {
  input:resolve('src/main.js'), //入口文件
  output:{
    file:resolve('./dist/bundle.js'),//出口路径
    format:'iife',//压缩的格式  
           ------------------------
           ## amd – 异步模块定义，用于像RequireJS这样的模块加载器
           ## cjs – CommonJS，适用于 Node 和 Browserify/Webpack
           ## es – 将软件包保存为ES模块文件
           ## iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小）
           ## umd – 通用模块定义，以amd，cjs 和 iife 为一体
           ------------------------
    name:'bundle.js' //文件名
  },
  plugins:[
    buble()
  ]
}
```
```
## ES6写法
import path from 'path';
import buble from 'rollup-plugin-buble';

const resolve = function(filePath){
    return path.join(__dirname,filePath);
}

export default {
    input:resolve('src/main.js'),
    output:{
      file:resolve('./dist/bundle.js'),
      format:'iife',
      name:'bundle.js'
    },
    plugins:[
      buble()
    ]
}
```
