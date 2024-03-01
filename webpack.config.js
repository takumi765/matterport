const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { updateExpressionWithTypeArguments } = require('typescript');

module.exports = {
  // 開発用モード（本番用モード：production）
  mode: 'development',

  // バンドルするファイルを指定する
  entry: {
    app: './src/index.ts',
  },

  devtool: 'source-map',

  // import 文で .ts ファイルを解決するため
  // これを定義しないと import 文で拡張子を書く必要が生まれる。
  // フロントエンドの開発では拡張子を省略することが多いので、
  // 記載したほうがトラブルに巻き込まれにくい。
  resolve: {
    // 拡張子を配列で指定
    extensions: ['.js', '.ts']
  },

  plugins: [
    // 不要なファイルの消し忘れ、ファイル名が変わる場合、
    // ファイルの一部が不要になる場合があるため出力先をクリーンアップしファイルを出力する。
    new CleanWebpackPlugin(),
    
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'index.html',// 出力するhtmlのファイルの場所・ファイル名
      inject: true // css, jsを出力するように変更
    }),
    // 静的フォルダを出力先にコピーする（バンドルフォルダは必要だから出力先にコピーする）
    new CopyPlugin([
      { from: 'bundle', to: 'dist/bundle' },
    ]),
  ],

  // TSを読み込めるように設定
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader'
      },
    ]
  },
  
  // バンドルして[name].bundle.jsとして出力する
  output: {
    filename: '[name].bundle.js',// [name]は公式ドキュメントへ
    path: path.resolve(__dirname, 'dist'), // __dirnameはルートディレクトリ
  },

  // webpack-dev-serverを立ち上げたときのドキュメントルートを設定
  devServer: {
    port: 8000,
    open: true // プラウザを自動で立ち上げる
  }
};