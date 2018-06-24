const path = require('path')

module.exports = {
  entry: './src/tracker/track.js',
  output: {
    filename: 'track.js',
    path: path.resolve(__dirname, './dist')
  }
}