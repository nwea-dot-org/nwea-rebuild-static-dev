/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./components/Carousel/index.ts":
/*!**************************************!*\
  !*** ./components/Carousel/index.ts ***!
  \**************************************/
/***/ (() => {



window.addEventListener("DOMContentLoaded", function () {
  var carousels = document.querySelectorAll('[is="carousel"]');
  var toSlideClassName = 'next-slide';
  var fromSlideClassName = 'previous-slide';
  var currentSlideClassName = 'current-slide';
  var transitionStartClassName = 'is-transitioning';
  var nextSlideEvent = new Event("nextslide");
  var previousSlideEvent = new Event("previousslide");
  carousels.forEach(function (carousel) {
    var slideContainer = carousel.querySelector(':scope > .slides');
    var slides = slideContainer === null || slideContainer === void 0 ? void 0 : slideContainer.querySelectorAll(':scope > *');
    var nextButtons = carousel.querySelectorAll(':scope .next.pagination-action');
    var previousButtons = carousel.querySelectorAll(':scope .previous.pagination-action');
    var transitionDuration = parseInt(getComputedStyle(carousel).getPropertyValue("--transition-duration"), 10);
    var isHovered = false;
    var isPaused = false;
    var isDeferred = false;
    var isTransitioning = false;
    var hasPauseOnHover = false;
    var autoAdvanceDuration = 0;
    var autoAdvanceTimeout;

    function setAutoAdvance() {
      if (autoAdvanceDuration > 0) {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = setTimeout(function () {
          return requestAnimationFrame(function () {
            if (!isPaused) {
              carousel.dispatchEvent(nextSlideEvent);
            } else {
              isDeferred = true;
            }
          });
        }, autoAdvanceDuration);
      }
    }

    if (carousel instanceof HTMLElement) {
      if (carousel.dataset.autoAdvanceDuration) {
        autoAdvanceDuration = parseInt(carousel.dataset.autoAdvanceDuration, 10);
        setAutoAdvance();
      }

      if (carousel.dataset.pauseOnHover) {
        hasPauseOnHover = carousel.dataset.pauseOnHover.toLowerCase() == 'true';
      }
    }

    if (slideContainer && slides && slides.length > 1) {
      var dispatchChangeSlideEvent = function dispatchChangeSlideEvent(targetSlide, isForward) {
        var detail = {
          detail: {
            targetSlide: targetSlide,
            isForward: isForward
          }
        };
        carousel.dispatchEvent(new CustomEvent("changeslide", detail));
      };

      var firstSlide = slideContainer.firstElementChild;
      var lastSlide = slideContainer.lastElementChild;
      var fromSlide = firstSlide;
      fromSlide === null || fromSlide === void 0 ? void 0 : fromSlide.classList.add(currentSlideClassName);
      carousel.addEventListener("nextslide", function () {
        var _a;

        dispatchChangeSlideEvent((_a = fromSlide === null || fromSlide === void 0 ? void 0 : fromSlide.nextElementSibling) !== null && _a !== void 0 ? _a : firstSlide, true);
      });
      carousel.addEventListener("previousslide", function () {
        var _a;

        dispatchChangeSlideEvent((_a = fromSlide === null || fromSlide === void 0 ? void 0 : fromSlide.previousElementSibling) !== null && _a !== void 0 ? _a : lastSlide, false);
      });
      carousel.addEventListener("changeslide", function (event) {
        var _a, _b, _c;

        if (!isTransitioning) {
          var toSlide = (_a = event.detail.targetSlide) !== null && _a !== void 0 ? _a : (_b = fromSlide === null || fromSlide === void 0 ? void 0 : fromSlide.nextElementSibling) !== null && _b !== void 0 ? _b : firstSlide;
          var isForward = (_c = event.detail.isForward) !== null && _c !== void 0 ? _c : true;
          isTransitioning = true;
          toSlide === null || toSlide === void 0 ? void 0 : toSlide.classList.add(isForward ? toSlideClassName : fromSlideClassName);
          requestAnimationFrame(function () {
            setTimeout(function () {
              toSlide === null || toSlide === void 0 ? void 0 : toSlide.classList.add(currentSlideClassName);
              toSlide === null || toSlide === void 0 ? void 0 : toSlide.classList.remove(isForward ? toSlideClassName : fromSlideClassName);
              fromSlide === null || fromSlide === void 0 ? void 0 : fromSlide.classList.remove(currentSlideClassName);
              fromSlide === null || fromSlide === void 0 ? void 0 : fromSlide.classList.add(isForward ? fromSlideClassName : toSlideClassName, transitionStartClassName);
              setTimeout(function () {
                requestAnimationFrame(function () {
                  isTransitioning = false;
                  fromSlide === null || fromSlide === void 0 ? void 0 : fromSlide.classList.remove(isForward ? fromSlideClassName : toSlideClassName, transitionStartClassName);
                  fromSlide = toSlide;
                  setAutoAdvance();
                });
              }, transitionDuration);
            }, 0);
          });
        }
      });
      nextButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
          carousel.dispatchEvent(nextSlideEvent);
          event.preventDefault();
        });
      });
      previousButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
          carousel.dispatchEvent(previousSlideEvent);
          event.preventDefault();
        });
      });
    }

    carousel.addEventListener("mouseenter", function () {
      isHovered = true;
      isPaused = isHovered && hasPauseOnHover;
    });
    carousel.addEventListener("mouseleave", function () {
      isHovered = false;
      isPaused = isHovered && hasPauseOnHover;

      if (isDeferred) {
        isDeferred = false;
        carousel.dispatchEvent(nextSlideEvent);
      }
    });
    carousel.classList.remove('is-loading');
  });
});

/***/ }),

/***/ "./components/Region/index.ts":
/*!************************************!*\
  !*** ./components/Region/index.ts ***!
  \************************************/
/***/ (() => {



/***/ }),

/***/ "./components/org/PageHeader/index.ts":
/*!********************************************!*\
  !*** ./components/org/PageHeader/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _partials_headerNavigation_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./partials/headerNavigation.ts */ "./components/org/PageHeader/partials/headerNavigation.ts");

(0,_partials_headerNavigation_ts__WEBPACK_IMPORTED_MODULE_0__.default)("#top-level-navigation", "#nav-button", "nav-item");

/***/ }),

/***/ "./components/org/PageHeader/partials/headerNavigation.ts":
/*!****************************************************************!*\
  !*** ./components/org/PageHeader/partials/headerNavigation.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_js_inweave_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/js/inweave.ts */ "./src/js/inweave.ts");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



function hookNavigation(navigationSelector, buttonSelector, navItemClassName) {
  var component = document.getElementById("page-header");
  var navigation = component === null || component === void 0 ? void 0 : component.querySelector(navigationSelector);
  var navigationContent = navigation === null || navigation === void 0 ? void 0 : navigation.parentNode;
  var toggleButton = component === null || component === void 0 ? void 0 : component.querySelector(buttonSelector);
  var utilityNavigation = component === null || component === void 0 ? void 0 : component.querySelector(".utility-navigation");
  var searchForm = component === null || component === void 0 ? void 0 : component.querySelector(".site-search");
  var isCompactLayout = null;
  var expandableNavItems = Array.from(component === null || component === void 0 ? void 0 : component.querySelectorAll(".".concat(navItemClassName, " .child-items")), function (item) {
    return item.parentElement;
  });

  function toggleAriaExpanded(item) {
    if (item.getAttribute("aria-expanded") === "true") {
      item.setAttribute("aria-expanded", "false");
      return false;
    } else {
      (0,src_js_inweave_ts__WEBPACK_IMPORTED_MODULE_0__.setAttribute)(expandableNavItems, "aria-expanded", "false");
      item.setAttribute("aria-expanded", "true");
      return true;
    }
  }

  function getIsCompactLayout() {
    var _a;

    var flexDirection = '';

    if (navigationContent) {
      flexDirection = (_a = window.getComputedStyle(navigationContent)) === null || _a === void 0 ? void 0 : _a.getPropertyValue("flex-direction");
    }

    return flexDirection === "column";
  }

  document.addEventListener("keydown", function (event) {
    var _a;

    if (navigation === null || navigation === void 0 ? void 0 : navigation.contains(document.activeElement)) {
      switch (event.key.toLowerCase()) {
        case " ":
          var focusedNavItem = navigation.querySelector(".".concat(navItemClassName, ":focus-within"));
          var isExpanded = JSON.parse(((_a = focusedNavItem === null || focusedNavItem === void 0 ? void 0 : focusedNavItem.getAttribute("aria-expanded")) !== null && _a !== void 0 ? _a : "false").toLowerCase());
          (0,src_js_inweave_ts__WEBPACK_IMPORTED_MODULE_0__.setAttribute)(expandableNavItems, "aria-expanded", "false");
          focusedNavItem === null || focusedNavItem === void 0 ? void 0 : focusedNavItem.setAttribute("aria-expanded", (!isExpanded).toString());
          event.preventDefault();
          break;

        case "escape":
        case "esc":
          (0,src_js_inweave_ts__WEBPACK_IMPORTED_MODULE_0__.setAttribute)(expandableNavItems, "aria-expanded", "false");
          break;
      }
    }
  });
  var mutationObserver = new MutationObserver(function (mutations) {
    var _iterator = _createForOfIteratorHelper(mutations),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var mutation = _step.value;
        var item = mutation.target;

        if (item === null || item === void 0 ? void 0 : item.classList.contains("nav-item")) {
          var childItemsPanel = item.querySelector(".child-items");

          if (item.getAttribute("aria-expanded") === "true") {
            childItemsPanel === null || childItemsPanel === void 0 ? void 0 : childItemsPanel.style.setProperty("--expanded-height", "".concat(childItemsPanel.scrollHeight, "px"));
          } else {
            childItemsPanel === null || childItemsPanel === void 0 ? void 0 : childItemsPanel.style.removeProperty("--expanded-height");
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  expandableNavItems.forEach(function (item) {
    var _a;

    if (item instanceof HTMLElement) {
      mutationObserver.observe(item, {
        attributes: true
      });
      item.addEventListener("mouseenter", function (event) {
        var currentNavItem = event.target;

        if (!isCompactLayout) {
          (0,src_js_inweave_ts__WEBPACK_IMPORTED_MODULE_0__.setAttribute)(expandableNavItems, "aria-expanded", "false");
          currentNavItem === null || currentNavItem === void 0 ? void 0 : currentNavItem.setAttribute("aria-expanded", "true");
        }
      });
      item.addEventListener("mouseleave", function () {
        if (!isCompactLayout) {
          (0,src_js_inweave_ts__WEBPACK_IMPORTED_MODULE_0__.setAttribute)(expandableNavItems, "aria-expanded", "false");
        }
      });
      (_a = item.firstElementChild) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (event) {
        if (item instanceof HTMLElement) {
          var childItemsPanel = item.querySelector(".child-items");

          if (childItemsPanel && toggleAriaExpanded(item)) {
            event.preventDefault();
          }
        }
      });
    }
  });

  function toggleMenuNavigation() {
    if (component instanceof HTMLElement) {
      toggleAriaExpanded(component);
    }

    document.documentElement.classList.toggle("modal-open");
  }

  toggleButton === null || toggleButton === void 0 ? void 0 : toggleButton.addEventListener("click", function () {
    toggleMenuNavigation();
  });
  var resizeObserver = new ResizeObserver(function (entries) {
    var _iterator2 = _createForOfIteratorHelper(entries),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var entry = _step2.value;

        if (entry.target === document.documentElement) {
          var isCompactLayoutNow = getIsCompactLayout();

          if (utilityNavigation) {
            if (isCompactLayoutNow !== isCompactLayout) {
              if (isCompactLayoutNow) {
                navigationContent.append(utilityNavigation);
                navigationContent.style.display = "block";
              } else if (searchForm) {
                navigationContent === null || navigationContent === void 0 ? void 0 : navigationContent.insertBefore(utilityNavigation, searchForm);
                navigationContent.style.display = "flex";

                if (document.documentElement.classList.contains("modal-open")) {
                  toggleMenuNavigation();
                }
              }
            }
          }

          isCompactLayout = isCompactLayoutNow;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  });
  resizeObserver.observe(document.documentElement);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hookNavigation);

/***/ }),

/***/ "./src/js/inweave.ts":
/*!***************************!*\
  !*** ./src/js/inweave.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setAttribute": () => (/* binding */ setAttribute)
/* harmony export */ });
function setAttribute(items, name, value) {
  items.forEach(function (item) {
    if (item instanceof HTMLElement) {
      item.setAttribute(name, value);
    }
  });
}

/***/ }),

/***/ "./src/js/main.ts":
/*!************************!*\
  !*** ./src/js/main.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_jake_weston_Development_nwea_org_v3_themes_inweave_components_Carousel_index_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/Carousel/index.ts */ "./components/Carousel/index.ts");
/* harmony import */ var _Users_jake_weston_Development_nwea_org_v3_themes_inweave_components_Carousel_index_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Users_jake_weston_Development_nwea_org_v3_themes_inweave_components_Carousel_index_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Users_jake_weston_Development_nwea_org_v3_themes_inweave_components_org_PageHeader_index_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/org/PageHeader/index.ts */ "./components/org/PageHeader/index.ts");
/* harmony import */ var _Users_jake_weston_Development_nwea_org_v3_themes_inweave_components_Region_index_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/Region/index.ts */ "./components/Region/index.ts");
/* harmony import */ var _Users_jake_weston_Development_nwea_org_v3_themes_inweave_components_Region_index_ts__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Users_jake_weston_Development_nwea_org_v3_themes_inweave_components_Region_index_ts__WEBPACK_IMPORTED_MODULE_2__);




/***/ }),

/***/ "./src/css/screen.scss":
/*!*****************************!*\
  !*** ./src/css/screen.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/css/print.scss":
/*!****************************!*\
  !*** ./src/css/print.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/main": 0,
/******/ 			"css/print": 0,
/******/ 			"css/screen": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkinweave"] = self["webpackChunkinweave"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/print","css/screen"], () => (__webpack_require__("./src/js/main.ts")))
/******/ 	__webpack_require__.O(undefined, ["css/print","css/screen"], () => (__webpack_require__("./src/css/screen.scss")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/print","css/screen"], () => (__webpack_require__("./src/css/print.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map