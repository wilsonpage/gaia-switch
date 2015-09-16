/* global marionette, suite, setup, test */

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
  }, {
    selector: '#switch-4',
    enabled: true,
    checked: true
  }, {
    selector: '#switch-5',
    enabled: true,
    checked: false
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

  test('gaia-switch becomes checked/unchecked when tapped or clicked',
    function() {
      ['click', 'tap'].forEach(function(action) {
        switches.forEach(function(aSwitch) {
          if (!aSwitch.checkedOnAction) {
            return;
          }
          aSwitch.checkedOnAction.forEach(function(checked) {
            if (aSwitch.enabled) {
              aSwitch.element[action]();
              assert.equal(isChecked(aSwitch.element), checked,
                aSwitch.selector);
            } else {
              try {
                aSwitch.element[action]();
              } catch (err) {
                // NOTE: selenium checks for isEnabled does not support custom
                // elements and will always return true. Although from a11y
                // standpoint it is disabled.
                // See: https://code.google.com/p/selenium/source/browse/
                //              javascript/atoms/dom.js#324
                assert.equal(err.type, 'ElementNotAccessibleError');
              }
            }
          });
        });
      });
    });

  suite('gaia-switches that are not fully accessible', function() {
    test('clicking/tapping on gaia-switch that has no label throws an error',
      function() {
        try {
          switches[4].element.click();
        } catch (err) {
          // If gaia-switch does not have an accessible name that comes from,
          // for example, an aria-label or a label element clicking/tapping on
          // it will raise an ElementNotAccessibleError exception when
          // raisesAccessibilityExceptions is set to true.
          assert.equal(err.type, 'ElementNotAccessibleError');
          assert.isTrue(
            err.message.indexOf('Element is missing an accesible name') > -1);
        }
      });
  });
});
