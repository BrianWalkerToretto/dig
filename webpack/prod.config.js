// starter/webpack.config.js
const os = require('os');
import webpack from 'webpack';
import WebpackCommonConfig, { resolve } from './common.config';
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const merge = require('webpack-merge');
// const nodeExternals  = require('webpack-node-externals');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(WebpackCommonConfig, {
  plugins: [
    new UglifyJSPlugin({
      exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        mangle: true,
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          // warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
          pure_funcs: ['console.log']
        },
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
        }
      },
      extractComments: false, // 移除注释
      sourceMap: true,
      cache: true,
      parallel: os.cpus().length
  }),
    //根据模块相对路径生成四位数hash值作为模块id
    new webpack.HashedModuleIdsPlugin(),
    new LodashModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ],
  // 官网解释：webpack 中的 externals 配置提供了不从 bundle 中引用依赖的方式。解决的是，所创建的 bundle 依赖于那些存在于用户环境(consumer environment)中的依赖。
  // 理解：意思是如果需要引用一个库，但是又不想让webpack打包（减少打包的时间），并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用（一般都以import方式引用使用），那就可以通过配置externals。
  // externals: [
  //   nodeExternals()
  // ],
  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
  optimization: {
    nodeEnv: 'production',
    concatenateModules: true, //  webpack 4
    usedExports: true,
    minimize: true,
    // minimizer: [new TerserPlugin()]
  }
});
