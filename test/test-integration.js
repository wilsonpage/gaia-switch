/* global marionette, setup, test */

'use strict';

var assert = require('chai').assert;
marionette.plugin('helper', require('marionette-helper'));

marionette('gaia-switch', function() {
  var client = marionette.client({
    profile: {
      prefs: {
        // Disable first time run UI
        'browser.feeds.showFirstRunUI': false,
        // Disable default browser check
        'browser.shell.checkDefaultBrowser': false,
        // Disable UI tutorial
        'browser.uitour.enabled': false,
        // Enable chrome debugging
        'devtools.chrome.enabled': true,
        'devtools.debugger.remote-enabled': true,

        // Load integration test page on startup
        'startup.homepage_welcome_url': __dirname + '/test-integration.html',

        // Enable web components
        'dom.webcomponents.enabled': true,
        // Enable touch events
        'dom.w3c_touch_events.enabled': 1
      }
    },
    desiredCapabilities: {
      raisesAccessibilityExceptions: true
    }
  });

  var switches = [{
    selector: '#switch-0',
    enabled: true,
    checked: false,
    checkedOnAction: [true, false]
  }, {
    selector: '#switch-1',
    enabled: true,
    checked: true,
    checkedOnAction: [false, true]
  }, {
    selector: '#switch-2',
    enabled: false,
    checked: false,
    checkedOnAction: [false, false]
  }, {
    selector: '#switch-3',
    enabled: false,
    checked: true,
    checkedOnAction: [true, true]
  }];

  function isChecked(subject) {
    return subject.scriptWith(function(element) {
      return element.hasAttribute('checked');
    });
  }

  setup(function() {
    switches.forEach(function(aSwitch) {
      aSwitch.element = client.helper.waitForElement(aSwitch.selector);
    });
  });

  test('gaia-switch is present and has a correct state', function() {
    switches.forEach(function(aSwitch) {
      assert.ok(aSwitch.element, aSwitch.selector);
      if (aSwitch.enabled) {
        // NOTE: selenium checks for isEnabled does not support custom elements
        // and will always return true.
        // See: https://code.google.com/p/selenium/source/browse/javascript/
        //              atoms/dom.js#324
        assert.equal(
          aSwitch.element.enabled(), aSwitch.enabled, aSwitch.selector);
      }
      assert.equal(
        isChecked(aSwitch.element), aSwitch.checked, aSwitch.selector);
    });
  });

  test('gaia-switch after user action', function() {
    ['click', 'tap'].forEach(function(action) {
      switches.forEach(function(aSwitch) {
        aSwitch.checkedOnAction.forEach(function(checked) {
          aSwitch.element[action]();
          assert.equal(isChecked(aSwitch.element), checked, aSwitch.selector);
        });
      });
    });
  });
});
