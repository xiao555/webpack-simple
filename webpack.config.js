let webpack = require('webpack')
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let BrowserSyncPlugin = require('browser-sync-webpack-plugin')
let poststylus = require('poststylus')

let config = {
  watch: true,
  entry: {
    style: './src/style/entry.js',
    script: './src/script/entry.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?sourceMap'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader?name=static/[hash].[ext]'
      },
      { 
        test: /\.styl$/, 
        loader: "style-loader!css-loader!stylus-loader?sourceMap"
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'assets': path.join(__dirname, './src/assets')
    }
  },
  resolveLoader: {
    alias: {
      'copy': 'file-loader?name=[name].[ext]', //&context=./src
    }
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      // test: /\.xxx$/, // may apply this only for some modules
      options: {
        stylus: {
          use: [
            poststylus([ 'autoprefixer' ]),
          ],
          import: [
            '~nib/index.styl',
            path.join(__dirname, 'src/style/variables.styl')
          ]
        },
        babel: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    }),
    new BrowserSyncPlugin(
      // BrowserSync options 
      {
        // browse to http://localhost:3000/ during development 
        host: 'localhost',
        port: 4000,
        // proxy the Webpack Dev Server endpoint 
        // (which should be serving on http://localhost:3100/) 
        // through BrowserSync 
        // proxy: 'http://localhost:3100/'
        server: { 
          baseDir: ['dist'],
          directory: true  // with directory listing
        }
      },
      // plugin options 
      {
        // prevent BrowserSync from reloading the page 
        // and let Webpack Dev Server take care of this 
        reload: true
      }
    )
  ]
}
const array = ['index', 'test']
array.forEach((file) => {
  const conf = {
    filename: `${file}.html`,
    template: `${file}.html`
  }
  config.plugins.push(new HtmlWebpackPlugin(conf))
})

module.exports = config