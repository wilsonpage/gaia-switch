
suite('GaiaRadio', function() {
  setup(function() {
    this.sandbox = sinon.sandbox.create();
    this.container = document.createElement('div');
    this.container.innerHTML = '<gaia-switch></gaia-switch>';
    this.switch = this.container.firstElementChild;
    document.body.appendChild(this.container);
  });

  teardown(function() {
    this.sandbox.restore();
    document.body.removeChild(this.container);
    this.container = null;
  });

  test('It toggles `checked` when clicked', function() {
    this.switch.inner.click();
    assert.isTrue(this.switch.hasAttribute('checked'));
    assert.isTrue(this.switch.checked);
    this.switch.inner.click();
    assert.isFalse(this.switch.hasAttribute('checked'));
    assert.isFalse(this.switch.checked);
  });

  test('It should respond to attribute changes', function() {
    this.switch.setAttribute('checked', '');
    assert.isTrue(this.switch.checked);
  });
});
