'use strict';
module.exports = function(config) {
  config.set({
    basePath: '..',
    browsers: ['firefox_latest'],
    frameworks: [
      'mocha',
      'sinon-chai'
    ],

    client: {
      captureConsole: true,
      mocha: { 'ui': 'tdd' }
    },

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
      'node_modules/fxos-component/fxos-component.js',
      'fxos-switch.js',
      'node_modules/axe-core/axe.min.js',
      'node_modules/test-utils/src/utils.js',
      'node_modules/test-utils/src/accessibility.js',
      'test/test-unit.js'
    ]
  });
};
