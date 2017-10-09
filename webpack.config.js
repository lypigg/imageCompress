var path = require('path')
const webpack = require('webpack')

const dist = path.resolve(__dirname, 'dist');
const src = path.resolve(__dirname, 'src');


module.exports = {
    entry: './src/index.js',
    output: {
        path: dist,
        publicPath: "test",
        filename: 'imageCompress.main.js',
        library: {
            root: "imageCompress",
            amd: "image-compress",
            commonjs: "image-compress"
        },
        libraryTarget: "umd"
    }
}