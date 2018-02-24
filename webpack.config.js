const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const _ = require('lodash');

const production = process.env.NODE_ENV === 'production';

const config = {
    output: {
        path: path.resolve(__dirname, "web"),
        publicPath: '/'
    },
    module: {
        rules: []
    },
    stats: {
        colors: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new ExtractTextPlugin('css/app.css')
    ],
    devtool: "cheap-module-source-map"
};

if(production){
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1,
            moveToParents: true
        })
    );
    config.devtool = undefined;
}

loaderOptions = production ? {
    sourceMap: false,
    minimize: true
} : {
    sourceMap: true,
    minimize: false
};

const jsConfig = _.cloneDeep(config);
jsConfig.entry = './src/js/app.js';
jsConfig.output.filename = 'js/app.js';
jsConfig.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
        'babel-loader'
    ]
},{
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{ loader: 'css-loader', options: loaderOptions }]
    })
});

const js2Config = _.cloneDeep(config);
js2Config.entry = './src/js/sw.js';
js2Config.output.filename = 'sw.js';
js2Config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
        'babel-loader'
    ]
},{
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{ loader: 'css-loader', options: loaderOptions }]
    })
});

const cssConfig = _.cloneDeep(config);
cssConfig.entry = './src/scss/app.scss';
cssConfig.output.filename = 'css/app.css';
cssConfig.module.rules.push({
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            {loader: 'css-loader', options: loaderOptions},
            {loader: 'sass-loader', options: loaderOptions}
        ]
    })
});

module.exports = [jsConfig, js2Config, cssConfig];
