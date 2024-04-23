module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['@babel/preset-env']
    },
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  globals: {
    $: true,
    jQuery: true,
    Plugin: true,
    __webpack_require__: true,
    gsap: true,
    ScrollTrigger: true, 
    Panzoom: true,
    moment: true,
    Handlebars: true,
  }
}
