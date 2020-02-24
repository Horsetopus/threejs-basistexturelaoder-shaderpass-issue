
const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {

    resolve: {

        extensions: [ '.ts', '.js', '.shader' ]
    },

    module: {

        rules: [

            {
                test: /\.ts$/,
                exclude: [ /node_modules/ ],
                use: {

                    loader: 'awesome-typescript-loader',

                    options: {

                        useCache: true,
                        useBabel: true,
                        babelCore: '@babel/core'
                    }
                }
            },

            {
                test: /\.shader$/,
                loader: 'raw-loader'
            }
        ]
    },

    entry: {
        index:[
            '@babel/polyfill',
            './src/index.ts'
        ]
    },

    output: {

        path: path.resolve( __dirname, 'build' ),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
    },

    devServer: {

        contentBase: path.join( __dirname, 'build' ),
        headers: { 'Access-Control-Allow-Origin': '*' }
    }
};