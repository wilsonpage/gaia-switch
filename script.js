(function(define){define(function(require,exports,module){
'use strict';

var utils = require('gaia-component-utils');
var Drag = require('drag');

// Extend from the HTMLElement prototype
var proto = Object.create(HTMLElement.prototype);

// Allow baseurl to be overridden (used for demo page)
var packagesBaseUrl = window.packagesBaseUrl || '/bower_components/';
var baseUrl = window.GaiaSwitchBaseUrl || packagesBaseUrl + 'gaia-switch/';

var stylesheets = [
  { url: packagesBaseUrl + 'gaia-icons/style.css' },
  { url: baseUrl + 'style.css', scoped: true }
];

proto.createdCallback = function() {
  var shadow = this.createShadowRoot();
  var self = this;

  this._template = template.content.cloneNode(true);

  this.els = {};
  this.els.inner = this._template.firstElementChild;
  this.els.track = this._template.querySelector('.js-track');
  this.els.handle = this._template.querySelector('.js-handle');

  // this.els.handle.addEventListener('click', this.onClick.bind(this));
  this.els.inner.addEventListener('mousemove', function(e) {
    e.stopPropagation();
    var event = new CustomEvent('mousemove', { bubbles: true });
    event.clientX = e.clientX;
    event.clientY = e.clientY;
    self.parentNode.dispatchEvent(event);
  });

  // this.addEventListener('touchmove', this.onClick.bind(this));
  this.checked = this.hasAttribute('checked');

  this.drag = window.d = new Drag({
    handle: this.els.handle,
    container: this.els.track
  });



  shadow.appendChild(this._template);
  utils.style.call(this, stylesheets);

  this.drag.configureMinMax();
};

proto.attachedCallback = function() {
  this.drag.configureMinMax();
  console.log('attachedCallback');
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
  this.toggle();
};

/**
 * Proxy the checked property to the input element.
 */
Object.defineProperty(proto, 'checked', {
  get: function() {
    return this._checked;
  },
  set: function(value) {
    this.setChecked(value);
  }
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
template.innerHTML = '<div class="inner">' +
  '<div class="label"><content></content></div>' +
  '<div class="track js-track">' +
    '<div class="head js-handle">' +
      '<span class="icon icon-tick"></span>' +
      '<div class="circle-1"></div>' +
      '<div class="circle-2"></div>' +
    '</div>' +
  '</div>' +
'</div>';

// Register and return the constructor
return document.registerElement('gaia-switch', { prototype: proto });

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('gaia-switch',this));