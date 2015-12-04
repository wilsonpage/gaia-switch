module.exports = {
  entry: './src/fxos-switch.js',
  output: {
    filename: 'fxos-switch.js',
    library: 'FXOSSwitch',
    libraryTarget: 'umd'
  },

  externals: {
    "fxos-component": "fxosComponent"
  }
}
