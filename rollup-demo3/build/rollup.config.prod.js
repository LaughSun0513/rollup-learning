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
