(function(define){define(function(require,exports,module){
/* jshint laxbreak:true */
/* jshint esnext:true */

'use strict';

/**
 * Dependencies
 */

var component = require('gaia-component');
var Drag = require('drag');

/**
 * Simple logger
 * @type {Function}
 */
var debug = 1 ? console.log.bind(console) : function() {};

/**
 * Exports
 */

module.exports = component.register('gaia-switch', {
  created: function() {
    this.setupShadowRoot();

    this.els = {
      inner: this.shadowRoot.querySelector('.inner'),
      track: this.shadowRoot.querySelector('.track'),
      handle: this.shadowRoot.querySelector('.handle')
    };

    // Bind context
    this.toggle = this.toggle.bind(this);
    this.onSnapped = this.onSnapped.bind(this);
    this.onTapped = this.onTapped.bind(this);

    // Configure
    this.checked = this.getAttribute('checked');
    this.tabIndex = 0;
    this.setupDrag();

    setTimeout(() => { this.activateTransitions(); });
  },

  setupDrag: function() {
    this.drag = new Drag({
      handle: this.els.handle,
      container: this.els.track
    });

    this.drag.on('ended', this.drag.snapToClosestEdge);
    this.drag.on('snapped', this.onSnapped);
    this.drag.on('tapped', this.onTapped);
  },

  activateTransitions: function() {
    this.els.inner.classList.add('transitions-on');
  },

  onTapped: function(e) {
    debug('tapped', e);
    e.stopPropagation();
    this.toggle();
  },

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
  onSnapped: function(e) {
    debug('snapped', e);
    this.checked = e.x === 'right';
    this.els.handle.style.transform = '';
    this.els.handle.style.transition = '';
  },

  toggle: function(value) {
    debug('toggle', value);
    this.checked = typeof value !== 'boolean'
      ? !this.hasAttribute('checked')
      : value;
  },

  setChecked: function(value) {
    debug('set checked', value);

    value = !!value;
    if (this.checked === value) { return; }

    var changed = this._checked !== undefined;
    this._checked = value;

    if (value) { this.setAttr('checked', ''); }
    else { this.removeAttr('checked'); }

    this.els.handle.style.transform = '';
    this.els.handle.style.transition = '';

    if (changed) { this.dispatchEvent(new CustomEvent('change')); }
  },

  attrs: {
    checked: {
      get: function() { return this._checked; },
      set: function(value) {
        debug('checked setter', value);
        value = value || value === '';
        this.setChecked(value);
      }
    }
  },

  template: `
    <div class="inner">
      <div class="track">
        <div class="handle">
          <div class="handle-head"></div>
        </div>
      </div>
    </div>
    <style>

    :host {
      display: inline-block;
      position: relative;
      outline: 0;
    }

    /** Inner
     ---------------------------------------------------------*/

    .inner {
      display: block;
      width: 50px;
      height: 32px;
      direction: ltr;
    }

    /** Track
     ---------------------------------------------------------*/

    .track {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 18px;

      /* Themeable */

      background:
        var(--switch-background,
        var(--background-minus,
        var(--background-plus,
        rgba(0,0,0,0.2))));
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

      /* Theamable */

      background-color:
        var(--highlight-color, #000)
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
    }

    /**
     * transitions-on
     */

    .transitions-on .handle {
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
      border: 1px solid;
      cursor: pointer;
      align-items: center;
      justify-content: center;

      /* Themable */

      background:
        var(--switch-head-background,
        var(--input-background,
        var(--button-background,
        var(--background-plus,
        #fff))));

      border-color:
        var(--switch-head-border-color,
        var(--switch-background,
        var(--border-color,
        var(--background-minus,
        rgba(0,0,0,0.2)))));
    }

    /** Handle Head Circle
     ---------------------------------------------------------*/

    .handle-head:after {
      content: "";
      display: block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      transform: scale(0);
      transition: transform 300ms ease;
      transition-delay: 600ms;

      /* Themeable */

      background:
        var(--highlight-color, #000)
    }

    /**
     * [checked]
     */

    [checked] .handle-head:after {
      transform: scale(1);
    }

    </style>
  `
});

// Bind a 'click' delegate to the
// window to listen for all clicks
// and toggle checkboxes when required.
addEventListener('click', function(e) {
  var label = getLabel(e.target);
  var gaiaSwitch = getLinkedSwitch(label);
  if (gaiaSwitch) { gaiaSwitch.toggle(); }
}, true);

/**
 * Find a gaiaSwitch when given a <label>.
 *
 * @param  {Element} label
 * @return {GaiaCheckbox|null}
 */
function getLinkedSwitch(label) {
  if (!label) { return; }
  var id = label.getAttribute('for');
  var el = id && document.getElementById(id);
  return el && el.tagName === 'GAIA-SWITCH' ? el : null;// || label.querySelector('gaia-checkbox');
}

/**
 * Walk up the DOM tree from a given
 * element until a <label> is found.
 *
 * @param  {Element} el
 * @return {HTMLLabelElement|undefined}
 */
function getLabel(el) {
  return el && (el.tagName == 'LABEL' ? el : getLabel(el.parentNode));
}

addEventListener('keypress', function(e) {
  var isSpaceKey = e.which === 32;
  var el = document.activeElement;
  var isGaiaSwitch = el.tagName === 'GAIA-SWITCH';
  if (isSpaceKey && isGaiaSwitch) { el.toggle(); }
});

});})((function(n,w){return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:function(c){
var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};})('gaia-switch',this));