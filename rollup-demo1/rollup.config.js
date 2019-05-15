
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



/* cmj写法
const buble = require('rollup-plugin-buble');

const resolve = function(filePath){
    return path.join(__dirname,filePath);
}
module.exports = {
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
*/
