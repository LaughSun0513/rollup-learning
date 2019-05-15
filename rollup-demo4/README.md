# 使用rollup & Node 来编译文件
```
npm i rollup -D   #安装rollup
npm i rollup-plugin-babel -D #安装babel 解析ES6语法
npm i @babel/core @babel/preset-env @babel/plugin-proposal-object-rest-spread -D # 安装babel核心模块/预设/解析...解构语法
npm i  rollup-plugin-uglify -D #生产模式压缩代码

## 安装开发例子服务 所需模块
npm i --save-dev chalk ## 日志样式模块
npm i --save-dev chokidar ## 目录监听模块
npm i --save-dev koa  koa-static ## 服务模块
npm i --save-dev koa-compose ## koa流程控制模块，用来控制流程编译
```
----------------------
# 公共配置 多入口 需要编译三个文件`src/index.js` `src/lib/hello.js` `src/lib/world.js`
```
  const path = require('path');
  const babel = require('rollup-plugin-babel');
  const buble = require('rollup-plugin-buble');

  const resolveFile = function(filePath){
      return path.join(__dirname,'../',filePath);
  }
  const plugins =[
    babel(),
    buble()
  ]
  module.exports = [
    { //编译文件1--src/index.js
      input:resolveFile('src/index.js'),
      output:{
        file: resolveFile('dist/index.js'),
        format:'umd',
        name:'Demo'
      },
      external: ['lib/hello', 'lib/world'],
      plugins
    },
    { //编译文件2--src/lib/hello.js
      input:resolveFile('src/lib/hello.js'),
      output:{
        file: resolveFile('dist/lib/hello.js'),
        format:'umd',
        name:'Hello'
      },
      plugins
    },
    { //编译文件3--src/lib/world.js
      input:resolveFile('src/lib/world.js'),
      output:{
        file: resolveFile('dist/lib/world.js'),
        format:'umd',
        name:'World'
      },
      plugins
    },
  ]
```
# .babelrc
为什么要用 @babel/plugin-external-helpers ？
babel 有很多辅助函数，例如 toArray函数， jsx转化函数。这些函数是 babel transform 的时候用的，都放在 babel-helpers这个包中。如果 babe 编译的时候检测到某个文件需要这些 helpers，在编译成模块的时候，会放到模块的顶部。

但是如果多个文件都需要提供，会重复引用这些 helpers，会导致每一个模块都定义一份，代码冗余。所以 babel 提供了这个命令，用于生成一个包含了所有 helpers 的 js 文件，用于直接引用。然后再通过一个 plugin，去检测全局下是否存在这个模块，存在就不需要重新定义了。

具体参考：https://juejin.im/post/59b9ffa8f265da06710d8e89 定位到 babel-external-helpers
```
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false
    }],
  ],
  "plugins": [
    //它允许 Rollup 在文件输入前仅引用一次任何的 'helpers' 函数，而不是在每个使用这些 'helpers' 的模块里都引入一遍（一般是默认行为）
    "@babel/plugin-external-helpers",
    "@babel/plugin-proposal-object-rest-spread",
    "transform-es2015-arrow-functions"
  ],
}
```
----------------------
# 开发模式  -- 生成sourcemap文件
```
  const configList = require('./rollup.config');

  configList.map(config=>{
    config.output.sourcemap = true;
    return config;
  })

  module.exports = configList;
```
----------------------
#生产模式 -- 不生成sourcemap文件 并压缩代码
```
  const configList = require('./rollup.config');
  const { uglify } = require('rollup-plugin-uglify');

  configList.map(config=>{
     config.output.sourcemap = false;
     config.plugins = [
       ...config.plugins,
       ...[
         uglify()
       ]
     ]
     return config;
  })
  module.exports = configList;
```
***********关键内容***************
# 使用Node 编写编译任务的js`compile_task`

##日志样式输出 -- 利用chalk https://github.com/chalk/chalk
```
  const chalk = require('chalk');

  function logger( text = '', opts = { status : 'INFO' } ) {
    let logText = '';
    switch( opts.status)  {
      case 'SUCCESS':
        logText = `${chalk.green('[SUCCESS]')} ${chalk.green(text)}`
        break;
      case 'WARN':
        logText = `${chalk.yellow('[WARN]')} ${chalk.yellow(text)}`
        break;
      case 'ERROR':
        logText = `${chalk.red('[ERROR]')} ${chalk.red(text)}`
        break;
      default:
        logText = `${chalk.magenta('[INFO]')} ${chalk.magenta(text)}`
        break;
    }
    console.log(logText);
  }
```
## rollup.rollup通过JS API 生成单个打包任务，并产出bundle文件
```
  const path = require('path');
  const rollup = require('rollup');

  function wrapTask( config ) {
    const inputOptions = config;
    const outputOptions = config.output;
    return async function(ctx, next) {
      // create a bundle
      const bundle = await rollup.rollup(inputOptions);        //----产出bundle对象
      logger(`开始编译 ${path.basename(inputOptions.input) }`);
      const { code, map } = await bundle.generate(outputOptions);  //---产出编译后的code和sourcemap文件
      // or write the bundle to disk
      await bundle.write(outputOptions);  //--将打包好的代码写入文件夹
      logger(`编译结束 ${path.basename(outputOptions.file)}`);

      await next();
    }
  }
```
## 生成总的编译任务，通过koa-compose的机制，推进循环编译
```
  const compose = require('koa-compose'); //推动编译任务前进

  function compileTask(configList){
    const taskList = [];

    //根据rollup的dev/prod配置，进行代码的打包编译，再push进一个数组
    configList.forEach(function(config){
      taskList.push(wrapTask(config));
    });

    //通过compose进行所有任务的推进
    compose(taskList)().then(function(){
      logger('END', {status: 'SUCCESS'});
    }).catch(function(err){
      console.log(err);
    })
  }
```
---------------------
### 开发模式的编译 `compile/dev.js`
#### koa-static
```
  const Koa = require('koa'); //利用koa启动Node服务
  const KoaStatic = require('koa-static'); //利用koa-static 静态资源目录对于相对入口文件index.js的路径

  const app = new Koa();
  const projectPath = path.join(__dirname, '..'); // -->/Users/xxxx/Desktop/rollup-learning/rollup-demo4/build

  app.use(KoaStatic(projectPath))
  app.listen(3001, function(){
    console.log('[example] http://127.0.0.1:3001/example/index.html');
    console.log('[example] http://127.0.0.1:3001/example/hello.html');
    console.log('[example] http://127.0.0.1:3001/example/world.html');
  })
```
#### chokidar  https://isliulei.com/article/Node-WatchFile/
```
const chokidar = require('chokidar');  //利用chokidar监听文件目录变化

const projectPath = path.join(__dirname, '..'); // -->/Users/xxxx/Desktop/rollup-learning/rollup-demo4/build
const srcPath = path.join(projectPath, '..','src') // -->/Users/xxxx/Desktop/rollup-learning/rollup-demo4/src

function watchSrc () {
  chokidar.watch(srcPath, {
    ignored: /(^|[\/\\])\../       //忽略点文件
  }).on('all', (event, path) => {
    if ( event === 'change' ) {
      compileTask(configList);
    }
  });
}
```
##### 最终版本
```
const path = require('path');
const chokidar = require('chokidar');
const Koa = require('koa');
const KoaStatic = require('koa-static');
const compileTask = require('./compile_task');
const configList = require('../rollup.config.dev');

const app = new Koa();
const projectPath = path.join(__dirname, '..');
const srcPath = path.join(projectPath, '..','src')

function watchSrc () {
  chokidar.watch(srcPath, {
    ignored: /(^|[\/\\])\../
  }).on('all', (event, path) => {
    if ( event === 'change' ) {
      compileTask(configList); //执行编译任务
    }
  });
}

app.use(KoaStatic(projectPath))
app.listen(3001, function(){
  console.log('[example] http://127.0.0.1:3001/example/index.html');
  console.log('[example] http://127.0.0.1:3001/example/hello.html');
  console.log('[example] http://127.0.0.1:3001/example/world.html');
  compileTask(configList); //执行编译任务
  watchSrc() //监听文件
})
```

### 生产模式的编译
```
const compileTask = require('./compile_task');
const configList = require('../rollup.config.prod');

compileTask(configList); //执行编译任务
```
---------------------
# pageage.json
```
  "scripts": {
    "dev": "node ./build/compile/dev.js",
    "build": "node ./build/compile/build.js"
  }
```
