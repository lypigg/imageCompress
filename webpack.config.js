var path = require('path')
const webpack = require('webpack')

const dist = path.resolve(__dirname, 'dist');
const src = path.resolve(__dirname, 'src');


module.exports = {
    entry: {
        "imageCompress.main": './src/index.js'
    },
    output: {
        path: dist,
        filename: '[name].js',
        library: {
            root: "htmlImageCompress",
            amd: "html-image-compress",
            commonjs: "html-image-compress"
        },
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
}