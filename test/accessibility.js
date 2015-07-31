/* jshint maxlen: 100 */
/*global sinon, suite, setup, teardown, test */
'use strict';
suite('gaia-switch', function() {

  /**
   * Utils
   */
  var touch = window['test-utils'].touch;
  var accessibility = window['test-utils'].accessibility;

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

  test('checked and unchecked switch is accessible', function(done) {
    accessibility.check(this.dom).then(() => {
      this.el.click();
      return accessibility.check(this.dom);
    }).then(() => {
      this.el.click();
      return accessibility.check(this.dom);
    }).then(done, done);
  });

  test('switch after attribute change is accessible', function(done) {
    accessibility.check(this.dom).then(() => {
      this.el.setAttribute('checked', '');
      return accessibility.check(this.dom);
    }).then(done, done);
  });

  test('swtich after drag is accessible', function(done) {
    var handle = this.el.els.handle;
    var pos = handle.getBoundingClientRect();

    touch(handle, 'touchstart', pos.x, pos.y);
    touch(handle, 'touchstart', pos.x, pos.y);
    touch(handle, 'touchmove', pos.x+=5, pos.y);
    touch(handle, 'touchmove', pos.x+=5, pos.y);
    touch(handle, 'touchmove', pos.x+=10, pos.y);
    touch(handle, 'touchend', pos.x, pos.y);

    accessibility.check(this.dom).then(done, done);
  });

  test('enabled and disabled switch is accessible', function(done) {
    accessibility.check(this.dom).then(() => {
      this.el.disabled = true;
      return accessibility.check(this.dom);
    }).then(() => {
      this.el.disabled = false;
      return accessibility.check(this.dom);
    }).then(() => {
      this.el.disabled = 'foo';
      return accessibility.check(this.dom);
    }).then(() => {
      this.el.setAttribute('disabled', true);
      return accessibility.check(this.dom);
    }).then(done, done);
  });
});
