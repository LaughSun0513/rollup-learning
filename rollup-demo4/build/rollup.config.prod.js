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
