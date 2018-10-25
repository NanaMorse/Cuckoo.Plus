const webpack = require('webpack')
const path = require('path')
const yargs = require('yargs')
const fs = require('fs')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

let { env } = yargs.argv
if (!env) env = 'develop'
const isEnvProduction = env === 'production'

const plugins = [
  new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(env)
  }),
]

if (isEnvProduction) {
  // 删除source-map数据 / remove source map data
  fs.unlink(path.join(__dirname, './public/dist/bundle.js.map'), (err) => {})
} else {
  plugins.push(new BundleAnalyzerPlugin())
}

module.exports = {

  devServer: {
    contentBase: path.join(__dirname, '/public'),
    publicPath: '/dist/',
    compress: true,
    port: 3000,
    host: "0.0.0.0",
    watchContentBase: true,
    disableHostCheck: true
  },

  entry: './src/index.ts',

  devtool: isEnvProduction ? '' : '#source-map',

  output: {
    libraryExport: 'default',
    path: path.resolve(__dirname, 'public/dist/'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            'i18n': '@kazupon/vue-i18n-loader'
          },
          esModule: true
        }
      },


      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      },

      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader'
        ]
      },

      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '../assets/images/[name].[ext]'
        }
      },

      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: '../assets/fonts/[name].[ext]'
        }
      },

      {
        test: /\.css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }]
      },

      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "less-loader"
        }]
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js', '.vue'],

    alias: {
      '@': path.join(__dirname, '/src')
    }
  },

  externals: {
    'moment': 'moment'
    // todo muse ui has bug
  },

  plugins: plugins
};
