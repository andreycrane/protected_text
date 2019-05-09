const { webpackApp } = require('./src/server/application');
const baseConfig = require('./webpack.base.config');

module.exports = {
  ...baseConfig,
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    before(app) {
      const { app: serverApp } = webpackApp();
      app.use(serverApp);
    },
  },
};
