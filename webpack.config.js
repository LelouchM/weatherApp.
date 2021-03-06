const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    context: __dirname + '/src',
    entry: 'index.js',
    output: {
        publicPath: 'http://localhost:3000/',
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    watch: NODE_ENV == 'development',
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : false,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('bundle.css'),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        })
    ],
    resolve: {
        modules: [__dirname + '/src',
         'node_modules'
        ]
    },
    resolveLoader: {
        moduleExtensions: ["-loader"]
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        contentBase: path.join(__dirname, '/public'),

        inline: true,
        hot: true,
        historyApiFallback: true
    },
    module: {
        rules: [{
            test: /\.(css|scss)$/,
            use: ExtractTextPlugin.extract({
              fallback:'style-loader',
              use:'css-loader?minimize=true!sass-loader?resolve url'
            }),
            include: /src/
          },
          {
            test: /\.js$/,
            use: ['react-hot', 'babel-loader'],
            include: /src/
          },
          {
            test: /\.(png|jpg|svg|gif)$/,
            use: 'file?name=img/[path][name].[ext]'
          },
          {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            use: 'url?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'
          },
          {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            use: 'url?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'
          },
          {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            use: 'url?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]'
          },
          {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            use: 'file?name=fonts/[name].[ext]'
          },
          {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: 'url?limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]'
          }
        ]
    }
};


if (NODE_ENV == 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}
