const path = require('path')

module.exports = {
  entry: './src/client/track.js',
  output: {
    filename: 'tab.js',
    path: path.resolve(__dirname, 'dist')
  }
}