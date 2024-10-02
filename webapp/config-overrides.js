const path = require('path');
const webpack = require('webpack');
const LimitChunkCountPlugin = require('webpack/lib/optimize/LimitChunkCountPlugin');

module.exports = function override(config, env) {
  var appTarget = process.env.APP_TARGET || 'dev';
  let defaultConfig = { ...config };
  defaultConfig.plugins[5].options.filename = 'css/[name].css';
  const customConfig = {
    resolve: {
      alias: {
        '@Assets': path.resolve(__dirname, 'src/assets'),
        '@Components': path.resolve(__dirname, 'src/components'),
        '@Constants': path.resolve(__dirname, 'src/constants'),
        '@Containers': path.resolve(__dirname, 'src/containers'),
        '@Helper': path.resolve(__dirname, 'src/helper'),
        '@Network': path.resolve(__dirname, 'src/network'),
        '@Styles': path.resolve(__dirname, 'src/styles'),
        '@Store': path.resolve(__dirname, 'src/store')
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    output: {
      ...defaultConfig.output,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].chunk.js',
      path: path.resolve(__dirname, 'build')
    },
    optimization: {
      ...defaultConfig.optimization,
      splitChunks: {
        chunks: 'all',
        name: false,
        cacheGroups: {
          default: false
        }
      },
      runtimeChunk: false
    },
    plugins: [
      ...defaultConfig.plugins,
      new LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new webpack.NormalModuleReplacementPlugin(
        /(.*)-APP_TARGET(\.*)/,
        function (resource) {
          resource.request = resource.request.replace(
            /-APP_TARGET/,
            `-${appTarget}`
          );
        }
      )
    ]
  };
  return { ...defaultConfig, ...customConfig };
};
