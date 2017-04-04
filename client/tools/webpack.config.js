const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.resolve(__dirname, '../src/view');
const BUILD_DIR = path.resolve(__dirname, '../build');

//Plugin to turn LESS into static styles.css, stored in output path specified in config
const extractLESS = new ExtractTextPlugin('styles.css');

var config = {
  resolve: {
    // Since our build tools and modules are in DashFit/tools and not DashFit (root dir),
    // add the directory to be resolved so WebPack finds it
    modules: [
      path.resolve(__dirname,'node_modules')
    ],
    extensions: ['.js', '.jsx'],
    alias: {
      
    }
  },
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      //JSX to JS
      {
        test: /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader',
        query: {
          // Presets have to be resolved since our node_modules is not at root
          presets: [
            'babel-preset-es2015',
            'babel-preset-react',
          ].map(require.resolve),
        }
      },
      //LESS to static CSS file
      {
          test: /\.less$/,
          use: extractLESS.extract(['css-loader','less-loader']),
      },
    ]
  },
  plugins: [
    extractLESS
  ]
}

module.exports = config;
