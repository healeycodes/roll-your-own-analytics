const path = require('path')

module.exports = {
  entry: './src/tracker/track.js',
  output: {
    filename: 'track.js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /'node_modules'/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ["env"]
          }
        }]
      }
    ]
  }
}