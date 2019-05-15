const path = require('path');
const rollup = require('rollup');
const chalk = require('chalk');
const compose = require('koa-compose');


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

function wrapTask( config ) {
  const inputOptions = config;
  const outputOptions = config.output;
  return async function(ctx, next) {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);
    logger(`开始编译 ${path.basename(inputOptions.input) }`);
    await bundle.generate(outputOptions);
    // or write the bundle to disk
    await bundle.write(outputOptions);
    logger(`编译结束 ${path.basename(outputOptions.file)}`);

    await next();
  }
}

function compileTask(configList){
  const taskList = [];

  configList.forEach(function(config){
    taskList.push(wrapTask(config));
  });

  compose(taskList)().then(function(){
    logger('END', {status: 'SUCCESS'});
  }).catch(function(err){
    console.log(err);
  })
}
module.exports = compileTask;
