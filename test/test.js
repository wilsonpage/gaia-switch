/* jshint maxlen: 100 */
/*global sinon, assert, suite, setup, teardown, test */
'use strict';
suite('gaia-switch', function() {

  /**
   * Utils
   */
  var touch = window['test-utils'].touch;
  var afterNext = window['test-utils'].afterNext;

  setup(function() {
    this.sinon = sinon.sandbox.create();
    this.dom = document.createElement('div');
    this.dom.innerHTML = '<gaia-switch></gaia-switch>';
    this.el = this.dom.firstElementChild;
    document.body.appendChild(this.dom);
  });

  teardown(function() {
    this.sinon.restore();
    document.body.removeChild(this.dom);
    this.dom = null;
  });

  test('It toggles `checked` when clicked', function() {
    this.el.click();
    assert.isTrue(this.el.hasAttribute('checked'));
    assert.isTrue(this.el.checked);

    this.el.click();
    assert.isFalse(this.el.hasAttribute('checked'));
    assert.isFalse(this.el.checked);
  });

  test('It toggles `aria-checked` when clicked (accessibility)', function() {
    this.el.click();
    assert.equal(this.el.getAttribute('aria-checked'), 'true');

    this.el.click();
    assert.equal(this.el.getAttribute('aria-checked'), 'false');
  });

  test('It should respond to attribute changes', function() {
    this.el.setAttribute('checked', '');
    assert.isTrue(this.el.checked);
  });

  test('It fires a `change` event when value changes', function(done) {
    this.el.addEventListener('change', () => done());
    this.el.checked = true;
  });

  test('It positions the handle on the left when unchecked and right when checked', function() {
    var elLeft = this.el.els.handle.getBoundingClientRect().left;
    var handleLeft = this.el.els.handle.getBoundingClientRect().left;

    assert.equal(elLeft, handleLeft);

    this.el.checked = true;

    var elRight = this.el.els.handle.getBoundingClientRect().right;
    var handleRight = this.el.els.handle.getBoundingClientRect().right;

    assert.equal(elRight, handleRight);
  });

  suite('rtl', function() {
    setup(function() {
      this.dir = document.dir;
    });

    teardown(function() {
      document.dir = this.dir;
    });

    test('It reverses handle position when in rtl mode', function(done) {
      var trackLeft = this.el.els.track.getBoundingClientRect().left;

      // Unchecked left in ltr
      var uncheckedLeftLtr = trackLeft - this.el.els.handle.getBoundingClientRect().left;

      // Get checked left ltr
      this.el.checked = true;
      var checkedLeftLtr = trackLeft - this.el.els.handle.getBoundingClientRect().left;

      // Change to rtl
      document.dir = 'rtl';

      afterNext(this.el, 'updatePosition').then(() => {
        var trackLeft = this.el.els.track.getBoundingClientRect().left;

        var checkedLeftRtl = trackLeft - this.el.els.handle.getBoundingClientRect().left;
        assert.equal(checkedLeftRtl, uncheckedLeftLtr, 'handle has switched sides');

        // Switch to unchecked
        this.el.checked = false;

        var uncheckedLeftRtl = trackLeft - this.el.els.handle.getBoundingClientRect().left;
        assert.equal(uncheckedLeftRtl, checkedLeftLtr, 'handle has switched sides');
      }).then(done, done);
    });
  });

  test('The switch can be dragged', function() {
    var handle = this.el.els.handle;
    var pos = handle.getBoundingClientRect();

    touch(handle, 'touchstart', pos.x, pos.y);
    touch(handle, 'touchstart', pos.x, pos.y);
    touch(handle, 'touchmove', pos.x+=5, pos.y);
    touch(handle, 'touchmove', pos.x+=5, pos.y);
    touch(handle, 'touchmove', pos.x+=10, pos.y);
    touch(handle, 'touchend', pos.x, pos.y);

    assert.isTrue(this.el.checked);
  });

  test('It doesn\'t register clicks if the switch is being dragged', function() {
    this.sinon.useFakeTimers();

    var handle = this.el.els.handle;
    var pos = handle.getBoundingClientRect();

    this.sinon.spy(this.el, 'toggle');

    // Simulate a drag

    touch(handle, 'touchstart', pos.x, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchmove', pos.x, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchmove', pos.x+=5, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchmove', pos.x+=5, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchmove', pos.x-=10, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchend', pos.x, pos.y);

    // Mock click on `touchend`

    this.el.click();

    sinon.assert.notCalled(this.el.toggle);
    assert.isFalse(this.el.checked);
  });

  test('It snaps to closest edge on touchend', function() {
    this.sinon.useFakeTimers();

    var handle = this.el.els.handle;
    var pos = handle.getBoundingClientRect();

    // Ending drag before the halfway point snaps back

    touch(handle, 'touchstart', pos.x, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchmove', pos.x+=9, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchmove', pos.x, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchend', pos.x, pos.y);

    assert.isFalse(this.el.checked);

    // Ending drag past the halfway point snaps forward

    touch(handle, 'touchstart', pos.x, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchmove', pos.x+=5, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchmove', pos.x+=10, pos.y);
    this.sinon.clock.tick(50);
    touch(handle, 'touchend', pos.x, pos.y);

    assert.isTrue(this.el.checked);
  });

  test('It can be disabled via attribute or property', function() {
    this.el.disabled = true;
    assert.equal(this.el.getAttribute('disabled'), '');

    this.el.disabled = false;
    assert.equal(this.el.getAttribute('disabled'), null);

    this.el.disabled = 'foo';
    assert.equal(this.el.getAttribute('disabled'), '');

    this.el.setAttribute('disabled', true);
    assert.equal(this.el.getAttribute('disabled'), 'true');
    assert.equal(this.el.disabled, true);
  });

  test('It can be aria-disabled via attribute or property', function() {
    this.el.disabled = true;
    assert.equal(this.el.getAttribute('aria-disabled'), 'true');

    this.el.disabled = false;
    assert.isFalse(this.el.hasAttribute('aria-disabled'));

    this.el.disabled = 'foo';
    assert.isTrue(this.el.hasAttribute('aria-disabled'));

    this.el.setAttribute('disabled', true);
    assert.equal(this.el.getAttribute('aria-disabled'), 'true');
  });

  test('It applies the initial `disabled` value on creation', function() {
    this.dom.innerHTML = '<gaia-switch disabled></gaia-switch>';
    var el = this.dom.firstElementChild;
    assert.equal(el.disabled, true);
  });

  test('It applies the initial aria value on creation (accessibility)', function() {
    this.sinon.useFakeTimers();
    this.dom.innerHTML = '<gaia-switch disabled></gaia-switch>';
    this.sinon.clock.tick(50);
    var el = this.dom.firstElementChild;

    assert.equal(el.getAttribute('role'), 'switch');
    assert.equal(el.getAttribute('aria-disabled'), 'true');
    assert.equal(el.getAttribute('aria-checked'), 'false');

    this.dom.innerHTML = '<gaia-switch></gaia-switch>';
    this.sinon.clock.tick(50);
    el = this.dom.firstElementChild;

    assert.equal(el.getAttribute('role'), 'switch');
    assert.isFalse(el.hasAttribute('aria-disabled'));
    assert.equal(el.getAttribute('aria-checked'), 'false');
  });

  test('It ignores clicks when disabled', function() {
    this.sinon.spy(this.el, 'toggle');
    this.el.disabled = true;
    this.el.click();

    sinon.assert.notCalled(this.el.toggle);
  });
});
