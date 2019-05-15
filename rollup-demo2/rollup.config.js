
import path from 'path';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

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
      serve({
        port:3001,
        contentBase:[
          resolveFile('example'),
          resolveFile('dist')
        ]
      })
    ]
}
