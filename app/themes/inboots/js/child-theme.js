/*!
  * Understrap v1.1.0 (https://understrap.com)
  * Copyright 2013-2022 The Understrap Authors (https://github.com/understrap/understrap/graphs/contributors)
  * Licensed under GPL (http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.understrap = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var alert$1 = {exports: {}};

	var eventHandler = {exports: {}};

	/*!
	  * Bootstrap event-handler.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory() ;
	})(commonjsGlobal, (function () {
	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): dom/event-handler.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
	  const stripNameRegex = /\..*/;
	  const stripUidRegex = /::\d+$/;
	  const eventRegistry = {}; // Events storage

	  let uidEvent = 1;
	  const customEvents = {
	    mouseenter: 'mouseover',
	    mouseleave: 'mouseout'
	  };
	  const customEventsRegex = /^(mouseenter|mouseleave)/i;
	  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
	  /**
	   * ------------------------------------------------------------------------
	   * Private methods
	   * ------------------------------------------------------------------------
	   */

	  function getUidEvent(element, uid) {
	    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
	  }

	  function getEvent(element) {
	    const uid = getUidEvent(element);
	    element.uidEvent = uid;
	    eventRegistry[uid] = eventRegistry[uid] || {};
	    return eventRegistry[uid];
	  }

	  function bootstrapHandler(element, fn) {
	    return function handler(event) {
	      event.delegateTarget = element;

	      if (handler.oneOff) {
	        EventHandler.off(element, event.type, fn);
	      }

	      return fn.apply(element, [event]);
	    };
	  }

	  function bootstrapDelegationHandler(element, selector, fn) {
	    return function handler(event) {
	      const domElements = element.querySelectorAll(selector);

	      for (let {
	        target
	      } = event; target && target !== this; target = target.parentNode) {
	        for (let i = domElements.length; i--;) {
	          if (domElements[i] === target) {
	            event.delegateTarget = target;

	            if (handler.oneOff) {
	              EventHandler.off(element, event.type, selector, fn);
	            }

	            return fn.apply(target, [event]);
	          }
	        }
	      } // To please ESLint


	      return null;
	    };
	  }

	  function findHandler(events, handler, delegationSelector = null) {
	    const uidEventList = Object.keys(events);

	    for (let i = 0, len = uidEventList.length; i < len; i++) {
	      const event = events[uidEventList[i]];

	      if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
	        return event;
	      }
	    }

	    return null;
	  }

	  function normalizeParams(originalTypeEvent, handler, delegationFn) {
	    const delegation = typeof handler === 'string';
	    const originalHandler = delegation ? delegationFn : handler;
	    let typeEvent = getTypeEvent(originalTypeEvent);
	    const isNative = nativeEvents.has(typeEvent);

	    if (!isNative) {
	      typeEvent = originalTypeEvent;
	    }

	    return [delegation, originalHandler, typeEvent];
	  }

	  function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
	    if (typeof originalTypeEvent !== 'string' || !element) {
	      return;
	    }

	    if (!handler) {
	      handler = delegationFn;
	      delegationFn = null;
	    } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
	    // this prevents the handler from being dispatched the same way as mouseover or mouseout does


	    if (customEventsRegex.test(originalTypeEvent)) {
	      const wrapFn = fn => {
	        return function (event) {
	          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
	            return fn.call(this, event);
	          }
	        };
	      };

	      if (delegationFn) {
	        delegationFn = wrapFn(delegationFn);
	      } else {
	        handler = wrapFn(handler);
	      }
	    }

	    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
	    const events = getEvent(element);
	    const handlers = events[typeEvent] || (events[typeEvent] = {});
	    const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

	    if (previousFn) {
	      previousFn.oneOff = previousFn.oneOff && oneOff;
	      return;
	    }

	    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
	    const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
	    fn.delegationSelector = delegation ? handler : null;
	    fn.originalHandler = originalHandler;
	    fn.oneOff = oneOff;
	    fn.uidEvent = uid;
	    handlers[uid] = fn;
	    element.addEventListener(typeEvent, fn, delegation);
	  }

	  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
	    const fn = findHandler(events[typeEvent], handler, delegationSelector);

	    if (!fn) {
	      return;
	    }

	    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
	    delete events[typeEvent][fn.uidEvent];
	  }

	  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
	    const storeElementEvent = events[typeEvent] || {};
	    Object.keys(storeElementEvent).forEach(handlerKey => {
	      if (handlerKey.includes(namespace)) {
	        const event = storeElementEvent[handlerKey];
	        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
	      }
	    });
	  }

	  function getTypeEvent(event) {
	    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
	    event = event.replace(stripNameRegex, '');
	    return customEvents[event] || event;
	  }

	  const EventHandler = {
	    on(element, event, handler, delegationFn) {
	      addHandler(element, event, handler, delegationFn, false);
	    },

	    one(element, event, handler, delegationFn) {
	      addHandler(element, event, handler, delegationFn, true);
	    },

	    off(element, originalTypeEvent, handler, delegationFn) {
	      if (typeof originalTypeEvent !== 'string' || !element) {
	        return;
	      }

	      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
	      const inNamespace = typeEvent !== originalTypeEvent;
	      const events = getEvent(element);
	      const isNamespace = originalTypeEvent.startsWith('.');

	      if (typeof originalHandler !== 'undefined') {
	        // Simplest case: handler is passed, remove that listener ONLY.
	        if (!events || !events[typeEvent]) {
	          return;
	        }

	        removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
	        return;
	      }

	      if (isNamespace) {
	        Object.keys(events).forEach(elementEvent => {
	          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
	        });
	      }

	      const storeElementEvent = events[typeEvent] || {};
	      Object.keys(storeElementEvent).forEach(keyHandlers => {
	        const handlerKey = keyHandlers.replace(stripUidRegex, '');

	        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
	          const event = storeElementEvent[keyHandlers];
	          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
	        }
	      });
	    },

	    trigger(element, event, args) {
	      if (typeof event !== 'string' || !element) {
	        return null;
	      }

	      const $ = getjQuery();
	      const typeEvent = getTypeEvent(event);
	      const inNamespace = event !== typeEvent;
	      const isNative = nativeEvents.has(typeEvent);
	      let jQueryEvent;
	      let bubbles = true;
	      let nativeDispatch = true;
	      let defaultPrevented = false;
	      let evt = null;

	      if (inNamespace && $) {
	        jQueryEvent = $.Event(event, args);
	        $(element).trigger(jQueryEvent);
	        bubbles = !jQueryEvent.isPropagationStopped();
	        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
	        defaultPrevented = jQueryEvent.isDefaultPrevented();
	      }

	      if (isNative) {
	        evt = document.createEvent('HTMLEvents');
	        evt.initEvent(typeEvent, bubbles, true);
	      } else {
	        evt = new CustomEvent(event, {
	          bubbles,
	          cancelable: true
	        });
	      } // merge custom information in our event


	      if (typeof args !== 'undefined') {
	        Object.keys(args).forEach(key => {
	          Object.defineProperty(evt, key, {
	            get() {
	              return args[key];
	            }

	          });
	        });
	      }

	      if (defaultPrevented) {
	        evt.preventDefault();
	      }

	      if (nativeDispatch) {
	        element.dispatchEvent(evt);
	      }

	      if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
	        jQueryEvent.preventDefault();
	      }

	      return evt;
	    }

	  };

	  return EventHandler;

	}));

	}(eventHandler));

	var baseComponent = {exports: {}};

	var data = {exports: {}};

	/*!
	  * Bootstrap data.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory() ;
	})(commonjsGlobal, (function () {
	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): dom/data.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */
	  const elementMap = new Map();
	  const data = {
	    set(element, key, instance) {
	      if (!elementMap.has(element)) {
	        elementMap.set(element, new Map());
	      }

	      const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
	      // can be removed later when multiple key/instances are fine to be used

	      if (!instanceMap.has(key) && instanceMap.size !== 0) {
	        // eslint-disable-next-line no-console
	        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
	        return;
	      }

	      instanceMap.set(key, instance);
	    },

	    get(element, key) {
	      if (elementMap.has(element)) {
	        return elementMap.get(element).get(key) || null;
	      }

	      return null;
	    },

	    remove(element, key) {
	      if (!elementMap.has(element)) {
	        return;
	      }

	      const instanceMap = elementMap.get(element);
	      instanceMap.delete(key); // free up element references if there are no instances left for an element

	      if (instanceMap.size === 0) {
	        elementMap.delete(element);
	      }
	    }

	  };

	  return data;

	}));

	}(data));

	/*!
	  * Bootstrap base-component.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(data.exports, eventHandler.exports) ;
	})(commonjsGlobal, (function (Data, EventHandler) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const MILLISECONDS_MULTIPLIER = 1000;
	  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

	  const getTransitionDurationFromElement = element => {
	    if (!element) {
	      return 0;
	    } // Get transition-duration of the element


	    let {
	      transitionDuration,
	      transitionDelay
	    } = window.getComputedStyle(element);
	    const floatTransitionDuration = Number.parseFloat(transitionDuration);
	    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

	    if (!floatTransitionDuration && !floatTransitionDelay) {
	      return 0;
	    } // If multiple durations are defined, take the first


	    transitionDuration = transitionDuration.split(',')[0];
	    transitionDelay = transitionDelay.split(',')[0];
	    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
	  };

	  const triggerTransitionEnd = element => {
	    element.dispatchEvent(new Event(TRANSITION_END));
	  };

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const getElement = obj => {
	    if (isElement(obj)) {
	      // it's a jQuery object or a node element
	      return obj.jquery ? obj[0] : obj;
	    }

	    if (typeof obj === 'string' && obj.length > 0) {
	      return document.querySelector(obj);
	    }

	    return null;
	  };

	  const execute = callback => {
	    if (typeof callback === 'function') {
	      callback();
	    }
	  };

	  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
	    if (!waitForTransition) {
	      execute(callback);
	      return;
	    }

	    const durationPadding = 5;
	    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
	    let called = false;

	    const handler = ({
	      target
	    }) => {
	      if (target !== transitionElement) {
	        return;
	      }

	      called = true;
	      transitionElement.removeEventListener(TRANSITION_END, handler);
	      execute(callback);
	    };

	    transitionElement.addEventListener(TRANSITION_END, handler);
	    setTimeout(() => {
	      if (!called) {
	        triggerTransitionEnd(transitionElement);
	      }
	    }, emulatedDuration);
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): base-component.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const VERSION = '5.1.3';

	  class BaseComponent {
	    constructor(element) {
	      element = getElement(element);

	      if (!element) {
	        return;
	      }

	      this._element = element;
	      Data__default.default.set(this._element, this.constructor.DATA_KEY, this);
	    }

	    dispose() {
	      Data__default.default.remove(this._element, this.constructor.DATA_KEY);
	      EventHandler__default.default.off(this._element, this.constructor.EVENT_KEY);
	      Object.getOwnPropertyNames(this).forEach(propertyName => {
	        this[propertyName] = null;
	      });
	    }

	    _queueCallback(callback, element, isAnimated = true) {
	      executeAfterTransition(callback, element, isAnimated);
	    }
	    /** Static */


	    static getInstance(element) {
	      return Data__default.default.get(getElement(element), this.DATA_KEY);
	    }

	    static getOrCreateInstance(element, config = {}) {
	      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
	    }

	    static get VERSION() {
	      return VERSION;
	    }

	    static get NAME() {
	      throw new Error('You have to implement the static method "NAME", for each component!');
	    }

	    static get DATA_KEY() {
	      return `bs.${this.NAME}`;
	    }

	    static get EVENT_KEY() {
	      return `.${this.DATA_KEY}`;
	    }

	  }

	  return BaseComponent;

	}));

	}(baseComponent));

	/*!
	  * Bootstrap alert.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(eventHandler.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (EventHandler, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const getSelector = element => {
	    let selector = element.getAttribute('data-bs-target');

	    if (!selector || selector === '#') {
	      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	      // `document.querySelector` will rightfully complain it is invalid.
	      // See https://github.com/twbs/bootstrap/issues/32273

	      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	        return null;
	      } // Just in case some CMS puts out a full URL with the anchor appended


	      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	        hrefAttr = `#${hrefAttr.split('#')[1]}`;
	      }

	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	    }

	    return selector;
	  };

	  const getElementFromSelector = element => {
	    const selector = getSelector(element);
	    return selector ? document.querySelector(selector) : null;
	  };

	  const isDisabled = element => {
	    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
	      return true;
	    }

	    if (element.classList.contains('disabled')) {
	      return true;
	    }

	    if (typeof element.disabled !== 'undefined') {
	      return element.disabled;
	    }

	    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
	  };

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/component-functions.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const enableDismissTrigger = (component, method = 'hide') => {
	    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
	    const name = component.NAME;
	    EventHandler__default.default.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
	      if (['A', 'AREA'].includes(this.tagName)) {
	        event.preventDefault();
	      }

	      if (isDisabled(this)) {
	        return;
	      }

	      const target = getElementFromSelector(this) || this.closest(`.${name}`);
	      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

	      instance[method]();
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): alert.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'alert';
	  const DATA_KEY = 'bs.alert';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const EVENT_CLOSE = `close${EVENT_KEY}`;
	  const EVENT_CLOSED = `closed${EVENT_KEY}`;
	  const CLASS_NAME_FADE = 'fade';
	  const CLASS_NAME_SHOW = 'show';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Alert extends BaseComponent__default.default {
	    // Getters
	    static get NAME() {
	      return NAME;
	    } // Public


	    close() {
	      const closeEvent = EventHandler__default.default.trigger(this._element, EVENT_CLOSE);

	      if (closeEvent.defaultPrevented) {
	        return;
	      }

	      this._element.classList.remove(CLASS_NAME_SHOW);

	      const isAnimated = this._element.classList.contains(CLASS_NAME_FADE);

	      this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
	    } // Private


	    _destroyElement() {
	      this._element.remove();

	      EventHandler__default.default.trigger(this._element, EVENT_CLOSED);
	      this.dispose();
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const data = Alert.getOrCreateInstance(this);

	        if (typeof config !== 'string') {
	          return;
	        }

	        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
	          throw new TypeError(`No method named "${config}"`);
	        }

	        data[config](this);
	      });
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * Data Api implementation
	   * ------------------------------------------------------------------------
	   */


	  enableDismissTrigger(Alert, 'close');
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Alert to jQuery only if jQuery is present
	   */

	  defineJQueryPlugin(Alert);

	  return Alert;

	}));

	}(alert$1));

	var alert = alert$1.exports;

	var button$1 = {exports: {}};

	/*!
	  * Bootstrap button.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(eventHandler.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (EventHandler, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): button.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'button';
	  const DATA_KEY = 'bs.button';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const DATA_API_KEY = '.data-api';
	  const CLASS_NAME_ACTIVE = 'active';
	  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="button"]';
	  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Button extends BaseComponent__default.default {
	    // Getters
	    static get NAME() {
	      return NAME;
	    } // Public


	    toggle() {
	      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
	      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE));
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const data = Button.getOrCreateInstance(this);

	        if (config === 'toggle') {
	          data[config]();
	        }
	      });
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * Data Api implementation
	   * ------------------------------------------------------------------------
	   */


	  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, event => {
	    event.preventDefault();
	    const button = event.target.closest(SELECTOR_DATA_TOGGLE);
	    const data = Button.getOrCreateInstance(button);
	    data.toggle();
	  });
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Button to jQuery only if jQuery is present
	   */

	  defineJQueryPlugin(Button);

	  return Button;

	}));

	}(button$1));

	var button = button$1.exports;

	var carousel$1 = {exports: {}};

	var manipulator = {exports: {}};

	/*!
	  * Bootstrap manipulator.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory() ;
	})(commonjsGlobal, (function () {
	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): dom/manipulator.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  function normalizeData(val) {
	    if (val === 'true') {
	      return true;
	    }

	    if (val === 'false') {
	      return false;
	    }

	    if (val === Number(val).toString()) {
	      return Number(val);
	    }

	    if (val === '' || val === 'null') {
	      return null;
	    }

	    return val;
	  }

	  function normalizeDataKey(key) {
	    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
	  }

	  const Manipulator = {
	    setDataAttribute(element, key, value) {
	      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
	    },

	    removeDataAttribute(element, key) {
	      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
	    },

	    getDataAttributes(element) {
	      if (!element) {
	        return {};
	      }

	      const attributes = {};
	      Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
	        let pureKey = key.replace(/^bs/, '');
	        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
	        attributes[pureKey] = normalizeData(element.dataset[key]);
	      });
	      return attributes;
	    },

	    getDataAttribute(element, key) {
	      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
	    },

	    offset(element) {
	      const rect = element.getBoundingClientRect();
	      return {
	        top: rect.top + window.pageYOffset,
	        left: rect.left + window.pageXOffset
	      };
	    },

	    position(element) {
	      return {
	        top: element.offsetTop,
	        left: element.offsetLeft
	      };
	    }

	  };

	  return Manipulator;

	}));

	}(manipulator));

	var selectorEngine = {exports: {}};

	/*!
	  * Bootstrap selector-engine.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory() ;
	})(commonjsGlobal, (function () {
	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const isVisible = element => {
	    if (!isElement(element) || element.getClientRects().length === 0) {
	      return false;
	    }

	    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
	  };

	  const isDisabled = element => {
	    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
	      return true;
	    }

	    if (element.classList.contains('disabled')) {
	      return true;
	    }

	    if (typeof element.disabled !== 'undefined') {
	      return element.disabled;
	    }

	    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): dom/selector-engine.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const NODE_TEXT = 3;
	  const SelectorEngine = {
	    find(selector, element = document.documentElement) {
	      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
	    },

	    findOne(selector, element = document.documentElement) {
	      return Element.prototype.querySelector.call(element, selector);
	    },

	    children(element, selector) {
	      return [].concat(...element.children).filter(child => child.matches(selector));
	    },

	    parents(element, selector) {
	      const parents = [];
	      let ancestor = element.parentNode;

	      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
	        if (ancestor.matches(selector)) {
	          parents.push(ancestor);
	        }

	        ancestor = ancestor.parentNode;
	      }

	      return parents;
	    },

	    prev(element, selector) {
	      let previous = element.previousElementSibling;

	      while (previous) {
	        if (previous.matches(selector)) {
	          return [previous];
	        }

	        previous = previous.previousElementSibling;
	      }

	      return [];
	    },

	    next(element, selector) {
	      let next = element.nextElementSibling;

	      while (next) {
	        if (next.matches(selector)) {
	          return [next];
	        }

	        next = next.nextElementSibling;
	      }

	      return [];
	    },

	    focusableChildren(element) {
	      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(', ');
	      return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
	    }

	  };

	  return SelectorEngine;

	}));

	}(selectorEngine));

	/*!
	  * Bootstrap carousel.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(eventHandler.exports, manipulator.exports, selectorEngine.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (EventHandler, Manipulator, SelectorEngine, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
	  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

	  const toType = obj => {
	    if (obj === null || obj === undefined) {
	      return `${obj}`;
	    }

	    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	  };

	  const getSelector = element => {
	    let selector = element.getAttribute('data-bs-target');

	    if (!selector || selector === '#') {
	      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	      // `document.querySelector` will rightfully complain it is invalid.
	      // See https://github.com/twbs/bootstrap/issues/32273

	      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	        return null;
	      } // Just in case some CMS puts out a full URL with the anchor appended


	      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	        hrefAttr = `#${hrefAttr.split('#')[1]}`;
	      }

	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	    }

	    return selector;
	  };

	  const getElementFromSelector = element => {
	    const selector = getSelector(element);
	    return selector ? document.querySelector(selector) : null;
	  };

	  const triggerTransitionEnd = element => {
	    element.dispatchEvent(new Event(TRANSITION_END));
	  };

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const typeCheckConfig = (componentName, config, configTypes) => {
	    Object.keys(configTypes).forEach(property => {
	      const expectedTypes = configTypes[property];
	      const value = config[property];
	      const valueType = value && isElement(value) ? 'element' : toType(value);

	      if (!new RegExp(expectedTypes).test(valueType)) {
	        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
	      }
	    });
	  };

	  const isVisible = element => {
	    if (!isElement(element) || element.getClientRects().length === 0) {
	      return false;
	    }

	    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
	  };
	  /**
	   * Trick to restart an element's animation
	   *
	   * @param {HTMLElement} element
	   * @return void
	   *
	   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
	   */


	  const reflow = element => {
	    // eslint-disable-next-line no-unused-expressions
	    element.offsetHeight;
	  };

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const isRTL = () => document.documentElement.dir === 'rtl';

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };
	  /**
	   * Return the previous/next element of a list.
	   *
	   * @param {array} list    The list of elements
	   * @param activeElement   The active element
	   * @param shouldGetNext   Choose to get next or previous element
	   * @param isCycleAllowed
	   * @return {Element|elem} The proper element
	   */


	  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
	    let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed

	    if (index === -1) {
	      return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
	    }

	    const listLength = list.length;
	    index += shouldGetNext ? 1 : -1;

	    if (isCycleAllowed) {
	      index = (index + listLength) % listLength;
	    }

	    return list[Math.max(0, Math.min(index, listLength - 1))];
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): carousel.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'carousel';
	  const DATA_KEY = 'bs.carousel';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const DATA_API_KEY = '.data-api';
	  const ARROW_LEFT_KEY = 'ArrowLeft';
	  const ARROW_RIGHT_KEY = 'ArrowRight';
	  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

	  const SWIPE_THRESHOLD = 40;
	  const Default = {
	    interval: 5000,
	    keyboard: true,
	    slide: false,
	    pause: 'hover',
	    wrap: true,
	    touch: true
	  };
	  const DefaultType = {
	    interval: '(number|boolean)',
	    keyboard: 'boolean',
	    slide: '(boolean|string)',
	    pause: '(string|boolean)',
	    wrap: 'boolean',
	    touch: 'boolean'
	  };
	  const ORDER_NEXT = 'next';
	  const ORDER_PREV = 'prev';
	  const DIRECTION_LEFT = 'left';
	  const DIRECTION_RIGHT = 'right';
	  const KEY_TO_DIRECTION = {
	    [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
	    [ARROW_RIGHT_KEY]: DIRECTION_LEFT
	  };
	  const EVENT_SLIDE = `slide${EVENT_KEY}`;
	  const EVENT_SLID = `slid${EVENT_KEY}`;
	  const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
	  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`;
	  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`;
	  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`;
	  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`;
	  const EVENT_TOUCHEND = `touchend${EVENT_KEY}`;
	  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
	  const EVENT_POINTERUP = `pointerup${EVENT_KEY}`;
	  const EVENT_DRAG_START = `dragstart${EVENT_KEY}`;
	  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
	  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
	  const CLASS_NAME_CAROUSEL = 'carousel';
	  const CLASS_NAME_ACTIVE = 'active';
	  const CLASS_NAME_SLIDE = 'slide';
	  const CLASS_NAME_END = 'carousel-item-end';
	  const CLASS_NAME_START = 'carousel-item-start';
	  const CLASS_NAME_NEXT = 'carousel-item-next';
	  const CLASS_NAME_PREV = 'carousel-item-prev';
	  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
	  const SELECTOR_ACTIVE = '.active';
	  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
	  const SELECTOR_ITEM = '.carousel-item';
	  const SELECTOR_ITEM_IMG = '.carousel-item img';
	  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
	  const SELECTOR_INDICATORS = '.carousel-indicators';
	  const SELECTOR_INDICATOR = '[data-bs-target]';
	  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
	  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
	  const POINTER_TYPE_TOUCH = 'touch';
	  const POINTER_TYPE_PEN = 'pen';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Carousel extends BaseComponent__default.default {
	    constructor(element, config) {
	      super(element);
	      this._items = null;
	      this._interval = null;
	      this._activeElement = null;
	      this._isPaused = false;
	      this._isSliding = false;
	      this.touchTimeout = null;
	      this.touchStartX = 0;
	      this.touchDeltaX = 0;
	      this._config = this._getConfig(config);
	      this._indicatorsElement = SelectorEngine__default.default.findOne(SELECTOR_INDICATORS, this._element);
	      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
	      this._pointerEvent = Boolean(window.PointerEvent);

	      this._addEventListeners();
	    } // Getters


	    static get Default() {
	      return Default;
	    }

	    static get NAME() {
	      return NAME;
	    } // Public


	    next() {
	      this._slide(ORDER_NEXT);
	    }

	    nextWhenVisible() {
	      // Don't call next when the page isn't visible
	      // or the carousel or its parent isn't visible
	      if (!document.hidden && isVisible(this._element)) {
	        this.next();
	      }
	    }

	    prev() {
	      this._slide(ORDER_PREV);
	    }

	    pause(event) {
	      if (!event) {
	        this._isPaused = true;
	      }

	      if (SelectorEngine__default.default.findOne(SELECTOR_NEXT_PREV, this._element)) {
	        triggerTransitionEnd(this._element);
	        this.cycle(true);
	      }

	      clearInterval(this._interval);
	      this._interval = null;
	    }

	    cycle(event) {
	      if (!event) {
	        this._isPaused = false;
	      }

	      if (this._interval) {
	        clearInterval(this._interval);
	        this._interval = null;
	      }

	      if (this._config && this._config.interval && !this._isPaused) {
	        this._updateInterval();

	        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
	      }
	    }

	    to(index) {
	      this._activeElement = SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element);

	      const activeIndex = this._getItemIndex(this._activeElement);

	      if (index > this._items.length - 1 || index < 0) {
	        return;
	      }

	      if (this._isSliding) {
	        EventHandler__default.default.one(this._element, EVENT_SLID, () => this.to(index));
	        return;
	      }

	      if (activeIndex === index) {
	        this.pause();
	        this.cycle();
	        return;
	      }

	      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

	      this._slide(order, this._items[index]);
	    } // Private


	    _getConfig(config) {
	      config = { ...Default,
	        ...Manipulator__default.default.getDataAttributes(this._element),
	        ...(typeof config === 'object' ? config : {})
	      };
	      typeCheckConfig(NAME, config, DefaultType);
	      return config;
	    }

	    _handleSwipe() {
	      const absDeltax = Math.abs(this.touchDeltaX);

	      if (absDeltax <= SWIPE_THRESHOLD) {
	        return;
	      }

	      const direction = absDeltax / this.touchDeltaX;
	      this.touchDeltaX = 0;

	      if (!direction) {
	        return;
	      }

	      this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
	    }

	    _addEventListeners() {
	      if (this._config.keyboard) {
	        EventHandler__default.default.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
	      }

	      if (this._config.pause === 'hover') {
	        EventHandler__default.default.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
	        EventHandler__default.default.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
	      }

	      if (this._config.touch && this._touchSupported) {
	        this._addTouchEventListeners();
	      }
	    }

	    _addTouchEventListeners() {
	      const hasPointerPenTouch = event => {
	        return this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
	      };

	      const start = event => {
	        if (hasPointerPenTouch(event)) {
	          this.touchStartX = event.clientX;
	        } else if (!this._pointerEvent) {
	          this.touchStartX = event.touches[0].clientX;
	        }
	      };

	      const move = event => {
	        // ensure swiping with one touch and not pinching
	        this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
	      };

	      const end = event => {
	        if (hasPointerPenTouch(event)) {
	          this.touchDeltaX = event.clientX - this.touchStartX;
	        }

	        this._handleSwipe();

	        if (this._config.pause === 'hover') {
	          // If it's a touch-enabled device, mouseenter/leave are fired as
	          // part of the mouse compatibility events on first tap - the carousel
	          // would stop cycling until user tapped out of it;
	          // here, we listen for touchend, explicitly pause the carousel
	          // (as if it's the second time we tap on it, mouseenter compat event
	          // is NOT fired) and after a timeout (to allow for mouse compatibility
	          // events to fire) we explicitly restart cycling
	          this.pause();

	          if (this.touchTimeout) {
	            clearTimeout(this.touchTimeout);
	          }

	          this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
	        }
	      };

	      SelectorEngine__default.default.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
	        EventHandler__default.default.on(itemImg, EVENT_DRAG_START, event => event.preventDefault());
	      });

	      if (this._pointerEvent) {
	        EventHandler__default.default.on(this._element, EVENT_POINTERDOWN, event => start(event));
	        EventHandler__default.default.on(this._element, EVENT_POINTERUP, event => end(event));

	        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
	      } else {
	        EventHandler__default.default.on(this._element, EVENT_TOUCHSTART, event => start(event));
	        EventHandler__default.default.on(this._element, EVENT_TOUCHMOVE, event => move(event));
	        EventHandler__default.default.on(this._element, EVENT_TOUCHEND, event => end(event));
	      }
	    }

	    _keydown(event) {
	      if (/input|textarea/i.test(event.target.tagName)) {
	        return;
	      }

	      const direction = KEY_TO_DIRECTION[event.key];

	      if (direction) {
	        event.preventDefault();

	        this._slide(direction);
	      }
	    }

	    _getItemIndex(element) {
	      this._items = element && element.parentNode ? SelectorEngine__default.default.find(SELECTOR_ITEM, element.parentNode) : [];
	      return this._items.indexOf(element);
	    }

	    _getItemByOrder(order, activeElement) {
	      const isNext = order === ORDER_NEXT;
	      return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
	    }

	    _triggerSlideEvent(relatedTarget, eventDirectionName) {
	      const targetIndex = this._getItemIndex(relatedTarget);

	      const fromIndex = this._getItemIndex(SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element));

	      return EventHandler__default.default.trigger(this._element, EVENT_SLIDE, {
	        relatedTarget,
	        direction: eventDirectionName,
	        from: fromIndex,
	        to: targetIndex
	      });
	    }

	    _setActiveIndicatorElement(element) {
	      if (this._indicatorsElement) {
	        const activeIndicator = SelectorEngine__default.default.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
	        activeIndicator.classList.remove(CLASS_NAME_ACTIVE);
	        activeIndicator.removeAttribute('aria-current');
	        const indicators = SelectorEngine__default.default.find(SELECTOR_INDICATOR, this._indicatorsElement);

	        for (let i = 0; i < indicators.length; i++) {
	          if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
	            indicators[i].classList.add(CLASS_NAME_ACTIVE);
	            indicators[i].setAttribute('aria-current', 'true');
	            break;
	          }
	        }
	      }
	    }

	    _updateInterval() {
	      const element = this._activeElement || SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element);

	      if (!element) {
	        return;
	      }

	      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

	      if (elementInterval) {
	        this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
	        this._config.interval = elementInterval;
	      } else {
	        this._config.interval = this._config.defaultInterval || this._config.interval;
	      }
	    }

	    _slide(directionOrOrder, element) {
	      const order = this._directionToOrder(directionOrOrder);

	      const activeElement = SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element);

	      const activeElementIndex = this._getItemIndex(activeElement);

	      const nextElement = element || this._getItemByOrder(order, activeElement);

	      const nextElementIndex = this._getItemIndex(nextElement);

	      const isCycling = Boolean(this._interval);
	      const isNext = order === ORDER_NEXT;
	      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
	      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

	      const eventDirectionName = this._orderToDirection(order);

	      if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE)) {
	        this._isSliding = false;
	        return;
	      }

	      if (this._isSliding) {
	        return;
	      }

	      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

	      if (slideEvent.defaultPrevented) {
	        return;
	      }

	      if (!activeElement || !nextElement) {
	        // Some weirdness is happening, so we bail
	        return;
	      }

	      this._isSliding = true;

	      if (isCycling) {
	        this.pause();
	      }

	      this._setActiveIndicatorElement(nextElement);

	      this._activeElement = nextElement;

	      const triggerSlidEvent = () => {
	        EventHandler__default.default.trigger(this._element, EVENT_SLID, {
	          relatedTarget: nextElement,
	          direction: eventDirectionName,
	          from: activeElementIndex,
	          to: nextElementIndex
	        });
	      };

	      if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
	        nextElement.classList.add(orderClassName);
	        reflow(nextElement);
	        activeElement.classList.add(directionalClassName);
	        nextElement.classList.add(directionalClassName);

	        const completeCallBack = () => {
	          nextElement.classList.remove(directionalClassName, orderClassName);
	          nextElement.classList.add(CLASS_NAME_ACTIVE);
	          activeElement.classList.remove(CLASS_NAME_ACTIVE, orderClassName, directionalClassName);
	          this._isSliding = false;
	          setTimeout(triggerSlidEvent, 0);
	        };

	        this._queueCallback(completeCallBack, activeElement, true);
	      } else {
	        activeElement.classList.remove(CLASS_NAME_ACTIVE);
	        nextElement.classList.add(CLASS_NAME_ACTIVE);
	        this._isSliding = false;
	        triggerSlidEvent();
	      }

	      if (isCycling) {
	        this.cycle();
	      }
	    }

	    _directionToOrder(direction) {
	      if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
	        return direction;
	      }

	      if (isRTL()) {
	        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
	      }

	      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
	    }

	    _orderToDirection(order) {
	      if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
	        return order;
	      }

	      if (isRTL()) {
	        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
	      }

	      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
	    } // Static


	    static carouselInterface(element, config) {
	      const data = Carousel.getOrCreateInstance(element, config);
	      let {
	        _config
	      } = data;

	      if (typeof config === 'object') {
	        _config = { ..._config,
	          ...config
	        };
	      }

	      const action = typeof config === 'string' ? config : _config.slide;

	      if (typeof config === 'number') {
	        data.to(config);
	      } else if (typeof action === 'string') {
	        if (typeof data[action] === 'undefined') {
	          throw new TypeError(`No method named "${action}"`);
	        }

	        data[action]();
	      } else if (_config.interval && _config.ride) {
	        data.pause();
	        data.cycle();
	      }
	    }

	    static jQueryInterface(config) {
	      return this.each(function () {
	        Carousel.carouselInterface(this, config);
	      });
	    }

	    static dataApiClickHandler(event) {
	      const target = getElementFromSelector(this);

	      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
	        return;
	      }

	      const config = { ...Manipulator__default.default.getDataAttributes(target),
	        ...Manipulator__default.default.getDataAttributes(this)
	      };
	      const slideIndex = this.getAttribute('data-bs-slide-to');

	      if (slideIndex) {
	        config.interval = false;
	      }

	      Carousel.carouselInterface(target, config);

	      if (slideIndex) {
	        Carousel.getInstance(target).to(slideIndex);
	      }

	      event.preventDefault();
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * Data Api implementation
	   * ------------------------------------------------------------------------
	   */


	  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
	  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
	    const carousels = SelectorEngine__default.default.find(SELECTOR_DATA_RIDE);

	    for (let i = 0, len = carousels.length; i < len; i++) {
	      Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
	    }
	  });
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Carousel to jQuery only if jQuery is present
	   */

	  defineJQueryPlugin(Carousel);

	  return Carousel;

	}));

	}(carousel$1));

	var carousel = carousel$1.exports;

	var collapse$1 = {exports: {}};

	/*!
	  * Bootstrap collapse.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(data.exports, eventHandler.exports, manipulator.exports, selectorEngine.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (Data, EventHandler, Manipulator, SelectorEngine, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
	  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const toType = obj => {
	    if (obj === null || obj === undefined) {
	      return `${obj}`;
	    }

	    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	  };

	  const getSelector = element => {
	    let selector = element.getAttribute('data-bs-target');

	    if (!selector || selector === '#') {
	      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	      // `document.querySelector` will rightfully complain it is invalid.
	      // See https://github.com/twbs/bootstrap/issues/32273

	      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	        return null;
	      } // Just in case some CMS puts out a full URL with the anchor appended


	      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	        hrefAttr = `#${hrefAttr.split('#')[1]}`;
	      }

	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	    }

	    return selector;
	  };

	  const getSelectorFromElement = element => {
	    const selector = getSelector(element);

	    if (selector) {
	      return document.querySelector(selector) ? selector : null;
	    }

	    return null;
	  };

	  const getElementFromSelector = element => {
	    const selector = getSelector(element);
	    return selector ? document.querySelector(selector) : null;
	  };

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const getElement = obj => {
	    if (isElement(obj)) {
	      // it's a jQuery object or a node element
	      return obj.jquery ? obj[0] : obj;
	    }

	    if (typeof obj === 'string' && obj.length > 0) {
	      return document.querySelector(obj);
	    }

	    return null;
	  };

	  const typeCheckConfig = (componentName, config, configTypes) => {
	    Object.keys(configTypes).forEach(property => {
	      const expectedTypes = configTypes[property];
	      const value = config[property];
	      const valueType = value && isElement(value) ? 'element' : toType(value);

	      if (!new RegExp(expectedTypes).test(valueType)) {
	        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
	      }
	    });
	  };
	  /**
	   * Trick to restart an element's animation
	   *
	   * @param {HTMLElement} element
	   * @return void
	   *
	   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
	   */


	  const reflow = element => {
	    // eslint-disable-next-line no-unused-expressions
	    element.offsetHeight;
	  };

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): collapse.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'collapse';
	  const DATA_KEY = 'bs.collapse';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const DATA_API_KEY = '.data-api';
	  const Default = {
	    toggle: true,
	    parent: null
	  };
	  const DefaultType = {
	    toggle: 'boolean',
	    parent: '(null|element)'
	  };
	  const EVENT_SHOW = `show${EVENT_KEY}`;
	  const EVENT_SHOWN = `shown${EVENT_KEY}`;
	  const EVENT_HIDE = `hide${EVENT_KEY}`;
	  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
	  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
	  const CLASS_NAME_SHOW = 'show';
	  const CLASS_NAME_COLLAPSE = 'collapse';
	  const CLASS_NAME_COLLAPSING = 'collapsing';
	  const CLASS_NAME_COLLAPSED = 'collapsed';
	  const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
	  const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
	  const WIDTH = 'width';
	  const HEIGHT = 'height';
	  const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
	  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="collapse"]';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Collapse extends BaseComponent__default.default {
	    constructor(element, config) {
	      super(element);
	      this._isTransitioning = false;
	      this._config = this._getConfig(config);
	      this._triggerArray = [];
	      const toggleList = SelectorEngine__default.default.find(SELECTOR_DATA_TOGGLE);

	      for (let i = 0, len = toggleList.length; i < len; i++) {
	        const elem = toggleList[i];
	        const selector = getSelectorFromElement(elem);
	        const filterElement = SelectorEngine__default.default.find(selector).filter(foundElem => foundElem === this._element);

	        if (selector !== null && filterElement.length) {
	          this._selector = selector;

	          this._triggerArray.push(elem);
	        }
	      }

	      this._initializeChildren();

	      if (!this._config.parent) {
	        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
	      }

	      if (this._config.toggle) {
	        this.toggle();
	      }
	    } // Getters


	    static get Default() {
	      return Default;
	    }

	    static get NAME() {
	      return NAME;
	    } // Public


	    toggle() {
	      if (this._isShown()) {
	        this.hide();
	      } else {
	        this.show();
	      }
	    }

	    show() {
	      if (this._isTransitioning || this._isShown()) {
	        return;
	      }

	      let actives = [];
	      let activesData;

	      if (this._config.parent) {
	        const children = SelectorEngine__default.default.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
	        actives = SelectorEngine__default.default.find(SELECTOR_ACTIVES, this._config.parent).filter(elem => !children.includes(elem)); // remove children if greater depth
	      }

	      const container = SelectorEngine__default.default.findOne(this._selector);

	      if (actives.length) {
	        const tempActiveData = actives.find(elem => container !== elem);
	        activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null;

	        if (activesData && activesData._isTransitioning) {
	          return;
	        }
	      }

	      const startEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW);

	      if (startEvent.defaultPrevented) {
	        return;
	      }

	      actives.forEach(elemActive => {
	        if (container !== elemActive) {
	          Collapse.getOrCreateInstance(elemActive, {
	            toggle: false
	          }).hide();
	        }

	        if (!activesData) {
	          Data__default.default.set(elemActive, DATA_KEY, null);
	        }
	      });

	      const dimension = this._getDimension();

	      this._element.classList.remove(CLASS_NAME_COLLAPSE);

	      this._element.classList.add(CLASS_NAME_COLLAPSING);

	      this._element.style[dimension] = 0;

	      this._addAriaAndCollapsedClass(this._triggerArray, true);

	      this._isTransitioning = true;

	      const complete = () => {
	        this._isTransitioning = false;

	        this._element.classList.remove(CLASS_NAME_COLLAPSING);

	        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

	        this._element.style[dimension] = '';
	        EventHandler__default.default.trigger(this._element, EVENT_SHOWN);
	      };

	      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
	      const scrollSize = `scroll${capitalizedDimension}`;

	      this._queueCallback(complete, this._element, true);

	      this._element.style[dimension] = `${this._element[scrollSize]}px`;
	    }

	    hide() {
	      if (this._isTransitioning || !this._isShown()) {
	        return;
	      }

	      const startEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);

	      if (startEvent.defaultPrevented) {
	        return;
	      }

	      const dimension = this._getDimension();

	      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
	      reflow(this._element);

	      this._element.classList.add(CLASS_NAME_COLLAPSING);

	      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

	      const triggerArrayLength = this._triggerArray.length;

	      for (let i = 0; i < triggerArrayLength; i++) {
	        const trigger = this._triggerArray[i];
	        const elem = getElementFromSelector(trigger);

	        if (elem && !this._isShown(elem)) {
	          this._addAriaAndCollapsedClass([trigger], false);
	        }
	      }

	      this._isTransitioning = true;

	      const complete = () => {
	        this._isTransitioning = false;

	        this._element.classList.remove(CLASS_NAME_COLLAPSING);

	        this._element.classList.add(CLASS_NAME_COLLAPSE);

	        EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
	      };

	      this._element.style[dimension] = '';

	      this._queueCallback(complete, this._element, true);
	    }

	    _isShown(element = this._element) {
	      return element.classList.contains(CLASS_NAME_SHOW);
	    } // Private


	    _getConfig(config) {
	      config = { ...Default,
	        ...Manipulator__default.default.getDataAttributes(this._element),
	        ...config
	      };
	      config.toggle = Boolean(config.toggle); // Coerce string values

	      config.parent = getElement(config.parent);
	      typeCheckConfig(NAME, config, DefaultType);
	      return config;
	    }

	    _getDimension() {
	      return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
	    }

	    _initializeChildren() {
	      if (!this._config.parent) {
	        return;
	      }

	      const children = SelectorEngine__default.default.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
	      SelectorEngine__default.default.find(SELECTOR_DATA_TOGGLE, this._config.parent).filter(elem => !children.includes(elem)).forEach(element => {
	        const selected = getElementFromSelector(element);

	        if (selected) {
	          this._addAriaAndCollapsedClass([element], this._isShown(selected));
	        }
	      });
	    }

	    _addAriaAndCollapsedClass(triggerArray, isOpen) {
	      if (!triggerArray.length) {
	        return;
	      }

	      triggerArray.forEach(elem => {
	        if (isOpen) {
	          elem.classList.remove(CLASS_NAME_COLLAPSED);
	        } else {
	          elem.classList.add(CLASS_NAME_COLLAPSED);
	        }

	        elem.setAttribute('aria-expanded', isOpen);
	      });
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const _config = {};

	        if (typeof config === 'string' && /show|hide/.test(config)) {
	          _config.toggle = false;
	        }

	        const data = Collapse.getOrCreateInstance(this, _config);

	        if (typeof config === 'string') {
	          if (typeof data[config] === 'undefined') {
	            throw new TypeError(`No method named "${config}"`);
	          }

	          data[config]();
	        }
	      });
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * Data Api implementation
	   * ------------------------------------------------------------------------
	   */


	  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
	    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
	      event.preventDefault();
	    }

	    const selector = getSelectorFromElement(this);
	    const selectorElements = SelectorEngine__default.default.find(selector);
	    selectorElements.forEach(element => {
	      Collapse.getOrCreateInstance(element, {
	        toggle: false
	      }).toggle();
	    });
	  });
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Collapse to jQuery only if jQuery is present
	   */

	  defineJQueryPlugin(Collapse);

	  return Collapse;

	}));

	}(collapse$1));

	var collapse = collapse$1.exports;

	var dropdown$1 = {exports: {}};

	var top = 'top';
	var bottom = 'bottom';
	var right = 'right';
	var left = 'left';
	var auto = 'auto';
	var basePlacements = [top, bottom, right, left];
	var start = 'start';
	var end = 'end';
	var clippingParents = 'clippingParents';
	var viewport = 'viewport';
	var popper = 'popper';
	var reference = 'reference';
	var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
	  return acc.concat([placement + "-" + start, placement + "-" + end]);
	}, []);
	var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
	  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
	}, []); // modifiers that need to read the DOM

	var beforeRead = 'beforeRead';
	var read = 'read';
	var afterRead = 'afterRead'; // pure-logic modifiers

	var beforeMain = 'beforeMain';
	var main = 'main';
	var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

	var beforeWrite = 'beforeWrite';
	var write = 'write';
	var afterWrite = 'afterWrite';
	var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

	function getNodeName(element) {
	  return element ? (element.nodeName || '').toLowerCase() : null;
	}

	function getWindow(node) {
	  if (node == null) {
	    return window;
	  }

	  if (node.toString() !== '[object Window]') {
	    var ownerDocument = node.ownerDocument;
	    return ownerDocument ? ownerDocument.defaultView || window : window;
	  }

	  return node;
	}

	function isElement(node) {
	  var OwnElement = getWindow(node).Element;
	  return node instanceof OwnElement || node instanceof Element;
	}

	function isHTMLElement(node) {
	  var OwnElement = getWindow(node).HTMLElement;
	  return node instanceof OwnElement || node instanceof HTMLElement;
	}

	function isShadowRoot(node) {
	  // IE 11 has no ShadowRoot
	  if (typeof ShadowRoot === 'undefined') {
	    return false;
	  }

	  var OwnElement = getWindow(node).ShadowRoot;
	  return node instanceof OwnElement || node instanceof ShadowRoot;
	}

	// and applies them to the HTMLElements such as popper and arrow

	function applyStyles(_ref) {
	  var state = _ref.state;
	  Object.keys(state.elements).forEach(function (name) {
	    var style = state.styles[name] || {};
	    var attributes = state.attributes[name] || {};
	    var element = state.elements[name]; // arrow is optional + virtual elements

	    if (!isHTMLElement(element) || !getNodeName(element)) {
	      return;
	    } // Flow doesn't support to extend this property, but it's the most
	    // effective way to apply styles to an HTMLElement
	    // $FlowFixMe[cannot-write]


	    Object.assign(element.style, style);
	    Object.keys(attributes).forEach(function (name) {
	      var value = attributes[name];

	      if (value === false) {
	        element.removeAttribute(name);
	      } else {
	        element.setAttribute(name, value === true ? '' : value);
	      }
	    });
	  });
	}

	function effect$2(_ref2) {
	  var state = _ref2.state;
	  var initialStyles = {
	    popper: {
	      position: state.options.strategy,
	      left: '0',
	      top: '0',
	      margin: '0'
	    },
	    arrow: {
	      position: 'absolute'
	    },
	    reference: {}
	  };
	  Object.assign(state.elements.popper.style, initialStyles.popper);
	  state.styles = initialStyles;

	  if (state.elements.arrow) {
	    Object.assign(state.elements.arrow.style, initialStyles.arrow);
	  }

	  return function () {
	    Object.keys(state.elements).forEach(function (name) {
	      var element = state.elements[name];
	      var attributes = state.attributes[name] || {};
	      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

	      var style = styleProperties.reduce(function (style, property) {
	        style[property] = '';
	        return style;
	      }, {}); // arrow is optional + virtual elements

	      if (!isHTMLElement(element) || !getNodeName(element)) {
	        return;
	      }

	      Object.assign(element.style, style);
	      Object.keys(attributes).forEach(function (attribute) {
	        element.removeAttribute(attribute);
	      });
	    });
	  };
	} // eslint-disable-next-line import/no-unused-modules


	var applyStyles$1 = {
	  name: 'applyStyles',
	  enabled: true,
	  phase: 'write',
	  fn: applyStyles,
	  effect: effect$2,
	  requires: ['computeStyles']
	};

	function getBasePlacement(placement) {
	  return placement.split('-')[0];
	}

	var max = Math.max;
	var min = Math.min;
	var round = Math.round;

	function getBoundingClientRect(element, includeScale) {
	  if (includeScale === void 0) {
	    includeScale = false;
	  }

	  var rect = element.getBoundingClientRect();
	  var scaleX = 1;
	  var scaleY = 1;

	  if (isHTMLElement(element) && includeScale) {
	    var offsetHeight = element.offsetHeight;
	    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
	    // Fallback to 1 in case both values are `0`

	    if (offsetWidth > 0) {
	      scaleX = round(rect.width) / offsetWidth || 1;
	    }

	    if (offsetHeight > 0) {
	      scaleY = round(rect.height) / offsetHeight || 1;
	    }
	  }

	  return {
	    width: rect.width / scaleX,
	    height: rect.height / scaleY,
	    top: rect.top / scaleY,
	    right: rect.right / scaleX,
	    bottom: rect.bottom / scaleY,
	    left: rect.left / scaleX,
	    x: rect.left / scaleX,
	    y: rect.top / scaleY
	  };
	}

	// means it doesn't take into account transforms.

	function getLayoutRect(element) {
	  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
	  // Fixes https://github.com/popperjs/popper-core/issues/1223

	  var width = element.offsetWidth;
	  var height = element.offsetHeight;

	  if (Math.abs(clientRect.width - width) <= 1) {
	    width = clientRect.width;
	  }

	  if (Math.abs(clientRect.height - height) <= 1) {
	    height = clientRect.height;
	  }

	  return {
	    x: element.offsetLeft,
	    y: element.offsetTop,
	    width: width,
	    height: height
	  };
	}

	function contains(parent, child) {
	  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

	  if (parent.contains(child)) {
	    return true;
	  } // then fallback to custom implementation with Shadow DOM support
	  else if (rootNode && isShadowRoot(rootNode)) {
	      var next = child;

	      do {
	        if (next && parent.isSameNode(next)) {
	          return true;
	        } // $FlowFixMe[prop-missing]: need a better way to handle this...


	        next = next.parentNode || next.host;
	      } while (next);
	    } // Give up, the result is false


	  return false;
	}

	function getComputedStyle$1(element) {
	  return getWindow(element).getComputedStyle(element);
	}

	function isTableElement(element) {
	  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
	}

	function getDocumentElement(element) {
	  // $FlowFixMe[incompatible-return]: assume body is always available
	  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
	  element.document) || window.document).documentElement;
	}

	function getParentNode(element) {
	  if (getNodeName(element) === 'html') {
	    return element;
	  }

	  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
	    // $FlowFixMe[incompatible-return]
	    // $FlowFixMe[prop-missing]
	    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
	    element.parentNode || ( // DOM Element detected
	    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
	    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
	    getDocumentElement(element) // fallback

	  );
	}

	function getTrueOffsetParent(element) {
	  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
	  getComputedStyle$1(element).position === 'fixed') {
	    return null;
	  }

	  return element.offsetParent;
	} // `.offsetParent` reports `null` for fixed elements, while absolute elements
	// return the containing block


	function getContainingBlock(element) {
	  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
	  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

	  if (isIE && isHTMLElement(element)) {
	    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
	    var elementCss = getComputedStyle$1(element);

	    if (elementCss.position === 'fixed') {
	      return null;
	    }
	  }

	  var currentNode = getParentNode(element);

	  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
	    var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
	    // create a containing block.
	    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

	    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
	      return currentNode;
	    } else {
	      currentNode = currentNode.parentNode;
	    }
	  }

	  return null;
	} // Gets the closest ancestor positioned element. Handles some edge cases,
	// such as table ancestors and cross browser bugs.


	function getOffsetParent(element) {
	  var window = getWindow(element);
	  var offsetParent = getTrueOffsetParent(element);

	  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
	    offsetParent = getTrueOffsetParent(offsetParent);
	  }

	  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
	    return window;
	  }

	  return offsetParent || getContainingBlock(element) || window;
	}

	function getMainAxisFromPlacement(placement) {
	  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
	}

	function within(min$1, value, max$1) {
	  return max(min$1, min(value, max$1));
	}
	function withinMaxClamp(min, value, max) {
	  var v = within(min, value, max);
	  return v > max ? max : v;
	}

	function getFreshSideObject() {
	  return {
	    top: 0,
	    right: 0,
	    bottom: 0,
	    left: 0
	  };
	}

	function mergePaddingObject(paddingObject) {
	  return Object.assign({}, getFreshSideObject(), paddingObject);
	}

	function expandToHashMap(value, keys) {
	  return keys.reduce(function (hashMap, key) {
	    hashMap[key] = value;
	    return hashMap;
	  }, {});
	}

	var toPaddingObject = function toPaddingObject(padding, state) {
	  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : padding;
	  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	};

	function arrow(_ref) {
	  var _state$modifiersData$;

	  var state = _ref.state,
	      name = _ref.name,
	      options = _ref.options;
	  var arrowElement = state.elements.arrow;
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var basePlacement = getBasePlacement(state.placement);
	  var axis = getMainAxisFromPlacement(basePlacement);
	  var isVertical = [left, right].indexOf(basePlacement) >= 0;
	  var len = isVertical ? 'height' : 'width';

	  if (!arrowElement || !popperOffsets) {
	    return;
	  }

	  var paddingObject = toPaddingObject(options.padding, state);
	  var arrowRect = getLayoutRect(arrowElement);
	  var minProp = axis === 'y' ? top : left;
	  var maxProp = axis === 'y' ? bottom : right;
	  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
	  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
	  var arrowOffsetParent = getOffsetParent(arrowElement);
	  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
	  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
	  // outside of the popper bounds

	  var min = paddingObject[minProp];
	  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
	  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
	  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

	  var axisProp = axis;
	  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
	}

	function effect$1(_ref2) {
	  var state = _ref2.state,
	      options = _ref2.options;
	  var _options$element = options.element,
	      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

	  if (arrowElement == null) {
	    return;
	  } // CSS selector


	  if (typeof arrowElement === 'string') {
	    arrowElement = state.elements.popper.querySelector(arrowElement);

	    if (!arrowElement) {
	      return;
	    }
	  }

	  if (!contains(state.elements.popper, arrowElement)) {

	    return;
	  }

	  state.elements.arrow = arrowElement;
	} // eslint-disable-next-line import/no-unused-modules


	var arrow$1 = {
	  name: 'arrow',
	  enabled: true,
	  phase: 'main',
	  fn: arrow,
	  effect: effect$1,
	  requires: ['popperOffsets'],
	  requiresIfExists: ['preventOverflow']
	};

	function getVariation(placement) {
	  return placement.split('-')[1];
	}

	var unsetSides = {
	  top: 'auto',
	  right: 'auto',
	  bottom: 'auto',
	  left: 'auto'
	}; // Round the offsets to the nearest suitable subpixel based on the DPR.
	// Zooming can change the DPR, but it seems to report a value that will
	// cleanly divide the values into the appropriate subpixels.

	function roundOffsetsByDPR(_ref) {
	  var x = _ref.x,
	      y = _ref.y;
	  var win = window;
	  var dpr = win.devicePixelRatio || 1;
	  return {
	    x: round(x * dpr) / dpr || 0,
	    y: round(y * dpr) / dpr || 0
	  };
	}

	function mapToStyles(_ref2) {
	  var _Object$assign2;

	  var popper = _ref2.popper,
	      popperRect = _ref2.popperRect,
	      placement = _ref2.placement,
	      variation = _ref2.variation,
	      offsets = _ref2.offsets,
	      position = _ref2.position,
	      gpuAcceleration = _ref2.gpuAcceleration,
	      adaptive = _ref2.adaptive,
	      roundOffsets = _ref2.roundOffsets,
	      isFixed = _ref2.isFixed;

	  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
	      _ref3$x = _ref3.x,
	      x = _ref3$x === void 0 ? 0 : _ref3$x,
	      _ref3$y = _ref3.y,
	      y = _ref3$y === void 0 ? 0 : _ref3$y;

	  var hasX = offsets.hasOwnProperty('x');
	  var hasY = offsets.hasOwnProperty('y');
	  var sideX = left;
	  var sideY = top;
	  var win = window;

	  if (adaptive) {
	    var offsetParent = getOffsetParent(popper);
	    var heightProp = 'clientHeight';
	    var widthProp = 'clientWidth';

	    if (offsetParent === getWindow(popper)) {
	      offsetParent = getDocumentElement(popper);

	      if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
	        heightProp = 'scrollHeight';
	        widthProp = 'scrollWidth';
	      }
	    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


	    offsetParent = offsetParent;

	    if (placement === top || (placement === left || placement === right) && variation === end) {
	      sideY = bottom;
	      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
	      offsetParent[heightProp];
	      y -= offsetY - popperRect.height;
	      y *= gpuAcceleration ? 1 : -1;
	    }

	    if (placement === left || (placement === top || placement === bottom) && variation === end) {
	      sideX = right;
	      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
	      offsetParent[widthProp];
	      x -= offsetX - popperRect.width;
	      x *= gpuAcceleration ? 1 : -1;
	    }
	  }

	  var commonStyles = Object.assign({
	    position: position
	  }, adaptive && unsetSides);

	  if (gpuAcceleration) {
	    var _Object$assign;

	    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
	  }

	  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
	}

	function computeStyles(_ref4) {
	  var state = _ref4.state,
	      options = _ref4.options;
	  var _options$gpuAccelerat = options.gpuAcceleration,
	      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
	      _options$adaptive = options.adaptive,
	      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
	      _options$roundOffsets = options.roundOffsets,
	      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

	  var commonStyles = {
	    placement: getBasePlacement(state.placement),
	    variation: getVariation(state.placement),
	    popper: state.elements.popper,
	    popperRect: state.rects.popper,
	    gpuAcceleration: gpuAcceleration,
	    isFixed: state.options.strategy === 'fixed'
	  };

	  if (state.modifiersData.popperOffsets != null) {
	    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.popperOffsets,
	      position: state.options.strategy,
	      adaptive: adaptive,
	      roundOffsets: roundOffsets
	    })));
	  }

	  if (state.modifiersData.arrow != null) {
	    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.arrow,
	      position: 'absolute',
	      adaptive: false,
	      roundOffsets: roundOffsets
	    })));
	  }

	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-placement': state.placement
	  });
	} // eslint-disable-next-line import/no-unused-modules


	var computeStyles$1 = {
	  name: 'computeStyles',
	  enabled: true,
	  phase: 'beforeWrite',
	  fn: computeStyles,
	  data: {}
	};

	var passive = {
	  passive: true
	};

	function effect(_ref) {
	  var state = _ref.state,
	      instance = _ref.instance,
	      options = _ref.options;
	  var _options$scroll = options.scroll,
	      scroll = _options$scroll === void 0 ? true : _options$scroll,
	      _options$resize = options.resize,
	      resize = _options$resize === void 0 ? true : _options$resize;
	  var window = getWindow(state.elements.popper);
	  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

	  if (scroll) {
	    scrollParents.forEach(function (scrollParent) {
	      scrollParent.addEventListener('scroll', instance.update, passive);
	    });
	  }

	  if (resize) {
	    window.addEventListener('resize', instance.update, passive);
	  }

	  return function () {
	    if (scroll) {
	      scrollParents.forEach(function (scrollParent) {
	        scrollParent.removeEventListener('scroll', instance.update, passive);
	      });
	    }

	    if (resize) {
	      window.removeEventListener('resize', instance.update, passive);
	    }
	  };
	} // eslint-disable-next-line import/no-unused-modules


	var eventListeners = {
	  name: 'eventListeners',
	  enabled: true,
	  phase: 'write',
	  fn: function fn() {},
	  effect: effect,
	  data: {}
	};

	var hash$1 = {
	  left: 'right',
	  right: 'left',
	  bottom: 'top',
	  top: 'bottom'
	};
	function getOppositePlacement(placement) {
	  return placement.replace(/left|right|bottom|top/g, function (matched) {
	    return hash$1[matched];
	  });
	}

	var hash = {
	  start: 'end',
	  end: 'start'
	};
	function getOppositeVariationPlacement(placement) {
	  return placement.replace(/start|end/g, function (matched) {
	    return hash[matched];
	  });
	}

	function getWindowScroll(node) {
	  var win = getWindow(node);
	  var scrollLeft = win.pageXOffset;
	  var scrollTop = win.pageYOffset;
	  return {
	    scrollLeft: scrollLeft,
	    scrollTop: scrollTop
	  };
	}

	function getWindowScrollBarX(element) {
	  // If <html> has a CSS width greater than the viewport, then this will be
	  // incorrect for RTL.
	  // Popper 1 is broken in this case and never had a bug report so let's assume
	  // it's not an issue. I don't think anyone ever specifies width on <html>
	  // anyway.
	  // Browsers where the left scrollbar doesn't cause an issue report `0` for
	  // this (e.g. Edge 2019, IE11, Safari)
	  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
	}

	function getViewportRect(element) {
	  var win = getWindow(element);
	  var html = getDocumentElement(element);
	  var visualViewport = win.visualViewport;
	  var width = html.clientWidth;
	  var height = html.clientHeight;
	  var x = 0;
	  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
	  // can be obscured underneath it.
	  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
	  // if it isn't open, so if this isn't available, the popper will be detected
	  // to overflow the bottom of the screen too early.

	  if (visualViewport) {
	    width = visualViewport.width;
	    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
	    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
	    // errors due to floating point numbers, so we need to check precision.
	    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
	    // Feature detection fails in mobile emulation mode in Chrome.
	    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
	    // 0.001
	    // Fallback here: "Not Safari" userAgent

	    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
	      x = visualViewport.offsetLeft;
	      y = visualViewport.offsetTop;
	    }
	  }

	  return {
	    width: width,
	    height: height,
	    x: x + getWindowScrollBarX(element),
	    y: y
	  };
	}

	// of the `<html>` and `<body>` rect bounds if horizontally scrollable

	function getDocumentRect(element) {
	  var _element$ownerDocumen;

	  var html = getDocumentElement(element);
	  var winScroll = getWindowScroll(element);
	  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
	  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
	  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
	  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
	  var y = -winScroll.scrollTop;

	  if (getComputedStyle$1(body || html).direction === 'rtl') {
	    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
	  }

	  return {
	    width: width,
	    height: height,
	    x: x,
	    y: y
	  };
	}

	function isScrollParent(element) {
	  // Firefox wants us to check `-x` and `-y` variations as well
	  var _getComputedStyle = getComputedStyle$1(element),
	      overflow = _getComputedStyle.overflow,
	      overflowX = _getComputedStyle.overflowX,
	      overflowY = _getComputedStyle.overflowY;

	  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
	}

	function getScrollParent(node) {
	  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
	    // $FlowFixMe[incompatible-return]: assume body is always available
	    return node.ownerDocument.body;
	  }

	  if (isHTMLElement(node) && isScrollParent(node)) {
	    return node;
	  }

	  return getScrollParent(getParentNode(node));
	}

	/*
	given a DOM element, return the list of all scroll parents, up the list of ancesors
	until we get to the top window object. This list is what we attach scroll listeners
	to, because if any of these parent elements scroll, we'll need to re-calculate the
	reference element's position.
	*/

	function listScrollParents(element, list) {
	  var _element$ownerDocumen;

	  if (list === void 0) {
	    list = [];
	  }

	  var scrollParent = getScrollParent(element);
	  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
	  var win = getWindow(scrollParent);
	  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
	  var updatedList = list.concat(target);
	  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
	  updatedList.concat(listScrollParents(getParentNode(target)));
	}

	function rectToClientRect(rect) {
	  return Object.assign({}, rect, {
	    left: rect.x,
	    top: rect.y,
	    right: rect.x + rect.width,
	    bottom: rect.y + rect.height
	  });
	}

	function getInnerBoundingClientRect(element) {
	  var rect = getBoundingClientRect(element);
	  rect.top = rect.top + element.clientTop;
	  rect.left = rect.left + element.clientLeft;
	  rect.bottom = rect.top + element.clientHeight;
	  rect.right = rect.left + element.clientWidth;
	  rect.width = element.clientWidth;
	  rect.height = element.clientHeight;
	  rect.x = rect.left;
	  rect.y = rect.top;
	  return rect;
	}

	function getClientRectFromMixedType(element, clippingParent) {
	  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
	} // A "clipping parent" is an overflowable container with the characteristic of
	// clipping (or hiding) overflowing elements with a position different from
	// `initial`


	function getClippingParents(element) {
	  var clippingParents = listScrollParents(getParentNode(element));
	  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
	  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

	  if (!isElement(clipperElement)) {
	    return [];
	  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


	  return clippingParents.filter(function (clippingParent) {
	    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body' && (canEscapeClipping ? getComputedStyle$1(clippingParent).position !== 'static' : true);
	  });
	} // Gets the maximum area that the element is visible in due to any number of
	// clipping parents


	function getClippingRect(element, boundary, rootBoundary) {
	  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
	  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
	  var firstClippingParent = clippingParents[0];
	  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
	    var rect = getClientRectFromMixedType(element, clippingParent);
	    accRect.top = max(rect.top, accRect.top);
	    accRect.right = min(rect.right, accRect.right);
	    accRect.bottom = min(rect.bottom, accRect.bottom);
	    accRect.left = max(rect.left, accRect.left);
	    return accRect;
	  }, getClientRectFromMixedType(element, firstClippingParent));
	  clippingRect.width = clippingRect.right - clippingRect.left;
	  clippingRect.height = clippingRect.bottom - clippingRect.top;
	  clippingRect.x = clippingRect.left;
	  clippingRect.y = clippingRect.top;
	  return clippingRect;
	}

	function computeOffsets(_ref) {
	  var reference = _ref.reference,
	      element = _ref.element,
	      placement = _ref.placement;
	  var basePlacement = placement ? getBasePlacement(placement) : null;
	  var variation = placement ? getVariation(placement) : null;
	  var commonX = reference.x + reference.width / 2 - element.width / 2;
	  var commonY = reference.y + reference.height / 2 - element.height / 2;
	  var offsets;

	  switch (basePlacement) {
	    case top:
	      offsets = {
	        x: commonX,
	        y: reference.y - element.height
	      };
	      break;

	    case bottom:
	      offsets = {
	        x: commonX,
	        y: reference.y + reference.height
	      };
	      break;

	    case right:
	      offsets = {
	        x: reference.x + reference.width,
	        y: commonY
	      };
	      break;

	    case left:
	      offsets = {
	        x: reference.x - element.width,
	        y: commonY
	      };
	      break;

	    default:
	      offsets = {
	        x: reference.x,
	        y: reference.y
	      };
	  }

	  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

	  if (mainAxis != null) {
	    var len = mainAxis === 'y' ? 'height' : 'width';

	    switch (variation) {
	      case start:
	        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
	        break;

	      case end:
	        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
	        break;
	    }
	  }

	  return offsets;
	}

	function detectOverflow(state, options) {
	  if (options === void 0) {
	    options = {};
	  }

	  var _options = options,
	      _options$placement = _options.placement,
	      placement = _options$placement === void 0 ? state.placement : _options$placement,
	      _options$boundary = _options.boundary,
	      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
	      _options$rootBoundary = _options.rootBoundary,
	      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
	      _options$elementConte = _options.elementContext,
	      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
	      _options$altBoundary = _options.altBoundary,
	      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
	      _options$padding = _options.padding,
	      padding = _options$padding === void 0 ? 0 : _options$padding;
	  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	  var altContext = elementContext === popper ? reference : popper;
	  var popperRect = state.rects.popper;
	  var element = state.elements[altBoundary ? altContext : elementContext];
	  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
	  var referenceClientRect = getBoundingClientRect(state.elements.reference);
	  var popperOffsets = computeOffsets({
	    reference: referenceClientRect,
	    element: popperRect,
	    strategy: 'absolute',
	    placement: placement
	  });
	  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
	  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
	  // 0 or negative = within the clipping rect

	  var overflowOffsets = {
	    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
	    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
	    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
	    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
	  };
	  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

	  if (elementContext === popper && offsetData) {
	    var offset = offsetData[placement];
	    Object.keys(overflowOffsets).forEach(function (key) {
	      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
	      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
	      overflowOffsets[key] += offset[axis] * multiply;
	    });
	  }

	  return overflowOffsets;
	}

	function computeAutoPlacement(state, options) {
	  if (options === void 0) {
	    options = {};
	  }

	  var _options = options,
	      placement = _options.placement,
	      boundary = _options.boundary,
	      rootBoundary = _options.rootBoundary,
	      padding = _options.padding,
	      flipVariations = _options.flipVariations,
	      _options$allowedAutoP = _options.allowedAutoPlacements,
	      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
	  var variation = getVariation(placement);
	  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
	    return getVariation(placement) === variation;
	  }) : basePlacements;
	  var allowedPlacements = placements$1.filter(function (placement) {
	    return allowedAutoPlacements.indexOf(placement) >= 0;
	  });

	  if (allowedPlacements.length === 0) {
	    allowedPlacements = placements$1;
	  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


	  var overflows = allowedPlacements.reduce(function (acc, placement) {
	    acc[placement] = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding
	    })[getBasePlacement(placement)];
	    return acc;
	  }, {});
	  return Object.keys(overflows).sort(function (a, b) {
	    return overflows[a] - overflows[b];
	  });
	}

	function getExpandedFallbackPlacements(placement) {
	  if (getBasePlacement(placement) === auto) {
	    return [];
	  }

	  var oppositePlacement = getOppositePlacement(placement);
	  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
	}

	function flip(_ref) {
	  var state = _ref.state,
	      options = _ref.options,
	      name = _ref.name;

	  if (state.modifiersData[name]._skip) {
	    return;
	  }

	  var _options$mainAxis = options.mainAxis,
	      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	      _options$altAxis = options.altAxis,
	      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
	      specifiedFallbackPlacements = options.fallbackPlacements,
	      padding = options.padding,
	      boundary = options.boundary,
	      rootBoundary = options.rootBoundary,
	      altBoundary = options.altBoundary,
	      _options$flipVariatio = options.flipVariations,
	      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
	      allowedAutoPlacements = options.allowedAutoPlacements;
	  var preferredPlacement = state.options.placement;
	  var basePlacement = getBasePlacement(preferredPlacement);
	  var isBasePlacement = basePlacement === preferredPlacement;
	  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
	  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
	    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding,
	      flipVariations: flipVariations,
	      allowedAutoPlacements: allowedAutoPlacements
	    }) : placement);
	  }, []);
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var checksMap = new Map();
	  var makeFallbackChecks = true;
	  var firstFittingPlacement = placements[0];

	  for (var i = 0; i < placements.length; i++) {
	    var placement = placements[i];

	    var _basePlacement = getBasePlacement(placement);

	    var isStartVariation = getVariation(placement) === start;
	    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
	    var len = isVertical ? 'width' : 'height';
	    var overflow = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      altBoundary: altBoundary,
	      padding: padding
	    });
	    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

	    if (referenceRect[len] > popperRect[len]) {
	      mainVariationSide = getOppositePlacement(mainVariationSide);
	    }

	    var altVariationSide = getOppositePlacement(mainVariationSide);
	    var checks = [];

	    if (checkMainAxis) {
	      checks.push(overflow[_basePlacement] <= 0);
	    }

	    if (checkAltAxis) {
	      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
	    }

	    if (checks.every(function (check) {
	      return check;
	    })) {
	      firstFittingPlacement = placement;
	      makeFallbackChecks = false;
	      break;
	    }

	    checksMap.set(placement, checks);
	  }

	  if (makeFallbackChecks) {
	    // `2` may be desired in some cases – research later
	    var numberOfChecks = flipVariations ? 3 : 1;

	    var _loop = function _loop(_i) {
	      var fittingPlacement = placements.find(function (placement) {
	        var checks = checksMap.get(placement);

	        if (checks) {
	          return checks.slice(0, _i).every(function (check) {
	            return check;
	          });
	        }
	      });

	      if (fittingPlacement) {
	        firstFittingPlacement = fittingPlacement;
	        return "break";
	      }
	    };

	    for (var _i = numberOfChecks; _i > 0; _i--) {
	      var _ret = _loop(_i);

	      if (_ret === "break") break;
	    }
	  }

	  if (state.placement !== firstFittingPlacement) {
	    state.modifiersData[name]._skip = true;
	    state.placement = firstFittingPlacement;
	    state.reset = true;
	  }
	} // eslint-disable-next-line import/no-unused-modules


	var flip$1 = {
	  name: 'flip',
	  enabled: true,
	  phase: 'main',
	  fn: flip,
	  requiresIfExists: ['offset'],
	  data: {
	    _skip: false
	  }
	};

	function getSideOffsets(overflow, rect, preventedOffsets) {
	  if (preventedOffsets === void 0) {
	    preventedOffsets = {
	      x: 0,
	      y: 0
	    };
	  }

	  return {
	    top: overflow.top - rect.height - preventedOffsets.y,
	    right: overflow.right - rect.width + preventedOffsets.x,
	    bottom: overflow.bottom - rect.height + preventedOffsets.y,
	    left: overflow.left - rect.width - preventedOffsets.x
	  };
	}

	function isAnySideFullyClipped(overflow) {
	  return [top, right, bottom, left].some(function (side) {
	    return overflow[side] >= 0;
	  });
	}

	function hide(_ref) {
	  var state = _ref.state,
	      name = _ref.name;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var preventedOffsets = state.modifiersData.preventOverflow;
	  var referenceOverflow = detectOverflow(state, {
	    elementContext: 'reference'
	  });
	  var popperAltOverflow = detectOverflow(state, {
	    altBoundary: true
	  });
	  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
	  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
	  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
	  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
	  state.modifiersData[name] = {
	    referenceClippingOffsets: referenceClippingOffsets,
	    popperEscapeOffsets: popperEscapeOffsets,
	    isReferenceHidden: isReferenceHidden,
	    hasPopperEscaped: hasPopperEscaped
	  };
	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-reference-hidden': isReferenceHidden,
	    'data-popper-escaped': hasPopperEscaped
	  });
	} // eslint-disable-next-line import/no-unused-modules


	var hide$1 = {
	  name: 'hide',
	  enabled: true,
	  phase: 'main',
	  requiresIfExists: ['preventOverflow'],
	  fn: hide
	};

	function distanceAndSkiddingToXY(placement, rects, offset) {
	  var basePlacement = getBasePlacement(placement);
	  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

	  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
	    placement: placement
	  })) : offset,
	      skidding = _ref[0],
	      distance = _ref[1];

	  skidding = skidding || 0;
	  distance = (distance || 0) * invertDistance;
	  return [left, right].indexOf(basePlacement) >= 0 ? {
	    x: distance,
	    y: skidding
	  } : {
	    x: skidding,
	    y: distance
	  };
	}

	function offset(_ref2) {
	  var state = _ref2.state,
	      options = _ref2.options,
	      name = _ref2.name;
	  var _options$offset = options.offset,
	      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
	  var data = placements.reduce(function (acc, placement) {
	    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
	    return acc;
	  }, {});
	  var _data$state$placement = data[state.placement],
	      x = _data$state$placement.x,
	      y = _data$state$placement.y;

	  if (state.modifiersData.popperOffsets != null) {
	    state.modifiersData.popperOffsets.x += x;
	    state.modifiersData.popperOffsets.y += y;
	  }

	  state.modifiersData[name] = data;
	} // eslint-disable-next-line import/no-unused-modules


	var offset$1 = {
	  name: 'offset',
	  enabled: true,
	  phase: 'main',
	  requires: ['popperOffsets'],
	  fn: offset
	};

	function popperOffsets(_ref) {
	  var state = _ref.state,
	      name = _ref.name;
	  // Offsets are the actual position the popper needs to have to be
	  // properly positioned near its reference element
	  // This is the most basic placement, and will be adjusted by
	  // the modifiers in the next step
	  state.modifiersData[name] = computeOffsets({
	    reference: state.rects.reference,
	    element: state.rects.popper,
	    strategy: 'absolute',
	    placement: state.placement
	  });
	} // eslint-disable-next-line import/no-unused-modules


	var popperOffsets$1 = {
	  name: 'popperOffsets',
	  enabled: true,
	  phase: 'read',
	  fn: popperOffsets,
	  data: {}
	};

	function getAltAxis(axis) {
	  return axis === 'x' ? 'y' : 'x';
	}

	function preventOverflow(_ref) {
	  var state = _ref.state,
	      options = _ref.options,
	      name = _ref.name;
	  var _options$mainAxis = options.mainAxis,
	      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	      _options$altAxis = options.altAxis,
	      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
	      boundary = options.boundary,
	      rootBoundary = options.rootBoundary,
	      altBoundary = options.altBoundary,
	      padding = options.padding,
	      _options$tether = options.tether,
	      tether = _options$tether === void 0 ? true : _options$tether,
	      _options$tetherOffset = options.tetherOffset,
	      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
	  var overflow = detectOverflow(state, {
	    boundary: boundary,
	    rootBoundary: rootBoundary,
	    padding: padding,
	    altBoundary: altBoundary
	  });
	  var basePlacement = getBasePlacement(state.placement);
	  var variation = getVariation(state.placement);
	  var isBasePlacement = !variation;
	  var mainAxis = getMainAxisFromPlacement(basePlacement);
	  var altAxis = getAltAxis(mainAxis);
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : tetherOffset;
	  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
	    mainAxis: tetherOffsetValue,
	    altAxis: tetherOffsetValue
	  } : Object.assign({
	    mainAxis: 0,
	    altAxis: 0
	  }, tetherOffsetValue);
	  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
	  var data = {
	    x: 0,
	    y: 0
	  };

	  if (!popperOffsets) {
	    return;
	  }

	  if (checkMainAxis) {
	    var _offsetModifierState$;

	    var mainSide = mainAxis === 'y' ? top : left;
	    var altSide = mainAxis === 'y' ? bottom : right;
	    var len = mainAxis === 'y' ? 'height' : 'width';
	    var offset = popperOffsets[mainAxis];
	    var min$1 = offset + overflow[mainSide];
	    var max$1 = offset - overflow[altSide];
	    var additive = tether ? -popperRect[len] / 2 : 0;
	    var minLen = variation === start ? referenceRect[len] : popperRect[len];
	    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
	    // outside the reference bounds

	    var arrowElement = state.elements.arrow;
	    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
	      width: 0,
	      height: 0
	    };
	    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
	    var arrowPaddingMin = arrowPaddingObject[mainSide];
	    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
	    // to include its full size in the calculation. If the reference is small
	    // and near the edge of a boundary, the popper can overflow even if the
	    // reference is not overflowing as well (e.g. virtual elements with no
	    // width or height)

	    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
	    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
	    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
	    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
	    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
	    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
	    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
	    var tetherMax = offset + maxOffset - offsetModifierValue;
	    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
	    popperOffsets[mainAxis] = preventedOffset;
	    data[mainAxis] = preventedOffset - offset;
	  }

	  if (checkAltAxis) {
	    var _offsetModifierState$2;

	    var _mainSide = mainAxis === 'x' ? top : left;

	    var _altSide = mainAxis === 'x' ? bottom : right;

	    var _offset = popperOffsets[altAxis];

	    var _len = altAxis === 'y' ? 'height' : 'width';

	    var _min = _offset + overflow[_mainSide];

	    var _max = _offset - overflow[_altSide];

	    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

	    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

	    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

	    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

	    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

	    popperOffsets[altAxis] = _preventedOffset;
	    data[altAxis] = _preventedOffset - _offset;
	  }

	  state.modifiersData[name] = data;
	} // eslint-disable-next-line import/no-unused-modules


	var preventOverflow$1 = {
	  name: 'preventOverflow',
	  enabled: true,
	  phase: 'main',
	  fn: preventOverflow,
	  requiresIfExists: ['offset']
	};

	function getHTMLElementScroll(element) {
	  return {
	    scrollLeft: element.scrollLeft,
	    scrollTop: element.scrollTop
	  };
	}

	function getNodeScroll(node) {
	  if (node === getWindow(node) || !isHTMLElement(node)) {
	    return getWindowScroll(node);
	  } else {
	    return getHTMLElementScroll(node);
	  }
	}

	function isElementScaled(element) {
	  var rect = element.getBoundingClientRect();
	  var scaleX = round(rect.width) / element.offsetWidth || 1;
	  var scaleY = round(rect.height) / element.offsetHeight || 1;
	  return scaleX !== 1 || scaleY !== 1;
	} // Returns the composite rect of an element relative to its offsetParent.
	// Composite means it takes into account transforms as well as layout.


	function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
	  if (isFixed === void 0) {
	    isFixed = false;
	  }

	  var isOffsetParentAnElement = isHTMLElement(offsetParent);
	  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
	  var documentElement = getDocumentElement(offsetParent);
	  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
	  var scroll = {
	    scrollLeft: 0,
	    scrollTop: 0
	  };
	  var offsets = {
	    x: 0,
	    y: 0
	  };

	  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
	    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
	    isScrollParent(documentElement)) {
	      scroll = getNodeScroll(offsetParent);
	    }

	    if (isHTMLElement(offsetParent)) {
	      offsets = getBoundingClientRect(offsetParent, true);
	      offsets.x += offsetParent.clientLeft;
	      offsets.y += offsetParent.clientTop;
	    } else if (documentElement) {
	      offsets.x = getWindowScrollBarX(documentElement);
	    }
	  }

	  return {
	    x: rect.left + scroll.scrollLeft - offsets.x,
	    y: rect.top + scroll.scrollTop - offsets.y,
	    width: rect.width,
	    height: rect.height
	  };
	}

	function order(modifiers) {
	  var map = new Map();
	  var visited = new Set();
	  var result = [];
	  modifiers.forEach(function (modifier) {
	    map.set(modifier.name, modifier);
	  }); // On visiting object, check for its dependencies and visit them recursively

	  function sort(modifier) {
	    visited.add(modifier.name);
	    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
	    requires.forEach(function (dep) {
	      if (!visited.has(dep)) {
	        var depModifier = map.get(dep);

	        if (depModifier) {
	          sort(depModifier);
	        }
	      }
	    });
	    result.push(modifier);
	  }

	  modifiers.forEach(function (modifier) {
	    if (!visited.has(modifier.name)) {
	      // check for visited object
	      sort(modifier);
	    }
	  });
	  return result;
	}

	function orderModifiers(modifiers) {
	  // order based on dependencies
	  var orderedModifiers = order(modifiers); // order based on phase

	  return modifierPhases.reduce(function (acc, phase) {
	    return acc.concat(orderedModifiers.filter(function (modifier) {
	      return modifier.phase === phase;
	    }));
	  }, []);
	}

	function debounce(fn) {
	  var pending;
	  return function () {
	    if (!pending) {
	      pending = new Promise(function (resolve) {
	        Promise.resolve().then(function () {
	          pending = undefined;
	          resolve(fn());
	        });
	      });
	    }

	    return pending;
	  };
	}

	function mergeByName(modifiers) {
	  var merged = modifiers.reduce(function (merged, current) {
	    var existing = merged[current.name];
	    merged[current.name] = existing ? Object.assign({}, existing, current, {
	      options: Object.assign({}, existing.options, current.options),
	      data: Object.assign({}, existing.data, current.data)
	    }) : current;
	    return merged;
	  }, {}); // IE11 does not support Object.values

	  return Object.keys(merged).map(function (key) {
	    return merged[key];
	  });
	}

	var DEFAULT_OPTIONS = {
	  placement: 'bottom',
	  modifiers: [],
	  strategy: 'absolute'
	};

	function areValidElements() {
	  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  return !args.some(function (element) {
	    return !(element && typeof element.getBoundingClientRect === 'function');
	  });
	}

	function popperGenerator(generatorOptions) {
	  if (generatorOptions === void 0) {
	    generatorOptions = {};
	  }

	  var _generatorOptions = generatorOptions,
	      _generatorOptions$def = _generatorOptions.defaultModifiers,
	      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
	      _generatorOptions$def2 = _generatorOptions.defaultOptions,
	      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
	  return function createPopper(reference, popper, options) {
	    if (options === void 0) {
	      options = defaultOptions;
	    }

	    var state = {
	      placement: 'bottom',
	      orderedModifiers: [],
	      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
	      modifiersData: {},
	      elements: {
	        reference: reference,
	        popper: popper
	      },
	      attributes: {},
	      styles: {}
	    };
	    var effectCleanupFns = [];
	    var isDestroyed = false;
	    var instance = {
	      state: state,
	      setOptions: function setOptions(setOptionsAction) {
	        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
	        cleanupModifierEffects();
	        state.options = Object.assign({}, defaultOptions, state.options, options);
	        state.scrollParents = {
	          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
	          popper: listScrollParents(popper)
	        }; // Orders the modifiers based on their dependencies and `phase`
	        // properties

	        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

	        state.orderedModifiers = orderedModifiers.filter(function (m) {
	          return m.enabled;
	        }); // Validate the provided modifiers so that the consumer will get warned

	        runModifierEffects();
	        return instance.update();
	      },
	      // Sync update – it will always be executed, even if not necessary. This
	      // is useful for low frequency updates where sync behavior simplifies the
	      // logic.
	      // For high frequency updates (e.g. `resize` and `scroll` events), always
	      // prefer the async Popper#update method
	      forceUpdate: function forceUpdate() {
	        if (isDestroyed) {
	          return;
	        }

	        var _state$elements = state.elements,
	            reference = _state$elements.reference,
	            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
	        // anymore

	        if (!areValidElements(reference, popper)) {

	          return;
	        } // Store the reference and popper rects to be read by modifiers


	        state.rects = {
	          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
	          popper: getLayoutRect(popper)
	        }; // Modifiers have the ability to reset the current update cycle. The
	        // most common use case for this is the `flip` modifier changing the
	        // placement, which then needs to re-run all the modifiers, because the
	        // logic was previously ran for the previous placement and is therefore
	        // stale/incorrect

	        state.reset = false;
	        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
	        // is filled with the initial data specified by the modifier. This means
	        // it doesn't persist and is fresh on each update.
	        // To ensure persistent data, use `${name}#persistent`

	        state.orderedModifiers.forEach(function (modifier) {
	          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
	        });

	        for (var index = 0; index < state.orderedModifiers.length; index++) {

	          if (state.reset === true) {
	            state.reset = false;
	            index = -1;
	            continue;
	          }

	          var _state$orderedModifie = state.orderedModifiers[index],
	              fn = _state$orderedModifie.fn,
	              _state$orderedModifie2 = _state$orderedModifie.options,
	              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
	              name = _state$orderedModifie.name;

	          if (typeof fn === 'function') {
	            state = fn({
	              state: state,
	              options: _options,
	              name: name,
	              instance: instance
	            }) || state;
	          }
	        }
	      },
	      // Async and optimistically optimized update – it will not be executed if
	      // not necessary (debounced to run at most once-per-tick)
	      update: debounce(function () {
	        return new Promise(function (resolve) {
	          instance.forceUpdate();
	          resolve(state);
	        });
	      }),
	      destroy: function destroy() {
	        cleanupModifierEffects();
	        isDestroyed = true;
	      }
	    };

	    if (!areValidElements(reference, popper)) {

	      return instance;
	    }

	    instance.setOptions(options).then(function (state) {
	      if (!isDestroyed && options.onFirstUpdate) {
	        options.onFirstUpdate(state);
	      }
	    }); // Modifiers have the ability to execute arbitrary code before the first
	    // update cycle runs. They will be executed in the same order as the update
	    // cycle. This is useful when a modifier adds some persistent data that
	    // other modifiers need to use, but the modifier is run after the dependent
	    // one.

	    function runModifierEffects() {
	      state.orderedModifiers.forEach(function (_ref3) {
	        var name = _ref3.name,
	            _ref3$options = _ref3.options,
	            options = _ref3$options === void 0 ? {} : _ref3$options,
	            effect = _ref3.effect;

	        if (typeof effect === 'function') {
	          var cleanupFn = effect({
	            state: state,
	            name: name,
	            instance: instance,
	            options: options
	          });

	          var noopFn = function noopFn() {};

	          effectCleanupFns.push(cleanupFn || noopFn);
	        }
	      });
	    }

	    function cleanupModifierEffects() {
	      effectCleanupFns.forEach(function (fn) {
	        return fn();
	      });
	      effectCleanupFns = [];
	    }

	    return instance;
	  };
	}
	var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

	var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
	var createPopper$1 = /*#__PURE__*/popperGenerator({
	  defaultModifiers: defaultModifiers$1
	}); // eslint-disable-next-line import/no-unused-modules

	var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
	var createPopper = /*#__PURE__*/popperGenerator({
	  defaultModifiers: defaultModifiers
	}); // eslint-disable-next-line import/no-unused-modules

	var lib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		popperGenerator: popperGenerator,
		detectOverflow: detectOverflow,
		createPopperBase: createPopper$2,
		createPopper: createPopper,
		createPopperLite: createPopper$1,
		top: top,
		bottom: bottom,
		right: right,
		left: left,
		auto: auto,
		basePlacements: basePlacements,
		start: start,
		end: end,
		clippingParents: clippingParents,
		viewport: viewport,
		popper: popper,
		reference: reference,
		variationPlacements: variationPlacements,
		placements: placements,
		beforeRead: beforeRead,
		read: read,
		afterRead: afterRead,
		beforeMain: beforeMain,
		main: main,
		afterMain: afterMain,
		beforeWrite: beforeWrite,
		write: write,
		afterWrite: afterWrite,
		modifierPhases: modifierPhases,
		applyStyles: applyStyles$1,
		arrow: arrow$1,
		computeStyles: computeStyles$1,
		eventListeners: eventListeners,
		flip: flip$1,
		hide: hide$1,
		offset: offset$1,
		popperOffsets: popperOffsets$1,
		preventOverflow: preventOverflow$1
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(lib);

	/*!
	  * Bootstrap dropdown.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(require$$0, eventHandler.exports, manipulator.exports, selectorEngine.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (Popper, EventHandler, Manipulator, SelectorEngine, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  function _interopNamespace(e) {
	    if (e && e.__esModule) return e;
	    const n = Object.create(null);
	    if (e) {
	      for (const k in e) {
	        if (k !== 'default') {
	          const d = Object.getOwnPropertyDescriptor(e, k);
	          Object.defineProperty(n, k, d.get ? d : {
	            enumerable: true,
	            get: () => e[k]
	          });
	        }
	      }
	    }
	    n.default = e;
	    return Object.freeze(n);
	  }

	  const Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);
	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
	  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const toType = obj => {
	    if (obj === null || obj === undefined) {
	      return `${obj}`;
	    }

	    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	  };

	  const getSelector = element => {
	    let selector = element.getAttribute('data-bs-target');

	    if (!selector || selector === '#') {
	      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	      // `document.querySelector` will rightfully complain it is invalid.
	      // See https://github.com/twbs/bootstrap/issues/32273

	      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	        return null;
	      } // Just in case some CMS puts out a full URL with the anchor appended


	      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	        hrefAttr = `#${hrefAttr.split('#')[1]}`;
	      }

	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	    }

	    return selector;
	  };

	  const getElementFromSelector = element => {
	    const selector = getSelector(element);
	    return selector ? document.querySelector(selector) : null;
	  };

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const getElement = obj => {
	    if (isElement(obj)) {
	      // it's a jQuery object or a node element
	      return obj.jquery ? obj[0] : obj;
	    }

	    if (typeof obj === 'string' && obj.length > 0) {
	      return document.querySelector(obj);
	    }

	    return null;
	  };

	  const typeCheckConfig = (componentName, config, configTypes) => {
	    Object.keys(configTypes).forEach(property => {
	      const expectedTypes = configTypes[property];
	      const value = config[property];
	      const valueType = value && isElement(value) ? 'element' : toType(value);

	      if (!new RegExp(expectedTypes).test(valueType)) {
	        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
	      }
	    });
	  };

	  const isVisible = element => {
	    if (!isElement(element) || element.getClientRects().length === 0) {
	      return false;
	    }

	    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
	  };

	  const isDisabled = element => {
	    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
	      return true;
	    }

	    if (element.classList.contains('disabled')) {
	      return true;
	    }

	    if (typeof element.disabled !== 'undefined') {
	      return element.disabled;
	    }

	    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
	  };

	  const noop = () => {};

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const isRTL = () => document.documentElement.dir === 'rtl';

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };
	  /**
	   * Return the previous/next element of a list.
	   *
	   * @param {array} list    The list of elements
	   * @param activeElement   The active element
	   * @param shouldGetNext   Choose to get next or previous element
	   * @param isCycleAllowed
	   * @return {Element|elem} The proper element
	   */


	  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
	    let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed

	    if (index === -1) {
	      return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
	    }

	    const listLength = list.length;
	    index += shouldGetNext ? 1 : -1;

	    if (isCycleAllowed) {
	      index = (index + listLength) % listLength;
	    }

	    return list[Math.max(0, Math.min(index, listLength - 1))];
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): dropdown.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'dropdown';
	  const DATA_KEY = 'bs.dropdown';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const DATA_API_KEY = '.data-api';
	  const ESCAPE_KEY = 'Escape';
	  const SPACE_KEY = 'Space';
	  const TAB_KEY = 'Tab';
	  const ARROW_UP_KEY = 'ArrowUp';
	  const ARROW_DOWN_KEY = 'ArrowDown';
	  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

	  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY}`);
	  const EVENT_HIDE = `hide${EVENT_KEY}`;
	  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
	  const EVENT_SHOW = `show${EVENT_KEY}`;
	  const EVENT_SHOWN = `shown${EVENT_KEY}`;
	  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
	  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
	  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;
	  const CLASS_NAME_SHOW = 'show';
	  const CLASS_NAME_DROPUP = 'dropup';
	  const CLASS_NAME_DROPEND = 'dropend';
	  const CLASS_NAME_DROPSTART = 'dropstart';
	  const CLASS_NAME_NAVBAR = 'navbar';
	  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dropdown"]';
	  const SELECTOR_MENU = '.dropdown-menu';
	  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
	  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
	  const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
	  const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
	  const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
	  const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
	  const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
	  const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
	  const Default = {
	    offset: [0, 2],
	    boundary: 'clippingParents',
	    reference: 'toggle',
	    display: 'dynamic',
	    popperConfig: null,
	    autoClose: true
	  };
	  const DefaultType = {
	    offset: '(array|string|function)',
	    boundary: '(string|element)',
	    reference: '(string|element|object)',
	    display: 'string',
	    popperConfig: '(null|object|function)',
	    autoClose: '(boolean|string)'
	  };
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Dropdown extends BaseComponent__default.default {
	    constructor(element, config) {
	      super(element);
	      this._popper = null;
	      this._config = this._getConfig(config);
	      this._menu = this._getMenuElement();
	      this._inNavbar = this._detectNavbar();
	    } // Getters


	    static get Default() {
	      return Default;
	    }

	    static get DefaultType() {
	      return DefaultType;
	    }

	    static get NAME() {
	      return NAME;
	    } // Public


	    toggle() {
	      return this._isShown() ? this.hide() : this.show();
	    }

	    show() {
	      if (isDisabled(this._element) || this._isShown(this._menu)) {
	        return;
	      }

	      const relatedTarget = {
	        relatedTarget: this._element
	      };
	      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, relatedTarget);

	      if (showEvent.defaultPrevented) {
	        return;
	      }

	      const parent = Dropdown.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar

	      if (this._inNavbar) {
	        Manipulator__default.default.setDataAttribute(this._menu, 'popper', 'none');
	      } else {
	        this._createPopper(parent);
	      } // If this is a touch-enabled device we add extra
	      // empty mouseover listeners to the body's immediate children;
	      // only needed because of broken event delegation on iOS
	      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


	      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
	        [].concat(...document.body.children).forEach(elem => EventHandler__default.default.on(elem, 'mouseover', noop));
	      }

	      this._element.focus();

	      this._element.setAttribute('aria-expanded', true);

	      this._menu.classList.add(CLASS_NAME_SHOW);

	      this._element.classList.add(CLASS_NAME_SHOW);

	      EventHandler__default.default.trigger(this._element, EVENT_SHOWN, relatedTarget);
	    }

	    hide() {
	      if (isDisabled(this._element) || !this._isShown(this._menu)) {
	        return;
	      }

	      const relatedTarget = {
	        relatedTarget: this._element
	      };

	      this._completeHide(relatedTarget);
	    }

	    dispose() {
	      if (this._popper) {
	        this._popper.destroy();
	      }

	      super.dispose();
	    }

	    update() {
	      this._inNavbar = this._detectNavbar();

	      if (this._popper) {
	        this._popper.update();
	      }
	    } // Private


	    _completeHide(relatedTarget) {
	      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE, relatedTarget);

	      if (hideEvent.defaultPrevented) {
	        return;
	      } // If this is a touch-enabled device we remove the extra
	      // empty mouseover listeners we added for iOS support


	      if ('ontouchstart' in document.documentElement) {
	        [].concat(...document.body.children).forEach(elem => EventHandler__default.default.off(elem, 'mouseover', noop));
	      }

	      if (this._popper) {
	        this._popper.destroy();
	      }

	      this._menu.classList.remove(CLASS_NAME_SHOW);

	      this._element.classList.remove(CLASS_NAME_SHOW);

	      this._element.setAttribute('aria-expanded', 'false');

	      Manipulator__default.default.removeDataAttribute(this._menu, 'popper');
	      EventHandler__default.default.trigger(this._element, EVENT_HIDDEN, relatedTarget);
	    }

	    _getConfig(config) {
	      config = { ...this.constructor.Default,
	        ...Manipulator__default.default.getDataAttributes(this._element),
	        ...config
	      };
	      typeCheckConfig(NAME, config, this.constructor.DefaultType);

	      if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
	        // Popper virtual elements require a getBoundingClientRect method
	        throw new TypeError(`${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
	      }

	      return config;
	    }

	    _createPopper(parent) {
	      if (typeof Popper__namespace === 'undefined') {
	        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
	      }

	      let referenceElement = this._element;

	      if (this._config.reference === 'parent') {
	        referenceElement = parent;
	      } else if (isElement(this._config.reference)) {
	        referenceElement = getElement(this._config.reference);
	      } else if (typeof this._config.reference === 'object') {
	        referenceElement = this._config.reference;
	      }

	      const popperConfig = this._getPopperConfig();

	      const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
	      this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);

	      if (isDisplayStatic) {
	        Manipulator__default.default.setDataAttribute(this._menu, 'popper', 'static');
	      }
	    }

	    _isShown(element = this._element) {
	      return element.classList.contains(CLASS_NAME_SHOW);
	    }

	    _getMenuElement() {
	      return SelectorEngine__default.default.next(this._element, SELECTOR_MENU)[0];
	    }

	    _getPlacement() {
	      const parentDropdown = this._element.parentNode;

	      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
	        return PLACEMENT_RIGHT;
	      }

	      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
	        return PLACEMENT_LEFT;
	      } // We need to trim the value because custom properties can also include spaces


	      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

	      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
	        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
	      }

	      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
	    }

	    _detectNavbar() {
	      return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
	    }

	    _getOffset() {
	      const {
	        offset
	      } = this._config;

	      if (typeof offset === 'string') {
	        return offset.split(',').map(val => Number.parseInt(val, 10));
	      }

	      if (typeof offset === 'function') {
	        return popperData => offset(popperData, this._element);
	      }

	      return offset;
	    }

	    _getPopperConfig() {
	      const defaultBsPopperConfig = {
	        placement: this._getPlacement(),
	        modifiers: [{
	          name: 'preventOverflow',
	          options: {
	            boundary: this._config.boundary
	          }
	        }, {
	          name: 'offset',
	          options: {
	            offset: this._getOffset()
	          }
	        }]
	      }; // Disable Popper if we have a static display

	      if (this._config.display === 'static') {
	        defaultBsPopperConfig.modifiers = [{
	          name: 'applyStyles',
	          enabled: false
	        }];
	      }

	      return { ...defaultBsPopperConfig,
	        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
	      };
	    }

	    _selectMenuItem({
	      key,
	      target
	    }) {
	      const items = SelectorEngine__default.default.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

	      if (!items.length) {
	        return;
	      } // if target isn't included in items (e.g. when expanding the dropdown)
	      // allow cycling to get the last item in case key equals ARROW_UP_KEY


	      getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const data = Dropdown.getOrCreateInstance(this, config);

	        if (typeof config !== 'string') {
	          return;
	        }

	        if (typeof data[config] === 'undefined') {
	          throw new TypeError(`No method named "${config}"`);
	        }

	        data[config]();
	      });
	    }

	    static clearMenus(event) {
	      if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY)) {
	        return;
	      }

	      const toggles = SelectorEngine__default.default.find(SELECTOR_DATA_TOGGLE);

	      for (let i = 0, len = toggles.length; i < len; i++) {
	        const context = Dropdown.getInstance(toggles[i]);

	        if (!context || context._config.autoClose === false) {
	          continue;
	        }

	        if (!context._isShown()) {
	          continue;
	        }

	        const relatedTarget = {
	          relatedTarget: context._element
	        };

	        if (event) {
	          const composedPath = event.composedPath();
	          const isMenuTarget = composedPath.includes(context._menu);

	          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
	            continue;
	          } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


	          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY || /input|select|option|textarea|form/i.test(event.target.tagName))) {
	            continue;
	          }

	          if (event.type === 'click') {
	            relatedTarget.clickEvent = event;
	          }
	        }

	        context._completeHide(relatedTarget);
	      }
	    }

	    static getParentFromElement(element) {
	      return getElementFromSelector(element) || element.parentNode;
	    }

	    static dataApiKeydownHandler(event) {
	      // If not input/textarea:
	      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
	      // If input/textarea:
	      //  - If space key => not a dropdown command
	      //  - If key is other than escape
	      //    - If key is not up or down => not a dropdown command
	      //    - If trigger inside the menu => not a dropdown command
	      if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
	        return;
	      }

	      const isActive = this.classList.contains(CLASS_NAME_SHOW);

	      if (!isActive && event.key === ESCAPE_KEY) {
	        return;
	      }

	      event.preventDefault();
	      event.stopPropagation();

	      if (isDisabled(this)) {
	        return;
	      }

	      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE) ? this : SelectorEngine__default.default.prev(this, SELECTOR_DATA_TOGGLE)[0];
	      const instance = Dropdown.getOrCreateInstance(getToggleButton);

	      if (event.key === ESCAPE_KEY) {
	        instance.hide();
	        return;
	      }

	      if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
	        if (!isActive) {
	          instance.show();
	        }

	        instance._selectMenuItem(event);

	        return;
	      }

	      if (!isActive || event.key === SPACE_KEY) {
	        Dropdown.clearMenus();
	      }
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * Data Api implementation
	   * ------------------------------------------------------------------------
	   */


	  EventHandler__default.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown.dataApiKeydownHandler);
	  EventHandler__default.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
	  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus);
	  EventHandler__default.default.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
	  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	    event.preventDefault();
	    Dropdown.getOrCreateInstance(this).toggle();
	  });
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Dropdown to jQuery only if jQuery is present
	   */

	  defineJQueryPlugin(Dropdown);

	  return Dropdown;

	}));

	}(dropdown$1));

	var dropdown = /*@__PURE__*/getDefaultExportFromCjs(dropdown$1.exports);

	var modal$1 = {exports: {}};

	/*!
	  * Bootstrap modal.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(eventHandler.exports, manipulator.exports, selectorEngine.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (EventHandler, Manipulator, SelectorEngine, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
	  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const MILLISECONDS_MULTIPLIER = 1000;
	  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

	  const toType = obj => {
	    if (obj === null || obj === undefined) {
	      return `${obj}`;
	    }

	    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	  };

	  const getSelector = element => {
	    let selector = element.getAttribute('data-bs-target');

	    if (!selector || selector === '#') {
	      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	      // `document.querySelector` will rightfully complain it is invalid.
	      // See https://github.com/twbs/bootstrap/issues/32273

	      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	        return null;
	      } // Just in case some CMS puts out a full URL with the anchor appended


	      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	        hrefAttr = `#${hrefAttr.split('#')[1]}`;
	      }

	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	    }

	    return selector;
	  };

	  const getElementFromSelector = element => {
	    const selector = getSelector(element);
	    return selector ? document.querySelector(selector) : null;
	  };

	  const getTransitionDurationFromElement = element => {
	    if (!element) {
	      return 0;
	    } // Get transition-duration of the element


	    let {
	      transitionDuration,
	      transitionDelay
	    } = window.getComputedStyle(element);
	    const floatTransitionDuration = Number.parseFloat(transitionDuration);
	    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

	    if (!floatTransitionDuration && !floatTransitionDelay) {
	      return 0;
	    } // If multiple durations are defined, take the first


	    transitionDuration = transitionDuration.split(',')[0];
	    transitionDelay = transitionDelay.split(',')[0];
	    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
	  };

	  const triggerTransitionEnd = element => {
	    element.dispatchEvent(new Event(TRANSITION_END));
	  };

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const getElement = obj => {
	    if (isElement(obj)) {
	      // it's a jQuery object or a node element
	      return obj.jquery ? obj[0] : obj;
	    }

	    if (typeof obj === 'string' && obj.length > 0) {
	      return document.querySelector(obj);
	    }

	    return null;
	  };

	  const typeCheckConfig = (componentName, config, configTypes) => {
	    Object.keys(configTypes).forEach(property => {
	      const expectedTypes = configTypes[property];
	      const value = config[property];
	      const valueType = value && isElement(value) ? 'element' : toType(value);

	      if (!new RegExp(expectedTypes).test(valueType)) {
	        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
	      }
	    });
	  };

	  const isVisible = element => {
	    if (!isElement(element) || element.getClientRects().length === 0) {
	      return false;
	    }

	    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
	  };

	  const isDisabled = element => {
	    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
	      return true;
	    }

	    if (element.classList.contains('disabled')) {
	      return true;
	    }

	    if (typeof element.disabled !== 'undefined') {
	      return element.disabled;
	    }

	    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
	  };
	  /**
	   * Trick to restart an element's animation
	   *
	   * @param {HTMLElement} element
	   * @return void
	   *
	   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
	   */


	  const reflow = element => {
	    // eslint-disable-next-line no-unused-expressions
	    element.offsetHeight;
	  };

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const isRTL = () => document.documentElement.dir === 'rtl';

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  const execute = callback => {
	    if (typeof callback === 'function') {
	      callback();
	    }
	  };

	  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
	    if (!waitForTransition) {
	      execute(callback);
	      return;
	    }

	    const durationPadding = 5;
	    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
	    let called = false;

	    const handler = ({
	      target
	    }) => {
	      if (target !== transitionElement) {
	        return;
	      }

	      called = true;
	      transitionElement.removeEventListener(TRANSITION_END, handler);
	      execute(callback);
	    };

	    transitionElement.addEventListener(TRANSITION_END, handler);
	    setTimeout(() => {
	      if (!called) {
	        triggerTransitionEnd(transitionElement);
	      }
	    }, emulatedDuration);
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/scrollBar.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
	  const SELECTOR_STICKY_CONTENT = '.sticky-top';

	  class ScrollBarHelper {
	    constructor() {
	      this._element = document.body;
	    }

	    getWidth() {
	      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
	      const documentWidth = document.documentElement.clientWidth;
	      return Math.abs(window.innerWidth - documentWidth);
	    }

	    hide() {
	      const width = this.getWidth();

	      this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


	      this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


	      this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

	      this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
	    }

	    _disableOverFlow() {
	      this._saveInitialAttribute(this._element, 'overflow');

	      this._element.style.overflow = 'hidden';
	    }

	    _setElementAttributes(selector, styleProp, callback) {
	      const scrollbarWidth = this.getWidth();

	      const manipulationCallBack = element => {
	        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
	          return;
	        }

	        this._saveInitialAttribute(element, styleProp);

	        const calculatedValue = window.getComputedStyle(element)[styleProp];
	        element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
	      };

	      this._applyManipulationCallback(selector, manipulationCallBack);
	    }

	    reset() {
	      this._resetElementAttributes(this._element, 'overflow');

	      this._resetElementAttributes(this._element, 'paddingRight');

	      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

	      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
	    }

	    _saveInitialAttribute(element, styleProp) {
	      const actualValue = element.style[styleProp];

	      if (actualValue) {
	        Manipulator__default.default.setDataAttribute(element, styleProp, actualValue);
	      }
	    }

	    _resetElementAttributes(selector, styleProp) {
	      const manipulationCallBack = element => {
	        const value = Manipulator__default.default.getDataAttribute(element, styleProp);

	        if (typeof value === 'undefined') {
	          element.style.removeProperty(styleProp);
	        } else {
	          Manipulator__default.default.removeDataAttribute(element, styleProp);
	          element.style[styleProp] = value;
	        }
	      };

	      this._applyManipulationCallback(selector, manipulationCallBack);
	    }

	    _applyManipulationCallback(selector, callBack) {
	      if (isElement(selector)) {
	        callBack(selector);
	      } else {
	        SelectorEngine__default.default.find(selector, this._element).forEach(callBack);
	      }
	    }

	    isOverflowing() {
	      return this.getWidth() > 0;
	    }

	  }

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/backdrop.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const Default$2 = {
	    className: 'modal-backdrop',
	    isVisible: true,
	    // if false, we use the backdrop helper without adding any element to the dom
	    isAnimated: false,
	    rootElement: 'body',
	    // give the choice to place backdrop under different elements
	    clickCallback: null
	  };
	  const DefaultType$2 = {
	    className: 'string',
	    isVisible: 'boolean',
	    isAnimated: 'boolean',
	    rootElement: '(element|string)',
	    clickCallback: '(function|null)'
	  };
	  const NAME$2 = 'backdrop';
	  const CLASS_NAME_FADE$1 = 'fade';
	  const CLASS_NAME_SHOW$1 = 'show';
	  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$2}`;

	  class Backdrop {
	    constructor(config) {
	      this._config = this._getConfig(config);
	      this._isAppended = false;
	      this._element = null;
	    }

	    show(callback) {
	      if (!this._config.isVisible) {
	        execute(callback);
	        return;
	      }

	      this._append();

	      if (this._config.isAnimated) {
	        reflow(this._getElement());
	      }

	      this._getElement().classList.add(CLASS_NAME_SHOW$1);

	      this._emulateAnimation(() => {
	        execute(callback);
	      });
	    }

	    hide(callback) {
	      if (!this._config.isVisible) {
	        execute(callback);
	        return;
	      }

	      this._getElement().classList.remove(CLASS_NAME_SHOW$1);

	      this._emulateAnimation(() => {
	        this.dispose();
	        execute(callback);
	      });
	    } // Private


	    _getElement() {
	      if (!this._element) {
	        const backdrop = document.createElement('div');
	        backdrop.className = this._config.className;

	        if (this._config.isAnimated) {
	          backdrop.classList.add(CLASS_NAME_FADE$1);
	        }

	        this._element = backdrop;
	      }

	      return this._element;
	    }

	    _getConfig(config) {
	      config = { ...Default$2,
	        ...(typeof config === 'object' ? config : {})
	      }; // use getElement() with the default "body" to get a fresh Element on each instantiation

	      config.rootElement = getElement(config.rootElement);
	      typeCheckConfig(NAME$2, config, DefaultType$2);
	      return config;
	    }

	    _append() {
	      if (this._isAppended) {
	        return;
	      }

	      this._config.rootElement.append(this._getElement());

	      EventHandler__default.default.on(this._getElement(), EVENT_MOUSEDOWN, () => {
	        execute(this._config.clickCallback);
	      });
	      this._isAppended = true;
	    }

	    dispose() {
	      if (!this._isAppended) {
	        return;
	      }

	      EventHandler__default.default.off(this._element, EVENT_MOUSEDOWN);

	      this._element.remove();

	      this._isAppended = false;
	    }

	    _emulateAnimation(callback) {
	      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
	    }

	  }

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/focustrap.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const Default$1 = {
	    trapElement: null,
	    // The element to trap focus inside of
	    autofocus: true
	  };
	  const DefaultType$1 = {
	    trapElement: 'element',
	    autofocus: 'boolean'
	  };
	  const NAME$1 = 'focustrap';
	  const DATA_KEY$1 = 'bs.focustrap';
	  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
	  const EVENT_FOCUSIN = `focusin${EVENT_KEY$1}`;
	  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$1}`;
	  const TAB_KEY = 'Tab';
	  const TAB_NAV_FORWARD = 'forward';
	  const TAB_NAV_BACKWARD = 'backward';

	  class FocusTrap {
	    constructor(config) {
	      this._config = this._getConfig(config);
	      this._isActive = false;
	      this._lastTabNavDirection = null;
	    }

	    activate() {
	      const {
	        trapElement,
	        autofocus
	      } = this._config;

	      if (this._isActive) {
	        return;
	      }

	      if (autofocus) {
	        trapElement.focus();
	      }

	      EventHandler__default.default.off(document, EVENT_KEY$1); // guard against infinite focus loop

	      EventHandler__default.default.on(document, EVENT_FOCUSIN, event => this._handleFocusin(event));
	      EventHandler__default.default.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
	      this._isActive = true;
	    }

	    deactivate() {
	      if (!this._isActive) {
	        return;
	      }

	      this._isActive = false;
	      EventHandler__default.default.off(document, EVENT_KEY$1);
	    } // Private


	    _handleFocusin(event) {
	      const {
	        target
	      } = event;
	      const {
	        trapElement
	      } = this._config;

	      if (target === document || target === trapElement || trapElement.contains(target)) {
	        return;
	      }

	      const elements = SelectorEngine__default.default.focusableChildren(trapElement);

	      if (elements.length === 0) {
	        trapElement.focus();
	      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
	        elements[elements.length - 1].focus();
	      } else {
	        elements[0].focus();
	      }
	    }

	    _handleKeydown(event) {
	      if (event.key !== TAB_KEY) {
	        return;
	      }

	      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
	    }

	    _getConfig(config) {
	      config = { ...Default$1,
	        ...(typeof config === 'object' ? config : {})
	      };
	      typeCheckConfig(NAME$1, config, DefaultType$1);
	      return config;
	    }

	  }

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/component-functions.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const enableDismissTrigger = (component, method = 'hide') => {
	    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
	    const name = component.NAME;
	    EventHandler__default.default.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
	      if (['A', 'AREA'].includes(this.tagName)) {
	        event.preventDefault();
	      }

	      if (isDisabled(this)) {
	        return;
	      }

	      const target = getElementFromSelector(this) || this.closest(`.${name}`);
	      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

	      instance[method]();
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): modal.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'modal';
	  const DATA_KEY = 'bs.modal';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const DATA_API_KEY = '.data-api';
	  const ESCAPE_KEY = 'Escape';
	  const Default = {
	    backdrop: true,
	    keyboard: true,
	    focus: true
	  };
	  const DefaultType = {
	    backdrop: '(boolean|string)',
	    keyboard: 'boolean',
	    focus: 'boolean'
	  };
	  const EVENT_HIDE = `hide${EVENT_KEY}`;
	  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
	  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
	  const EVENT_SHOW = `show${EVENT_KEY}`;
	  const EVENT_SHOWN = `shown${EVENT_KEY}`;
	  const EVENT_RESIZE = `resize${EVENT_KEY}`;
	  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
	  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
	  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`;
	  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
	  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
	  const CLASS_NAME_OPEN = 'modal-open';
	  const CLASS_NAME_FADE = 'fade';
	  const CLASS_NAME_SHOW = 'show';
	  const CLASS_NAME_STATIC = 'modal-static';
	  const OPEN_SELECTOR = '.modal.show';
	  const SELECTOR_DIALOG = '.modal-dialog';
	  const SELECTOR_MODAL_BODY = '.modal-body';
	  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="modal"]';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Modal extends BaseComponent__default.default {
	    constructor(element, config) {
	      super(element);
	      this._config = this._getConfig(config);
	      this._dialog = SelectorEngine__default.default.findOne(SELECTOR_DIALOG, this._element);
	      this._backdrop = this._initializeBackDrop();
	      this._focustrap = this._initializeFocusTrap();
	      this._isShown = false;
	      this._ignoreBackdropClick = false;
	      this._isTransitioning = false;
	      this._scrollBar = new ScrollBarHelper();
	    } // Getters


	    static get Default() {
	      return Default;
	    }

	    static get NAME() {
	      return NAME;
	    } // Public


	    toggle(relatedTarget) {
	      return this._isShown ? this.hide() : this.show(relatedTarget);
	    }

	    show(relatedTarget) {
	      if (this._isShown || this._isTransitioning) {
	        return;
	      }

	      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, {
	        relatedTarget
	      });

	      if (showEvent.defaultPrevented) {
	        return;
	      }

	      this._isShown = true;

	      if (this._isAnimated()) {
	        this._isTransitioning = true;
	      }

	      this._scrollBar.hide();

	      document.body.classList.add(CLASS_NAME_OPEN);

	      this._adjustDialog();

	      this._setEscapeEvent();

	      this._setResizeEvent();

	      EventHandler__default.default.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
	        EventHandler__default.default.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
	          if (event.target === this._element) {
	            this._ignoreBackdropClick = true;
	          }
	        });
	      });

	      this._showBackdrop(() => this._showElement(relatedTarget));
	    }

	    hide() {
	      if (!this._isShown || this._isTransitioning) {
	        return;
	      }

	      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);

	      if (hideEvent.defaultPrevented) {
	        return;
	      }

	      this._isShown = false;

	      const isAnimated = this._isAnimated();

	      if (isAnimated) {
	        this._isTransitioning = true;
	      }

	      this._setEscapeEvent();

	      this._setResizeEvent();

	      this._focustrap.deactivate();

	      this._element.classList.remove(CLASS_NAME_SHOW);

	      EventHandler__default.default.off(this._element, EVENT_CLICK_DISMISS);
	      EventHandler__default.default.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

	      this._queueCallback(() => this._hideModal(), this._element, isAnimated);
	    }

	    dispose() {
	      [window, this._dialog].forEach(htmlElement => EventHandler__default.default.off(htmlElement, EVENT_KEY));

	      this._backdrop.dispose();

	      this._focustrap.deactivate();

	      super.dispose();
	    }

	    handleUpdate() {
	      this._adjustDialog();
	    } // Private


	    _initializeBackDrop() {
	      return new Backdrop({
	        isVisible: Boolean(this._config.backdrop),
	        // 'static' option will be translated to true, and booleans will keep their value
	        isAnimated: this._isAnimated()
	      });
	    }

	    _initializeFocusTrap() {
	      return new FocusTrap({
	        trapElement: this._element
	      });
	    }

	    _getConfig(config) {
	      config = { ...Default,
	        ...Manipulator__default.default.getDataAttributes(this._element),
	        ...(typeof config === 'object' ? config : {})
	      };
	      typeCheckConfig(NAME, config, DefaultType);
	      return config;
	    }

	    _showElement(relatedTarget) {
	      const isAnimated = this._isAnimated();

	      const modalBody = SelectorEngine__default.default.findOne(SELECTOR_MODAL_BODY, this._dialog);

	      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
	        // Don't move modal's DOM position
	        document.body.append(this._element);
	      }

	      this._element.style.display = 'block';

	      this._element.removeAttribute('aria-hidden');

	      this._element.setAttribute('aria-modal', true);

	      this._element.setAttribute('role', 'dialog');

	      this._element.scrollTop = 0;

	      if (modalBody) {
	        modalBody.scrollTop = 0;
	      }

	      if (isAnimated) {
	        reflow(this._element);
	      }

	      this._element.classList.add(CLASS_NAME_SHOW);

	      const transitionComplete = () => {
	        if (this._config.focus) {
	          this._focustrap.activate();
	        }

	        this._isTransitioning = false;
	        EventHandler__default.default.trigger(this._element, EVENT_SHOWN, {
	          relatedTarget
	        });
	      };

	      this._queueCallback(transitionComplete, this._dialog, isAnimated);
	    }

	    _setEscapeEvent() {
	      if (this._isShown) {
	        EventHandler__default.default.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
	          if (this._config.keyboard && event.key === ESCAPE_KEY) {
	            event.preventDefault();
	            this.hide();
	          } else if (!this._config.keyboard && event.key === ESCAPE_KEY) {
	            this._triggerBackdropTransition();
	          }
	        });
	      } else {
	        EventHandler__default.default.off(this._element, EVENT_KEYDOWN_DISMISS);
	      }
	    }

	    _setResizeEvent() {
	      if (this._isShown) {
	        EventHandler__default.default.on(window, EVENT_RESIZE, () => this._adjustDialog());
	      } else {
	        EventHandler__default.default.off(window, EVENT_RESIZE);
	      }
	    }

	    _hideModal() {
	      this._element.style.display = 'none';

	      this._element.setAttribute('aria-hidden', true);

	      this._element.removeAttribute('aria-modal');

	      this._element.removeAttribute('role');

	      this._isTransitioning = false;

	      this._backdrop.hide(() => {
	        document.body.classList.remove(CLASS_NAME_OPEN);

	        this._resetAdjustments();

	        this._scrollBar.reset();

	        EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
	      });
	    }

	    _showBackdrop(callback) {
	      EventHandler__default.default.on(this._element, EVENT_CLICK_DISMISS, event => {
	        if (this._ignoreBackdropClick) {
	          this._ignoreBackdropClick = false;
	          return;
	        }

	        if (event.target !== event.currentTarget) {
	          return;
	        }

	        if (this._config.backdrop === true) {
	          this.hide();
	        } else if (this._config.backdrop === 'static') {
	          this._triggerBackdropTransition();
	        }
	      });

	      this._backdrop.show(callback);
	    }

	    _isAnimated() {
	      return this._element.classList.contains(CLASS_NAME_FADE);
	    }

	    _triggerBackdropTransition() {
	      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE_PREVENTED);

	      if (hideEvent.defaultPrevented) {
	        return;
	      }

	      const {
	        classList,
	        scrollHeight,
	        style
	      } = this._element;
	      const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed

	      if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
	        return;
	      }

	      if (!isModalOverflowing) {
	        style.overflowY = 'hidden';
	      }

	      classList.add(CLASS_NAME_STATIC);

	      this._queueCallback(() => {
	        classList.remove(CLASS_NAME_STATIC);

	        if (!isModalOverflowing) {
	          this._queueCallback(() => {
	            style.overflowY = '';
	          }, this._dialog);
	        }
	      }, this._dialog);

	      this._element.focus();
	    } // ----------------------------------------------------------------------
	    // the following methods are used to handle overflowing modals
	    // ----------------------------------------------------------------------


	    _adjustDialog() {
	      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

	      const scrollbarWidth = this._scrollBar.getWidth();

	      const isBodyOverflowing = scrollbarWidth > 0;

	      if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
	        this._element.style.paddingLeft = `${scrollbarWidth}px`;
	      }

	      if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
	        this._element.style.paddingRight = `${scrollbarWidth}px`;
	      }
	    }

	    _resetAdjustments() {
	      this._element.style.paddingLeft = '';
	      this._element.style.paddingRight = '';
	    } // Static


	    static jQueryInterface(config, relatedTarget) {
	      return this.each(function () {
	        const data = Modal.getOrCreateInstance(this, config);

	        if (typeof config !== 'string') {
	          return;
	        }

	        if (typeof data[config] === 'undefined') {
	          throw new TypeError(`No method named "${config}"`);
	        }

	        data[config](relatedTarget);
	      });
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * Data Api implementation
	   * ------------------------------------------------------------------------
	   */


	  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	    const target = getElementFromSelector(this);

	    if (['A', 'AREA'].includes(this.tagName)) {
	      event.preventDefault();
	    }

	    EventHandler__default.default.one(target, EVENT_SHOW, showEvent => {
	      if (showEvent.defaultPrevented) {
	        // only register focus restorer if modal will actually get shown
	        return;
	      }

	      EventHandler__default.default.one(target, EVENT_HIDDEN, () => {
	        if (isVisible(this)) {
	          this.focus();
	        }
	      });
	    }); // avoid conflict when clicking moddal toggler while another one is open

	    const allReadyOpen = SelectorEngine__default.default.findOne(OPEN_SELECTOR);

	    if (allReadyOpen) {
	      Modal.getInstance(allReadyOpen).hide();
	    }

	    const data = Modal.getOrCreateInstance(target);
	    data.toggle(this);
	  });
	  enableDismissTrigger(Modal);
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Modal to jQuery only if jQuery is present
	   */

	  defineJQueryPlugin(Modal);

	  return Modal;

	}));

	}(modal$1));

	var modal = modal$1.exports;

	var offcanvas$1 = {exports: {}};

	/*!
	  * Bootstrap offcanvas.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(selectorEngine.exports, manipulator.exports, eventHandler.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (SelectorEngine, Manipulator, EventHandler, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
	  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const MILLISECONDS_MULTIPLIER = 1000;
	  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

	  const toType = obj => {
	    if (obj === null || obj === undefined) {
	      return `${obj}`;
	    }

	    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	  };

	  const getSelector = element => {
	    let selector = element.getAttribute('data-bs-target');

	    if (!selector || selector === '#') {
	      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	      // `document.querySelector` will rightfully complain it is invalid.
	      // See https://github.com/twbs/bootstrap/issues/32273

	      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	        return null;
	      } // Just in case some CMS puts out a full URL with the anchor appended


	      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	        hrefAttr = `#${hrefAttr.split('#')[1]}`;
	      }

	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	    }

	    return selector;
	  };

	  const getElementFromSelector = element => {
	    const selector = getSelector(element);
	    return selector ? document.querySelector(selector) : null;
	  };

	  const getTransitionDurationFromElement = element => {
	    if (!element) {
	      return 0;
	    } // Get transition-duration of the element


	    let {
	      transitionDuration,
	      transitionDelay
	    } = window.getComputedStyle(element);
	    const floatTransitionDuration = Number.parseFloat(transitionDuration);
	    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

	    if (!floatTransitionDuration && !floatTransitionDelay) {
	      return 0;
	    } // If multiple durations are defined, take the first


	    transitionDuration = transitionDuration.split(',')[0];
	    transitionDelay = transitionDelay.split(',')[0];
	    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
	  };

	  const triggerTransitionEnd = element => {
	    element.dispatchEvent(new Event(TRANSITION_END));
	  };

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const getElement = obj => {
	    if (isElement(obj)) {
	      // it's a jQuery object or a node element
	      return obj.jquery ? obj[0] : obj;
	    }

	    if (typeof obj === 'string' && obj.length > 0) {
	      return document.querySelector(obj);
	    }

	    return null;
	  };

	  const typeCheckConfig = (componentName, config, configTypes) => {
	    Object.keys(configTypes).forEach(property => {
	      const expectedTypes = configTypes[property];
	      const value = config[property];
	      const valueType = value && isElement(value) ? 'element' : toType(value);

	      if (!new RegExp(expectedTypes).test(valueType)) {
	        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
	      }
	    });
	  };

	  const isVisible = element => {
	    if (!isElement(element) || element.getClientRects().length === 0) {
	      return false;
	    }

	    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
	  };

	  const isDisabled = element => {
	    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
	      return true;
	    }

	    if (element.classList.contains('disabled')) {
	      return true;
	    }

	    if (typeof element.disabled !== 'undefined') {
	      return element.disabled;
	    }

	    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
	  };
	  /**
	   * Trick to restart an element's animation
	   *
	   * @param {HTMLElement} element
	   * @return void
	   *
	   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
	   */


	  const reflow = element => {
	    // eslint-disable-next-line no-unused-expressions
	    element.offsetHeight;
	  };

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  const execute = callback => {
	    if (typeof callback === 'function') {
	      callback();
	    }
	  };

	  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
	    if (!waitForTransition) {
	      execute(callback);
	      return;
	    }

	    const durationPadding = 5;
	    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
	    let called = false;

	    const handler = ({
	      target
	    }) => {
	      if (target !== transitionElement) {
	        return;
	      }

	      called = true;
	      transitionElement.removeEventListener(TRANSITION_END, handler);
	      execute(callback);
	    };

	    transitionElement.addEventListener(TRANSITION_END, handler);
	    setTimeout(() => {
	      if (!called) {
	        triggerTransitionEnd(transitionElement);
	      }
	    }, emulatedDuration);
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/scrollBar.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
	  const SELECTOR_STICKY_CONTENT = '.sticky-top';

	  class ScrollBarHelper {
	    constructor() {
	      this._element = document.body;
	    }

	    getWidth() {
	      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
	      const documentWidth = document.documentElement.clientWidth;
	      return Math.abs(window.innerWidth - documentWidth);
	    }

	    hide() {
	      const width = this.getWidth();

	      this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


	      this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


	      this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

	      this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
	    }

	    _disableOverFlow() {
	      this._saveInitialAttribute(this._element, 'overflow');

	      this._element.style.overflow = 'hidden';
	    }

	    _setElementAttributes(selector, styleProp, callback) {
	      const scrollbarWidth = this.getWidth();

	      const manipulationCallBack = element => {
	        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
	          return;
	        }

	        this._saveInitialAttribute(element, styleProp);

	        const calculatedValue = window.getComputedStyle(element)[styleProp];
	        element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
	      };

	      this._applyManipulationCallback(selector, manipulationCallBack);
	    }

	    reset() {
	      this._resetElementAttributes(this._element, 'overflow');

	      this._resetElementAttributes(this._element, 'paddingRight');

	      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

	      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
	    }

	    _saveInitialAttribute(element, styleProp) {
	      const actualValue = element.style[styleProp];

	      if (actualValue) {
	        Manipulator__default.default.setDataAttribute(element, styleProp, actualValue);
	      }
	    }

	    _resetElementAttributes(selector, styleProp) {
	      const manipulationCallBack = element => {
	        const value = Manipulator__default.default.getDataAttribute(element, styleProp);

	        if (typeof value === 'undefined') {
	          element.style.removeProperty(styleProp);
	        } else {
	          Manipulator__default.default.removeDataAttribute(element, styleProp);
	          element.style[styleProp] = value;
	        }
	      };

	      this._applyManipulationCallback(selector, manipulationCallBack);
	    }

	    _applyManipulationCallback(selector, callBack) {
	      if (isElement(selector)) {
	        callBack(selector);
	      } else {
	        SelectorEngine__default.default.find(selector, this._element).forEach(callBack);
	      }
	    }

	    isOverflowing() {
	      return this.getWidth() > 0;
	    }

	  }

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/backdrop.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const Default$2 = {
	    className: 'modal-backdrop',
	    isVisible: true,
	    // if false, we use the backdrop helper without adding any element to the dom
	    isAnimated: false,
	    rootElement: 'body',
	    // give the choice to place backdrop under different elements
	    clickCallback: null
	  };
	  const DefaultType$2 = {
	    className: 'string',
	    isVisible: 'boolean',
	    isAnimated: 'boolean',
	    rootElement: '(element|string)',
	    clickCallback: '(function|null)'
	  };
	  const NAME$2 = 'backdrop';
	  const CLASS_NAME_FADE = 'fade';
	  const CLASS_NAME_SHOW$1 = 'show';
	  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$2}`;

	  class Backdrop {
	    constructor(config) {
	      this._config = this._getConfig(config);
	      this._isAppended = false;
	      this._element = null;
	    }

	    show(callback) {
	      if (!this._config.isVisible) {
	        execute(callback);
	        return;
	      }

	      this._append();

	      if (this._config.isAnimated) {
	        reflow(this._getElement());
	      }

	      this._getElement().classList.add(CLASS_NAME_SHOW$1);

	      this._emulateAnimation(() => {
	        execute(callback);
	      });
	    }

	    hide(callback) {
	      if (!this._config.isVisible) {
	        execute(callback);
	        return;
	      }

	      this._getElement().classList.remove(CLASS_NAME_SHOW$1);

	      this._emulateAnimation(() => {
	        this.dispose();
	        execute(callback);
	      });
	    } // Private


	    _getElement() {
	      if (!this._element) {
	        const backdrop = document.createElement('div');
	        backdrop.className = this._config.className;

	        if (this._config.isAnimated) {
	          backdrop.classList.add(CLASS_NAME_FADE);
	        }

	        this._element = backdrop;
	      }

	      return this._element;
	    }

	    _getConfig(config) {
	      config = { ...Default$2,
	        ...(typeof config === 'object' ? config : {})
	      }; // use getElement() with the default "body" to get a fresh Element on each instantiation

	      config.rootElement = getElement(config.rootElement);
	      typeCheckConfig(NAME$2, config, DefaultType$2);
	      return config;
	    }

	    _append() {
	      if (this._isAppended) {
	        return;
	      }

	      this._config.rootElement.append(this._getElement());

	      EventHandler__default.default.on(this._getElement(), EVENT_MOUSEDOWN, () => {
	        execute(this._config.clickCallback);
	      });
	      this._isAppended = true;
	    }

	    dispose() {
	      if (!this._isAppended) {
	        return;
	      }

	      EventHandler__default.default.off(this._element, EVENT_MOUSEDOWN);

	      this._element.remove();

	      this._isAppended = false;
	    }

	    _emulateAnimation(callback) {
	      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
	    }

	  }

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/focustrap.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const Default$1 = {
	    trapElement: null,
	    // The element to trap focus inside of
	    autofocus: true
	  };
	  const DefaultType$1 = {
	    trapElement: 'element',
	    autofocus: 'boolean'
	  };
	  const NAME$1 = 'focustrap';
	  const DATA_KEY$1 = 'bs.focustrap';
	  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
	  const EVENT_FOCUSIN = `focusin${EVENT_KEY$1}`;
	  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$1}`;
	  const TAB_KEY = 'Tab';
	  const TAB_NAV_FORWARD = 'forward';
	  const TAB_NAV_BACKWARD = 'backward';

	  class FocusTrap {
	    constructor(config) {
	      this._config = this._getConfig(config);
	      this._isActive = false;
	      this._lastTabNavDirection = null;
	    }

	    activate() {
	      const {
	        trapElement,
	        autofocus
	      } = this._config;

	      if (this._isActive) {
	        return;
	      }

	      if (autofocus) {
	        trapElement.focus();
	      }

	      EventHandler__default.default.off(document, EVENT_KEY$1); // guard against infinite focus loop

	      EventHandler__default.default.on(document, EVENT_FOCUSIN, event => this._handleFocusin(event));
	      EventHandler__default.default.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
	      this._isActive = true;
	    }

	    deactivate() {
	      if (!this._isActive) {
	        return;
	      }

	      this._isActive = false;
	      EventHandler__default.default.off(document, EVENT_KEY$1);
	    } // Private


	    _handleFocusin(event) {
	      const {
	        target
	      } = event;
	      const {
	        trapElement
	      } = this._config;

	      if (target === document || target === trapElement || trapElement.contains(target)) {
	        return;
	      }

	      const elements = SelectorEngine__default.default.focusableChildren(trapElement);

	      if (elements.length === 0) {
	        trapElement.focus();
	      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
	        elements[elements.length - 1].focus();
	      } else {
	        elements[0].focus();
	      }
	    }

	    _handleKeydown(event) {
	      if (event.key !== TAB_KEY) {
	        return;
	      }

	      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
	    }

	    _getConfig(config) {
	      config = { ...Default$1,
	        ...(typeof config === 'object' ? config : {})
	      };
	      typeCheckConfig(NAME$1, config, DefaultType$1);
	      return config;
	    }

	  }

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/component-functions.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const enableDismissTrigger = (component, method = 'hide') => {
	    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
	    const name = component.NAME;
	    EventHandler__default.default.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
	      if (['A', 'AREA'].includes(this.tagName)) {
	        event.preventDefault();
	      }

	      if (isDisabled(this)) {
	        return;
	      }

	      const target = getElementFromSelector(this) || this.closest(`.${name}`);
	      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

	      instance[method]();
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): offcanvas.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'offcanvas';
	  const DATA_KEY = 'bs.offcanvas';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const DATA_API_KEY = '.data-api';
	  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
	  const ESCAPE_KEY = 'Escape';
	  const Default = {
	    backdrop: true,
	    keyboard: true,
	    scroll: false
	  };
	  const DefaultType = {
	    backdrop: 'boolean',
	    keyboard: 'boolean',
	    scroll: 'boolean'
	  };
	  const CLASS_NAME_SHOW = 'show';
	  const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
	  const OPEN_SELECTOR = '.offcanvas.show';
	  const EVENT_SHOW = `show${EVENT_KEY}`;
	  const EVENT_SHOWN = `shown${EVENT_KEY}`;
	  const EVENT_HIDE = `hide${EVENT_KEY}`;
	  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
	  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
	  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
	  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="offcanvas"]';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Offcanvas extends BaseComponent__default.default {
	    constructor(element, config) {
	      super(element);
	      this._config = this._getConfig(config);
	      this._isShown = false;
	      this._backdrop = this._initializeBackDrop();
	      this._focustrap = this._initializeFocusTrap();

	      this._addEventListeners();
	    } // Getters


	    static get NAME() {
	      return NAME;
	    }

	    static get Default() {
	      return Default;
	    } // Public


	    toggle(relatedTarget) {
	      return this._isShown ? this.hide() : this.show(relatedTarget);
	    }

	    show(relatedTarget) {
	      if (this._isShown) {
	        return;
	      }

	      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, {
	        relatedTarget
	      });

	      if (showEvent.defaultPrevented) {
	        return;
	      }

	      this._isShown = true;
	      this._element.style.visibility = 'visible';

	      this._backdrop.show();

	      if (!this._config.scroll) {
	        new ScrollBarHelper().hide();
	      }

	      this._element.removeAttribute('aria-hidden');

	      this._element.setAttribute('aria-modal', true);

	      this._element.setAttribute('role', 'dialog');

	      this._element.classList.add(CLASS_NAME_SHOW);

	      const completeCallBack = () => {
	        if (!this._config.scroll) {
	          this._focustrap.activate();
	        }

	        EventHandler__default.default.trigger(this._element, EVENT_SHOWN, {
	          relatedTarget
	        });
	      };

	      this._queueCallback(completeCallBack, this._element, true);
	    }

	    hide() {
	      if (!this._isShown) {
	        return;
	      }

	      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);

	      if (hideEvent.defaultPrevented) {
	        return;
	      }

	      this._focustrap.deactivate();

	      this._element.blur();

	      this._isShown = false;

	      this._element.classList.remove(CLASS_NAME_SHOW);

	      this._backdrop.hide();

	      const completeCallback = () => {
	        this._element.setAttribute('aria-hidden', true);

	        this._element.removeAttribute('aria-modal');

	        this._element.removeAttribute('role');

	        this._element.style.visibility = 'hidden';

	        if (!this._config.scroll) {
	          new ScrollBarHelper().reset();
	        }

	        EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
	      };

	      this._queueCallback(completeCallback, this._element, true);
	    }

	    dispose() {
	      this._backdrop.dispose();

	      this._focustrap.deactivate();

	      super.dispose();
	    } // Private


	    _getConfig(config) {
	      config = { ...Default,
	        ...Manipulator__default.default.getDataAttributes(this._element),
	        ...(typeof config === 'object' ? config : {})
	      };
	      typeCheckConfig(NAME, config, DefaultType);
	      return config;
	    }

	    _initializeBackDrop() {
	      return new Backdrop({
	        className: CLASS_NAME_BACKDROP,
	        isVisible: this._config.backdrop,
	        isAnimated: true,
	        rootElement: this._element.parentNode,
	        clickCallback: () => this.hide()
	      });
	    }

	    _initializeFocusTrap() {
	      return new FocusTrap({
	        trapElement: this._element
	      });
	    }

	    _addEventListeners() {
	      EventHandler__default.default.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
	        if (this._config.keyboard && event.key === ESCAPE_KEY) {
	          this.hide();
	        }
	      });
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const data = Offcanvas.getOrCreateInstance(this, config);

	        if (typeof config !== 'string') {
	          return;
	        }

	        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
	          throw new TypeError(`No method named "${config}"`);
	        }

	        data[config](this);
	      });
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * Data Api implementation
	   * ------------------------------------------------------------------------
	   */


	  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	    const target = getElementFromSelector(this);

	    if (['A', 'AREA'].includes(this.tagName)) {
	      event.preventDefault();
	    }

	    if (isDisabled(this)) {
	      return;
	    }

	    EventHandler__default.default.one(target, EVENT_HIDDEN, () => {
	      // focus on trigger when it is closed
	      if (isVisible(this)) {
	        this.focus();
	      }
	    }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

	    const allReadyOpen = SelectorEngine__default.default.findOne(OPEN_SELECTOR);

	    if (allReadyOpen && allReadyOpen !== target) {
	      Offcanvas.getInstance(allReadyOpen).hide();
	    }

	    const data = Offcanvas.getOrCreateInstance(target);
	    data.toggle(this);
	  });
	  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => SelectorEngine__default.default.find(OPEN_SELECTOR).forEach(el => Offcanvas.getOrCreateInstance(el).show()));
	  enableDismissTrigger(Offcanvas);
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   */

	  defineJQueryPlugin(Offcanvas);

	  return Offcanvas;

	}));

	}(offcanvas$1));

	var offcanvas = offcanvas$1.exports;

	var popover$1 = {exports: {}};

	var tooltip$1 = {exports: {}};

	/*!
	  * Bootstrap tooltip.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(require$$0, data.exports, eventHandler.exports, manipulator.exports, selectorEngine.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (Popper, Data, EventHandler, Manipulator, SelectorEngine, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  function _interopNamespace(e) {
	    if (e && e.__esModule) return e;
	    const n = Object.create(null);
	    if (e) {
	      for (const k in e) {
	        if (k !== 'default') {
	          const d = Object.getOwnPropertyDescriptor(e, k);
	          Object.defineProperty(n, k, d.get ? d : {
	            enumerable: true,
	            get: () => e[k]
	          });
	        }
	      }
	    }
	    n.default = e;
	    return Object.freeze(n);
	  }

	  const Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);
	  const Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
	  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const MAX_UID = 1000000;

	  const toType = obj => {
	    if (obj === null || obj === undefined) {
	      return `${obj}`;
	    }

	    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	  };
	  /**
	   * --------------------------------------------------------------------------
	   * Public Util Api
	   * --------------------------------------------------------------------------
	   */


	  const getUID = prefix => {
	    do {
	      prefix += Math.floor(Math.random() * MAX_UID);
	    } while (document.getElementById(prefix));

	    return prefix;
	  };

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const getElement = obj => {
	    if (isElement(obj)) {
	      // it's a jQuery object or a node element
	      return obj.jquery ? obj[0] : obj;
	    }

	    if (typeof obj === 'string' && obj.length > 0) {
	      return document.querySelector(obj);
	    }

	    return null;
	  };

	  const typeCheckConfig = (componentName, config, configTypes) => {
	    Object.keys(configTypes).forEach(property => {
	      const expectedTypes = configTypes[property];
	      const value = config[property];
	      const valueType = value && isElement(value) ? 'element' : toType(value);

	      if (!new RegExp(expectedTypes).test(valueType)) {
	        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
	      }
	    });
	  };

	  const findShadowRoot = element => {
	    if (!document.documentElement.attachShadow) {
	      return null;
	    } // Can find the shadow root otherwise it'll return the document


	    if (typeof element.getRootNode === 'function') {
	      const root = element.getRootNode();
	      return root instanceof ShadowRoot ? root : null;
	    }

	    if (element instanceof ShadowRoot) {
	      return element;
	    } // when we don't find a shadow root


	    if (!element.parentNode) {
	      return null;
	    }

	    return findShadowRoot(element.parentNode);
	  };

	  const noop = () => {};

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const isRTL = () => document.documentElement.dir === 'rtl';

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/sanitizer.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
	  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
	  /**
	   * A pattern that recognizes a commonly useful subset of URLs that are safe.
	   *
	   * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
	   */

	  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
	  /**
	   * A pattern that matches safe data URLs. Only matches image, video and audio types.
	   *
	   * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
	   */

	  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

	  const allowedAttribute = (attribute, allowedAttributeList) => {
	    const attributeName = attribute.nodeName.toLowerCase();

	    if (allowedAttributeList.includes(attributeName)) {
	      if (uriAttributes.has(attributeName)) {
	        return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
	      }

	      return true;
	    }

	    const regExp = allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp); // Check if a regular expression validates the attribute.

	    for (let i = 0, len = regExp.length; i < len; i++) {
	      if (regExp[i].test(attributeName)) {
	        return true;
	      }
	    }

	    return false;
	  };

	  const DefaultAllowlist = {
	    // Global attributes allowed on any supplied element below.
	    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
	    a: ['target', 'href', 'title', 'rel'],
	    area: [],
	    b: [],
	    br: [],
	    col: [],
	    code: [],
	    div: [],
	    em: [],
	    hr: [],
	    h1: [],
	    h2: [],
	    h3: [],
	    h4: [],
	    h5: [],
	    h6: [],
	    i: [],
	    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
	    li: [],
	    ol: [],
	    p: [],
	    pre: [],
	    s: [],
	    small: [],
	    span: [],
	    sub: [],
	    sup: [],
	    strong: [],
	    u: [],
	    ul: []
	  };
	  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
	    if (!unsafeHtml.length) {
	      return unsafeHtml;
	    }

	    if (sanitizeFn && typeof sanitizeFn === 'function') {
	      return sanitizeFn(unsafeHtml);
	    }

	    const domParser = new window.DOMParser();
	    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
	    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

	    for (let i = 0, len = elements.length; i < len; i++) {
	      const element = elements[i];
	      const elementName = element.nodeName.toLowerCase();

	      if (!Object.keys(allowList).includes(elementName)) {
	        element.remove();
	        continue;
	      }

	      const attributeList = [].concat(...element.attributes);
	      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
	      attributeList.forEach(attribute => {
	        if (!allowedAttribute(attribute, allowedAttributes)) {
	          element.removeAttribute(attribute.nodeName);
	        }
	      });
	    }

	    return createdDocument.body.innerHTML;
	  }

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): tooltip.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'tooltip';
	  const DATA_KEY = 'bs.tooltip';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const CLASS_PREFIX = 'bs-tooltip';
	  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
	  const DefaultType = {
	    animation: 'boolean',
	    template: 'string',
	    title: '(string|element|function)',
	    trigger: 'string',
	    delay: '(number|object)',
	    html: 'boolean',
	    selector: '(string|boolean)',
	    placement: '(string|function)',
	    offset: '(array|string|function)',
	    container: '(string|element|boolean)',
	    fallbackPlacements: 'array',
	    boundary: '(string|element)',
	    customClass: '(string|function)',
	    sanitize: 'boolean',
	    sanitizeFn: '(null|function)',
	    allowList: 'object',
	    popperConfig: '(null|object|function)'
	  };
	  const AttachmentMap = {
	    AUTO: 'auto',
	    TOP: 'top',
	    RIGHT: isRTL() ? 'left' : 'right',
	    BOTTOM: 'bottom',
	    LEFT: isRTL() ? 'right' : 'left'
	  };
	  const Default = {
	    animation: true,
	    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
	    trigger: 'hover focus',
	    title: '',
	    delay: 0,
	    html: false,
	    selector: false,
	    placement: 'top',
	    offset: [0, 0],
	    container: false,
	    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
	    boundary: 'clippingParents',
	    customClass: '',
	    sanitize: true,
	    sanitizeFn: null,
	    allowList: DefaultAllowlist,
	    popperConfig: null
	  };
	  const Event = {
	    HIDE: `hide${EVENT_KEY}`,
	    HIDDEN: `hidden${EVENT_KEY}`,
	    SHOW: `show${EVENT_KEY}`,
	    SHOWN: `shown${EVENT_KEY}`,
	    INSERTED: `inserted${EVENT_KEY}`,
	    CLICK: `click${EVENT_KEY}`,
	    FOCUSIN: `focusin${EVENT_KEY}`,
	    FOCUSOUT: `focusout${EVENT_KEY}`,
	    MOUSEENTER: `mouseenter${EVENT_KEY}`,
	    MOUSELEAVE: `mouseleave${EVENT_KEY}`
	  };
	  const CLASS_NAME_FADE = 'fade';
	  const CLASS_NAME_MODAL = 'modal';
	  const CLASS_NAME_SHOW = 'show';
	  const HOVER_STATE_SHOW = 'show';
	  const HOVER_STATE_OUT = 'out';
	  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
	  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
	  const EVENT_MODAL_HIDE = 'hide.bs.modal';
	  const TRIGGER_HOVER = 'hover';
	  const TRIGGER_FOCUS = 'focus';
	  const TRIGGER_CLICK = 'click';
	  const TRIGGER_MANUAL = 'manual';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Tooltip extends BaseComponent__default.default {
	    constructor(element, config) {
	      if (typeof Popper__namespace === 'undefined') {
	        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
	      }

	      super(element); // private

	      this._isEnabled = true;
	      this._timeout = 0;
	      this._hoverState = '';
	      this._activeTrigger = {};
	      this._popper = null; // Protected

	      this._config = this._getConfig(config);
	      this.tip = null;

	      this._setListeners();
	    } // Getters


	    static get Default() {
	      return Default;
	    }

	    static get NAME() {
	      return NAME;
	    }

	    static get Event() {
	      return Event;
	    }

	    static get DefaultType() {
	      return DefaultType;
	    } // Public


	    enable() {
	      this._isEnabled = true;
	    }

	    disable() {
	      this._isEnabled = false;
	    }

	    toggleEnabled() {
	      this._isEnabled = !this._isEnabled;
	    }

	    toggle(event) {
	      if (!this._isEnabled) {
	        return;
	      }

	      if (event) {
	        const context = this._initializeOnDelegatedTarget(event);

	        context._activeTrigger.click = !context._activeTrigger.click;

	        if (context._isWithActiveTrigger()) {
	          context._enter(null, context);
	        } else {
	          context._leave(null, context);
	        }
	      } else {
	        if (this.getTipElement().classList.contains(CLASS_NAME_SHOW)) {
	          this._leave(null, this);

	          return;
	        }

	        this._enter(null, this);
	      }
	    }

	    dispose() {
	      clearTimeout(this._timeout);
	      EventHandler__default.default.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

	      if (this.tip) {
	        this.tip.remove();
	      }

	      this._disposePopper();

	      super.dispose();
	    }

	    show() {
	      if (this._element.style.display === 'none') {
	        throw new Error('Please use show on visible elements');
	      }

	      if (!(this.isWithContent() && this._isEnabled)) {
	        return;
	      }

	      const showEvent = EventHandler__default.default.trigger(this._element, this.constructor.Event.SHOW);
	      const shadowRoot = findShadowRoot(this._element);
	      const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

	      if (showEvent.defaultPrevented || !isInTheDom) {
	        return;
	      } // A trick to recreate a tooltip in case a new title is given by using the NOT documented `data-bs-original-title`
	      // This will be removed later in favor of a `setContent` method


	      if (this.constructor.NAME === 'tooltip' && this.tip && this.getTitle() !== this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
	        this._disposePopper();

	        this.tip.remove();
	        this.tip = null;
	      }

	      const tip = this.getTipElement();
	      const tipId = getUID(this.constructor.NAME);
	      tip.setAttribute('id', tipId);

	      this._element.setAttribute('aria-describedby', tipId);

	      if (this._config.animation) {
	        tip.classList.add(CLASS_NAME_FADE);
	      }

	      const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

	      const attachment = this._getAttachment(placement);

	      this._addAttachmentClass(attachment);

	      const {
	        container
	      } = this._config;
	      Data__default.default.set(tip, this.constructor.DATA_KEY, this);

	      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
	        container.append(tip);
	        EventHandler__default.default.trigger(this._element, this.constructor.Event.INSERTED);
	      }

	      if (this._popper) {
	        this._popper.update();
	      } else {
	        this._popper = Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
	      }

	      tip.classList.add(CLASS_NAME_SHOW);

	      const customClass = this._resolvePossibleFunction(this._config.customClass);

	      if (customClass) {
	        tip.classList.add(...customClass.split(' '));
	      } // If this is a touch-enabled device we add extra
	      // empty mouseover listeners to the body's immediate children;
	      // only needed because of broken event delegation on iOS
	      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


	      if ('ontouchstart' in document.documentElement) {
	        [].concat(...document.body.children).forEach(element => {
	          EventHandler__default.default.on(element, 'mouseover', noop);
	        });
	      }

	      const complete = () => {
	        const prevHoverState = this._hoverState;
	        this._hoverState = null;
	        EventHandler__default.default.trigger(this._element, this.constructor.Event.SHOWN);

	        if (prevHoverState === HOVER_STATE_OUT) {
	          this._leave(null, this);
	        }
	      };

	      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE);

	      this._queueCallback(complete, this.tip, isAnimated);
	    }

	    hide() {
	      if (!this._popper) {
	        return;
	      }

	      const tip = this.getTipElement();

	      const complete = () => {
	        if (this._isWithActiveTrigger()) {
	          return;
	        }

	        if (this._hoverState !== HOVER_STATE_SHOW) {
	          tip.remove();
	        }

	        this._cleanTipClass();

	        this._element.removeAttribute('aria-describedby');

	        EventHandler__default.default.trigger(this._element, this.constructor.Event.HIDDEN);

	        this._disposePopper();
	      };

	      const hideEvent = EventHandler__default.default.trigger(this._element, this.constructor.Event.HIDE);

	      if (hideEvent.defaultPrevented) {
	        return;
	      }

	      tip.classList.remove(CLASS_NAME_SHOW); // If this is a touch-enabled device we remove the extra
	      // empty mouseover listeners we added for iOS support

	      if ('ontouchstart' in document.documentElement) {
	        [].concat(...document.body.children).forEach(element => EventHandler__default.default.off(element, 'mouseover', noop));
	      }

	      this._activeTrigger[TRIGGER_CLICK] = false;
	      this._activeTrigger[TRIGGER_FOCUS] = false;
	      this._activeTrigger[TRIGGER_HOVER] = false;
	      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE);

	      this._queueCallback(complete, this.tip, isAnimated);

	      this._hoverState = '';
	    }

	    update() {
	      if (this._popper !== null) {
	        this._popper.update();
	      }
	    } // Protected


	    isWithContent() {
	      return Boolean(this.getTitle());
	    }

	    getTipElement() {
	      if (this.tip) {
	        return this.tip;
	      }

	      const element = document.createElement('div');
	      element.innerHTML = this._config.template;
	      const tip = element.children[0];
	      this.setContent(tip);
	      tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW);
	      this.tip = tip;
	      return this.tip;
	    }

	    setContent(tip) {
	      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
	    }

	    _sanitizeAndSetContent(template, content, selector) {
	      const templateElement = SelectorEngine__default.default.findOne(selector, template);

	      if (!content && templateElement) {
	        templateElement.remove();
	        return;
	      } // we use append for html objects to maintain js events


	      this.setElementContent(templateElement, content);
	    }

	    setElementContent(element, content) {
	      if (element === null) {
	        return;
	      }

	      if (isElement(content)) {
	        content = getElement(content); // content is a DOM node or a jQuery

	        if (this._config.html) {
	          if (content.parentNode !== element) {
	            element.innerHTML = '';
	            element.append(content);
	          }
	        } else {
	          element.textContent = content.textContent;
	        }

	        return;
	      }

	      if (this._config.html) {
	        if (this._config.sanitize) {
	          content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
	        }

	        element.innerHTML = content;
	      } else {
	        element.textContent = content;
	      }
	    }

	    getTitle() {
	      const title = this._element.getAttribute('data-bs-original-title') || this._config.title;

	      return this._resolvePossibleFunction(title);
	    }

	    updateAttachment(attachment) {
	      if (attachment === 'right') {
	        return 'end';
	      }

	      if (attachment === 'left') {
	        return 'start';
	      }

	      return attachment;
	    } // Private


	    _initializeOnDelegatedTarget(event, context) {
	      return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
	    }

	    _getOffset() {
	      const {
	        offset
	      } = this._config;

	      if (typeof offset === 'string') {
	        return offset.split(',').map(val => Number.parseInt(val, 10));
	      }

	      if (typeof offset === 'function') {
	        return popperData => offset(popperData, this._element);
	      }

	      return offset;
	    }

	    _resolvePossibleFunction(content) {
	      return typeof content === 'function' ? content.call(this._element) : content;
	    }

	    _getPopperConfig(attachment) {
	      const defaultBsPopperConfig = {
	        placement: attachment,
	        modifiers: [{
	          name: 'flip',
	          options: {
	            fallbackPlacements: this._config.fallbackPlacements
	          }
	        }, {
	          name: 'offset',
	          options: {
	            offset: this._getOffset()
	          }
	        }, {
	          name: 'preventOverflow',
	          options: {
	            boundary: this._config.boundary
	          }
	        }, {
	          name: 'arrow',
	          options: {
	            element: `.${this.constructor.NAME}-arrow`
	          }
	        }, {
	          name: 'onChange',
	          enabled: true,
	          phase: 'afterWrite',
	          fn: data => this._handlePopperPlacementChange(data)
	        }],
	        onFirstUpdate: data => {
	          if (data.options.placement !== data.placement) {
	            this._handlePopperPlacementChange(data);
	          }
	        }
	      };
	      return { ...defaultBsPopperConfig,
	        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
	      };
	    }

	    _addAttachmentClass(attachment) {
	      this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
	    }

	    _getAttachment(placement) {
	      return AttachmentMap[placement.toUpperCase()];
	    }

	    _setListeners() {
	      const triggers = this._config.trigger.split(' ');

	      triggers.forEach(trigger => {
	        if (trigger === 'click') {
	          EventHandler__default.default.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
	        } else if (trigger !== TRIGGER_MANUAL) {
	          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
	          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
	          EventHandler__default.default.on(this._element, eventIn, this._config.selector, event => this._enter(event));
	          EventHandler__default.default.on(this._element, eventOut, this._config.selector, event => this._leave(event));
	        }
	      });

	      this._hideModalHandler = () => {
	        if (this._element) {
	          this.hide();
	        }
	      };

	      EventHandler__default.default.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

	      if (this._config.selector) {
	        this._config = { ...this._config,
	          trigger: 'manual',
	          selector: ''
	        };
	      } else {
	        this._fixTitle();
	      }
	    }

	    _fixTitle() {
	      const title = this._element.getAttribute('title');

	      const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

	      if (title || originalTitleType !== 'string') {
	        this._element.setAttribute('data-bs-original-title', title || '');

	        if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
	          this._element.setAttribute('aria-label', title);
	        }

	        this._element.setAttribute('title', '');
	      }
	    }

	    _enter(event, context) {
	      context = this._initializeOnDelegatedTarget(event, context);

	      if (event) {
	        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
	      }

	      if (context.getTipElement().classList.contains(CLASS_NAME_SHOW) || context._hoverState === HOVER_STATE_SHOW) {
	        context._hoverState = HOVER_STATE_SHOW;
	        return;
	      }

	      clearTimeout(context._timeout);
	      context._hoverState = HOVER_STATE_SHOW;

	      if (!context._config.delay || !context._config.delay.show) {
	        context.show();
	        return;
	      }

	      context._timeout = setTimeout(() => {
	        if (context._hoverState === HOVER_STATE_SHOW) {
	          context.show();
	        }
	      }, context._config.delay.show);
	    }

	    _leave(event, context) {
	      context = this._initializeOnDelegatedTarget(event, context);

	      if (event) {
	        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
	      }

	      if (context._isWithActiveTrigger()) {
	        return;
	      }

	      clearTimeout(context._timeout);
	      context._hoverState = HOVER_STATE_OUT;

	      if (!context._config.delay || !context._config.delay.hide) {
	        context.hide();
	        return;
	      }

	      context._timeout = setTimeout(() => {
	        if (context._hoverState === HOVER_STATE_OUT) {
	          context.hide();
	        }
	      }, context._config.delay.hide);
	    }

	    _isWithActiveTrigger() {
	      for (const trigger in this._activeTrigger) {
	        if (this._activeTrigger[trigger]) {
	          return true;
	        }
	      }

	      return false;
	    }

	    _getConfig(config) {
	      const dataAttributes = Manipulator__default.default.getDataAttributes(this._element);
	      Object.keys(dataAttributes).forEach(dataAttr => {
	        if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
	          delete dataAttributes[dataAttr];
	        }
	      });
	      config = { ...this.constructor.Default,
	        ...dataAttributes,
	        ...(typeof config === 'object' && config ? config : {})
	      };
	      config.container = config.container === false ? document.body : getElement(config.container);

	      if (typeof config.delay === 'number') {
	        config.delay = {
	          show: config.delay,
	          hide: config.delay
	        };
	      }

	      if (typeof config.title === 'number') {
	        config.title = config.title.toString();
	      }

	      if (typeof config.content === 'number') {
	        config.content = config.content.toString();
	      }

	      typeCheckConfig(NAME, config, this.constructor.DefaultType);

	      if (config.sanitize) {
	        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
	      }

	      return config;
	    }

	    _getDelegateConfig() {
	      const config = {};

	      for (const key in this._config) {
	        if (this.constructor.Default[key] !== this._config[key]) {
	          config[key] = this._config[key];
	        }
	      } // In the future can be replaced with:
	      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
	      // `Object.fromEntries(keysWithDifferentValues)`


	      return config;
	    }

	    _cleanTipClass() {
	      const tip = this.getTipElement();
	      const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
	      const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);

	      if (tabClass !== null && tabClass.length > 0) {
	        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
	      }
	    }

	    _getBasicClassPrefix() {
	      return CLASS_PREFIX;
	    }

	    _handlePopperPlacementChange(popperData) {
	      const {
	        state
	      } = popperData;

	      if (!state) {
	        return;
	      }

	      this.tip = state.elements.popper;

	      this._cleanTipClass();

	      this._addAttachmentClass(this._getAttachment(state.placement));
	    }

	    _disposePopper() {
	      if (this._popper) {
	        this._popper.destroy();

	        this._popper = null;
	      }
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const data = Tooltip.getOrCreateInstance(this, config);

	        if (typeof config === 'string') {
	          if (typeof data[config] === 'undefined') {
	            throw new TypeError(`No method named "${config}"`);
	          }

	          data[config]();
	        }
	      });
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Tooltip to jQuery only if jQuery is present
	   */


	  defineJQueryPlugin(Tooltip);

	  return Tooltip;

	}));

	}(tooltip$1));

	var tooltip = /*@__PURE__*/getDefaultExportFromCjs(tooltip$1.exports);

	/*!
	  * Bootstrap popover.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(tooltip$1.exports) ;
	})(commonjsGlobal, (function (Tooltip) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const Tooltip__default = /*#__PURE__*/_interopDefaultLegacy(Tooltip);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): popover.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'popover';
	  const DATA_KEY = 'bs.popover';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const CLASS_PREFIX = 'bs-popover';
	  const Default = { ...Tooltip__default.default.Default,
	    placement: 'right',
	    offset: [0, 8],
	    trigger: 'click',
	    content: '',
	    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
	  };
	  const DefaultType = { ...Tooltip__default.default.DefaultType,
	    content: '(string|element|function)'
	  };
	  const Event = {
	    HIDE: `hide${EVENT_KEY}`,
	    HIDDEN: `hidden${EVENT_KEY}`,
	    SHOW: `show${EVENT_KEY}`,
	    SHOWN: `shown${EVENT_KEY}`,
	    INSERTED: `inserted${EVENT_KEY}`,
	    CLICK: `click${EVENT_KEY}`,
	    FOCUSIN: `focusin${EVENT_KEY}`,
	    FOCUSOUT: `focusout${EVENT_KEY}`,
	    MOUSEENTER: `mouseenter${EVENT_KEY}`,
	    MOUSELEAVE: `mouseleave${EVENT_KEY}`
	  };
	  const SELECTOR_TITLE = '.popover-header';
	  const SELECTOR_CONTENT = '.popover-body';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Popover extends Tooltip__default.default {
	    // Getters
	    static get Default() {
	      return Default;
	    }

	    static get NAME() {
	      return NAME;
	    }

	    static get Event() {
	      return Event;
	    }

	    static get DefaultType() {
	      return DefaultType;
	    } // Overrides


	    isWithContent() {
	      return this.getTitle() || this._getContent();
	    }

	    setContent(tip) {
	      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);

	      this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
	    } // Private


	    _getContent() {
	      return this._resolvePossibleFunction(this._config.content);
	    }

	    _getBasicClassPrefix() {
	      return CLASS_PREFIX;
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const data = Popover.getOrCreateInstance(this, config);

	        if (typeof config === 'string') {
	          if (typeof data[config] === 'undefined') {
	            throw new TypeError(`No method named "${config}"`);
	          }

	          data[config]();
	        }
	      });
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Popover to jQuery only if jQuery is present
	   */


	  defineJQueryPlugin(Popover);

	  return Popover;

	}));

	}(popover$1));

	var popover = popover$1.exports;

	var scrollspy$1 = {exports: {}};

	/*!
	  * Bootstrap scrollspy.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(eventHandler.exports, manipulator.exports, selectorEngine.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (EventHandler, Manipulator, SelectorEngine, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
	  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const toType = obj => {
	    if (obj === null || obj === undefined) {
	      return `${obj}`;
	    }

	    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	  };

	  const getSelector = element => {
	    let selector = element.getAttribute('data-bs-target');

	    if (!selector || selector === '#') {
	      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	      // `document.querySelector` will rightfully complain it is invalid.
	      // See https://github.com/twbs/bootstrap/issues/32273

	      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	        return null;
	      } // Just in case some CMS puts out a full URL with the anchor appended


	      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	        hrefAttr = `#${hrefAttr.split('#')[1]}`;
	      }

	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	    }

	    return selector;
	  };

	  const getSelectorFromElement = element => {
	    const selector = getSelector(element);

	    if (selector) {
	      return document.querySelector(selector) ? selector : null;
	    }

	    return null;
	  };

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const getElement = obj => {
	    if (isElement(obj)) {
	      // it's a jQuery object or a node element
	      return obj.jquery ? obj[0] : obj;
	    }

	    if (typeof obj === 'string' && obj.length > 0) {
	      return document.querySelector(obj);
	    }

	    return null;
	  };

	  const typeCheckConfig = (componentName, config, configTypes) => {
	    Object.keys(configTypes).forEach(property => {
	      const expectedTypes = configTypes[property];
	      const value = config[property];
	      const valueType = value && isElement(value) ? 'element' : toType(value);

	      if (!new RegExp(expectedTypes).test(valueType)) {
	        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
	      }
	    });
	  };

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): scrollspy.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'scrollspy';
	  const DATA_KEY = 'bs.scrollspy';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const DATA_API_KEY = '.data-api';
	  const Default = {
	    offset: 10,
	    method: 'auto',
	    target: ''
	  };
	  const DefaultType = {
	    offset: 'number',
	    method: 'string',
	    target: '(string|element)'
	  };
	  const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
	  const EVENT_SCROLL = `scroll${EVENT_KEY}`;
	  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
	  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
	  const CLASS_NAME_ACTIVE = 'active';
	  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
	  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
	  const SELECTOR_NAV_LINKS = '.nav-link';
	  const SELECTOR_NAV_ITEMS = '.nav-item';
	  const SELECTOR_LIST_ITEMS = '.list-group-item';
	  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
	  const SELECTOR_DROPDOWN = '.dropdown';
	  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
	  const METHOD_OFFSET = 'offset';
	  const METHOD_POSITION = 'position';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class ScrollSpy extends BaseComponent__default.default {
	    constructor(element, config) {
	      super(element);
	      this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
	      this._config = this._getConfig(config);
	      this._offsets = [];
	      this._targets = [];
	      this._activeTarget = null;
	      this._scrollHeight = 0;
	      EventHandler__default.default.on(this._scrollElement, EVENT_SCROLL, () => this._process());
	      this.refresh();

	      this._process();
	    } // Getters


	    static get Default() {
	      return Default;
	    }

	    static get NAME() {
	      return NAME;
	    } // Public


	    refresh() {
	      const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
	      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
	      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
	      this._offsets = [];
	      this._targets = [];
	      this._scrollHeight = this._getScrollHeight();
	      const targets = SelectorEngine__default.default.find(SELECTOR_LINK_ITEMS, this._config.target);
	      targets.map(element => {
	        const targetSelector = getSelectorFromElement(element);
	        const target = targetSelector ? SelectorEngine__default.default.findOne(targetSelector) : null;

	        if (target) {
	          const targetBCR = target.getBoundingClientRect();

	          if (targetBCR.width || targetBCR.height) {
	            return [Manipulator__default.default[offsetMethod](target).top + offsetBase, targetSelector];
	          }
	        }

	        return null;
	      }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
	        this._offsets.push(item[0]);

	        this._targets.push(item[1]);
	      });
	    }

	    dispose() {
	      EventHandler__default.default.off(this._scrollElement, EVENT_KEY);
	      super.dispose();
	    } // Private


	    _getConfig(config) {
	      config = { ...Default,
	        ...Manipulator__default.default.getDataAttributes(this._element),
	        ...(typeof config === 'object' && config ? config : {})
	      };
	      config.target = getElement(config.target) || document.documentElement;
	      typeCheckConfig(NAME, config, DefaultType);
	      return config;
	    }

	    _getScrollTop() {
	      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
	    }

	    _getScrollHeight() {
	      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
	    }

	    _getOffsetHeight() {
	      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
	    }

	    _process() {
	      const scrollTop = this._getScrollTop() + this._config.offset;

	      const scrollHeight = this._getScrollHeight();

	      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

	      if (this._scrollHeight !== scrollHeight) {
	        this.refresh();
	      }

	      if (scrollTop >= maxScroll) {
	        const target = this._targets[this._targets.length - 1];

	        if (this._activeTarget !== target) {
	          this._activate(target);
	        }

	        return;
	      }

	      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
	        this._activeTarget = null;

	        this._clear();

	        return;
	      }

	      for (let i = this._offsets.length; i--;) {
	        const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

	        if (isActiveTarget) {
	          this._activate(this._targets[i]);
	        }
	      }
	    }

	    _activate(target) {
	      this._activeTarget = target;

	      this._clear();

	      const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
	      const link = SelectorEngine__default.default.findOne(queries.join(','), this._config.target);
	      link.classList.add(CLASS_NAME_ACTIVE);

	      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
	        SelectorEngine__default.default.findOne(SELECTOR_DROPDOWN_TOGGLE, link.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE);
	      } else {
	        SelectorEngine__default.default.parents(link, SELECTOR_NAV_LIST_GROUP).forEach(listGroup => {
	          // Set triggered links parents as active
	          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
	          SelectorEngine__default.default.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE)); // Handle special case when .nav-link is inside .nav-item

	          SelectorEngine__default.default.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
	            SelectorEngine__default.default.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE));
	          });
	        });
	      }

	      EventHandler__default.default.trigger(this._scrollElement, EVENT_ACTIVATE, {
	        relatedTarget: target
	      });
	    }

	    _clear() {
	      SelectorEngine__default.default.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains(CLASS_NAME_ACTIVE)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE));
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const data = ScrollSpy.getOrCreateInstance(this, config);

	        if (typeof config !== 'string') {
	          return;
	        }

	        if (typeof data[config] === 'undefined') {
	          throw new TypeError(`No method named "${config}"`);
	        }

	        data[config]();
	      });
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * Data Api implementation
	   * ------------------------------------------------------------------------
	   */


	  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
	    SelectorEngine__default.default.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
	  });
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .ScrollSpy to jQuery only if jQuery is present
	   */

	  defineJQueryPlugin(ScrollSpy);

	  return ScrollSpy;

	}));

	}(scrollspy$1));

	var scrollspy = scrollspy$1.exports;

	var tab$1 = {exports: {}};

	/*!
	  * Bootstrap tab.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(eventHandler.exports, selectorEngine.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (EventHandler, SelectorEngine, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const getSelector = element => {
	    let selector = element.getAttribute('data-bs-target');

	    if (!selector || selector === '#') {
	      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	      // `document.querySelector` will rightfully complain it is invalid.
	      // See https://github.com/twbs/bootstrap/issues/32273

	      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	        return null;
	      } // Just in case some CMS puts out a full URL with the anchor appended


	      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	        hrefAttr = `#${hrefAttr.split('#')[1]}`;
	      }

	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	    }

	    return selector;
	  };

	  const getElementFromSelector = element => {
	    const selector = getSelector(element);
	    return selector ? document.querySelector(selector) : null;
	  };

	  const isDisabled = element => {
	    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
	      return true;
	    }

	    if (element.classList.contains('disabled')) {
	      return true;
	    }

	    if (typeof element.disabled !== 'undefined') {
	      return element.disabled;
	    }

	    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
	  };
	  /**
	   * Trick to restart an element's animation
	   *
	   * @param {HTMLElement} element
	   * @return void
	   *
	   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
	   */


	  const reflow = element => {
	    // eslint-disable-next-line no-unused-expressions
	    element.offsetHeight;
	  };

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): tab.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'tab';
	  const DATA_KEY = 'bs.tab';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const DATA_API_KEY = '.data-api';
	  const EVENT_HIDE = `hide${EVENT_KEY}`;
	  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
	  const EVENT_SHOW = `show${EVENT_KEY}`;
	  const EVENT_SHOWN = `shown${EVENT_KEY}`;
	  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
	  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
	  const CLASS_NAME_ACTIVE = 'active';
	  const CLASS_NAME_FADE = 'fade';
	  const CLASS_NAME_SHOW = 'show';
	  const SELECTOR_DROPDOWN = '.dropdown';
	  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
	  const SELECTOR_ACTIVE = '.active';
	  const SELECTOR_ACTIVE_UL = ':scope > li > .active';
	  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
	  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
	  const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Tab extends BaseComponent__default.default {
	    // Getters
	    static get NAME() {
	      return NAME;
	    } // Public


	    show() {
	      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
	        return;
	      }

	      let previous;
	      const target = getElementFromSelector(this._element);

	      const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

	      if (listElement) {
	        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
	        previous = SelectorEngine__default.default.find(itemSelector, listElement);
	        previous = previous[previous.length - 1];
	      }

	      const hideEvent = previous ? EventHandler__default.default.trigger(previous, EVENT_HIDE, {
	        relatedTarget: this._element
	      }) : null;
	      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, {
	        relatedTarget: previous
	      });

	      if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
	        return;
	      }

	      this._activate(this._element, listElement);

	      const complete = () => {
	        EventHandler__default.default.trigger(previous, EVENT_HIDDEN, {
	          relatedTarget: this._element
	        });
	        EventHandler__default.default.trigger(this._element, EVENT_SHOWN, {
	          relatedTarget: previous
	        });
	      };

	      if (target) {
	        this._activate(target, target.parentNode, complete);
	      } else {
	        complete();
	      }
	    } // Private


	    _activate(element, container, callback) {
	      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine__default.default.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine__default.default.children(container, SELECTOR_ACTIVE);
	      const active = activeElements[0];
	      const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE);

	      const complete = () => this._transitionComplete(element, active, callback);

	      if (active && isTransitioning) {
	        active.classList.remove(CLASS_NAME_SHOW);

	        this._queueCallback(complete, element, true);
	      } else {
	        complete();
	      }
	    }

	    _transitionComplete(element, active, callback) {
	      if (active) {
	        active.classList.remove(CLASS_NAME_ACTIVE);
	        const dropdownChild = SelectorEngine__default.default.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

	        if (dropdownChild) {
	          dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
	        }

	        if (active.getAttribute('role') === 'tab') {
	          active.setAttribute('aria-selected', false);
	        }
	      }

	      element.classList.add(CLASS_NAME_ACTIVE);

	      if (element.getAttribute('role') === 'tab') {
	        element.setAttribute('aria-selected', true);
	      }

	      reflow(element);

	      if (element.classList.contains(CLASS_NAME_FADE)) {
	        element.classList.add(CLASS_NAME_SHOW);
	      }

	      let parent = element.parentNode;

	      if (parent && parent.nodeName === 'LI') {
	        parent = parent.parentNode;
	      }

	      if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
	        const dropdownElement = element.closest(SELECTOR_DROPDOWN);

	        if (dropdownElement) {
	          SelectorEngine__default.default.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
	        }

	        element.setAttribute('aria-expanded', true);
	      }

	      if (callback) {
	        callback();
	      }
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const data = Tab.getOrCreateInstance(this);

	        if (typeof config === 'string') {
	          if (typeof data[config] === 'undefined') {
	            throw new TypeError(`No method named "${config}"`);
	          }

	          data[config]();
	        }
	      });
	    }

	  }
	  /**
	   * ------------------------------------------------------------------------
	   * Data Api implementation
	   * ------------------------------------------------------------------------
	   */


	  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	    if (['A', 'AREA'].includes(this.tagName)) {
	      event.preventDefault();
	    }

	    if (isDisabled(this)) {
	      return;
	    }

	    const data = Tab.getOrCreateInstance(this);
	    data.show();
	  });
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Tab to jQuery only if jQuery is present
	   */

	  defineJQueryPlugin(Tab);

	  return Tab;

	}));

	}(tab$1));

	var tab = tab$1.exports;

	var toast$1 = {exports: {}};

	/*!
	  * Bootstrap toast.js v5.1.3 (https://getbootstrap.com/)
	  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory(eventHandler.exports, manipulator.exports, baseComponent.exports) ;
	})(commonjsGlobal, (function (EventHandler, Manipulator, BaseComponent) {
	  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

	  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
	  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
	  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/index.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const toType = obj => {
	    if (obj === null || obj === undefined) {
	      return `${obj}`;
	    }

	    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	  };

	  const getSelector = element => {
	    let selector = element.getAttribute('data-bs-target');

	    if (!selector || selector === '#') {
	      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	      // `document.querySelector` will rightfully complain it is invalid.
	      // See https://github.com/twbs/bootstrap/issues/32273

	      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	        return null;
	      } // Just in case some CMS puts out a full URL with the anchor appended


	      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	        hrefAttr = `#${hrefAttr.split('#')[1]}`;
	      }

	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	    }

	    return selector;
	  };

	  const getElementFromSelector = element => {
	    const selector = getSelector(element);
	    return selector ? document.querySelector(selector) : null;
	  };

	  const isElement = obj => {
	    if (!obj || typeof obj !== 'object') {
	      return false;
	    }

	    if (typeof obj.jquery !== 'undefined') {
	      obj = obj[0];
	    }

	    return typeof obj.nodeType !== 'undefined';
	  };

	  const typeCheckConfig = (componentName, config, configTypes) => {
	    Object.keys(configTypes).forEach(property => {
	      const expectedTypes = configTypes[property];
	      const value = config[property];
	      const valueType = value && isElement(value) ? 'element' : toType(value);

	      if (!new RegExp(expectedTypes).test(valueType)) {
	        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
	      }
	    });
	  };

	  const isDisabled = element => {
	    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
	      return true;
	    }

	    if (element.classList.contains('disabled')) {
	      return true;
	    }

	    if (typeof element.disabled !== 'undefined') {
	      return element.disabled;
	    }

	    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
	  };
	  /**
	   * Trick to restart an element's animation
	   *
	   * @param {HTMLElement} element
	   * @return void
	   *
	   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
	   */


	  const reflow = element => {
	    // eslint-disable-next-line no-unused-expressions
	    element.offsetHeight;
	  };

	  const getjQuery = () => {
	    const {
	      jQuery
	    } = window;

	    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	      return jQuery;
	    }

	    return null;
	  };

	  const DOMContentLoadedCallbacks = [];

	  const onDOMContentLoaded = callback => {
	    if (document.readyState === 'loading') {
	      // add listener on the first call when the document is in loading state
	      if (!DOMContentLoadedCallbacks.length) {
	        document.addEventListener('DOMContentLoaded', () => {
	          DOMContentLoadedCallbacks.forEach(callback => callback());
	        });
	      }

	      DOMContentLoadedCallbacks.push(callback);
	    } else {
	      callback();
	    }
	  };

	  const defineJQueryPlugin = plugin => {
	    onDOMContentLoaded(() => {
	      const $ = getjQuery();
	      /* istanbul ignore if */

	      if ($) {
	        const name = plugin.NAME;
	        const JQUERY_NO_CONFLICT = $.fn[name];
	        $.fn[name] = plugin.jQueryInterface;
	        $.fn[name].Constructor = plugin;

	        $.fn[name].noConflict = () => {
	          $.fn[name] = JQUERY_NO_CONFLICT;
	          return plugin.jQueryInterface;
	        };
	      }
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): util/component-functions.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */

	  const enableDismissTrigger = (component, method = 'hide') => {
	    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
	    const name = component.NAME;
	    EventHandler__default.default.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
	      if (['A', 'AREA'].includes(this.tagName)) {
	        event.preventDefault();
	      }

	      if (isDisabled(this)) {
	        return;
	      }

	      const target = getElementFromSelector(this) || this.closest(`.${name}`);
	      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

	      instance[method]();
	    });
	  };

	  /**
	   * --------------------------------------------------------------------------
	   * Bootstrap (v5.1.3): toast.js
	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	   * --------------------------------------------------------------------------
	   */
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  const NAME = 'toast';
	  const DATA_KEY = 'bs.toast';
	  const EVENT_KEY = `.${DATA_KEY}`;
	  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
	  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
	  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
	  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
	  const EVENT_HIDE = `hide${EVENT_KEY}`;
	  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
	  const EVENT_SHOW = `show${EVENT_KEY}`;
	  const EVENT_SHOWN = `shown${EVENT_KEY}`;
	  const CLASS_NAME_FADE = 'fade';
	  const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

	  const CLASS_NAME_SHOW = 'show';
	  const CLASS_NAME_SHOWING = 'showing';
	  const DefaultType = {
	    animation: 'boolean',
	    autohide: 'boolean',
	    delay: 'number'
	  };
	  const Default = {
	    animation: true,
	    autohide: true,
	    delay: 5000
	  };
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  class Toast extends BaseComponent__default.default {
	    constructor(element, config) {
	      super(element);
	      this._config = this._getConfig(config);
	      this._timeout = null;
	      this._hasMouseInteraction = false;
	      this._hasKeyboardInteraction = false;

	      this._setListeners();
	    } // Getters


	    static get DefaultType() {
	      return DefaultType;
	    }

	    static get Default() {
	      return Default;
	    }

	    static get NAME() {
	      return NAME;
	    } // Public


	    show() {
	      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW);

	      if (showEvent.defaultPrevented) {
	        return;
	      }

	      this._clearTimeout();

	      if (this._config.animation) {
	        this._element.classList.add(CLASS_NAME_FADE);
	      }

	      const complete = () => {
	        this._element.classList.remove(CLASS_NAME_SHOWING);

	        EventHandler__default.default.trigger(this._element, EVENT_SHOWN);

	        this._maybeScheduleHide();
	      };

	      this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated


	      reflow(this._element);

	      this._element.classList.add(CLASS_NAME_SHOW);

	      this._element.classList.add(CLASS_NAME_SHOWING);

	      this._queueCallback(complete, this._element, this._config.animation);
	    }

	    hide() {
	      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
	        return;
	      }

	      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);

	      if (hideEvent.defaultPrevented) {
	        return;
	      }

	      const complete = () => {
	        this._element.classList.add(CLASS_NAME_HIDE); // @deprecated


	        this._element.classList.remove(CLASS_NAME_SHOWING);

	        this._element.classList.remove(CLASS_NAME_SHOW);

	        EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
	      };

	      this._element.classList.add(CLASS_NAME_SHOWING);

	      this._queueCallback(complete, this._element, this._config.animation);
	    }

	    dispose() {
	      this._clearTimeout();

	      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
	        this._element.classList.remove(CLASS_NAME_SHOW);
	      }

	      super.dispose();
	    } // Private


	    _getConfig(config) {
	      config = { ...Default,
	        ...Manipulator__default.default.getDataAttributes(this._element),
	        ...(typeof config === 'object' && config ? config : {})
	      };
	      typeCheckConfig(NAME, config, this.constructor.DefaultType);
	      return config;
	    }

	    _maybeScheduleHide() {
	      if (!this._config.autohide) {
	        return;
	      }

	      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
	        return;
	      }

	      this._timeout = setTimeout(() => {
	        this.hide();
	      }, this._config.delay);
	    }

	    _onInteraction(event, isInteracting) {
	      switch (event.type) {
	        case 'mouseover':
	        case 'mouseout':
	          this._hasMouseInteraction = isInteracting;
	          break;

	        case 'focusin':
	        case 'focusout':
	          this._hasKeyboardInteraction = isInteracting;
	          break;
	      }

	      if (isInteracting) {
	        this._clearTimeout();

	        return;
	      }

	      const nextElement = event.relatedTarget;

	      if (this._element === nextElement || this._element.contains(nextElement)) {
	        return;
	      }

	      this._maybeScheduleHide();
	    }

	    _setListeners() {
	      EventHandler__default.default.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
	      EventHandler__default.default.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
	      EventHandler__default.default.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
	      EventHandler__default.default.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
	    }

	    _clearTimeout() {
	      clearTimeout(this._timeout);
	      this._timeout = null;
	    } // Static


	    static jQueryInterface(config) {
	      return this.each(function () {
	        const data = Toast.getOrCreateInstance(this, config);

	        if (typeof config === 'string') {
	          if (typeof data[config] === 'undefined') {
	            throw new TypeError(`No method named "${config}"`);
	          }

	          data[config](this);
	        }
	      });
	    }

	  }

	  enableDismissTrigger(Toast);
	  /**
	   * ------------------------------------------------------------------------
	   * jQuery
	   * ------------------------------------------------------------------------
	   * add .Toast to jQuery only if jQuery is present
	   */

	  defineJQueryPlugin(Toast);

	  return Toast;

	}));

	}(toast$1));

	var toast = toast$1.exports;

	/**
	 * File skip-link-focus-fix.js.
	 *
	 * Helps with accessibility for keyboard only users.
	 *
	 * Learn more: https://git.io/vWdr2
	 */
	(function () {
	  var isWebkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1,
	      isOpera = navigator.userAgent.toLowerCase().indexOf('opera') > -1,
	      isIe = navigator.userAgent.toLowerCase().indexOf('msie') > -1;

	  if ((isWebkit || isOpera || isIe) && document.getElementById && window.addEventListener) {
	    window.addEventListener('hashchange', function () {
	      var id = location.hash.substring(1),
	          element;

	      if (!/^[A-z0-9_-]+$/.test(id)) {
	        return;
	      }

	      element = document.getElementById(id);

	      if (element) {
	        if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
	          element.tabIndex = -1;
	        }

	        element.focus();
	      }
	    }, false);
	  }
	})();

	function noop() { }
	function assign(tar, src) {
	    // @ts-ignore
	    for (const k in src)
	        tar[k] = src[k];
	    return tar;
	}
	function run(fn) {
	    return fn();
	}
	function blank_object() {
	    return Object.create(null);
	}
	function run_all(fns) {
	    fns.forEach(run);
	}
	function is_function(thing) {
	    return typeof thing === 'function';
	}
	function safe_not_equal(a, b) {
	    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}
	function is_empty(obj) {
	    return Object.keys(obj).length === 0;
	}
	function subscribe(store, ...callbacks) {
	    if (store == null) {
	        return noop;
	    }
	    const unsub = store.subscribe(...callbacks);
	    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
	}
	function component_subscribe(component, store, callback) {
	    component.$$.on_destroy.push(subscribe(store, callback));
	}
	function create_slot(definition, ctx, $$scope, fn) {
	    if (definition) {
	        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
	        return definition[0](slot_ctx);
	    }
	}
	function get_slot_context(definition, ctx, $$scope, fn) {
	    return definition[1] && fn
	        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
	        : $$scope.ctx;
	}
	function get_slot_changes(definition, $$scope, dirty, fn) {
	    if (definition[2] && fn) {
	        const lets = definition[2](fn(dirty));
	        if ($$scope.dirty === undefined) {
	            return lets;
	        }
	        if (typeof lets === 'object') {
	            const merged = [];
	            const len = Math.max($$scope.dirty.length, lets.length);
	            for (let i = 0; i < len; i += 1) {
	                merged[i] = $$scope.dirty[i] | lets[i];
	            }
	            return merged;
	        }
	        return $$scope.dirty | lets;
	    }
	    return $$scope.dirty;
	}
	function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
	    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
	    if (slot_changes) {
	        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
	        slot.p(slot_context, slot_changes);
	    }
	}
	function exclude_internal_props(props) {
	    const result = {};
	    for (const k in props)
	        if (k[0] !== '$')
	            result[k] = props[k];
	    return result;
	}
	function compute_rest_props(props, keys) {
	    const rest = {};
	    keys = new Set(keys);
	    for (const k in props)
	        if (!keys.has(k) && k[0] !== '$')
	            rest[k] = props[k];
	    return rest;
	}
	function null_to_empty(value) {
	    return value == null ? '' : value;
	}
	function set_store_value(store, ret, value = ret) {
	    store.set(value);
	    return ret;
	}
	function action_destroyer(action_result) {
	    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
	}

	// Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
	// at the end of hydration without touching the remaining nodes.
	let is_hydrating = false;
	function start_hydrating() {
	    is_hydrating = true;
	}
	function end_hydrating() {
	    is_hydrating = false;
	}
	function upper_bound(low, high, key, value) {
	    // Return first index of value larger than input value in the range [low, high)
	    while (low < high) {
	        const mid = low + ((high - low) >> 1);
	        if (key(mid) <= value) {
	            low = mid + 1;
	        }
	        else {
	            high = mid;
	        }
	    }
	    return low;
	}
	function init_hydrate(target) {
	    if (target.hydrate_init)
	        return;
	    target.hydrate_init = true;
	    // We know that all children have claim_order values since the unclaimed have been detached
	    const children = target.childNodes;
	    /*
	    * Reorder claimed children optimally.
	    * We can reorder claimed children optimally by finding the longest subsequence of
	    * nodes that are already claimed in order and only moving the rest. The longest
	    * subsequence subsequence of nodes that are claimed in order can be found by
	    * computing the longest increasing subsequence of .claim_order values.
	    *
	    * This algorithm is optimal in generating the least amount of reorder operations
	    * possible.
	    *
	    * Proof:
	    * We know that, given a set of reordering operations, the nodes that do not move
	    * always form an increasing subsequence, since they do not move among each other
	    * meaning that they must be already ordered among each other. Thus, the maximal
	    * set of nodes that do not move form a longest increasing subsequence.
	    */
	    // Compute longest increasing subsequence
	    // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
	    const m = new Int32Array(children.length + 1);
	    // Predecessor indices + 1
	    const p = new Int32Array(children.length);
	    m[0] = -1;
	    let longest = 0;
	    for (let i = 0; i < children.length; i++) {
	        const current = children[i].claim_order;
	        // Find the largest subsequence length such that it ends in a value less than our current value
	        // upper_bound returns first greater value, so we subtract one
	        const seqLen = upper_bound(1, longest + 1, idx => children[m[idx]].claim_order, current) - 1;
	        p[i] = m[seqLen] + 1;
	        const newLen = seqLen + 1;
	        // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
	        m[newLen] = i;
	        longest = Math.max(newLen, longest);
	    }
	    // The longest increasing subsequence of nodes (initially reversed)
	    const lis = [];
	    // The rest of the nodes, nodes that will be moved
	    const toMove = [];
	    let last = children.length - 1;
	    for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
	        lis.push(children[cur - 1]);
	        for (; last >= cur; last--) {
	            toMove.push(children[last]);
	        }
	        last--;
	    }
	    for (; last >= 0; last--) {
	        toMove.push(children[last]);
	    }
	    lis.reverse();
	    // We sort the nodes being moved to guarantee that their insertion order matches the claim order
	    toMove.sort((a, b) => a.claim_order - b.claim_order);
	    // Finally, we move the nodes
	    for (let i = 0, j = 0; i < toMove.length; i++) {
	        while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
	            j++;
	        }
	        const anchor = j < lis.length ? lis[j] : null;
	        target.insertBefore(toMove[i], anchor);
	    }
	}
	function append(target, node) {
	    if (is_hydrating) {
	        init_hydrate(target);
	        if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentElement !== target))) {
	            target.actual_end_child = target.firstChild;
	        }
	        if (node !== target.actual_end_child) {
	            target.insertBefore(node, target.actual_end_child);
	        }
	        else {
	            target.actual_end_child = node.nextSibling;
	        }
	    }
	    else if (node.parentNode !== target) {
	        target.appendChild(node);
	    }
	}
	function insert(target, node, anchor) {
	    if (is_hydrating && !anchor) {
	        append(target, node);
	    }
	    else if (node.parentNode !== target || node.nextSibling != anchor) {
	        target.insertBefore(node, anchor || null);
	    }
	}
	function detach(node) {
	    node.parentNode.removeChild(node);
	}
	function destroy_each(iterations, detaching) {
	    for (let i = 0; i < iterations.length; i += 1) {
	        if (iterations[i])
	            iterations[i].d(detaching);
	    }
	}
	function element(name) {
	    return document.createElement(name);
	}
	function svg_element(name) {
	    return document.createElementNS('http://www.w3.org/2000/svg', name);
	}
	function text(data) {
	    return document.createTextNode(data);
	}
	function space() {
	    return text(' ');
	}
	function empty() {
	    return text('');
	}
	function listen(node, event, handler, options) {
	    node.addEventListener(event, handler, options);
	    return () => node.removeEventListener(event, handler, options);
	}
	function attr(node, attribute, value) {
	    if (value == null)
	        node.removeAttribute(attribute);
	    else if (node.getAttribute(attribute) !== value)
	        node.setAttribute(attribute, value);
	}
	function set_attributes(node, attributes) {
	    // @ts-ignore
	    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
	    for (const key in attributes) {
	        if (attributes[key] == null) {
	            node.removeAttribute(key);
	        }
	        else if (key === 'style') {
	            node.style.cssText = attributes[key];
	        }
	        else if (key === '__value') {
	            node.value = node[key] = attributes[key];
	        }
	        else if (descriptors[key] && descriptors[key].set) {
	            node[key] = attributes[key];
	        }
	        else {
	            attr(node, key, attributes[key]);
	        }
	    }
	}
	function set_svg_attributes(node, attributes) {
	    for (const key in attributes) {
	        attr(node, key, attributes[key]);
	    }
	}
	function children(element) {
	    return Array.from(element.childNodes);
	}
	function set_data(text, data) {
	    data = '' + data;
	    if (text.wholeText !== data)
	        text.data = data;
	}
	function set_style(node, key, value, important) {
	    node.style.setProperty(key, value, important ? 'important' : '');
	}
	function toggle_class(element, name, toggle) {
	    element.classList[toggle ? 'add' : 'remove'](name);
	}
	function custom_event(type, detail, bubbles = false) {
	    const e = document.createEvent('CustomEvent');
	    e.initCustomEvent(type, bubbles, false, detail);
	    return e;
	}
	class HtmlTag {
	    constructor(claimed_nodes) {
	        this.e = this.n = null;
	        this.l = claimed_nodes;
	    }
	    m(html, target, anchor = null) {
	        if (!this.e) {
	            this.e = element(target.nodeName);
	            this.t = target;
	            if (this.l) {
	                this.n = this.l;
	            }
	            else {
	                this.h(html);
	            }
	        }
	        this.i(anchor);
	    }
	    h(html) {
	        this.e.innerHTML = html;
	        this.n = Array.from(this.e.childNodes);
	    }
	    i(anchor) {
	        for (let i = 0; i < this.n.length; i += 1) {
	            insert(this.t, this.n[i], anchor);
	        }
	    }
	    p(html) {
	        this.d();
	        this.h(html);
	        this.i(this.a);
	    }
	    d() {
	        this.n.forEach(detach);
	    }
	}

	let current_component;
	function set_current_component(component) {
	    current_component = component;
	}
	function get_current_component() {
	    if (!current_component)
	        throw new Error('Function called outside component initialization');
	    return current_component;
	}
	function createEventDispatcher() {
	    const component = get_current_component();
	    return (type, detail) => {
	        const callbacks = component.$$.callbacks[type];
	        if (callbacks) {
	            // TODO are there situations where events could be dispatched
	            // in a server (non-DOM) environment?
	            const event = custom_event(type, detail);
	            callbacks.slice().forEach(fn => {
	                fn.call(component, event);
	            });
	        }
	    };
	}
	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	function bubble(component, event) {
	    const callbacks = component.$$.callbacks[event.type];
	    if (callbacks) {
	        // @ts-ignore
	        callbacks.slice().forEach(fn => fn.call(this, event));
	    }
	}

	const dirty_components = [];
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];
	const resolved_promise = Promise.resolve();
	let update_scheduled = false;
	function schedule_update() {
	    if (!update_scheduled) {
	        update_scheduled = true;
	        resolved_promise.then(flush);
	    }
	}
	function add_render_callback(fn) {
	    render_callbacks.push(fn);
	}
	function add_flush_callback(fn) {
	    flush_callbacks.push(fn);
	}
	let flushing = false;
	const seen_callbacks = new Set();
	function flush() {
	    if (flushing)
	        return;
	    flushing = true;
	    do {
	        // first, call beforeUpdate functions
	        // and update components
	        for (let i = 0; i < dirty_components.length; i += 1) {
	            const component = dirty_components[i];
	            set_current_component(component);
	            update(component.$$);
	        }
	        set_current_component(null);
	        dirty_components.length = 0;
	        while (binding_callbacks.length)
	            binding_callbacks.pop()();
	        // then, once components are updated, call
	        // afterUpdate functions. This may cause
	        // subsequent updates...
	        for (let i = 0; i < render_callbacks.length; i += 1) {
	            const callback = render_callbacks[i];
	            if (!seen_callbacks.has(callback)) {
	                // ...so guard against infinite loops
	                seen_callbacks.add(callback);
	                callback();
	            }
	        }
	        render_callbacks.length = 0;
	    } while (dirty_components.length);
	    while (flush_callbacks.length) {
	        flush_callbacks.pop()();
	    }
	    update_scheduled = false;
	    flushing = false;
	    seen_callbacks.clear();
	}
	function update($$) {
	    if ($$.fragment !== null) {
	        $$.update();
	        run_all($$.before_update);
	        const dirty = $$.dirty;
	        $$.dirty = [-1];
	        $$.fragment && $$.fragment.p($$.ctx, dirty);
	        $$.after_update.forEach(add_render_callback);
	    }
	}
	const outroing = new Set();
	let outros;
	function group_outros() {
	    outros = {
	        r: 0,
	        c: [],
	        p: outros // parent group
	    };
	}
	function check_outros() {
	    if (!outros.r) {
	        run_all(outros.c);
	    }
	    outros = outros.p;
	}
	function transition_in(block, local) {
	    if (block && block.i) {
	        outroing.delete(block);
	        block.i(local);
	    }
	}
	function transition_out(block, local, detach, callback) {
	    if (block && block.o) {
	        if (outroing.has(block))
	            return;
	        outroing.add(block);
	        outros.c.push(() => {
	            outroing.delete(block);
	            if (callback) {
	                if (detach)
	                    block.d(1);
	                callback();
	            }
	        });
	        block.o(local);
	    }
	}

	function get_spread_update(levels, updates) {
	    const update = {};
	    const to_null_out = {};
	    const accounted_for = { $$scope: 1 };
	    let i = levels.length;
	    while (i--) {
	        const o = levels[i];
	        const n = updates[i];
	        if (n) {
	            for (const key in o) {
	                if (!(key in n))
	                    to_null_out[key] = 1;
	            }
	            for (const key in n) {
	                if (!accounted_for[key]) {
	                    update[key] = n[key];
	                    accounted_for[key] = 1;
	                }
	            }
	            levels[i] = n;
	        }
	        else {
	            for (const key in o) {
	                accounted_for[key] = 1;
	            }
	        }
	    }
	    for (const key in to_null_out) {
	        if (!(key in update))
	            update[key] = undefined;
	    }
	    return update;
	}

	function bind(component, name, callback) {
	    const index = component.$$.props[name];
	    if (index !== undefined) {
	        component.$$.bound[index] = callback;
	        callback(component.$$.ctx[index]);
	    }
	}
	function create_component(block) {
	    block && block.c();
	}
	function mount_component(component, target, anchor, customElement) {
	    const { fragment, on_mount, on_destroy, after_update } = component.$$;
	    fragment && fragment.m(target, anchor);
	    if (!customElement) {
	        // onMount happens before the initial afterUpdate
	        add_render_callback(() => {
	            const new_on_destroy = on_mount.map(run).filter(is_function);
	            if (on_destroy) {
	                on_destroy.push(...new_on_destroy);
	            }
	            else {
	                // Edge case - component was destroyed immediately,
	                // most likely as a result of a binding initialising
	                run_all(new_on_destroy);
	            }
	            component.$$.on_mount = [];
	        });
	    }
	    after_update.forEach(add_render_callback);
	}
	function destroy_component(component, detaching) {
	    const $$ = component.$$;
	    if ($$.fragment !== null) {
	        run_all($$.on_destroy);
	        $$.fragment && $$.fragment.d(detaching);
	        // TODO null out other refs, including component.$$ (but need to
	        // preserve final state?)
	        $$.on_destroy = $$.fragment = null;
	        $$.ctx = [];
	    }
	}
	function make_dirty(component, i) {
	    if (component.$$.dirty[0] === -1) {
	        dirty_components.push(component);
	        schedule_update();
	        component.$$.dirty.fill(0);
	    }
	    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
	}
	function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
	    const parent_component = current_component;
	    set_current_component(component);
	    const $$ = component.$$ = {
	        fragment: null,
	        ctx: null,
	        // state
	        props,
	        update: noop,
	        not_equal,
	        bound: blank_object(),
	        // lifecycle
	        on_mount: [],
	        on_destroy: [],
	        on_disconnect: [],
	        before_update: [],
	        after_update: [],
	        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
	        // everything else
	        callbacks: blank_object(),
	        dirty,
	        skip_bound: false
	    };
	    let ready = false;
	    $$.ctx = instance
	        ? instance(component, options.props || {}, (i, ret, ...rest) => {
	            const value = rest.length ? rest[0] : ret;
	            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
	                if (!$$.skip_bound && $$.bound[i])
	                    $$.bound[i](value);
	                if (ready)
	                    make_dirty(component, i);
	            }
	            return ret;
	        })
	        : [];
	    $$.update();
	    ready = true;
	    run_all($$.before_update);
	    // `false` as a special case of no DOM component
	    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	    if (options.target) {
	        if (options.hydrate) {
	            start_hydrating();
	            const nodes = children(options.target);
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            $$.fragment && $$.fragment.l(nodes);
	            nodes.forEach(detach);
	        }
	        else {
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            $$.fragment && $$.fragment.c();
	        }
	        if (options.intro)
	            transition_in(component.$$.fragment);
	        mount_component(component, options.target, options.anchor, options.customElement);
	        end_hydrating();
	        flush();
	    }
	    set_current_component(parent_component);
	}
	/**
	 * Base class for Svelte components. Used when dev=false.
	 */
	class SvelteComponent {
	    $destroy() {
	        destroy_component(this, 1);
	        this.$destroy = noop;
	    }
	    $on(type, callback) {
	        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
	        callbacks.push(callback);
	        return () => {
	            const index = callbacks.indexOf(callback);
	            if (index !== -1)
	                callbacks.splice(index, 1);
	        };
	    }
	    $set($$props) {
	        if (this.$$set && !is_empty($$props)) {
	            this.$$.skip_bound = true;
	            this.$$set($$props);
	            this.$$.skip_bound = false;
	        }
	    }
	}

	/* src/js/svelte/components/BlogFeedAccordion.svelte generated by Svelte v3.39.0 */

	function add_css$2() {
		var style = element("style");
		style.id = "svelte-2oc32n-style";
		style.textContent = ".accordion-button.svelte-2oc32n{background:none;border:none;box-shadow:none}";
		append(document.head, style);
	}

	function get_each_context$3(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[4] = list[i];
		return child_ctx;
	}

	// (25:2) {#if item.title }
	function create_if_block$4(ctx) {
		let div2;
		let div0;
		let button;
		let t0_value = /*item*/ ctx[4].title + "";
		let t0;
		let button_data_bs_target_value;
		let button_aria_controls_value;
		let div0_id_value;
		let t1;
		let div1;
		let div1_id_value;
		let div1_aria_labelledby_value;
		let div1_data_bs_parent_value;
		let t2;
		let div2_class_value;
		let if_block = /*item*/ ctx[4].content && create_if_block_1$2(ctx);

		return {
			c() {
				div2 = element("div");
				div0 = element("div");
				button = element("button");
				t0 = text(t0_value);
				t1 = space();
				div1 = element("div");
				if (if_block) if_block.c();
				t2 = space();
				attr(button, "class", "accordion-button fw-bold py-2 collapsed svelte-2oc32n");
				attr(button, "type", "button");
				attr(button, "data-bs-toggle", "collapse");
				attr(button, "data-bs-target", button_data_bs_target_value = "#collapse" + /*item*/ ctx[4].id);
				attr(button, "aria-expanded", "false");
				attr(button, "aria-controls", button_aria_controls_value = "collapse" + /*item*/ ctx[4].id);
				attr(div0, "class", "accordion-header");
				attr(div0, "id", div0_id_value = "heading" + /*item*/ ctx[4].id);
				attr(div1, "id", div1_id_value = "collapse" + /*item*/ ctx[4].id);
				attr(div1, "class", "accordion-collapse collapse");
				attr(div1, "aria-labelledby", div1_aria_labelledby_value = "heading" + /*item*/ ctx[4].id);
				attr(div1, "data-bs-parent", div1_data_bs_parent_value = "#" + /*accordionId*/ ctx[1]);
				attr(div2, "class", div2_class_value = "accordion-item " + (/*itemThemes*/ ctx[2][/*item*/ ctx[4].theme] ?? /*itemThemes*/ ctx[2].internal) + " svelte-2oc32n");
			},
			m(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);
				append(div0, button);
				append(button, t0);
				append(div2, t1);
				append(div2, div1);
				if (if_block) if_block.m(div1, null);
				append(div2, t2);
			},
			p(ctx, dirty) {
				if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*item*/ ctx[4].title + "")) set_data(t0, t0_value);

				if (dirty & /*items*/ 1 && button_data_bs_target_value !== (button_data_bs_target_value = "#collapse" + /*item*/ ctx[4].id)) {
					attr(button, "data-bs-target", button_data_bs_target_value);
				}

				if (dirty & /*items*/ 1 && button_aria_controls_value !== (button_aria_controls_value = "collapse" + /*item*/ ctx[4].id)) {
					attr(button, "aria-controls", button_aria_controls_value);
				}

				if (dirty & /*items*/ 1 && div0_id_value !== (div0_id_value = "heading" + /*item*/ ctx[4].id)) {
					attr(div0, "id", div0_id_value);
				}

				if (/*item*/ ctx[4].content) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block_1$2(ctx);
						if_block.c();
						if_block.m(div1, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (dirty & /*items*/ 1 && div1_id_value !== (div1_id_value = "collapse" + /*item*/ ctx[4].id)) {
					attr(div1, "id", div1_id_value);
				}

				if (dirty & /*items*/ 1 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = "heading" + /*item*/ ctx[4].id)) {
					attr(div1, "aria-labelledby", div1_aria_labelledby_value);
				}

				if (dirty & /*items*/ 1 && div2_class_value !== (div2_class_value = "accordion-item " + (/*itemThemes*/ ctx[2][/*item*/ ctx[4].theme] ?? /*itemThemes*/ ctx[2].internal) + " svelte-2oc32n")) {
					attr(div2, "class", div2_class_value);
				}
			},
			d(detaching) {
				if (detaching) detach(div2);
				if (if_block) if_block.d();
			}
		};
	}

	// (33:5) {#if item.content }
	function create_if_block_1$2(ctx) {
		let div;
		let raw_value = /*item*/ ctx[4].content + "";

		return {
			c() {
				div = element("div");
				attr(div, "class", "accordion-body pt-1 pb-3");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				div.innerHTML = raw_value;
			},
			p(ctx, dirty) {
				if (dirty & /*items*/ 1 && raw_value !== (raw_value = /*item*/ ctx[4].content + "")) div.innerHTML = raw_value;		},
			d(detaching) {
				if (detaching) detach(div);
			}
		};
	}

	// (24:1) {#each items as item}
	function create_each_block$3(ctx) {
		let if_block_anchor;
		let if_block = /*item*/ ctx[4].title && create_if_block$4(ctx);

		return {
			c() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},
			p(ctx, dirty) {
				if (/*item*/ ctx[4].title) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$4(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			d(detaching) {
				if (if_block) if_block.d(detaching);
				if (detaching) detach(if_block_anchor);
			}
		};
	}

	function create_fragment$a(ctx) {
		let div;
		let each_value = /*items*/ ctx[0];
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
		}

		let div_levels = [{ class: "accordion" }, { id: /*accordionId*/ ctx[1] }, /*$$restProps*/ ctx[3]];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		return {
			c() {
				div = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				set_attributes(div, div_data);
				toggle_class(div, "svelte-2oc32n", true);
			},
			m(target, anchor) {
				insert(target, div, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div, null);
				}
			},
			p(ctx, [dirty]) {
				if (dirty & /*itemThemes, items, accordionId*/ 7) {
					each_value = /*items*/ ctx[0];
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$3(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$3(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					{ class: "accordion" },
					{ id: /*accordionId*/ ctx[1] },
					dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
				]));

				toggle_class(div, "svelte-2oc32n", true);
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) detach(div);
				destroy_each(each_blocks, detaching);
			}
		};
	}

	function instance$a($$self, $$props, $$invalidate) {
		const omit_props_names = ["items"];
		let $$restProps = compute_rest_props($$props, omit_props_names);

		let { items = [
			{
				title: 'Test Title',
				content: 'Test Content'
			}
		] } = $$props;

		let accordionId = 'accordion_' + Math.floor(Math.random() * 10e15).toString(16);

		let itemThemes = {
			internal: 'border-primary bg-white',
			external: 'border-0 bg-light'
		};

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('items' in $$new_props) $$invalidate(0, items = $$new_props.items);
		};

		return [items, accordionId, itemThemes, $$restProps];
	}

	class BlogFeedAccordion extends SvelteComponent {
		constructor(options) {
			super();
			if (!document.getElementById("svelte-2oc32n-style")) add_css$2();
			init(this, options, instance$a, create_fragment$a, safe_not_equal, { items: 0 });
		}
	}

	var dropdownClick = function dropdownClick(node) {
	  // Dispatch event if Filter is clicked
	  var handleClick = function handleClick(event) {
	    if (event.target.getAttribute('data-option-term-id')) {
	      node.dispatchEvent(new CustomEvent("filterclick", {
	        detail: {
	          label: event.target.innerText,
	          id: event.target.getAttribute('data-option-term-id'),
	          type: event.target.getAttribute('data-option-term-type')
	        }
	      })); // Toggle classes

	      event.target.classList.toggle('active fw-500');
	    }
	  }; // Add listener for filter bar
	  // @todo maybe the filter bar should be a Svelte component instead of inside a PHP template


	  document.querySelector('.nwea-filter-dropdown').addEventListener("click", handleClick);
	};

	const subscriber_queue = [];
	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 * @param {*=}value initial value
	 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
	 */
	function writable(value, start = noop) {
	    let stop;
	    const subscribers = [];
	    function set(new_value) {
	        if (safe_not_equal(value, new_value)) {
	            value = new_value;
	            if (stop) { // store is ready
	                const run_queue = !subscriber_queue.length;
	                for (let i = 0; i < subscribers.length; i += 1) {
	                    const s = subscribers[i];
	                    s[1]();
	                    subscriber_queue.push(s, value);
	                }
	                if (run_queue) {
	                    for (let i = 0; i < subscriber_queue.length; i += 2) {
	                        subscriber_queue[i][0](subscriber_queue[i + 1]);
	                    }
	                    subscriber_queue.length = 0;
	                }
	            }
	        }
	    }
	    function update(fn) {
	        set(fn(value));
	    }
	    function subscribe(run, invalidate = noop) {
	        const subscriber = [run, invalidate];
	        subscribers.push(subscriber);
	        if (subscribers.length === 1) {
	            stop = start(set) || noop;
	        }
	        run(value);
	        return () => {
	            const index = subscribers.indexOf(subscriber);
	            if (index !== -1) {
	                subscribers.splice(index, 1);
	            }
	            if (subscribers.length === 0) {
	                stop();
	                stop = null;
	            }
	        };
	    }
	    return { set, update, subscribe };
	}

	var filter = writable([]); // The store for arguments passed to ajax

	var ajaxArgs = writable({
	  url: "https://stage.cms.nwea.io" + '/wp-json/wp/v2/posts/',
	  params: {
	    order: 'desc'
	  }
	});

	var ajaxRequest = function ajaxRequest(_ref) {
	  var url = _ref.url,
	      params = _ref.params;
	  var query = url + '?' + new URLSearchParams(params);
	  var data = fetch(query, {
	    method: 'GET'
	  }).then(function (response) {
	    return response;
	  })["catch"](function (error) {
	    return console.log('error', error);
	  });
	  return data;
	};

	/* src/js/svelte/components/filter/FilterPill.svelte generated by Svelte v3.39.0 */

	function create_fragment$9(ctx) {
		let button;
		let t0;
		let t1;
		let i;
		let mounted;
		let dispose;

		return {
			c() {
				button = element("button");
				t0 = text(/*name*/ ctx[0]);
				t1 = space();
				i = element("i");
				attr(i, "class", "fa fa-times");
				attr(i, "aria-hidden", "true");
				attr(button, "class", "btn btn-white btn-outline-dark b-2 rounded-pill px-4 m-1");
				attr(button, "data-term-id", /*id*/ ctx[1]);
				attr(button, "data-term-type", /*type*/ ctx[2]);
			},
			m(target, anchor) {
				insert(target, button, anchor);
				append(button, t0);
				append(button, t1);
				append(button, i);

				if (!mounted) {
					dispose = listen(button, "click", /*click_handler*/ ctx[3]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (dirty & /*name*/ 1) set_data(t0, /*name*/ ctx[0]);

				if (dirty & /*id*/ 2) {
					attr(button, "data-term-id", /*id*/ ctx[1]);
				}

				if (dirty & /*type*/ 4) {
					attr(button, "data-term-type", /*type*/ ctx[2]);
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) detach(button);
				mounted = false;
				dispose();
			}
		};
	}

	function instance$9($$self, $$props, $$invalidate) {
		let { name = 'Category' } = $$props;
		let { id = 'id' } = $$props;
		let { type = 'type' } = $$props;

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$props => {
			if ('name' in $$props) $$invalidate(0, name = $$props.name);
			if ('id' in $$props) $$invalidate(1, id = $$props.id);
			if ('type' in $$props) $$invalidate(2, type = $$props.type);
		};

		return [name, id, type, click_handler];
	}

	class FilterPill extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$9, create_fragment$9, safe_not_equal, { name: 0, id: 1, type: 2 });
		}
	}

	/* src/js/svelte/components/filter/Filter.svelte generated by Svelte v3.39.0 */

	function get_each_context$2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[10] = list[i];
		return child_ctx;
	}

	// (86:1) {#if $filter.length > 0 }
	function create_if_block$3(ctx) {
		let a;
		let t1;
		let br;
		let mounted;
		let dispose;

		return {
			c() {
				a = element("a");
				a.innerHTML = `Clear Results <i class="fa fa-times-circle" aria-hidden="true"></i>`;
				t1 = space();
				br = element("br");
				attr(a, "class", "d-block");
				attr(a, "href", "#");
			},
			m(target, anchor) {
				insert(target, a, anchor);
				insert(target, t1, anchor);
				insert(target, br, anchor);

				if (!mounted) {
					dispose = listen(a, "click", /*clearAll*/ ctx[4]);
					mounted = true;
				}
			},
			p: noop,
			d(detaching) {
				if (detaching) detach(a);
				if (detaching) detach(t1);
				if (detaching) detach(br);
				mounted = false;
				dispose();
			}
		};
	}

	// (90:1) {#each $filter as option}
	function create_each_block$2(ctx) {
		let filterpill;
		let current;

		function click_handler() {
			return /*click_handler*/ ctx[6](/*option*/ ctx[10]);
		}

		filterpill = new FilterPill({
				props: {
					id: /*option*/ ctx[10].id,
					name: /*option*/ ctx[10].name,
					type: /*option*/ ctx[10].rest_base
				}
			});

		filterpill.$on("click", click_handler);

		return {
			c() {
				create_component(filterpill.$$.fragment);
			},
			m(target, anchor) {
				mount_component(filterpill, target, anchor);
				current = true;
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;
				const filterpill_changes = {};
				if (dirty & /*$filter*/ 2) filterpill_changes.id = /*option*/ ctx[10].id;
				if (dirty & /*$filter*/ 2) filterpill_changes.name = /*option*/ ctx[10].name;
				if (dirty & /*$filter*/ 2) filterpill_changes.type = /*option*/ ctx[10].rest_base;
				filterpill.$set(filterpill_changes);
			},
			i(local) {
				if (current) return;
				transition_in(filterpill.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(filterpill.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(filterpill, detaching);
			}
		};
	}

	function create_fragment$8(ctx) {
		let div;
		let t;
		let current;
		let mounted;
		let dispose;
		let if_block = /*$filter*/ ctx[1].length > 0 && create_if_block$3(ctx);
		let each_value = /*$filter*/ ctx[1];
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		return {
			c() {
				div = element("div");
				if (if_block) if_block.c();
				t = space();

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr(div, "id", /*id*/ ctx[0]);
			},
			m(target, anchor) {
				insert(target, div, anchor);
				if (if_block) if_block.m(div, null);
				append(div, t);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div, null);
				}

				current = true;

				if (!mounted) {
					dispose = [
						action_destroyer(dropdownClick.call(null, div)),
						listen(div, "filterclick", /*handleDropdownClick*/ ctx[3])
					];

					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (/*$filter*/ ctx[1].length > 0) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$3(ctx);
						if_block.c();
						if_block.m(div, t);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (dirty & /*$filter, handlePillClick*/ 6) {
					each_value = /*$filter*/ ctx[1];
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block$2(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(div, null);
						}
					}

					group_outros();

					for (i = each_value.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}

				if (!current || dirty & /*id*/ 1) {
					attr(div, "id", /*id*/ ctx[0]);
				}
			},
			i(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d(detaching) {
				if (detaching) detach(div);
				if (if_block) if_block.d();
				destroy_each(each_blocks, detaching);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	function instance$8($$self, $$props, $$invalidate) {
		let $filter;
		let $ajaxArgs;
		component_subscribe($$self, filter, $$value => $$invalidate(1, $filter = $$value));
		component_subscribe($$self, ajaxArgs, $$value => $$invalidate(7, $ajaxArgs = $$value));
		let { id = 'filter-bar-id' } = $$props;
		let { initialData = [] } = $$props;
		set_store_value(filter, $filter = [...initialData], $filter);

		const handlePillClick = target => {
			set_store_value(
				filter,
				$filter = $filter.filter(option => {
					return option.id != target;
				}),
				$filter
			);

			// Toggle class for filter
			document.querySelectorAll(`[data-option-term-id="${target}"]`)[0].classList.toggle('active');

			document.querySelectorAll(`[data-option-term-id="${target}"]`)[0].classList.toggle('fw-500');
		};

		const handleDropdownClick = event => {
			if ($filter.some(option => event.detail.id == option.id)) {
				// if object id already exists in store, duplicate the handlePillClick behavior---which is to say, remove it
				handlePillClick(event.detail.id);
			} else {
				// Else, add it to the store
				set_store_value(
					filter,
					$filter = [
						...$filter,
						{
							name: event.detail.label,
							id: parseInt(event.detail.id),
							rest_base: event.detail.type
						}
					],
					$filter
				);
			}
		};

		const clearAll = () => {
			set_store_value(filter, $filter = [], $filter);

			// Toggle class for filter
			document.querySelectorAll(`[data-option-term-id]`).forEach(dataOption => {
				dataOption.classList.remove('active');
				dataOption.classList.remove('fw-500');
			});
		};

		const createUrlParams = data => {
			// loop through the filter object and merge duplicate rest_base keys
			let newData = [...new Set(data.map(d => d.rest_base))].map(rest_base => {
				// Concatenate values for duplicate rest_base
				return {
					[rest_base]: data.map(d => {
						if (d.rest_base === rest_base) {
							return d.id;
						}
					}).join(',')
				};
			});

			return newData;
		};

		const updateAjaxArgs = async data => {
			let params = { _embed: 1 };
			params = Object.assign(params, ...createUrlParams($filter));

			set_store_value(
				ajaxArgs,
				$ajaxArgs = {
					url: $ajaxArgs.url,
					params: {
						_embed: 1,
						per_page: 12, // hardcoded for now
						...params
					}
				},
				$ajaxArgs
			);
		};

		const click_handler = option => handlePillClick(option.id);

		$$self.$$set = $$props => {
			if ('id' in $$props) $$invalidate(0, id = $$props.id);
			if ('initialData' in $$props) $$invalidate(5, initialData = $$props.initialData);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*$filter*/ 2) {
				// Update ajax args whenevever $filter changes
				updateAjaxArgs();
			}
		};

		return [
			id,
			$filter,
			handlePillClick,
			handleDropdownClick,
			clearAll,
			initialData,
			click_handler
		];
	}

	class Filter extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$8, create_fragment$8, safe_not_equal, { id: 0, initialData: 5 });
		}
	}

	var regex = new RegExp('^http[s]?:\/\/(?!(www\.)?' + window.location.hostname.replace(/\./g, '\\.') + ')[A-Za-z0-9-\.]+');

	/* src/js/svelte/components/Link.svelte generated by Svelte v3.39.0 */

	function create_fragment$7(ctx) {
		let a;
		let a_target_value;
		let a_rel_value;
		let current;
		const default_slot_template = /*#slots*/ ctx[4].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

		let a_levels = [
			{ href: /*href*/ ctx[0] },
			{
				target: a_target_value = /*outbound*/ ctx[1] ? '_blank' : '_self'
			},
			{
				rel: a_rel_value = /*outbound*/ ctx[1] ? 'noopener' : ''
			},
			/*$$restProps*/ ctx[2]
		];

		let a_data = {};

		for (let i = 0; i < a_levels.length; i += 1) {
			a_data = assign(a_data, a_levels[i]);
		}

		return {
			c() {
				a = element("a");
				if (default_slot) default_slot.c();
				set_attributes(a, a_data);
			},
			m(target, anchor) {
				insert(target, a, anchor);

				if (default_slot) {
					default_slot.m(a, null);
				}

				current = true;
			},
			p(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
						update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], !current ? -1 : dirty, null, null);
					}
				}

				set_attributes(a, a_data = get_spread_update(a_levels, [
					(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
					(!current || dirty & /*outbound*/ 2 && a_target_value !== (a_target_value = /*outbound*/ ctx[1] ? '_blank' : '_self')) && { target: a_target_value },
					(!current || dirty & /*outbound*/ 2 && a_rel_value !== (a_rel_value = /*outbound*/ ctx[1] ? 'noopener' : '')) && { rel: a_rel_value },
					dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
				]));
			},
			i(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(a);
				if (default_slot) default_slot.d(detaching);
			}
		};
	}

	function instance$7($$self, $$props, $$invalidate) {
		const omit_props_names = ["href","outbound"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		let { href = ".#" } = $$props;
		let { outbound = href.match(regex) ? true : false } = $$props;

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
			if ('outbound' in $$new_props) $$invalidate(1, outbound = $$new_props.outbound);
			if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
		};

		return [href, outbound, $$restProps, $$scope, slots];
	}

	class Link extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$7, create_fragment$7, safe_not_equal, { href: 0, outbound: 1 });
		}
	}

	/* src/js/svelte/assets/NWEA-yellow.svg.rollup-plugin.svelte generated by Svelte v3.39.0 */

	function create_fragment$6(ctx) {
		let svg;
		let defs;
		let clipPath;
		let path0;
		let style;
		let t;
		let g3;
		let g2;
		let g1;
		let g0;
		let path1;
		let path2;

		let svg_levels = [
			{ xmlns: "http://www.w3.org/2000/svg" },
			{ viewBox: "0 0 297.89 62.95" },
			/*$$props*/ ctx[0]
		];

		let svg_data = {};

		for (let i = 0; i < svg_levels.length; i += 1) {
			svg_data = assign(svg_data, svg_levels[i]);
		}

		return {
			c() {
				svg = svg_element("svg");
				defs = svg_element("defs");
				clipPath = svg_element("clipPath");
				path0 = svg_element("path");
				style = svg_element("style");
				t = text(".cls-2{clip-path:url(#clip-path)}.cls-3{fill:#ffc20e}");
				g3 = svg_element("g");
				g2 = svg_element("g");
				g1 = svg_element("g");
				g0 = svg_element("g");
				path1 = svg_element("path");
				path2 = svg_element("path");
				set_style(path0, "fill", "none");
				attr(path0, "d", "M0 0h297.89v62.95H0z");
				attr(clipPath, "id", "clip-path");
				attr(path1, "class", "cls-3");
				attr(path1, "d", "M116.18 1.84a2.54 2.54 0 0 1 2.54 2.54v30.67c0 8 3.87 10.77 9.19 10.77s9.32-2.79 9.32-10.77V4.38a2.54 2.54 0 0 1 2.54-2.54h13.07a2.54 2.54 0 0 1 2.54 2.54v30.67c0 19.24-11.13 27.71-25.65 27.71-8.47 0-15.49-3.27-20-9.32h-.25c-4.47 6.05-11.37 9.32-20 9.32-14.52 0-25.65-8.47-25.65-27.71V4.38a2.54 2.54 0 0 1 2.54-2.54h13.15a2.54 2.54 0 0 1 2.54 2.54v30.67c0 8 3.87 10.77 9.31 10.77s9.2-2.79 9.2-10.77V4.38a2.54 2.54 0 0 1 2.54-2.54ZM178.55 36.54v.24c1.57 6.54 6.54 9.92 13.31 9.92 5 0 8.72-1 11-3.92a1.18 1.18 0 0 1 .93-.43h16.59a1.12 1.12 0 0 1 1 1.5c-4.3 11.5-15.35 19.07-29.62 19.07-18.87 0-32.18-13.31-32.18-31.46S173 0 191.86 0s31.82 13.31 31.82 31.46v4a1.11 1.11 0 0 1-1.11 1.11Zm.36-11.74v.2h26.14v-.2c-2.06-5.68-6.9-8.59-13.19-8.59s-11 2.91-13 8.59M41.27 29.86c0-9.4-4.74-13.39-11.69-13.39s-11.67 4-11.67 13.37v28.67a2.82 2.82 0 0 1-3 2.68H3a2.82 2.82 0 0 1-3-2.68l.08-54A2.82 2.82 0 0 1 3 1.84h11.21a2.82 2.82 0 0 1 2.95 2.68l-.08 4.39h.28C20.14 4.26 24.49 0 34.7 0 55.44 0 59.19 12.53 59 28.42v30.09a2.5 2.5 0 0 1-2.72 2.68h-12a2.82 2.82 0 0 1-2.95-2.68V29.86ZM256.56 63c8.84 0 15.62-4.36 18.53-10.9h.24v6.89a2.43 2.43 0 0 0 2.43 2.44h11.84a2.43 2.43 0 0 0 2.4-2.49V32.08C292 12.47 279 0 260.07 0s-32.2 13.32-32.2 31.47c0 22.16 16 31.48 28.69 31.48m3.51-46c8.24 0 13.81 5.93 13.81 14.52S268.31 46 260.07 46s-13.8-5.93-13.8-14.53S251.84 17 260.07 17M293.08 9.71a4.86 4.86 0 0 0 4.81-4.87 4.83 4.83 0 1 0-9.65.06 4.81 4.81 0 0 0 4.84 4.81m0-.53a4.25 4.25 0 0 1-4.29-4.28 4.28 4.28 0 0 1 4.26-4.37 4.23 4.23 0 0 1 4.28 4.28 4.28 4.28 0 0 1-4.25 4.34");
				attr(path2, "class", "cls-3");
				attr(path2, "d", "m293.15 5.52 1.17 1.69h1.14l-1.31-1.85a1.49 1.49 0 0 0 1.13-1.5c0-1-.81-1.55-1.89-1.55h-2.22v4.91h.94v-1.7Zm1.16-1.59c0 .48-.36.81-1 .81h-1.19v-1.6h1.19c.64 0 1 .28 1 .8");
				attr(g0, "class", "cls-2");
				attr(g1, "class", "cls-2");
				attr(g1, "id", "NWEA_Yellow_");
				attr(g1, "data-name", "NWEA Yellow ®");
				attr(g2, "id", "Layer_1-2");
				attr(g2, "data-name", "Layer 1");
				attr(g3, "id", "Layer_2");
				attr(g3, "data-name", "Layer 2");
				set_svg_attributes(svg, svg_data);
			},
			m(target, anchor) {
				insert(target, svg, anchor);
				append(svg, defs);
				append(defs, clipPath);
				append(clipPath, path0);
				append(defs, style);
				append(style, t);
				append(svg, g3);
				append(g3, g2);
				append(g2, g1);
				append(g1, g0);
				append(g0, path1);
				append(g0, path2);
			},
			p(ctx, [dirty]) {
				set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
					{ xmlns: "http://www.w3.org/2000/svg" },
					{ viewBox: "0 0 297.89 62.95" },
					dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
				]));
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) detach(svg);
			}
		};
	}

	function instance$6($$self, $$props, $$invalidate) {
		$$self.$$set = $$new_props => {
			$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		};

		$$props = exclude_internal_props($$props);
		return [$$props];
	}

	class NWEA_yellow_svg_rollup_plugin extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$6, create_fragment$6, safe_not_equal, {});
		}
	}

	/* src/js/svelte/components/Card.svelte generated by Svelte v3.39.0 */

	function add_css$1() {
		var style = element("style");
		style.id = "svelte-1uenme9-style";
		style.textContent = ".ratio.svelte-1uenme9 img.svelte-1uenme9{object-fit:cover}.card.svelte-1uenme9.svelte-1uenme9:not(.horizontal-card){max-width:20rem}.horizontal-card.svelte-1uenme9.svelte-1uenme9{flex-direction:row}.horizontal-card.svelte-1uenme9>.svelte-1uenme9{flex:1 0 50%}.horizontal-card.svelte-1uenme9 .card-title.svelte-1uenme9{font-size:1rem !important;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:0.5rem !important}.horizontal-card.svelte-1uenme9 .card-img-top.svelte-1uenme9{border-right:1px solid currentColor}.horizontal-card.svelte-1uenme9 .card-cta{margin-left:0 !important}";
		append(document.head, style);
	}

	// (63:2) {:else}
	function create_else_block$1(ctx) {
		let div;
		let logo;
		let current;

		logo = new NWEA_yellow_svg_rollup_plugin({
				props: {
					class: "w-75 mx-auto top-50 start-50 translate-middle"
				}
			});

		return {
			c() {
				div = element("div");
				create_component(logo.$$.fragment);
				attr(div, "class", "bg-dark ratio ratio-16x9 svelte-1uenme9");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				mount_component(logo, div, null);
				current = true;
			},
			p: noop,
			i(local) {
				if (current) return;
				transition_in(logo.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(logo.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(div);
				destroy_component(logo);
			}
		};
	}

	// (59:2) {#if cardImage }
	function create_if_block_5(ctx) {
		let div;
		let img;
		let img_src_value;

		return {
			c() {
				div = element("div");
				img = element("img");
				if (img.src !== (img_src_value = /*cardImage*/ ctx[0])) attr(img, "src", img_src_value);
				attr(img, "alt", /*cardImageAlt*/ ctx[1]);
				attr(img, "class", "card-img-top svelte-1uenme9");
				attr(div, "class", "ratio ratio-16x9 svelte-1uenme9");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				append(div, img);
			},
			p(ctx, dirty) {
				if (dirty & /*cardImage*/ 1 && img.src !== (img_src_value = /*cardImage*/ ctx[0])) {
					attr(img, "src", img_src_value);
				}

				if (dirty & /*cardImageAlt*/ 2) {
					attr(img, "alt", /*cardImageAlt*/ ctx[1]);
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) detach(div);
			}
		};
	}

	// (69:3) {#if eyebrow }
	function create_if_block_4$1(ctx) {
		let small;
		let t;

		return {
			c() {
				small = element("small");
				t = text(/*eyebrow*/ ctx[2]);
				attr(small, "class", "card-eyebrow");
			},
			m(target, anchor) {
				insert(target, small, anchor);
				append(small, t);
			},
			p(ctx, dirty) {
				if (dirty & /*eyebrow*/ 4) set_data(t, /*eyebrow*/ ctx[2]);
			},
			d(detaching) {
				if (detaching) detach(small);
			}
		};
	}

	// (72:3) {#if date }
	function create_if_block_3$1(ctx) {
		let small;
		let t;

		return {
			c() {
				small = element("small");
				t = text(/*date*/ ctx[3]);
				attr(small, "class", "text-muted d-block mb-2 fw-500");
			},
			m(target, anchor) {
				insert(target, small, anchor);
				append(small, t);
			},
			p(ctx, dirty) {
				if (dirty & /*date*/ 8) set_data(t, /*date*/ ctx[3]);
			},
			d(detaching) {
				if (detaching) detach(small);
			}
		};
	}

	// (75:3) {#if title }
	function create_if_block_2$1(ctx) {
		let span;

		return {
			c() {
				span = element("span");
				attr(span, "class", "card-title svelte-1uenme9");
			},
			m(target, anchor) {
				insert(target, span, anchor);
				span.innerHTML = /*title*/ ctx[4];
			},
			p(ctx, dirty) {
				if (dirty & /*title*/ 16) span.innerHTML = /*title*/ ctx[4];		},
			d(detaching) {
				if (detaching) detach(span);
			}
		};
	}

	// (78:3) {#if description }
	function create_if_block_1$1(ctx) {
		let div;

		return {
			c() {
				div = element("div");
				attr(div, "class", "d-block card-text");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				div.innerHTML = /*description*/ ctx[5];
			},
			p(ctx, dirty) {
				if (dirty & /*description*/ 32) div.innerHTML = /*description*/ ctx[5];		},
			d(detaching) {
				if (detaching) detach(div);
			}
		};
	}

	// (81:3) {#if link }
	function create_if_block$2(ctx) {
		let link_1;
		let current;

		link_1 = new Link({
				props: {
					href: /*link*/ ctx[7],
					"aria-label": /*title*/ ctx[4],
					class: (/*hot*/ ctx[10] ? 'stretched-link ' : '') + 'card-cta',
					$$slots: { default: [create_default_slot$1] },
					$$scope: { ctx }
				}
			});

		return {
			c() {
				create_component(link_1.$$.fragment);
			},
			m(target, anchor) {
				mount_component(link_1, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const link_1_changes = {};
				if (dirty & /*link*/ 128) link_1_changes.href = /*link*/ ctx[7];
				if (dirty & /*title*/ 16) link_1_changes["aria-label"] = /*title*/ ctx[4];
				if (dirty & /*hot*/ 1024) link_1_changes.class = (/*hot*/ ctx[10] ? 'stretched-link ' : '') + 'card-cta';

				if (dirty & /*$$scope, cta*/ 2112) {
					link_1_changes.$$scope = { dirty, ctx };
				}

				link_1.$set(link_1_changes);
			},
			i(local) {
				if (current) return;
				transition_in(link_1.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(link_1.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(link_1, detaching);
			}
		};
	}

	// (82:4) <Link href={ link } aria-label={ title } class="{ ( hot ? 'stretched-link ' : '') + 'card-cta' }">
	function create_default_slot$1(ctx) {
		let t;
		let i;

		return {
			c() {
				t = text(/*cta*/ ctx[6]);
				i = element("i");
				attr(i, "class", "bi bi-arrow-right-short align-middle");
			},
			m(target, anchor) {
				insert(target, t, anchor);
				insert(target, i, anchor);
			},
			p(ctx, dirty) {
				if (dirty & /*cta*/ 64) set_data(t, /*cta*/ ctx[6]);
			},
			d(detaching) {
				if (detaching) detach(t);
				if (detaching) detach(i);
			}
		};
	}

	function create_fragment$5(ctx) {
		let div2;
		let div1;
		let current_block_type_index;
		let if_block0;
		let t0;
		let div0;
		let t1;
		let t2;
		let t3;
		let t4;
		let div1_class_value;
		let div2_class_value;
		let current;
		const if_block_creators = [create_if_block_5, create_else_block$1];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*cardImage*/ ctx[0]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
		let if_block1 = /*eyebrow*/ ctx[2] && create_if_block_4$1(ctx);
		let if_block2 = /*date*/ ctx[3] && create_if_block_3$1(ctx);
		let if_block3 = /*title*/ ctx[4] && create_if_block_2$1(ctx);
		let if_block4 = /*description*/ ctx[5] && create_if_block_1$1(ctx);
		let if_block5 = /*link*/ ctx[7] && create_if_block$2(ctx);

		return {
			c() {
				div2 = element("div");
				div1 = element("div");
				if_block0.c();
				t0 = space();
				div0 = element("div");
				if (if_block1) if_block1.c();
				t1 = space();
				if (if_block2) if_block2.c();
				t2 = space();
				if (if_block3) if_block3.c();
				t3 = space();
				if (if_block4) if_block4.c();
				t4 = space();
				if (if_block5) if_block5.c();
				attr(div0, "class", "card-body d-flex flex-column svelte-1uenme9");
				attr(div1, "class", div1_class_value = "" + ('card mx-auto h-100 ' + /*cardClassName*/ ctx[9] + ' ' + (/*link*/ ctx[7] ? ' card-has-hover-effect' : '') + " " + " svelte-1uenme9"));
				attr(div2, "class", div2_class_value = "" + (null_to_empty('col ' + /*containerClassName*/ ctx[8]) + " svelte-1uenme9"));
			},
			m(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div1);
				if_blocks[current_block_type_index].m(div1, null);
				append(div1, t0);
				append(div1, div0);
				if (if_block1) if_block1.m(div0, null);
				append(div0, t1);
				if (if_block2) if_block2.m(div0, null);
				append(div0, t2);
				if (if_block3) if_block3.m(div0, null);
				append(div0, t3);
				if (if_block4) if_block4.m(div0, null);
				append(div0, t4);
				if (if_block5) if_block5.m(div0, null);
				current = true;
			},
			p(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block0 = if_blocks[current_block_type_index];

					if (!if_block0) {
						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block0.c();
					} else {
						if_block0.p(ctx, dirty);
					}

					transition_in(if_block0, 1);
					if_block0.m(div1, t0);
				}

				if (/*eyebrow*/ ctx[2]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block_4$1(ctx);
						if_block1.c();
						if_block1.m(div0, t1);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (/*date*/ ctx[3]) {
					if (if_block2) {
						if_block2.p(ctx, dirty);
					} else {
						if_block2 = create_if_block_3$1(ctx);
						if_block2.c();
						if_block2.m(div0, t2);
					}
				} else if (if_block2) {
					if_block2.d(1);
					if_block2 = null;
				}

				if (/*title*/ ctx[4]) {
					if (if_block3) {
						if_block3.p(ctx, dirty);
					} else {
						if_block3 = create_if_block_2$1(ctx);
						if_block3.c();
						if_block3.m(div0, t3);
					}
				} else if (if_block3) {
					if_block3.d(1);
					if_block3 = null;
				}

				if (/*description*/ ctx[5]) {
					if (if_block4) {
						if_block4.p(ctx, dirty);
					} else {
						if_block4 = create_if_block_1$1(ctx);
						if_block4.c();
						if_block4.m(div0, t4);
					}
				} else if (if_block4) {
					if_block4.d(1);
					if_block4 = null;
				}

				if (/*link*/ ctx[7]) {
					if (if_block5) {
						if_block5.p(ctx, dirty);

						if (dirty & /*link*/ 128) {
							transition_in(if_block5, 1);
						}
					} else {
						if_block5 = create_if_block$2(ctx);
						if_block5.c();
						transition_in(if_block5, 1);
						if_block5.m(div0, null);
					}
				} else if (if_block5) {
					group_outros();

					transition_out(if_block5, 1, 1, () => {
						if_block5 = null;
					});

					check_outros();
				}

				if (!current || dirty & /*cardClassName, link*/ 640 && div1_class_value !== (div1_class_value = "" + ('card mx-auto h-100 ' + /*cardClassName*/ ctx[9] + ' ' + (/*link*/ ctx[7] ? ' card-has-hover-effect' : '') + " " + " svelte-1uenme9"))) {
					attr(div1, "class", div1_class_value);
				}

				if (!current || dirty & /*containerClassName*/ 256 && div2_class_value !== (div2_class_value = "" + (null_to_empty('col ' + /*containerClassName*/ ctx[8]) + " svelte-1uenme9"))) {
					attr(div2, "class", div2_class_value);
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block0);
				transition_in(if_block5);
				current = true;
			},
			o(local) {
				transition_out(if_block0);
				transition_out(if_block5);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(div2);
				if_blocks[current_block_type_index].d();
				if (if_block1) if_block1.d();
				if (if_block2) if_block2.d();
				if (if_block3) if_block3.d();
				if (if_block4) if_block4.d();
				if (if_block5) if_block5.d();
			}
		};
	}

	function instance$5($$self, $$props, $$invalidate) {
		let { cardImage = '' } = $$props;
		let { cardImageAlt = '' } = $$props;
		let { eyebrow = '' } = $$props;
		let { date = '' } = $$props;
		let { title = '' } = $$props;
		let { description = '' } = $$props;
		let { cta = 'Read more' } = $$props;
		let { link = '' } = $$props;
		let { containerClassName = '' } = $$props;
		let { cardClassName = '' } = $$props;
		let { hot = true } = $$props;

		$$self.$$set = $$props => {
			if ('cardImage' in $$props) $$invalidate(0, cardImage = $$props.cardImage);
			if ('cardImageAlt' in $$props) $$invalidate(1, cardImageAlt = $$props.cardImageAlt);
			if ('eyebrow' in $$props) $$invalidate(2, eyebrow = $$props.eyebrow);
			if ('date' in $$props) $$invalidate(3, date = $$props.date);
			if ('title' in $$props) $$invalidate(4, title = $$props.title);
			if ('description' in $$props) $$invalidate(5, description = $$props.description);
			if ('cta' in $$props) $$invalidate(6, cta = $$props.cta);
			if ('link' in $$props) $$invalidate(7, link = $$props.link);
			if ('containerClassName' in $$props) $$invalidate(8, containerClassName = $$props.containerClassName);
			if ('cardClassName' in $$props) $$invalidate(9, cardClassName = $$props.cardClassName);
			if ('hot' in $$props) $$invalidate(10, hot = $$props.hot);
		};

		return [
			cardImage,
			cardImageAlt,
			eyebrow,
			date,
			title,
			description,
			cta,
			link,
			containerClassName,
			cardClassName,
			hot
		];
	}

	class Card extends SvelteComponent {
		constructor(options) {
			super();
			if (!document.getElementById("svelte-1uenme9-style")) add_css$1();

			init(this, options, instance$5, create_fragment$5, safe_not_equal, {
				cardImage: 0,
				cardImageAlt: 1,
				eyebrow: 2,
				date: 3,
				title: 4,
				description: 5,
				cta: 6,
				link: 7,
				containerClassName: 8,
				cardClassName: 9,
				hot: 10
			});
		}
	}

	/* src/js/svelte/components/filter/FilterControls.svelte generated by Svelte v3.39.0 */

	function create_fragment$4(ctx) {
		let div2;
		let div0;
		let t0;
		let t1;
		let div1;
		let t2;
		let t3;
		let i;
		let i_class_value;
		let mounted;
		let dispose;

		return {
			c() {
				div2 = element("div");
				div0 = element("div");
				t0 = text(/*name*/ ctx[1]);
				t1 = space();
				div1 = element("div");
				t2 = text(/*controlLabel*/ ctx[2]);
				t3 = space();
				i = element("i");
				attr(div0, "class", "col-auto ms-auto");
				attr(i, "role", "button");
				attr(i, "class", i_class_value = "fa fa-long-arrow-" + (/*asc*/ ctx[0] ? 'up' : 'down') + " text-info");
				attr(i, "aria-hidden", "true");
				attr(i, "tabindex", "0");
				attr(div1, "class", "col-auto ms-auto");
				attr(div2, "class", "row justify-content-center fw-500 mb-2 small text-uppercase pb-2");
			},
			m(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);
				append(div0, t0);
				append(div2, t1);
				append(div2, div1);
				append(div1, t2);
				append(div1, t3);
				append(div1, i);

				if (!mounted) {
					dispose = listen(i, "click", /*click_handler*/ ctx[3]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (dirty & /*name*/ 2) set_data(t0, /*name*/ ctx[1]);
				if (dirty & /*controlLabel*/ 4) set_data(t2, /*controlLabel*/ ctx[2]);

				if (dirty & /*asc*/ 1 && i_class_value !== (i_class_value = "fa fa-long-arrow-" + (/*asc*/ ctx[0] ? 'up' : 'down') + " text-info")) {
					attr(i, "class", i_class_value);
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) detach(div2);
				mounted = false;
				dispose();
			}
		};
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { asc = false } = $$props;
		let { name = 'Name' } = $$props;
		let { controlLabel = 'Control' } = $$props;

		const click_handler = () => {
			asc
			? $$invalidate(0, asc = false)
			: $$invalidate(0, asc = true);
		};

		$$self.$$set = $$props => {
			if ('asc' in $$props) $$invalidate(0, asc = $$props.asc);
			if ('name' in $$props) $$invalidate(1, name = $$props.name);
			if ('controlLabel' in $$props) $$invalidate(2, controlLabel = $$props.controlLabel);
		};

		return [asc, name, controlLabel, click_handler];
	}

	class FilterControls extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$4, create_fragment$4, safe_not_equal, { asc: 0, name: 1, controlLabel: 2 });
		}
	}

	/* src/js/svelte/components/filter/FilterPagination.svelte generated by Svelte v3.39.0 */

	function get_each_context$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[8] = list[i];
		child_ctx[10] = i;
		return child_ctx;
	}

	// (18:0) {#if pages > 0 }
	function create_if_block$1(ctx) {
		let nav;
		let ul;
		let li0;
		let a0;
		let a0_href_value;
		let t1;
		let t2;
		let li1;
		let a1;
		let a1_href_value;
		let mounted;
		let dispose;
		let each_value = { length: /*pages*/ ctx[1] };
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		return {
			c() {
				nav = element("nav");
				ul = element("ul");
				li0 = element("li");
				a0 = element("a");
				a0.textContent = "Previous";
				t1 = space();

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t2 = space();
				li1 = element("li");
				a1 = element("a");
				a1.textContent = "Next";
				attr(a0, "class", "page-link");
				attr(a0, "href", a0_href_value = '#.');
				attr(li0, "class", "page-item");
				toggle_class(li0, "disabled", /*currentPage*/ ctx[0] - 1 <= 0);
				attr(a1, "class", "page-link");
				attr(a1, "href", a1_href_value = '#.');
				attr(li1, "class", "page-item");
				toggle_class(li1, "disabled", /*currentPage*/ ctx[0] == /*pages*/ ctx[1]);
				attr(ul, "class", "pagination");
				attr(nav, "aria-label", "Page navigation example");
			},
			m(target, anchor) {
				insert(target, nav, anchor);
				append(nav, ul);
				append(ul, li0);
				append(li0, a0);
				append(ul, t1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				append(ul, t2);
				append(ul, li1);
				append(li1, a1);

				if (!mounted) {
					dispose = [
						listen(a0, "click", /*click_handler*/ ctx[2]),
						listen(a1, "click", /*click_handler_3*/ ctx[5])
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (dirty & /*currentPage*/ 1) {
					toggle_class(li0, "disabled", /*currentPage*/ ctx[0] - 1 <= 0);
				}

				if (dirty & /*currentPage, pages*/ 3) {
					each_value = { length: /*pages*/ ctx[1] };
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ul, t2);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}

				if (dirty & /*currentPage, pages*/ 3) {
					toggle_class(li1, "disabled", /*currentPage*/ ctx[0] == /*pages*/ ctx[1]);
				}
			},
			d(detaching) {
				if (detaching) detach(nav);
				destroy_each(each_blocks, detaching);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (28:2) {#each { length: pages } as _, page }
	function create_each_block$1(ctx) {
		let li;
		let a;
		let t_value = /*page*/ ctx[10] + 1 + "";
		let t;
		let a_href_value;
		let a_data_page_value;
		let mounted;
		let dispose;

		function click_handler_1() {
			return /*click_handler_1*/ ctx[3](/*page*/ ctx[10]);
		}

		function click_handler_2() {
			return /*click_handler_2*/ ctx[4](/*page*/ ctx[10]);
		}

		return {
			c() {
				li = element("li");
				a = element("a");
				t = text(t_value);
				attr(a, "class", "page-link");
				attr(a, "href", a_href_value = '#.');
				attr(a, "data-page", a_data_page_value = /*page*/ ctx[10] + 1);
				attr(li, "class", "page-item");
				toggle_class(li, "active", /*currentPage*/ ctx[0] === /*page*/ ctx[10] + 1);
			},
			m(target, anchor) {
				insert(target, li, anchor);
				append(li, a);
				append(a, t);

				if (!mounted) {
					dispose = [
						listen(a, "click", click_handler_1),
						listen(li, "click", click_handler_2)
					];

					mounted = true;
				}
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty & /*currentPage*/ 1) {
					toggle_class(li, "active", /*currentPage*/ ctx[0] === /*page*/ ctx[10] + 1);
				}
			},
			d(detaching) {
				if (detaching) detach(li);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	function create_fragment$3(ctx) {
		let if_block_anchor;
		let if_block = /*pages*/ ctx[1] > 0 && create_if_block$1(ctx);

		return {
			c() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},
			p(ctx, [dirty]) {
				if (/*pages*/ ctx[1] > 0) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$1(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (if_block) if_block.d(detaching);
				if (detaching) detach(if_block_anchor);
			}
		};
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { pages = 0 } = $$props;
		let { currentPage = 1 } = $$props;
		createEventDispatcher();

		const click_handler = () => $$invalidate(0, currentPage = currentPage - 1);
		const click_handler_1 = page => $$invalidate(0, currentPage = page + 1);
		const click_handler_2 = page => $$invalidate(0, currentPage = page + 1);
		const click_handler_3 = () => $$invalidate(0, currentPage = currentPage + 1);

		$$self.$$set = $$props => {
			if ('pages' in $$props) $$invalidate(1, pages = $$props.pages);
			if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
		};

		return [
			currentPage,
			pages,
			click_handler,
			click_handler_1,
			click_handler_2,
			click_handler_3
		];
	}

	class FilterPagination extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { pages: 1, currentPage: 0 });
		}
	}

	/* src/js/svelte/components/filter/Filtered.svelte generated by Svelte v3.39.0 */

	function add_css() {
		var style = element("style");
		style.id = "svelte-eyybwu-style";
		style.textContent = ".ratio.svelte-eyybwu img.svelte-eyybwu{object-fit:cover}";
		append(document.head, style);
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[16] = list[i];
		return child_ctx;
	}

	function get_each_context_2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[21] = list[i];
		child_ctx[23] = i;
		return child_ctx;
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[16] = list[i];
		return child_ctx;
	}

	// (89:0) {#if visible }
	function create_if_block(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block_1, create_else_block];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*filterTemplate*/ ctx[1] === 'cards') return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		return {
			c() {
				if_block.c();
				if_block_anchor = empty();
			},
			m(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert(target, if_block_anchor, anchor);
				current = true;
			},
			p(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach(if_block_anchor);
			}
		};
	}

	// (131:2) {:else}
	function create_else_block(ctx) {
		let filtercontrols;
		let updating_asc;
		let t0;
		let ul;
		let t1;
		let div1;
		let div0;
		let filterpagination;
		let updating_currentPage;
		let current;

		function filtercontrols_asc_binding(value) {
			/*filtercontrols_asc_binding*/ ctx[12](value);
		}

		let filtercontrols_props = {
			name: /*type*/ ctx[0],
			controlLabel: "Order"
		};

		if (/*asc*/ ctx[3] !== void 0) {
			filtercontrols_props.asc = /*asc*/ ctx[3];
		}

		filtercontrols = new FilterControls({ props: filtercontrols_props });
		binding_callbacks.push(() => bind(filtercontrols, 'asc', filtercontrols_asc_binding));
		filtercontrols.$on("click", /*click_handler*/ ctx[13]);
		let each_value_1 = /*data*/ ctx[2];
		let each_blocks = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		function filterpagination_currentPage_binding(value) {
			/*filterpagination_currentPage_binding*/ ctx[14](value);
		}

		let filterpagination_props = { pages: /*pages*/ ctx[7] };

		if (/*currentPage*/ ctx[4] !== void 0) {
			filterpagination_props.currentPage = /*currentPage*/ ctx[4];
		}

		filterpagination = new FilterPagination({ props: filterpagination_props });
		binding_callbacks.push(() => bind(filterpagination, 'currentPage', filterpagination_currentPage_binding));

		return {
			c() {
				create_component(filtercontrols.$$.fragment);
				t0 = space();
				ul = element("ul");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t1 = space();
				div1 = element("div");
				div0 = element("div");
				create_component(filterpagination.$$.fragment);
				attr(ul, "class", "list-group list-group-flush mb-4 border-top border-bottom py-2");
				attr(div0, "class", "col-auto");
				attr(div1, "class", "row justify-content-end");
			},
			m(target, anchor) {
				mount_component(filtercontrols, target, anchor);
				insert(target, t0, anchor);
				insert(target, ul, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				insert(target, t1, anchor);
				insert(target, div1, anchor);
				append(div1, div0);
				mount_component(filterpagination, div0, null);
				current = true;
			},
			p(ctx, dirty) {
				const filtercontrols_changes = {};
				if (dirty & /*type*/ 1) filtercontrols_changes.name = /*type*/ ctx[0];

				if (!updating_asc && dirty & /*asc*/ 8) {
					updating_asc = true;
					filtercontrols_changes.asc = /*asc*/ ctx[3];
					add_flush_callback(() => updating_asc = false);
				}

				filtercontrols.$set(filtercontrols_changes);

				if (dirty & /*Date, data*/ 4) {
					each_value_1 = /*data*/ ctx[2];
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_1, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block_1(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(ul, null);
						}
					}

					group_outros();

					for (i = each_value_1.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}

				const filterpagination_changes = {};
				if (dirty & /*pages*/ 128) filterpagination_changes.pages = /*pages*/ ctx[7];

				if (!updating_currentPage && dirty & /*currentPage*/ 16) {
					updating_currentPage = true;
					filterpagination_changes.currentPage = /*currentPage*/ ctx[4];
					add_flush_callback(() => updating_currentPage = false);
				}

				filterpagination.$set(filterpagination_changes);
			},
			i(local) {
				if (current) return;
				transition_in(filtercontrols.$$.fragment, local);

				for (let i = 0; i < each_value_1.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				transition_in(filterpagination.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(filtercontrols.$$.fragment, local);
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				transition_out(filterpagination.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(filtercontrols, detaching);
				if (detaching) detach(t0);
				if (detaching) detach(ul);
				destroy_each(each_blocks, detaching);
				if (detaching) detach(t1);
				if (detaching) detach(div1);
				destroy_component(filterpagination);
			}
		};
	}

	// (101:2) {#if filterTemplate === 'cards' }
	function create_if_block_1(ctx) {
		let div1;
		let div0;
		let t;
		let current;
		let each_value = /*data*/ ctx[2];
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		let if_block = /*loadMorePage*/ ctx[8] != /*pages*/ ctx[7] && create_if_block_2(ctx);

		return {
			c() {
				div1 = element("div");
				div0 = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t = space();
				if (if_block) if_block.c();
				attr(div0, "class", "row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5");
				attr(div1, "class", "container");
			},
			m(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div0, null);
				}

				append(div1, t);
				if (if_block) if_block.m(div1, null);
				current = true;
			},
			p(ctx, dirty) {
				if (dirty & /*data, Date*/ 4) {
					each_value = /*data*/ ctx[2];
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(div0, null);
						}
					}

					group_outros();

					for (i = each_value.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}

				if (/*loadMorePage*/ ctx[8] != /*pages*/ ctx[7]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block_2(ctx);
						if_block.c();
						if_block.m(div1, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d(detaching) {
				if (detaching) detach(div1);
				destroy_each(each_blocks, detaching);
				if (if_block) if_block.d();
			}
		};
	}

	// (150:10) {:else}
	function create_else_block_1(ctx) {
		let logo;
		let current;
		logo = new NWEA_yellow_svg_rollup_plugin({});

		return {
			c() {
				create_component(logo.$$.fragment);
			},
			m(target, anchor) {
				mount_component(logo, target, anchor);
				current = true;
			},
			p: noop,
			i(local) {
				if (current) return;
				transition_in(logo.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(logo.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(logo, detaching);
			}
		};
	}

	// (146:10) {#if dataRow._embedded['wp:featuredmedia']}
	function create_if_block_4(ctx) {
		let div;
		let img;
		let img_src_value;
		let img_alt_value;

		return {
			c() {
				div = element("div");
				img = element("img");
				attr(img, "class", "shadow svelte-eyybwu");
				if (img.src !== (img_src_value = /*dataRow*/ ctx[16]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url)) attr(img, "src", img_src_value);
				attr(img, "alt", img_alt_value = /*dataRow*/ ctx[16]._embedded['wp:featuredmedia'][0].media_details.alt_text);
				attr(div, "class", "ratio ratio-16x9 svelte-eyybwu");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				append(div, img);
			},
			p(ctx, dirty) {
				if (dirty & /*data*/ 4 && img.src !== (img_src_value = /*dataRow*/ ctx[16]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url)) {
					attr(img, "src", img_src_value);
				}

				if (dirty & /*data*/ 4 && img_alt_value !== (img_alt_value = /*dataRow*/ ctx[16]._embedded['wp:featuredmedia'][0].media_details.alt_text)) {
					attr(img, "alt", img_alt_value);
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) detach(div);
			}
		};
	}

	// (145:9) <Link href={ dataRow.link }>
	function create_default_slot_1(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block_4, create_else_block_1];
		const if_blocks = [];

		function select_block_type_1(ctx, dirty) {
			if (/*dataRow*/ ctx[16]._embedded['wp:featuredmedia']) return 0;
			return 1;
		}

		current_block_type_index = select_block_type_1(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		return {
			c() {
				if_block.c();
				if_block_anchor = empty();
			},
			m(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert(target, if_block_anchor, anchor);
				current = true;
			},
			p(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type_1(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach(if_block_anchor);
			}
		};
	}

	// (156:9) {#if dataRow._embedded['wp:term']}
	function create_if_block_3(ctx) {
		let each_1_anchor;
		let each_value_2 = /*dataRow*/ ctx[16]._embedded['wp:term'][0];
		let each_blocks = [];

		for (let i = 0; i < each_value_2.length; i += 1) {
			each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
		}

		return {
			c() {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},
			m(target, anchor) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_1_anchor, anchor);
			},
			p(ctx, dirty) {
				if (dirty & /*data*/ 4) {
					each_value_2 = /*dataRow*/ ctx[16]._embedded['wp:term'][0];
					let i;

					for (i = 0; i < each_value_2.length; i += 1) {
						const child_ctx = get_each_context_2(ctx, each_value_2, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block_2(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value_2.length;
				}
			},
			d(detaching) {
				destroy_each(each_blocks, detaching);
				if (detaching) detach(each_1_anchor);
			}
		};
	}

	// (157:10) {#each dataRow._embedded['wp:term'][0] as term, index }
	function create_each_block_2(ctx) {
		let a;
		let html_tag;

		let raw_value = (/*index*/ ctx[23] == /*dataRow*/ ctx[16]._embedded['wp:term'][0].length - 1
		? /*term*/ ctx[21].name
		: /*term*/ ctx[21].name + ',&nbsp;') + "";

		let t;
		let a_href_value;

		return {
			c() {
				a = element("a");
				html_tag = new HtmlTag();
				t = space();
				html_tag.a = t;
				attr(a, "href", a_href_value = /*term*/ ctx[21].link);
				attr(a, "class", "text-muted small text-uppercase d-inline-block mb-2 fw-500");
			},
			m(target, anchor) {
				insert(target, a, anchor);
				html_tag.m(raw_value, a);
				append(a, t);
			},
			p(ctx, dirty) {
				if (dirty & /*data*/ 4 && raw_value !== (raw_value = (/*index*/ ctx[23] == /*dataRow*/ ctx[16]._embedded['wp:term'][0].length - 1
				? /*term*/ ctx[21].name
				: /*term*/ ctx[21].name + ',&nbsp;') + "")) html_tag.p(raw_value);

				if (dirty & /*data*/ 4 && a_href_value !== (a_href_value = /*term*/ ctx[21].link)) {
					attr(a, "href", a_href_value);
				}
			},
			d(detaching) {
				if (detaching) detach(a);
			}
		};
	}

	// (163:9) <Link href={ dataRow.link } class="card-title fw-500 d-block">
	function create_default_slot(ctx) {
		let t_value = /*dataRow*/ ctx[16].title.rendered + "";
		let t;

		return {
			c() {
				t = text(t_value);
			},
			m(target, anchor) {
				insert(target, t, anchor);
			},
			p(ctx, dirty) {
				if (dirty & /*data*/ 4 && t_value !== (t_value = /*dataRow*/ ctx[16].title.rendered + "")) set_data(t, t_value);
			},
			d(detaching) {
				if (detaching) detach(t);
			}
		};
	}

	// (139:3) {#each data as dataRow }
	function create_each_block_1(ctx) {
		let li;
		let div6;
		let div4;
		let div3;
		let div0;
		let link0;
		let t0;
		let div2;
		let t1;
		let link1;
		let t2;
		let div1;
		let t3_value = /*dataRow*/ ctx[16].excerpt.rendered.replace(/(<([^>]+)>)/ig, '') + "";
		let t3;
		let t4;
		let div5;

		let t5_value = new Date(/*dataRow*/ ctx[16].date).toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit'
		}) + "";

		let t5;
		let t6;
		let current;

		link0 = new Link({
				props: {
					href: /*dataRow*/ ctx[16].link,
					$$slots: { default: [create_default_slot_1] },
					$$scope: { ctx }
				}
			});

		let if_block = /*dataRow*/ ctx[16]._embedded['wp:term'] && create_if_block_3(ctx);

		link1 = new Link({
				props: {
					href: /*dataRow*/ ctx[16].link,
					class: "card-title fw-500 d-block",
					$$slots: { default: [create_default_slot] },
					$$scope: { ctx }
				}
			});

		return {
			c() {
				li = element("li");
				div6 = element("div");
				div4 = element("div");
				div3 = element("div");
				div0 = element("div");
				create_component(link0.$$.fragment);
				t0 = space();
				div2 = element("div");
				if (if_block) if_block.c();
				t1 = space();
				create_component(link1.$$.fragment);
				t2 = space();
				div1 = element("div");
				t3 = text(t3_value);
				t4 = space();
				div5 = element("div");
				t5 = text(t5_value);
				t6 = space();
				attr(div0, "class", "col-lg-4 mb-3 py-2");
				attr(div1, "class", "d-block card-text");
				attr(div2, "class", "col small");
				attr(div3, "class", "row");
				attr(div4, "class", "col");
				attr(div5, "class", "col-auto fw-500 small d-flex justify-content-end");
				attr(div6, "class", "row");
				attr(li, "class", "list-group-item");
			},
			m(target, anchor) {
				insert(target, li, anchor);
				append(li, div6);
				append(div6, div4);
				append(div4, div3);
				append(div3, div0);
				mount_component(link0, div0, null);
				append(div3, t0);
				append(div3, div2);
				if (if_block) if_block.m(div2, null);
				append(div2, t1);
				mount_component(link1, div2, null);
				append(div2, t2);
				append(div2, div1);
				append(div1, t3);
				append(div6, t4);
				append(div6, div5);
				append(div5, t5);
				append(li, t6);
				current = true;
			},
			p(ctx, dirty) {
				const link0_changes = {};
				if (dirty & /*data*/ 4) link0_changes.href = /*dataRow*/ ctx[16].link;

				if (dirty & /*$$scope, data*/ 16777220) {
					link0_changes.$$scope = { dirty, ctx };
				}

				link0.$set(link0_changes);

				if (/*dataRow*/ ctx[16]._embedded['wp:term']) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block_3(ctx);
						if_block.c();
						if_block.m(div2, t1);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				const link1_changes = {};
				if (dirty & /*data*/ 4) link1_changes.href = /*dataRow*/ ctx[16].link;

				if (dirty & /*$$scope, data*/ 16777220) {
					link1_changes.$$scope = { dirty, ctx };
				}

				link1.$set(link1_changes);
				if ((!current || dirty & /*data*/ 4) && t3_value !== (t3_value = /*dataRow*/ ctx[16].excerpt.rendered.replace(/(<([^>]+)>)/ig, '') + "")) set_data(t3, t3_value);

				if ((!current || dirty & /*data*/ 4) && t5_value !== (t5_value = new Date(/*dataRow*/ ctx[16].date).toLocaleDateString('en-US', {
					month: '2-digit',
					day: '2-digit',
					year: '2-digit'
				}) + "")) set_data(t5, t5_value);
			},
			i(local) {
				if (current) return;
				transition_in(link0.$$.fragment, local);
				transition_in(link1.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(link0.$$.fragment, local);
				transition_out(link1.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(li);
				destroy_component(link0);
				if (if_block) if_block.d();
				destroy_component(link1);
			}
		};
	}

	// (104:5) {#each data as dataRow }
	function create_each_block(ctx) {
		let card;
		let current;

		card = new Card({
				props: {
					cardImage: /*dataRow*/ ctx[16].featured_media != 0
					? /*dataRow*/ ctx[16]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url
					: null,
					eyebrow: /*dataRow*/ ctx[16]._embedded['wp:term'][0].map(func).join(', '),
					link: /*dataRow*/ ctx[16].link,
					date: new Date(/*dataRow*/ ctx[16].date).toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
						year: 'numeric'
					}),
					title: /*dataRow*/ ctx[16].title.rendered
				}
			});

		return {
			c() {
				create_component(card.$$.fragment);
			},
			m(target, anchor) {
				mount_component(card, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const card_changes = {};

				if (dirty & /*data*/ 4) card_changes.cardImage = /*dataRow*/ ctx[16].featured_media != 0
				? /*dataRow*/ ctx[16]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url
				: null;

				if (dirty & /*data*/ 4) card_changes.eyebrow = /*dataRow*/ ctx[16]._embedded['wp:term'][0].map(func).join(', ');
				if (dirty & /*data*/ 4) card_changes.link = /*dataRow*/ ctx[16].link;

				if (dirty & /*data*/ 4) card_changes.date = new Date(/*dataRow*/ ctx[16].date).toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				});

				if (dirty & /*data*/ 4) card_changes.title = /*dataRow*/ ctx[16].title.rendered;
				card.$set(card_changes);
			},
			i(local) {
				if (current) return;
				transition_in(card.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(card.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(card, detaching);
			}
		};
	}

	// (119:4) {#if loadMorePage != pages }
	function create_if_block_2(ctx) {
		let div1;
		let div0;
		let button;
		let mounted;
		let dispose;

		return {
			c() {
				div1 = element("div");
				div0 = element("div");
				button = element("button");
				button.textContent = "Load more";
				attr(button, "class", " btn btn-info px-5");
				attr(button, "id", "load-more");
				toggle_class(button, "d-none", /*loaderVisible*/ ctx[6]);
				attr(div0, "class", "col text-center");
				attr(div1, "class", "row my-5 justify-content-center");
			},
			m(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);
				append(div0, button);

				if (!mounted) {
					dispose = listen(button, "click", /*loadMore*/ ctx[9]);
					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (dirty & /*loaderVisible*/ 64) {
					toggle_class(button, "d-none", /*loaderVisible*/ ctx[6]);
				}
			},
			d(detaching) {
				if (detaching) detach(div1);
				mounted = false;
				dispose();
			}
		};
	}

	function create_fragment$2(ctx) {
		let t0;
		let div2;
		let current;
		let if_block = /*visible*/ ctx[5] && create_if_block(ctx);

		return {
			c() {
				if (if_block) if_block.c();
				t0 = space();
				div2 = element("div");
				div2.innerHTML = `<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>`;
				attr(div2, "class", "row justify-content-center");
				toggle_class(div2, "d-none", !/*loaderVisible*/ ctx[6]);
			},
			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, t0, anchor);
				insert(target, div2, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				if (/*visible*/ ctx[5]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*visible*/ 32) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(t0.parentNode, t0);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}

				if (dirty & /*loaderVisible*/ 64) {
					toggle_class(div2, "d-none", !/*loaderVisible*/ ctx[6]);
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (if_block) if_block.d(detaching);
				if (detaching) detach(t0);
				if (detaching) detach(div2);
			}
		};
	}

	const func = term => term.name;

	function instance$2($$self, $$props, $$invalidate) {
		let $ajaxArgs;
		component_subscribe($$self, ajaxArgs, $$value => $$invalidate(11, $ajaxArgs = $$value));
		let { type = '' } = $$props;
		let { filterTemplate } = $$props;

		// Default props
		// Visibility for filtered data
		let visible = false;

		// Visibility for loading icon
		let loaderVisible = false;

		let data = [];
		let loadMoreData = [];
		let pages;
		let asc = false;
		let currentPage = 1;
		let loadMorePage = currentPage;

		// Run filter whenever ajax store changes
		const requestData = async () => {
			$$invalidate(6, loaderVisible = true);
			$$invalidate(5, visible = false);

			const response = await ajaxRequest({
				url: $ajaxArgs.url,
				params: {
					...$ajaxArgs.params,
					_embed: 1,
					per_page: 12, // hardcoded for now
					
				}
			});

			$$invalidate(2, data = await response.json());
			$$invalidate(7, pages = response.headers.get('x-wp-totalpages'));
			$$invalidate(5, visible = true);
			$$invalidate(6, loaderVisible = false);
		};

		const loadMore = async () => {
			$$invalidate(6, loaderVisible = true);
			$$invalidate(8, loadMorePage = loadMorePage + 1);

			const response = await ajaxRequest({
				url: $ajaxArgs.url,
				params: { ...$ajaxArgs.params, page: loadMorePage }
			});

			$$invalidate(10, loadMoreData = await response.json());
			$$invalidate(6, loaderVisible = false);
		};

		function filtercontrols_asc_binding(value) {
			asc = value;
			$$invalidate(3, asc);
		}

		const click_handler = () => $$invalidate(4, currentPage = 1);

		function filterpagination_currentPage_binding(value) {
			currentPage = value;
			($$invalidate(4, currentPage), $$invalidate(3, asc));
		}

		$$self.$$set = $$props => {
			if ('type' in $$props) $$invalidate(0, type = $$props.type);
			if ('filterTemplate' in $$props) $$invalidate(1, filterTemplate = $$props.filterTemplate);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*asc*/ 8) {
				set_store_value(ajaxArgs, $ajaxArgs.params.order = asc ? 'asc' : 'desc', $ajaxArgs);
			}

			if ($$self.$$.dirty & /*asc*/ 8) {
				// Reset currentPage each time asc changes
				($$invalidate(4, currentPage = 1));
			}

			if ($$self.$$.dirty & /*currentPage*/ 16) {
				set_store_value(ajaxArgs, $ajaxArgs.params.page = currentPage, $ajaxArgs);
			}

			if ($$self.$$.dirty & /*$ajaxArgs*/ 2048) {
				// Bindings
				(requestData());
			}

			if ($$self.$$.dirty & /*data, loadMoreData*/ 1028) {
				$$invalidate(2, data = [...data, ...loadMoreData]);
			}
		};

		return [
			type,
			filterTemplate,
			data,
			asc,
			currentPage,
			visible,
			loaderVisible,
			pages,
			loadMorePage,
			loadMore,
			loadMoreData,
			$ajaxArgs,
			filtercontrols_asc_binding,
			click_handler,
			filterpagination_currentPage_binding
		];
	}

	class Filtered extends SvelteComponent {
		constructor(options) {
			super();
			if (!document.getElementById("svelte-eyybwu-style")) add_css();
			init(this, options, instance$2, create_fragment$2, safe_not_equal, { type: 0, filterTemplate: 1 });
		}
	}

	/* src/js/svelte/assets/NWEA-biwp.svg.rollup-plugin.svelte generated by Svelte v3.39.0 */

	function create_fragment$1(ctx) {
		let svg;
		let g8;
		let g7;
		let path0;
		let path1;
		let path2;
		let path3;
		let path4;
		let g3;
		let g2;
		let path5;
		let path6;
		let path7;
		let path8;
		let path9;
		let path10;
		let path11;
		let path12;
		let path13;
		let g0;
		let path14;
		let path15;
		let path16;
		let path17;
		let path18;
		let path19;
		let g1;
		let path20;
		let path21;
		let path22;
		let path23;
		let path24;
		let path25;
		let path26;
		let path27;
		let g6;
		let g5;
		let g4;
		let path28;
		let path29;
		let path30;
		let path31;

		let svg_levels = [
			{ xmlns: "http://www.w3.org/2000/svg" },
			{ width: "300" },
			{ height: "37.286" },
			/*$$props*/ ctx[0]
		];

		let svg_data = {};

		for (let i = 0; i < svg_levels.length; i += 1) {
			svg_data = assign(svg_data, svg_levels[i]);
		}

		return {
			c() {
				svg = svg_element("svg");
				g8 = svg_element("g");
				g7 = svg_element("g");
				path0 = svg_element("path");
				path1 = svg_element("path");
				path2 = svg_element("path");
				path3 = svg_element("path");
				path4 = svg_element("path");
				g3 = svg_element("g");
				g2 = svg_element("g");
				path5 = svg_element("path");
				path6 = svg_element("path");
				path7 = svg_element("path");
				path8 = svg_element("path");
				path9 = svg_element("path");
				path10 = svg_element("path");
				path11 = svg_element("path");
				path12 = svg_element("path");
				path13 = svg_element("path");
				g0 = svg_element("g");
				path14 = svg_element("path");
				path15 = svg_element("path");
				path16 = svg_element("path");
				path17 = svg_element("path");
				path18 = svg_element("path");
				path19 = svg_element("path");
				g1 = svg_element("g");
				path20 = svg_element("path");
				path21 = svg_element("path");
				path22 = svg_element("path");
				path23 = svg_element("path");
				path24 = svg_element("path");
				path25 = svg_element("path");
				path26 = svg_element("path");
				path27 = svg_element("path");
				g6 = svg_element("g");
				g5 = svg_element("g");
				g4 = svg_element("g");
				path28 = svg_element("path");
				path29 = svg_element("path");
				path30 = svg_element("path");
				path31 = svg_element("path");
				attr(path0, "data-name", "Rectangle 182");
				attr(path0, "fill", "#ffb300");
				attr(path0, "d", "M180.646 31.899h51.469v4.457h-51.469z");
				attr(path1, "data-name", "Rectangle 183");
				attr(path1, "fill", "#e20064");
				attr(path1, "d", "M232.004 31.899H262.5v4.457h-30.496z");
				attr(path2, "data-name", "Rectangle 184");
				attr(path2, "fill", "#941079");
				attr(path2, "d", "M262.49 31.899h15.911v4.457H262.49z");
				attr(path3, "data-name", "Rectangle 185");
				attr(path3, "fill", "#17988b");
				attr(path3, "d", "M278.391 31.899h18.696v4.457h-18.696z");
				attr(path4, "data-name", "Rectangle 186");
				attr(path4, "fill", "#003049");
				attr(path4, "d", "M297.045 31.899H300v4.457h-2.955z");
				attr(path5, "data-name", "Path 2733");
				attr(path5, "d", "M183.914 10.352v.944h-2.733V.144h2.733v4.411a2.857 2.857 0 0 1 2.359-1.209c1.855 0 3.452 1.539 3.452 4.028v.028c0 2.532-1.6 4.071-3.438 4.071a2.922 2.922 0 0 1-2.373-1.121Zm3.136-2.934v-.029a1.605 1.605 0 1 0-3.194 0v.029a1.605 1.605 0 1 0 3.194 0Z");
				attr(path6, "data-name", "Path 2734");
				attr(path6, "d", "M190.649 7.446v-.03a3.9 3.9 0 0 1 3.924-4.07c2.676 0 3.913 1.971 3.913 4.258 0 .172 0 .374-.015.561h-5.207a1.606 1.606 0 0 0 1.683 1.281 2.325 2.325 0 0 0 1.726-.791l1.511 1.251a4.068 4.068 0 0 1-3.366 1.582 3.924 3.924 0 0 1-4.169-4.042Zm5.293-.676a1.4 1.4 0 0 0-1.367-1.41c-.719 0-1.208.546-1.352 1.41Z");
				attr(path7, "data-name", "Path 2735");
				attr(path7, "d", "M199.557.144h2.719v11.152h-2.719Z");
				attr(path8, "data-name", "Path 2736");
				attr(path8, "d", "M203.875.144h2.834v2.014h-2.834Zm.057 4.031h2.719v7.121h-2.719Z");
				attr(path9, "data-name", "Path 2737");
				attr(path9, "d", "M208.063 7.446v-.03a3.9 3.9 0 0 1 3.927-4.071c2.676 0 3.913 1.971 3.913 4.258 0 .172 0 .374-.015.561h-5.207a1.606 1.606 0 0 0 1.683 1.281 2.325 2.325 0 0 0 1.726-.791l1.511 1.251a4.068 4.068 0 0 1-3.366 1.582 3.924 3.924 0 0 1-4.172-4.041Zm5.293-.676a1.4 1.4 0 0 0-1.366-1.41c-.719 0-1.208.546-1.352 1.41Z");
				attr(path10, "data-name", "Path 2738");
				attr(path10, "d", "M216.08 3.519h2.878l1.5 4.545 1.511-4.545h2.819l-3.107 7.84h-2.489Z");
				attr(path11, "data-name", "Path 2739");
				attr(path11, "d", "M225.305 7.446v-.03a3.9 3.9 0 0 1 3.927-4.071c2.676 0 3.913 1.971 3.913 4.258 0 .172 0 .374-.015.561h-5.207a1.607 1.607 0 0 0 1.683 1.281 2.325 2.325 0 0 0 1.726-.791l1.511 1.251a4.068 4.068 0 0 1-3.366 1.582 3.924 3.924 0 0 1-4.172-4.041Zm5.293-.676a1.4 1.4 0 0 0-1.367-1.41c-.719 0-1.208.546-1.352 1.41Z");
				attr(path12, "data-name", "Path 2740");
				attr(path12, "d", "M237.627.259h2.834v2.019h-2.834Zm.057 3.881h2.719v7.276h-2.719Z");
				attr(path13, "data-name", "Path 2741");
				attr(path13, "d", "M242.303 3.639h2.733v1.094a2.886 2.886 0 0 1 2.331-1.266 2.548 2.548 0 0 1 2.646 2.863v5.092h-2.719V7.206c0-.863-.446-1.323-1.108-1.323s-1.151.46-1.151 1.323v4.215h-2.733Z");
				attr(path14, "data-name", "Path 2742");
				attr(path14, "d", "M180.697 17.387h2.661l1.021 3.912 1.208-3.941h2.244l1.208 3.97 1.05-3.941h2.633l-2.4 7.84h-2.361l-1.266-4.056-1.294 4.051h-2.33Z");
				attr(path15, "data-name", "Path 2743");
				attr(path15, "d", "M193.766 14.012h2.733v4.44a2.864 2.864 0 0 1 2.331-1.237 2.548 2.548 0 0 1 2.646 2.863v5.092h-2.719v-4.216c0-.863-.446-1.323-1.108-1.323s-1.151.46-1.151 1.323v4.215h-2.733Z");
				attr(path16, "data-name", "Path 2744");
				attr(path16, "d", "M202.526 22.94v-.029c0-1.626 1.223-2.445 3.05-2.445a5.583 5.583 0 0 1 1.87.3v-.13c0-.819-.5-1.28-1.553-1.28a5.9 5.9 0 0 0-2.158.432l-.561-1.913a7.807 7.807 0 0 1 3.15-.6 4 4 0 0 1 2.963.949 3.252 3.252 0 0 1 .835 2.474v4.467h-2.69v-.82a3 3 0 0 1-2.3.992 2.359 2.359 0 0 1-2.606-2.397Zm4.948-.59v-.36a3 3 0 0 0-1.079-.2c-.791 0-1.251.374-1.251.964v.029a.857.857 0 0 0 .964.849 1.255 1.255 0 0 0 1.367-1.282Z");
				attr(path17, "data-name", "Path 2745");
				attr(path17, "d", "M212.339 22.752v-3.179h-.921v-2.186h.921v-1.971h2.718v1.971h1.813v2.187h-1.812v2.647c0 .546.245.777.748.777a2.4 2.4 0 0 0 1.035-.259v2.128a3.892 3.892 0 0 1-1.9.461c-1.639-.001-2.602-.72-2.602-2.576Z");
				attr(path18, "data-name", "Path 2746");
				attr(path18, "d", "M218.353 15.1h2.978v.072l-1.827 5.092h-1.482Z");
				attr(path19, "data-name", "Path 2747");
				attr(path19, "d", "m221.517 24.177 1.021-1.64a5.009 5.009 0 0 0 2.661.892c.475 0 .7-.144.7-.417v-.027c0-.316-.446-.446-1.266-.676-1.539-.4-2.762-.921-2.762-2.474v-.029c0-1.654 1.323-2.575 3.122-2.575a6.087 6.087 0 0 1 3.208.907l-.936 1.726a5.122 5.122 0 0 0-2.3-.733c-.417 0-.633.158-.633.388v.029c0 .3.46.446 1.266.691 1.539.431 2.762.963 2.762 2.474v.028c0 1.712-1.281 2.6-3.179 2.6a6.216 6.216 0 0 1-3.664-1.164Z");
				attr(g0, "data-name", "Group 489");
				attr(path20, "data-name", "Path 2748");
				attr(path20, "d", "M232.159 17.387h2.733v1.039a2.859 2.859 0 0 1 2.36-1.208c1.855 0 3.452 1.539 3.452 4.028v.029c0 2.532-1.6 4.071-3.438 4.071a2.922 2.922 0 0 1-2.374-1.122v3.251h-2.733Zm5.869 3.9v-.029a1.605 1.605 0 1 0-3.194 0v.029a1.605 1.605 0 1 0 3.194 0Z");
				attr(path21, "data-name", "Path 2749");
				attr(path21, "d", "M241.623 21.314v-.029a4.3 4.3 0 0 1 8.587-.029v.029a4.145 4.145 0 0 1-4.315 4.071 4.1 4.1 0 0 1-4.272-4.042Zm5.941 0v-.029a1.7 1.7 0 0 0-1.669-1.769 1.634 1.634 0 0 0-1.625 1.741v.029a1.687 1.687 0 0 0 1.654 1.755 1.642 1.642 0 0 0 1.64-1.727Z");
				attr(path22, "data-name", "Path 2750");
				attr(path22, "d", "m250.836 24.177 1.021-1.64a5.01 5.01 0 0 0 2.661.892c.475 0 .7-.144.7-.417v-.027c0-.316-.446-.446-1.266-.676-1.539-.4-2.762-.921-2.762-2.474v-.029c0-1.654 1.323-2.575 3.122-2.575a6.09 6.09 0 0 1 3.208.906l-.926 1.724a5.113 5.113 0 0 0-2.3-.733c-.417 0-.633.158-.633.388v.029c0 .3.46.446 1.266.691 1.539.431 2.762.963 2.762 2.474v.028c0 1.712-1.281 2.6-3.179 2.6a6.218 6.218 0 0 1-3.674-1.161Z");
				attr(path23, "data-name", "Path 2751");
				attr(path23, "d", "m258.188 24.177 1.021-1.64a5.011 5.011 0 0 0 2.661.892c.474 0 .7-.144.7-.417v-.027c0-.316-.446-.446-1.266-.676-1.539-.4-2.762-.921-2.762-2.474v-.029c0-1.654 1.324-2.575 3.122-2.575a6.089 6.089 0 0 1 3.208.906l-.935 1.726a5.115 5.115 0 0 0-2.3-.733c-.417 0-.633.158-.633.388v.029c0 .3.46.446 1.266.691 1.539.431 2.762.963 2.762 2.474v.028c0 1.712-1.281 2.6-3.179 2.6a6.218 6.218 0 0 1-3.665-1.163Z");
				attr(path24, "data-name", "Path 2752");
				attr(path24, "d", "M266.468 14.012h2.834v2.014h-2.834Zm.057 3.984h2.719v7.173h-2.719Z");
				attr(path25, "data-name", "Path 2753");
				attr(path25, "d", "M273.818 24.22v.949h-2.733V14.012h2.733v4.41a2.859 2.859 0 0 1 2.36-1.208c1.855 0 3.452 1.539 3.452 4.028v.029c0 2.532-1.6 4.071-3.438 4.071a2.922 2.922 0 0 1-2.374-1.122Zm3.136-2.934v-.029a1.605 1.605 0 1 0-3.193 0v.029a1.605 1.605 0 1 0 3.193 0Z");
				attr(path26, "data-name", "Path 2754");
				attr(path26, "d", "M280.858 14.012h2.719v11.157h-2.719Z");
				attr(path27, "data-name", "Path 2755");
				attr(path27, "d", "M285.189 21.314v-.029a3.9 3.9 0 0 1 3.927-4.071c2.676 0 3.913 1.971 3.913 4.258 0 .172 0 .374-.015.561h-5.208a1.607 1.607 0 0 0 1.683 1.281 2.325 2.325 0 0 0 1.726-.791l1.51 1.251a4.067 4.067 0 0 1-3.366 1.582 3.924 3.924 0 0 1-4.17-4.042Zm5.293-.677a1.4 1.4 0 0 0-1.367-1.409c-.719 0-1.208.546-1.352 1.409Z");
				attr(g1, "data-name", "Group 490");
				attr(g2, "data-name", "Group 491");
				attr(g2, "fill", "#fff");
				attr(g3, "data-name", "Group 492");
				attr(path28, "data-name", "Path 2756");
				attr(path28, "d", "M68.814 1.091a1.505 1.505 0 0 1 1.505 1.505V20.76c0 4.73 2.293 6.379 5.447 6.379 3.225 0 5.519-1.649 5.519-6.379V2.596a1.505 1.505 0 0 1 1.505-1.505h7.739a1.505 1.505 0 0 1 1.505 1.505V20.76c0 11.395-6.594 16.412-15.194 16.412-5.016 0-9.173-1.936-11.824-5.519h-.144c-2.651 3.583-6.736 5.519-11.824 5.519-8.6 0-15.195-5.018-15.195-16.412V2.596a1.506 1.506 0 0 1 1.506-1.505h7.739a1.506 1.506 0 0 1 1.506 1.505V20.76c0 4.73 2.293 6.379 5.519 6.379 3.153 0 5.447-1.649 5.447-6.379V2.596a1.505 1.505 0 0 1 1.505-1.505Z");
				attr(path29, "data-name", "Path 2757");
				attr(path29, "d", "M105.76 21.643v.144c.931 3.87 3.87 5.876 7.883 5.876 2.94 0 5.163-.587 6.544-2.321a.7.7 0 0 1 .549-.258h9.827a.66.66 0 0 1 .62.888c-2.545 6.813-9.087 11.3-17.541 11.3-11.18 0-19.063-7.884-19.063-18.634S102.463 0 113.642 0s18.849 7.882 18.849 18.633v2.352a.659.659 0 0 1-.659.658Zm.214-6.952v.144h15.48v-.144c-1.218-3.368-4.085-5.088-7.812-5.088s-6.521 1.72-7.667 5.088Z");
				attr(path30, "data-name", "Path 2758");
				attr(path30, "d", "M24.442 17.685c0-5.566-2.8-7.929-6.922-7.929s-6.914 2.355-6.914 7.921l.008 13.275v3.705a1.673 1.673 0 0 1-1.747 1.588h-7.12A1.673 1.673 0 0 1 0 34.657L.045 2.679a1.673 1.673 0 0 1 1.747-1.588h6.626a1.673 1.673 0 0 1 1.747 1.588l-.045 2.6h.165C11.931 2.523 14.505 0 20.553 0 32.84 0 35.059 7.42 34.921 16.835v17.822a1.478 1.478 0 0 1-1.609 1.588h-7.12a1.673 1.673 0 0 1-1.747-1.588v-3.416Z");
				attr(path31, "data-name", "Path 2759");
				attr(path31, "d", "M151.967 37.286c5.235 0 9.25-2.581 10.971-6.454h.144v4.081a1.441 1.441 0 0 0 1.441 1.441h7.014a1.441 1.441 0 0 0 1.441-1.441V19c0-11.616-7.744-19-18.93-19s-19.075 7.887-19.075 18.643c0 13.122 9.465 18.643 16.994 18.643Zm2.08-27.248c4.876 0 8.174 3.513 8.174 8.6s-3.3 8.6-8.174 8.6-8.175-3.514-8.175-8.6 3.299-8.6 8.175-8.6Z");
				attr(g4, "data-name", "Group 493");
				attr(g4, "fill", "#ffb300");
				attr(g5, "data-name", "Group 494");
				attr(g6, "data-name", "NWEA Graphite");
				attr(g7, "data-name", "Group 495");
				attr(g8, "data-name", "NWEA Yellow with White Tagline and Color Band");
				set_svg_attributes(svg, svg_data);
			},
			m(target, anchor) {
				insert(target, svg, anchor);
				append(svg, g8);
				append(g8, g7);
				append(g7, path0);
				append(g7, path1);
				append(g7, path2);
				append(g7, path3);
				append(g7, path4);
				append(g7, g3);
				append(g3, g2);
				append(g2, path5);
				append(g2, path6);
				append(g2, path7);
				append(g2, path8);
				append(g2, path9);
				append(g2, path10);
				append(g2, path11);
				append(g2, path12);
				append(g2, path13);
				append(g2, g0);
				append(g0, path14);
				append(g0, path15);
				append(g0, path16);
				append(g0, path17);
				append(g0, path18);
				append(g0, path19);
				append(g2, g1);
				append(g1, path20);
				append(g1, path21);
				append(g1, path22);
				append(g1, path23);
				append(g1, path24);
				append(g1, path25);
				append(g1, path26);
				append(g1, path27);
				append(g7, g6);
				append(g6, g5);
				append(g5, g4);
				append(g4, path28);
				append(g4, path29);
				append(g4, path30);
				append(g4, path31);
			},
			p(ctx, [dirty]) {
				set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
					{ xmlns: "http://www.w3.org/2000/svg" },
					{ width: "300" },
					{ height: "37.286" },
					dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
				]));
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) detach(svg);
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		$$self.$$set = $$new_props => {
			$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		};

		$$props = exclude_internal_props($$props);
		return [$$props];
	}

	class NWEA_biwp_svg_rollup_plugin extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
		}
	}

	/* src/js/svelte/components/Footer.svelte generated by Svelte v3.39.0 */

	function create_fragment(ctx) {
		let div10;
		let div9;
		let div4;
		let div0;
		let raw0_value = /*args*/ ctx[0].content.footer_column_1 + "";
		let t0;
		let div1;
		let raw1_value = /*args*/ ctx[0].content.footer_column_2 + "";
		let t1;
		let div2;
		let raw2_value = /*args*/ ctx[0].content.footer_column_3 + "";
		let t2;
		let div3;
		let raw3_value = /*args*/ ctx[0].content.footer_column_4 + "";
		let t3;
		let div8;
		let div5;
		let a;
		let logo;
		let t4;
		let div6;
		let raw4_value = /*args*/ ctx[0].content.footer_bottom + "";
		let t5;
		let div7;
		let span;
		let current;

		logo = new NWEA_biwp_svg_rollup_plugin({
				props: {
					alt: "NWEA: Believe in What's Possible graphic"
				}
			});

		return {
			c() {
				div10 = element("div");
				div9 = element("div");
				div4 = element("div");
				div0 = element("div");
				t0 = space();
				div1 = element("div");
				t1 = space();
				div2 = element("div");
				t2 = space();
				div3 = element("div");
				t3 = space();
				div8 = element("div");
				div5 = element("div");
				a = element("a");
				create_component(logo.$$.fragment);
				t4 = space();
				div6 = element("div");
				t5 = space();
				div7 = element("div");
				span = element("span");
				span.textContent = `© ${(/\d{4}/).exec(Date())[0]} NWEA`;
				attr(div0, "class", "col-md-3");
				attr(div1, "class", "col-md-3");
				attr(div2, "class", "col-md-3");
				attr(div3, "class", "col-md-3");
				attr(div4, "class", "row gx-md-5 pb-4");
				attr(a, "href", "https://www.nwea.org");
				attr(div5, "class", "col-12 col-md-4 mb-3");
				attr(div6, "class", "col-12 col-md-auto ms-md-auto");
				attr(span, "class", "text-gray-400");
				attr(div7, "class", "col-12 col-md-auto");
				attr(div8, "class", "row border-top border-1 border-white py-5 justify-content-between align-items-center");
				attr(div9, "class", "container");
				attr(div10, "class", "container-fluid bg-dark py-4 text-white");
			},
			m(target, anchor) {
				insert(target, div10, anchor);
				append(div10, div9);
				append(div9, div4);
				append(div4, div0);
				div0.innerHTML = raw0_value;
				append(div4, t0);
				append(div4, div1);
				div1.innerHTML = raw1_value;
				append(div4, t1);
				append(div4, div2);
				div2.innerHTML = raw2_value;
				append(div4, t2);
				append(div4, div3);
				div3.innerHTML = raw3_value;
				append(div9, t3);
				append(div9, div8);
				append(div8, div5);
				append(div5, a);
				mount_component(logo, a, null);
				append(div8, t4);
				append(div8, div6);
				div6.innerHTML = raw4_value;
				append(div8, t5);
				append(div8, div7);
				append(div7, span);
				current = true;
			},
			p(ctx, [dirty]) {
				if ((!current || dirty & /*args*/ 1) && raw0_value !== (raw0_value = /*args*/ ctx[0].content.footer_column_1 + "")) div0.innerHTML = raw0_value;			if ((!current || dirty & /*args*/ 1) && raw1_value !== (raw1_value = /*args*/ ctx[0].content.footer_column_2 + "")) div1.innerHTML = raw1_value;			if ((!current || dirty & /*args*/ 1) && raw2_value !== (raw2_value = /*args*/ ctx[0].content.footer_column_3 + "")) div2.innerHTML = raw2_value;			if ((!current || dirty & /*args*/ 1) && raw3_value !== (raw3_value = /*args*/ ctx[0].content.footer_column_4 + "")) div3.innerHTML = raw3_value;			if ((!current || dirty & /*args*/ 1) && raw4_value !== (raw4_value = /*args*/ ctx[0].content.footer_bottom + "")) div6.innerHTML = raw4_value;		},
			i(local) {
				if (current) return;
				transition_in(logo.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(logo.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(div10);
				destroy_component(logo);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let { args } = $$props;

		$$self.$$set = $$props => {
			if ('args' in $$props) $$invalidate(0, args = $$props.args);
		};

		return [args];
	}

	class Footer extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal, { args: 0 });
		}
	}

	var nwea = {
	  BlogFeedAccordion: BlogFeedAccordion,
	  Card: Card,
	  filter: {
	    Filter: Filter,
	    Filtered: Filtered
	  },
	  Footer: Footer
	}; // Make these functions available to the browser

	window.nwea = nwea;

	if (typeof footer_args !== 'undefined') {
	  new nwea.Footer({
	    target: document.getElementById('wrapper-footer'),
	    props: {
	      args: footer_args
	    }
	  });
	}

	exports.Alert = alert;
	exports.Button = button;
	exports.Carousel = carousel;
	exports.Collapse = collapse;
	exports.Dropdown = dropdown;
	exports.Modal = modal;
	exports.Offcanvas = offcanvas;
	exports.Popover = popover;
	exports.Scrollspy = scrollspy;
	exports.Tab = tab;
	exports.Toast = toast;
	exports.Tooltip = tooltip;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=child-theme.js.map
