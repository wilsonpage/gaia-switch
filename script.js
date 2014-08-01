(function(define){define(function(require,exports,module){
'use strict';

/**
 * Dependencies
 */

var Drag = require('drag');

/**
 * Locals
 */

// Extend from the HTMLElement prototype
var proto = Object.create(HTMLElement.prototype);
var baseComponents = window.COMPONENTS_BASE_URL || 'bower_components/';
var base = window.GAIA_SWITCH_BASE_URL || baseComponents + 'gaia-switch/';

/**
 * Attributes supported
 * by this component.
 *
 * @type {Object}
 */
proto.attrs = {
  checked: true
};

proto.createdCallback = function() {
  var tmpl = template.content.cloneNode(true);
  var shadow = this.createShadowRoot();

  this.els = {};
  this.els.inner = this._template.firstElementChild;
  this.els.track = this._template.querySelector('.js-track');
  this.els.handle = this._template.querySelector('.js-handle');

  this.checked = this.hasAttribute('checked');

  this.drag = new Drag({
    handle: this.els.handle,
    container: this.els.track
  });

  shadow.appendChild(tmpl);
  this.styleHack();

  this.addEventListener('styled', this.drag.updateDimensions);
};

/**
 * Load in the the component's styles.
 *
 * We're working around a few platform bugs
 * here related to @import in the shadow-dom
 * stylesheet. When HTML-Imports are ready
 * we won't have to use @import anymore.
 *
 * @private
 */
proto.styleHack = function() {
  var style = document.createElement('style');
  var self = this;

  this.style.visibility = 'hidden';
  style.innerHTML = '@import url(' + base + 'style.css);';
  style.setAttribute('scoped', '');
  this.classList.add('content');
  this.appendChild(style);

  // There are platform issues around using
  // @import inside shadow root. Ensuring the
  // stylesheet has loaded before putting it in
  // the shadow root seems to work around this.
  style.addEventListener('load', function() {
    self.shadowRoot.appendChild(style.cloneNode(true));
    self.style.visibility = '';
    self.styled = true;
    self.dispatchEvent(new CustomEvent('styled'));
  });
};

proto.toggle = function(value) {
  this.checked = !arguments.length ? !this.hasAttribute('checked') : value;
};

proto.setChecked = function(value) {
  value = !!value;

  if (this._checked === value) { return; }

  var changed = this._checked !== undefined;
  this._checked = value;

  if (value) {
    this.setAttribute('checked', '');
    this.els.inner.setAttribute('checked', '');
  } else {
    this.removeAttribute('checked');
    this.els.inner.removeAttribute('checked');
  }

  if (changed) {
    var event = new CustomEvent('change');
    setTimeout(this.dispatchEvent.bind(this, event));
  }
};

proto.attributeChangedCallback = function(attr, oldVal, newVal) {
  if (attr === 'checked') {
    this.checked = newVal !== null;
  }
};

proto.onClick = function(e) {
  this.checked = !this.checked;

  // Dispatch a click event to any listeners to the app.
  // We should be able to remove this when bug 887541 lands.
  this.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
};

/**
 * Proxy the checked property to the input element.
 */
Object.defineProperty(proto, 'checked', {
  get: function() { return this._checked; },
  set: function(value) { this.setChecked(value); }
});

// HACK: Create a <template> in memory at runtime.
// When the custom-element is created we clone
// this template and inject into the shadow-root.
// Prior to this we would have had to copy/paste
// the template into the <head> of every app that
// wanted to use <gaia-switch>, this would make
// markup changes complicated, and could lead to
// things getting out of sync. This is a short-term
// hack until we can import entire custom-elements
// using HTML Imports (bug 877072).
var template = document.createElement('template');
template.innerHTML = '<button class="inner">' +
    '<div class="track"></div>' +
    '<div class="handle">' +
      '<div class="handle-head"></div>' +
    '</div>' +
  '</button>';

// Register and return the constructor
return document.registerElement('gaia-switch', { prototype: proto });

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('gaia-switch',this));