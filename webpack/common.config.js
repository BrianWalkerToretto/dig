const path = require('path');
const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, '../', dir);
}
const isProd = process.env.NODE_ENV === 'production';

export default {
  mode: isProd ? 'production' : 'development',
  entry: {
    dig: isProd ? resolve('/src') : resolve('/src/app'),
  },
  stats: {
    assets: true,
    assetsSort: 'field',
    builtAt: false,
    cached: false,
    colors: true,
  },
  cache: true,
  profile: true,
  devtool: isProd ? 'cheap-module-source-map' : 'cheap-module-eval-source-map', // 控制是否生成，以及如何生成 source map
  output: {
    path: resolve('/dist'),
    filename: '[name].js', // 输出文件的文件名
    // chunkFilename: IS_PROD ? 'chunks/[name].[contenthash:8].js' : '[name].js', // 非入口(non-entry) chunk 文件的名称
    publicPath: './', // 公共路径
    // libraryTarget决定了你的library运行在哪个环境
    libraryTarget: 'umd', // 工具库既可以用commonjs和amd方式使用也可以用script方式引入
    umdNamedDefine: true, // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
    library: 'Dig', // library指定的是你require时候的模块名。
    // libraryExport: 'default' // 移除libraryExport
  },
  resolve: {
    modules: [resolve('/src'), resolve('/node_modules')],
    extensions: ['.js', '.less'],
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main'],
    alias: {
      // @images,@common,@util,@layout,@include
      // '@styles': resolve('src/styles')
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: resolve('/src'),
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        include: resolve('/src'),
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProd,
              importLoaders: 2, // 启用/禁用或设置在CSS加载程序之前应用的加载程序的数量
              modules: {
                context: resolve('/src'), // 允许为本地标识符名称重新定义基本的加载程序上下文。
                localIdentName: '[name]__[local]-[hash:base64:5]', // 使用 localIdentName 查询参数配置生成类名
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProd,
              config: {
                path: 'postcss.config.js'  // 这个得在项目根目录创建此文件
              }

            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: !isProd,
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(), //  webpack 3
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }
    }),
  ]
};

export { resolve };
