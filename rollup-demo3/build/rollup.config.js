
import path from 'path';
import babel from 'rollup-plugin-babel';

const resolveFile = function(filePath){
    return path.join(__dirname,filePath);
}

export default {
    input:resolveFile('../src/main.js'),
    output:{
      format:'umd',
    },
    plugins:[
      babel()
    ]
}
