const createApp = require('./src/server/application');
const baseConfig = require('./webpack.base.config');

module.exports = {
  ...baseConfig,
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    before(app) {
      const { app: serverApp } = createApp(
        {
          connectionParams: [
            { store: new Map() },
          ],
        },
      );
      app.use(serverApp);
    },
  },
};
