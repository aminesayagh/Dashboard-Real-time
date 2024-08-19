// webpack.config.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    entry: './src/main.ts',
    target: 'node',
    externals: [nodeExternals({
      allowlist: [/@rtd\/shared-ts/],
    })],
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
      extensions: ['.tsx', '.ts', '.js', '.mjs', '.d.ts'],
      alias: {
        '@ts-shared': path.resolve(__dirname, '../../libs/shared-ts/dist'),
      },
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'module', 
      chunkFormat: 'module', 
    },
    experiments: {
      outputModule: true,
    },
    plugins: [new CleanWebpackPlugin()],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
  };
};
