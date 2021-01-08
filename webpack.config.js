'use strict';

const Path = require('path');
const Webpack = require('webpack');

module.exports = (options) => {
  const dest = Path.join(__dirname, 'dist');
  const port = 3000;
  const rootPath = Path.join(__dirname);
  
  let webpackConfig = {
    devtool: 'cheap-eval-source-map',
    entry: [
      './src/client.ts'
    ],
    mode: process.env.NODE_ENV,
    output: {
      library: 'BrowserSharing',
      libraryTarget: 'umd',
      filename: 'browser-sharing.js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              silent: false,
              transpileOnly: true,
            },
          },
        },
      ]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        '@': Path.join(rootPath, 'src'),
      },
    },
  };

  // webpackConfig.plugins.push(
  //   new Webpack.HotModuleReplacementPlugin()
  // );

  return webpackConfig;
};
