(() => {
  module.exports = {
    basePath: './',
    quiet: false,
    frameworks: ['mocha', 'chai'],
    reporters: ['progress'],
    colors: true,
    logLevel: 'INFO',
    autoWatch: false,
    singleRun: true,
    port: 9876,
    preprocessors: {
      'tests/**/*.js': ['babel'],
      'src/**/*.js': ['babel'],
    },
    babelPreprocessor: {
      options: { presets: ['@babel/preset-env'], sourceMap: 'inline' },
      filename: file => file.originalPath.replace(/\.js$/, '.es5.js'),
      sourceFileName: file => file.originalPath,
    },
    browsers: ['PhantomJS'],
    plugins: [
      'karma-mocha', 'karma-chai',
      'karma-phantomjs-launcher',
      'karma-babel-preprocessor',
    ],
    files: [],
  };
})();
