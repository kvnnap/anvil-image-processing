import * as path from 'path';
import * as webpack from 'webpack';
//import 'webpack-dev-server';
import * as  HtmlWebpackPlugin  from 'html-webpack-plugin'
import * as  MiniCssExtractPlugin   from 'mini-css-extract-plugin'

const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const useCdn = true;

const config: webpack.Configuration = {
  entry: './src/index.tsx',
  output: {
    clean: true,
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: path.resolve(__dirname, './src/favicon.ico'),
        templateParameters: {
          useCdn: useCdn,
          isProduction: isProduction
        }
    })
  ],
  module: {
    rules: [
        {
            test: /\.(ts|tsx)$/i,
            loader: 'ts-loader'
        },
        {
          test: /\.css$/i,
          use: [stylesHandler, "css-loader"],
        }
        ,
        {
            test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|csv)$/i,
            type: 'asset'
        }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
};

if (useCdn)
{
  config.externals = {
    'react': 'React',
    'react-dom': 'ReactDOM'
  };
}

if (isProduction)
{
    config.mode = 'production';
    config.plugins?.push(new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css"
    }));

} else 
{
    config.mode = 'development';
}

export default config;