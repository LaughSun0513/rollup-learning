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
