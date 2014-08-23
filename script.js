(function(define){define(function(require,exports,module){
/* jshint esnext:true */
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

  this.els = {
    inner: tmpl.querySelector('.js-inner'),
    track: tmpl.querySelector('.js-track'),
    handle: tmpl.querySelector('.js-handle')
  };

  // Bind context
  this.toggle = this.toggle.bind(this);
  this.onSnapped = this.onSnapped.bind(this);

  // Configure
  this.checked = this.hasAttribute('checked');

  // Make it draggable
  this.drag = new Drag({
    handle: this.els.handle,
    container: this.els.track
  });

  shadow.appendChild(tmpl);
  this.bindEvents();
  this.styleHack();
};

/**
 * Bind to to events.
 *
 * @private
 */
proto.bindEvents = function() {
  this.addEventListener('styled', this.drag.updateDimensions);
  this.drag.on('ended', this.drag.snapToClosestEdge);
  this.drag.on('snapped', this.onSnapped);
  this.drag.on('tapped', this.toggle);
};

proto.styleHack = function() {
  var style = this.shadowRoot.querySelector('style').cloneNode(true);
  style.setAttribute('scoped', '');
  this.appendChild(style);
};


/**
 * Sets the switch as `checked` depending
 * on whether it snapped to the right.
 *
 * We remove all styling Drag applied
 * during the drag so that our CSS
 * can take over.
 *
 * @param  {Event} e
 * @private
 */
proto.onSnapped = function(e) {
  this.checked = e.x === 'right';
  this.els.handle.style.transform = '';
  this.els.handle.style.transition = '';
};

proto.toggle = function(value) {
  console.log('toggle');
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
    this.dispatchEvent(new CustomEvent('change'));
  }
};

proto.attributeChangedCallback = function(attr, oldVal, newVal) {
  if (attr === 'checked') {
    this.checked = newVal !== null;
  }
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
template.innerHTML = `
<style>

gaia-switch {
  display: inline-block;
  position: relative;
}

/** Inner
 ---------------------------------------------------------*/

.inner {
  display: block;
  width: 50px;
  height: 32px;
}

/** Track
 ---------------------------------------------------------*/

.track {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 18px;

  /* Themeable */

  background-color:
    var(--background-minus, #000);
}

/** Track Background
 ---------------------------------------------------------*/

.track:after {
  content: " ";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  transform: scale(0);
  transition: transform 200ms ease;
  transition-delay: 300ms;
  will-change: transform;

  /* Theamable */

  background-color:
    var(--color-highlight, #000)
}

/**
 * [checked]
 */

[checked] .track:after {
  transform: scale(1);
}

/** Handle
 ---------------------------------------------------------*/

.handle {
  position: relative;
  z-index: 1;
  width: 32px;
  height: 32px;
  transition: transform 160ms linear;
}

/**
 * [checked]
 */

[checked] .handle {
  transform: translateX(18px)
}

/** Handle Head
 ---------------------------------------------------------*/

.handle-head {
  display: flex;
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  position: relative;
  top: -2px;
  left: -2px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #000;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  /* Themable */

  border-color:
    var(--background-minus);
}

/** Handle Head Circle
 ---------------------------------------------------------*/

.handle-head:after {
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: scale(0);
  background: #000;
  transition: transform 300ms ease;
  transition-delay: 600ms;
  will-change: transform;
}

/**
 * [checked]
 */

[checked] .handle-head:after {
  transform: scale(1);
}

</style>
<div class="inner js-inner">
  <div class="track js-track">
    <div class="handle js-handle">
      <div class="handle-head"></div>
    </div>
  </div>
</div>`;

// Register and return the constructor
return document.registerElement('gaia-switch', { prototype: proto });

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('gaia-switch',this));