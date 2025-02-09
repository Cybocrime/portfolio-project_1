const { override, addBabelPreset, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addBabelPreset('@babel/preset-env'),
  addBabelPreset('@babel/preset-react'),

  // Ensure Babel processes JS and JSX files correctly
  addWebpackModuleRule({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        sourceType: 'module',
      },
    },
  })
);
