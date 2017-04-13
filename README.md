## 如何写 Webpack 配置文件

本文从一个小Demo开始，通过不断增加功能来说明webpack的基本配置，只针对新手，也欢迎指正错误。

### Base
我们先从简单的Demo开始，首先我创建了一个项目目录`webpack`，在该目录下运行命令：
```bash
npm init
npm install webpack html-loader style-loader css-loader --save-dev
```
安装完成后我的`package.json`是这样子的：
```json
{
  "name": "webpack-example",
  "version": "1.0.0",
  "description": "A webpack example",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "webpack"
  ],
  "author": "xiao555",
  "license": "MIT",
  "devDependencies": {
    "css-loader": "^0.28.0",
    "html-loader": "^0.4.5",
    "webpack": "^2.3.3"
  }
}
```
然后我在根目录下创建了`index.html`，`style.css`，`entry.js`，`webpack.config.js`:
```html
// index.html
<!DOCTYPE html>
<html>
<head>
  <title>Hello Webpack</title>
  <link rel="stylesheet" type="text/css" href="./style.css">
</head>
<body>
  <h1>Hello Webpack!</h1>
  <script src="/bundle.js"></script>
</body>
</html>
```
```css
// style.css
h1 {
  color: lightblue;
}
```
```javascript
// entry.js
require('./style.css')
```
```javascript
// webpack.config.js
let webpack = require('webpack')

module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}
```
然后修改一下`package.json`的scripts:
```javascript
"scripts": { 
    "start": "webpack --config webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
好了，这样一个简单的Demo就完成了，让我们看一下效果：
```bash
➜  webpack npm start

> webpack-example@1.0.0 start /Users/zhangruiwu/Desktop/webpack
> webpack --config webpack.config.js

Hash: f9e8a168c2845147afb4
Version: webpack 2.3.3
Time: 384ms
    Asset     Size  Chunks             Chunk Names
bundle.js  73.1 kB       0  [emitted]  main
   [0] ./style.css 895 bytes {0} [built]
   [1] ./entry.js 22 bytes {0} [built]
   [2] ./~/base64-js/index.js 3.48 kB {0} [built]
   [3] ./~/buffer/index.js 48.6 kB {0} [built]
   [4] ./~/css-loader!./style.css 190 bytes {0} [built]
   [5] ./~/css-loader/lib/css-base.js 2.19 kB {0} [built]
   [6] ./~/ieee754/index.js 2.05 kB {0} [built]
   [7] ./~/isarray/index.js 132 bytes {0} [built]
   [8] ./~/style-loader/addStyles.js 8.51 kB {0} [built]
   [9] ./~/style-loader/fixUrls.js 3.01 kB {0} [built]
  [10] (webpack)/buildin/global.js 509 bytes {0} [built]
```
可以看到目录里生成了一个`bundle.js`，这就是webpack打包后的文件，我们在浏览器里打开`index.html`:
![](http://ojxrgrrxt.bkt.clouddn.com/hello_webpack.jpg)
OK, 可以看到我们的css已经渲染上去了。
我们的webpack配置文件做了什么呢？
```javascript
// webpack.config.js
let webpack = require('webpack')

module.exports = {
  entry: './entry.js', // 入口文件，根据这个文件来决定打包哪些文件
  output: {
    path: __dirname,   // 打包后文件存放的路径
    filename: 'bundle.js' // 打包后文件的名称
  },
  module: { // 决定不同类型的模块如何处理
    rules: [ // 决定了模块创建规则，
      {
        test: /\.css$/, // 匹配文件类型
        loader: 'style-loader!css-loader' // 应用加载器，'-loader'可以省略
      }
    ]
  }
}
```
### Loader
好了，让我们改一下，我再目录里加了一张图片`bg.jpg`,修改了`style.css` ：
```css
h1 {
  color: lightblue;
}

body {
  background-image: url('./bg.jpg');
}
```
`npm start` 一下： 
```bash
ERROR in ./bg.jpg
Module parse failed: /Users/zhangruiwu/Desktop/webpack/bg.jpg Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type.
(Source code omitted for this binary file)
 @ ./~/css-loader!./style.css 6:94-113
 @ ./style.css
 @ ./entry.js
```
报错了，这个错误是什么呢？因为我们引入了一个jpg图片文件，要打包的话需要一个处理这种文件类型的loader：
```javascript
// bash
npm i url-loader --save-dev
// webpack.config.js
module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader' // copy文件的loader
      }
    ]
  }
```
重新`npm start`，发现根目录下多了一个`f58125a1fa5c143130104dc5fa9af77b.jpg`, 浏览器打开`index.html`:
![](http://ojxrgrrxt.bkt.clouddn.com/webpack_bg.jpg)

OK! 

### 我们改造一下： 
1. css用stylus
2. css,img等资源放在`/src`目录下
3. 打包后图片文件放在`/dist/static`目录下
4. 打包文件统一放在一个目录下`/dist`
```bash
npm i stylus stylus-loader html-webpack-plugin --save-dev
```
调整目录结构：
```
- webpack
  - src
    - assets
      - img
        - bg.jpg
    - style
      - main.styl
      - entry.js
  - index.html
  - webpack.config.js
  - package.json 
```
```
// index.html
<!DOCTYPE html>
<html>
<head>
  <title>Hello Webpack</title>
</head>
<body>
  <h1>Hello Webpack!</h1>
</body>
</html>
```
```stylus
// main.styl
h1
  color lightblue
body
  background-image url('~assets/image/bg.jpg')
```
```javascript
// entry.js
import './main.styl'
```
```javascript
// webpack.config.js
let webpack = require('webpack')
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    style: './src/style/entry.js' // 新的入口文件
  },
  output: {
    path: path.join(__dirname, './dist'), // 新的打包目录
    filename: '[name].js' // 这里的name对应entry的key值，这里是style，如果增加一个入口文件scrit的话，同样生成一个script.js
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?sourceMap'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader?name=static/[hash].[ext]' // '?'后跟loader的配置参数，这里name指文件名，static目录下
      },
      { 
        test: /\.styl$/,  // 增加stylus文件的loader
        loader: "style-loader!css-loader!stylus-loader?sourceMap" // 可以通过'!'来级联loader
      }
    ]
  },
  resolve: {
    alias: {
      'assets': path.join(__dirname, './src/assets') // 定义别名，用法见main.styl 里 background-image url('~assets/image/bg.jpg')
    }
  },
  plugins: [
    // 这个插件用来处理html文件，https://github.com/jantimon/html-webpack-plugin , 这里的作业是吧index.html打包到dist目录下
    new HtmlWebpackPlugin({ 
      filename: 'index.html',
      template: 'index.html'
    })
  ]
}
```
`npm start` 之后生成的目录结构：
```
- dist
  - static
    - f58125a1fa5c143130104dc5fa9af77b.jpg
  - index.html
  - style.js 
```
浏览器访问这个目录下的`index.html`，没有问题，为什么要把html搞到`dist`目录下呢？  可以F12看看body背景图片的url，是相对与打包目录`dist`的，也就是说这里访问的根目录是打包目录，我们的html也要放进去。

###  让我们继续改造：
#### 1. 引入第三方css
以FontAwesome为例：
```path
npm install font-awesome --save
```
```javascript
module: {
    rules: [
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
        // FontAwesome 需要加载字体文件，(\?.*) 处理带版本号的文件
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
```
#### 2. 多html文件
`html-webpack-plugin` 这个插件处理多html文件，就是多new几次，也可以通过数组ForEach的方法：
```javascript
let config = {
  entry: {
    style: './src/style/entry.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
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
  plugins: []
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
```
### 3. 某些文件单独打包
以jquery为例：
```bash
npm i file-loader --save-dev
npm i jquery --save
```
```
- src
  - script
    - entry.js

// entry.js
import 'copy!jquery/dist/jquery.min.js'
```
```javascript
// webpack.config.js
entry: {
  style: './src/style/entry.js',
  script: './src/script/entry.js' // 新增入口文件
},
...
resolveLoader: { // 处理loader
  alias: {
    'copy': 'file-loader?name=[name].[ext]', //&context=./src
  }
},
```
`npm start` 后会发现`/dist` 目录下`jquery.min.js`已经单独打包出来了
#### 4. 热加载
以BrowserSync为例：
```bash
npm i browser-sync browser-sync-webpack-plugin --save-dev
```
```javascript
let BrowserSyncPlugin   = require('browser-sync-webpack-plugin')

let config = {
 watch: true,
 plugins: [
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
```
会自动打开浏览器访问`http://localhost:4000/`, 修改被打包的文件会自动刷新
#### 5. 配置stylus和babel
```bash
npm i autoprefixer nib poststylus babel-core babel-loader babel-plugin-transform-runtime babel-preset-es2015 --save-dev
```
```stylus
// ./src/style/variables.styl
blue = #0073aa
```
```stylus
// ./src/style/main.styl
h1
  color blue
```
```javascript
let poststylus = require('poststylus')
...
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
    ...
  ]
```
`autoprefixer`是个自动添加前缀的插件，`nib`是一个不错的css库，`variables.styl`可以作为stylus的全局变量加载，babel不用说，可以写es6的代码。

### 总结

感觉把以上说的走一遍，webpack基本的配置就可以熟悉了，会引入loader，配置loader选项，会设置alias，会用plugins差不多。至于现在一些比较大的项目中分多个配置文件，是根据不同的场景拆分开的，基本的一个`webpack.base.config.js`,主要包含`loader`，`resolve`等全局通用的部分，剩下的根据开发或者生产环境分成`webpack.dev.config.js`，`webpack.prod.config.js`，除了都会合并base的内容，其他可能跟去环境不一样像`output`， `plugins`也都有所不同。
loader和plugins的配置可以看官方文档，我没用详细说。
