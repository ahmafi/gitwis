import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const webpackConfig = {
  target: 'browserslist',
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.gql$/,
        exclude: /node_modules/,
        use: [
          {
            loader: '@graphql-tools/webpack-loader',
            options: {
              esModules: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: 'index.[contenthash].js',
    path: path.join(dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.template.html',
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  devServer: {
    hot: true,
    port: 8080,
    proxy: {
      '/graphql': 'http://localhost:8000/graphql',
    },
  },
};

export default webpackConfig;
