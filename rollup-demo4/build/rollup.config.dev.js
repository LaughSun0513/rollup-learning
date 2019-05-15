const configList = require('./rollup.config');

configList.map(config=>{
  config.output.sourcemap = true;
  return config;
})

module.exports = configList;
