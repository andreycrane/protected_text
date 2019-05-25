const path = require('path');
const baseConfig = require('./webpack.base.config');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  ...baseConfig,
  mode: 'production',
  entry: {
    index: './src/client/index.js',
    main_page: './src/client/components/MainPage',
    notes_page: './src/client/components/NotesPage',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      maxInitialRequests: 10,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'commons',
        },
        draft: {
          test: /[\\/]node_modules[\\/]draft-js/,
          priority: 10,
          chunks: 'all',
          name: 'draft',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)/,
          priority: 10,
          chunks: 'all',
          name: 'react',
        },
        material: {
          test: /[\\/]node_modules[\\/](@material-ui|jss)/,
          priority: 10,
          chunks: 'all',
          name: 'material',
        },
      },
    },
  },
  plugins: [
    ...baseConfig.plugins,
    //new BundleAnalyzerPlugin(),
  ],
};
