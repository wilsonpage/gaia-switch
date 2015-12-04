(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("fxosComponent"));
	else if(typeof define === 'function' && define.amd)
		define(["fxosComponent"], factory);
	else if(typeof exports === 'object')
		exports["FXOSSwitch"] = factory(require("fxosComponent"));
	else
		root["FXOSSwitch"] = factory(root["fxosComponent"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Dependencies
	 */

	var component = __webpack_require__(1);
	var Drag = __webpack_require__(2);

	/**
	 * Simple logger
	 * @type {Function}
	 */
	var debug = 0 ? console.log.bind(console) : function() {};

	/**
	 * Handles convertion of edges values
	 * to checked Booleans and checked
	 * Booleans to edge values.
	 *
	 * This is because in LTR mode when the
	 * handle is against the left edge the
	 * switch is checked, in RTL mode it's
	 * the opposite.
	 *
	 * @type {Object}
	 */
	var convert = {
	  ltr: {
	    edges: { '0': false, '1': true },
	    checked: { 'true': '1', 'false': '0' }
	  },

	  rtl: {
	    edges: { '0': true, '1': false },
	    checked: { 'true': '0', 'false': '1' }
	  },

	  toChecked: function(edge) {
	    return this[dir()].edges[edge];
	  },

	  toEdge: function(checked) {
	    return this[dir()].checked[checked];
	  }
	};

	/**
	 * Exports
	 */

	module.exports = component.register('fxos-switch', {
	  dirObserver: true,

	  created: function() {
	    this.setupShadowRoot();

	    this.els = {
	      inner: this.shadowRoot.querySelector('.inner'),
	      track: this.shadowRoot.querySelector('.track'),
	      handle: this.shadowRoot.querySelector('.handle')
	    };

	    // Bind context
	    this.updateDir = this.updateDir.bind(this);
	    this.toggle = this.toggle.bind(this);

	    // Events
	    on(this, 'click', e => this.onClick(e));

	    // Configure
	    this.setupDrag();
	    this.disabled = this.getAttribute('disabled');
	    this.checked = this.getAttribute('checked');

	    // process everything that doesn't affect user interaction
	    // after the component is created
	    setTimeout(() => {
	      // enable transitions after creation
	      this.activateTransitions();
	      this.makeAccessible();
	    });
	  },

	  /**
	   * Accessibility enhancements.
	   * Read fxos-switch as switch.
	   * make it tabable
	   * read its checked and disabled state
	   */
	  makeAccessible: function() {
	    this.setAttribute('role', 'switch');

	    // Make tabable
	    this.tabIndex = 0;

	    this.setAttribute('aria-checked', this.checked);
	    if (this.disabled) {
	      this.setAttr('aria-disabled', true);
	    }
	  },

	  attached: function() {
	    debug('attached');
	    on(document, 'dirchanged', this.updateDir);
	  },

	  detached: function() {
	    debug('detached');
	    off(document, 'dirchanged', this.updateDir);
	  },

	  setupDrag: function() {
	    debug('setup drag');

	    this.drag = new Drag({
	      container: {
	        el: this.els.track,
	        width: 50,
	        height: 32
	      },

	      handle: {
	        el: this.els.handle,
	        width: 32,
	        height: 32,
	        x: 0,
	        y: 0
	      },
	    });

	    this.drag.on('ended', () => this.drag.snap());
	    this.drag.on('snapped', (e) => this.onSnapped(e));
	  },

	  activateTransitions: function() {
	    debug('activate transitions');
	    this.els.inner.classList.add('transitions-on');
	  },

	  onClick: function(e) {
	    debug('click', e);
	    e.stopPropagation();
	    if (this.drag.dragging) { return; }
	    if (this.disabled) { return; }
	    this.toggle();
	  },

	  updateDir: function() {
	    debug('update dir', dir());
	    this.updatePosition();
	  },

	  onSnapped: function(e) {
	    debug('snapped', e, convert.toChecked(e.detail.x));
	    this.checked = convert.toChecked(e.detail.x);
	  },

	  toggle: function(value) {
	    debug('toggle', value);
	    this.checked = !this.checked;
	  },

	  updatePosition: function() {
	    var edge = convert.toEdge(this.checked);
	    this.drag.transition(edge, 0);
	    debug('updated position', edge);
	  },

	  attrs: {
	    checked: {
	      get: function() { return this._checked; },
	      set: function(value) {
	        debug('set checked', value);
	        value = !!(value || value === '');

	        if (this._checked === value) { return; }

	        var changed = this._checked !== undefined;
	        this._checked = value;

	        this.els.handle.style.transform = '';
	        this.els.handle.style.transition = '';

	        if (value) {
	          this.setAttr('checked', '');
	          this.setAttribute('aria-checked', true);
	        } else {
	          this.removeAttr('checked');
	          this.setAttribute('aria-checked', false);
	        }

	        this.updatePosition();

	        if (changed) { this.dispatchEvent(new CustomEvent('change')); }
	      }
	    },

	    disabled: {
	      get: function() { return this._disabled; },
	      set: function(value) {
	        value = !!(value || value === '');
	        if (this._disabled === value) { return; }
	        debug('set disabled', value);
	        this._disabled = value;
	        if (value) {
	          this.setAttr('disabled', '');
	          this.setAttr('aria-disabled', true);
	        } else {
	          this.removeAttr('disabled');
	          this.removeAttr('aria-disabled');
	        }
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
	      border-radius: 18px;
	      outline: 0;
	    }

	    :host([disabled]) {
	      pointer-events: none;
	      opacity: 0.5;
	    }

	    .inner {
	      display: block;
	      width: 50px;
	      height: 32px;
	      direction: ltr;
	    }

	    .track {
	      position: relative;

	      width: 100%;
	      height: 100%;
	      border-radius: 18px;

	      background: var(--fxos-switch-background);
	    }

	    .track:after {
	      content: " ";
	      position: absolute;
	      left: 0;
	      top: 0;

	      display: block;
	      width: 100%;
	      height: 100%;

	      border-radius: 25px;
	      transform: scale(0);
	      transition-property: transform;
	      transition-duration: 200ms;
	      transition-delay: 300ms;
	      background:
	        var(--fxos-switch-checked-color,
	        var(--fxos-brand-color));
	    }

	    [checked] .track:after { transform: scale(1); }

	    .handle {
	      position: relative;
	      z-index: 1;
	      width: 32px;
	      height: 32px;
	    }

	    .inner:not(.transitions-on) .handle {
	      transition: none !important;
	    }

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

	      background: var(--fxos-switch-handle-background);
	      color: var(--fxos-switch-background);;
	    }

	    .handle-head:after {
	      content: "";
	      display: block;
	      width: 15px;
	      height: 15px;
	      border-radius: 50%;
	      transform: scale(0);
	      transition-property: transform;
	      transition-duration: 300ms;
	      transition-delay: 600ms;

	      background:
	        var(--fxos-switch-checked-color,
	        var(--fxos-brand-color));
	    }

	    [checked] .handle-head:after { transform: scale(1); }
	  </style>`
	});

	// Toggle switches when the component is
	// focused and the spacebar is pressed.
	addEventListener('keypress', function(e) {
	  var isSpaceKey = e.which === 32;
	  var el = document.activeElement;
	  var isSwitch = el.localName === 'fxos-switch';
	  if (isSpaceKey && isSwitch) { el.click(); }
	});

	/**
	 * TODO: Replace this <label> stuff
	 * with smarter <fxos-label>
	 */

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
	  return el && el.localName === 'fxos-switch' ? el : null;
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

	/**
	 * Utils
	 */

	/**
	 * Get the document direction.
	 *
	 * @return {String} ('ltr'|'rtl')
	 */
	function dir() { return document.dir || 'ltr'; }

	function on(el, name, fn) { el.addEventListener(name, fn); }
	function off(el, name, fn) { el.removeEventListener(name, fn); }


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;(function(define){'use strict';!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require,exports,module){

	/**
	 * Pointer event abstraction to make
	 * it work for touch and mouse.
	 *
	 * @type {Object}
	 */
	var pointer = [
	  { down: 'touchstart', up: 'touchend', move: 'touchmove' },
	  { down: 'mousedown', up: 'mouseup', move: 'mousemove' }
	]['ontouchstart' in window ? 0 : 1];

	/**
	 * Simple logger
	 *
	 * @type {Function}
	 */
	var debug = 0 ? console.log.bind(console) : function() {};

	/**
	 * Exports
	 */

	module.exports = Drag;

	/**
	 * Drag creates a draggable 'handle' element,
	 * constrained within a 'container' element.
	 *
	 * Drag instances dispatch useful events and provides
	 * methods to support common draggable UI use-cases,
	 * like snapping.
	 *
	 * In Gaia we use `Drag` for our switch components.
	 *
	 * Example:
	 *
	 *   var container = document.getElementById(#my-container);
	 *   var handle = document.getElementById(#my-handle);
	 *
	 *   new Drag({
	 *     container: {
	 *       el: container,
	 *       width: container.clientWidth,
	 *       height: container.clientHeight
	 *     },
	 *     handle: {
	 *       el: handle,
	 *       width: handle.clientWidth,
	 *       height: handle.clientHeight,
	 *       x: 0,
	 *       y: 0
	 *     }
	 *   });
	 *
	 * @param {Object} config
	 */
	function Drag(config) {
	  debug('init', config);
	  this.config(config);
	  this.dragging = false;
	  this.enabled = true;
	  this.setupEvents();
	}

	/**
	 * Update the configuration.
	 *
	 * @param  {Object} config
	 */
	Drag.prototype.config = function(config) {
	  this.slideDuration = config.slideDuration || 140;
	  this.container = config.container;
	  this.handle = config.handle;
	  this.max = {
	    x: this.container.width - this.handle.width,
	    y: this.container.height - this.handle.height
	  };
	};

	/**
	 * Preserve context and bind initial
	 * 'down' event listener.
	 *
	 * @private
	 */
	Drag.prototype.setupEvents = function() {
	  debug('setup events', pointer);
	  this.onPointerStart = this.onPointerStart.bind(this);
	  this.onPointerMove = this.onPointerMove.bind(this);
	  this.onPointerEnd = this.onPointerEnd.bind(this);
	  this.handle.el.addEventListener(pointer.down, this.onPointerStart);
	};

	/**
	 * Enables dragging.
	 *
	 * @public
	 */
	Drag.prototype.enable = function() {
	  this.enabled = true;
	};

	/**
	 * Disables dragging.
	 *
	 * @public
	 */
	Drag.prototype.disable = function() {
	  this.enabled = false;

	  if (this.point) {
	    this.translate(this.startPosition.x, this.startPosition.y);
	    this.onPointerEnd();
	  }
	};

	/**
	 * Adds events listeners and updates
	 * the `dragging` flag.
	 *
	 * @param  {Event} e
	 * @private
	 */
	Drag.prototype.onPointerStart = function(e) {
	  if (!this.enabled) {
	    return;
	  }

	  debug('pointer start', e);
	  this.point = getPoint(e);
	  this.startPosition = {
	    x: this.handle.x,
	    y: this.handle.y
	  };

	  addEventListener(pointer.move, this.onPointerMove);
	  addEventListener(pointer.up, this.onPointerEnd);

	  clearTimeout(this.timeout);
	  this.timeout = setTimeout(() => this.dragging = true, 200);
	};

	/**
	 * Removes events listeners and updates
	 * the `dragging` flag.
	 *
	 * @param  {Event} e
	 * @private
	 */
	Drag.prototype.onPointerEnd = function(e) {
	  debug('pointer end', e);
	  this.point = null;
	  this.startPosition = null;

	  clearTimeout(this.timeout);
	  this.timeout = setTimeout(() => this.dragging = false);

	  removeEventListener(pointer.move, this.onPointerMove);
	  removeEventListener(pointer.up, this.onPointerEnd);

	  if (this.enabled) {
	    this.dispatch('ended', e);
	  }
	};

	/**
	 * Moves the handle when the pointer moves.
	 *
	 * @param  {Event} e
	 * @private
	 */
	Drag.prototype.onPointerMove = function(e) {
	  debug('pointer move', e);
	  e.preventDefault();
	  var previous = this.point;
	  this.point = getPoint(e);
	  this.setDuration(0);
	  this.translateDelta(
	    this.point.pageX - previous.pageX,
	    this.point.pageY - previous.pageY
	  );
	};

	/**
	 * Translate the handle by given delta.
	 *
	 * @param  {Number} deltaX
	 * @param  {Number} deltaY
	 * @public
	 */
	Drag.prototype.translateDelta = function(deltaX, deltaY) {
	  debug('translate by', deltaX, deltaY);
	  this.translate(
	    this.handle.x + deltaX,
	    this.handle.y + deltaY
	  );
	};

	/**
	 * Translate the handle to given coordinates.
	 *
	 * Numbers are interpreted as pixels and
	 * Strings as ratio/percentage.
	 *
	 * Example:
	 *
	 *   drag.translate(50, 0); // translate(50px, 0px);
	 *   drag.translate('0.5', 0); // translate(<halfway>, 0px);
	 *
	 * @param  {Number|String} x
	 * @param  {Number|String} y
	 * @public
	 */
	Drag.prototype.translate = function(x, y) {
	  debug('translate', x, y);
	  var position = this.clamp(this.normalize(x, y));
	  var translate = 'translate(' + position.x + 'px,' + position.y + 'px)';

	  // Set the transform to move the handle
	  this.handle.el.style.transform = translate;

	  // Update the handle position reference
	  this.handle.x = position.x;
	  this.handle.y = position.y;

	  // dispatch event with useful data
	  this.dispatch('translate', this.handle);
	};

	/**
	 * Transition the handle to given coordinates.
	 *
	 * Example:
	 *
	 *   drag.transition(50, 0); // 50px, 0px;
	 *   drag.transition('0.5', 0); // <halfway>, 0px
	 *
	 * @param  {Number|String} x
	 * @param  {Number|String} y
	 * @public
	 */
	Drag.prototype.transition = function(x, y) {
	  debug('transition', x, y);
	  var pos = this.clamp(this.normalize(x, y));
	  var duration = this.getDuration(this.handle, pos);
	  this.setDuration(duration);
	  this.translate(pos.x, pos.y);
	};

	/**
	 * Normalize x/y parametes to pixel values.
	 *
	 * Strings are interpreted as a ratio of
	 * max x/y position.
	 *
	 * @param  {Number|String} x
	 * @param  {Number|String} y
	 * @return {Object} {x,y}
	 * @private
	 */
	Drag.prototype.normalize = function(x, y) {
	  return {
	    x: typeof x == 'string' ? (Number(x) * this.max.x) : x,
	    y: typeof y == 'string' ? (Number(y) * this.max.y) : y
	  };
	};

	/**
	 * Snap the handle to nearest edge(s).
	 *
	 * @public
	 */
	Drag.prototype.snap = function() {
	  debug('snap');
	  var edges = this.getClosestEdges();
	  this.transition(edges.x, edges.y);
	  this.dispatch('snapped', edges);
	};

	/**
	 * Clamp coordinates between the
	 * allowed min/max values.
	 *
	 * @param  {Object} pos {x,y}
	 * @return {Object} {x,y}
	 */
	Drag.prototype.clamp = function(pos) {
	  return {
	    x: Math.max(0, Math.min(this.max.x, pos.x)),
	    y: Math.max(0, Math.min(this.max.y, pos.y)),
	  };
	};

	/**
	 * Get the ideal transition duration based
	 * on how much distance has to be tranvelled.
	 *
	 * When snapping, we don't want to use the same
	 * duration for short distances as long.
	 *
	 * @param  {Object} from {x,y}
	 * @param  {Object} to   {x,y}
	 * @return {Number}
	 */
	Drag.prototype.getDuration = function(from, to) {
	  var distanceX = Math.abs(from.x - to.x);
	  var distanceY = Math.abs(from.y - to.y);
	  var distance = Math.max(distanceX, distanceY);
	  var axis = distanceY > distanceX ? 'y' : 'x';
	  var ratio = distance / this.max[axis];
	  return this.slideDuration * ratio;
	};

	/**
	 * Set the handle's transition duration.
	 *
	 * @param {Number} ms
	 */
	Drag.prototype.setDuration = function(ms) {
	  this.handle.el.style.transitionDuration = ms + 'ms';
	};

	/**
	 * Get the closest x and y edges.
	 *
	 * The strings returns represent
	 * ratio/percentage of axis' overall range.
	 *
	 * @return {Object} {x,y}
	 */
	Drag.prototype.getClosestEdges = function() {
	  return {
	    x: this.handle.x <= (this.max.x / 2) ?  '0' : '1',
	    y: this.handle.y <= (this.max.y / 2) ?  '0' : '1'
	  };
	};

	/**
	 * Dispatch a DOM event on the container
	 * element. All events are namespaced ('drag').
	 *
	 * @param  {String} name
	 * @param  {*} detail
	 */
	Drag.prototype.dispatch = function(name, detail) {
	  var e = new CustomEvent('drag' + name, { bubble: false, detail: detail })
	  this.container.el.dispatchEvent(e);
	  debug('dispatched', e);
	};

	/**
	 * Add an event listener.
	 *
	 * @param  {String}   name
	 * @param  {Function} fn
	 */
	Drag.prototype.on = function(name, fn) {
	  this.container.el.addEventListener('drag' + name, fn);
	};

	/**
	 * Remove and event listener.
	 *
	 * @param  {String}   name
	 * @param  {Function} fn
	 */
	Drag.prototype.off = function(name, fn) {
	  this.container.el.removeEventListener('drag' + name, fn);
	};

	/**
	 * Utils
	 */

	function getPoint(e) {
	  return ~e.type.indexOf('mouse') ? e : e.touches[0];
	}

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));})(__webpack_require__(3));/*jshint ignore:line*/

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }
/******/ ])
});
;