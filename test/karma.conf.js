'use strict';
module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    browsers: ['firefox_latest'],
    client: {
      captureConsole: true,
      mocha: { 'ui': 'tdd' }
    },
    basePath: '../',

    customLaunchers: {
      firefox_latest: {
        base: 'FirefoxNightly',
        prefs: {
          'dom.webcomponents.enabled': true,
          'dom.w3c_touch_events.enabled': 1
        }
      }
    },

    files: [
      'bower_components/gaia-component/gaia-component.js',
      'bower_components/drag/drag.js',
      'gaia-switch.js',
      'test/test.js'
    ],

    proxies: {
      '/bower_components/': 'http://localhost:9876/base/bower_components/'
    }
  });
};
