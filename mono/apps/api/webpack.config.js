// webpack.config.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    entry: './src/main.ts',
    target: 'node',
    externals: [nodeExternals()],
    mode: isProduction ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@shared': path.resolve(__dirname, '../shared/src'),
      },
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new CleanWebpackPlugin()],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
  };
};
