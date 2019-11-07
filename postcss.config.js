const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');

module.exports = () => ({
  plugins: [
    autoprefixer(),
    postcssReporter({
      clearReportedMessages: true, // 插件将在记录结果消息后清除它们。这样可以防止其他插件或您使用的任何运行程序再次记录相同的信息并引起混乱。
      throwError: true // 在插件记录您的消息后，如果发现任何警告，它将引发错误。
    })
  ]
});
