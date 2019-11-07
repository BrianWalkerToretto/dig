//webpack.config.js
require('@babel/register')({
  presets: ['@babel/preset-env'],
  ignore: [/node_modules/],
  extensions: ['.es6', '.es', '.jsx', '.js', '.json'],
});

module.exports = () => {
  if (process.env.NODE_ENV === 'production') {
    return require('./webpack/prod.config.js');
  } else {
    return require('./webpack/dev.config.js');
  }
};
