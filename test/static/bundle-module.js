$_mod.installed("makeup-modal$0.0.2", "makeup-keyboard-trap", "0.0.7");
$_mod.main("/makeup-keyboard-trap$0.0.7", "");
$_mod.installed("makeup-keyboard-trap$0.0.7", "custom-event-polyfill", "0.3.0");
$_mod.main("/custom-event-polyfill$0.3.0", "custom-event-polyfill");
$_mod.def("/custom-event-polyfill$0.3.0/custom-event-polyfill", function(require, exports, module, __filename, __dirname) { // Polyfill for creating CustomEvents on IE9/10/11

// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

try {
    var ce = new window.CustomEvent('test');
    ce.preventDefault();
    if (ce.defaultPrevented !== true) {
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error('Could not prevent default');
    }
} catch(e) {
  var CustomEvent = function(event, params) {
    var evt, origPrevent;
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };

    evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    origPrevent = evt.preventDefault;
    evt.preventDefault = function () {
      origPrevent.call(this);
      try {
        Object.defineProperty(this, 'defaultPrevented', {
          get: function () {
            return true;
          }
        });
      } catch(e) {
        this.defaultPrevented = true;
      }
    };
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent; // expose definition to window
}

});
$_mod.installed("makeup-keyboard-trap$0.0.7", "makeup-focusables", "0.0.1");
$_mod.main("/makeup-focusables$0.0.1", "");
$_mod.def("/makeup-focusables$0.0.1/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var focusableElList = ['a[href]', 'area[href]', 'button:not([disabled])', 'embed', 'iframe', 'input:not([disabled])', 'object', 'select:not([disabled])', 'textarea:not([disabled])', '*[tabindex]', '*[contenteditable]'];

var focusableElSelector = focusableElList.join();

module.exports = function (el) {
    var keyboardOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var focusableEls = Array.prototype.slice.call(el.querySelectorAll(focusableElSelector));

    if (keyboardOnly === true) {
        focusableEls = focusableEls.filter(function (focusableEl) {
            return focusableEl.getAttribute('tabindex') !== '-1';
        });
    }

    return focusableEls;
};

});
$_mod.def("/makeup-keyboard-trap$0.0.7/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var focusables = require('/makeup-focusables$0.0.1/index'/*'makeup-focusables'*/);

// when bundled up with isomorphic components on the server, this code is run,
// so we must check if 'document' is defined.
var body = typeof document === "undefined" ? null : document.body;

// for the element that will be trapped
var trappedEl = void 0;

// for the trap boundary/bumper elements
var topTrap = void 0;
var outerTrapBefore = void 0;
var innerTrapBefore = void 0;
var innerTrapAfter = void 0;
var outerTrapAfter = void 0;
var botTrap = void 0;

// for the first and last focusable element inside the trap
var firstFocusableElement = void 0;
var lastFocusableElement = void 0;

function createTrapBoundary() {
    var trapBoundary = document.createElement('div');

    trapBoundary.setAttribute('tabindex', '0');
    trapBoundary.className = 'keyboard-trap-boundary';

    return trapBoundary;
}

function setFocusToFirstFocusableElement() {
    firstFocusableElement.focus();
}

function setFocusToLastFocusableElement() {
    lastFocusableElement.focus();
}

function createTraps() {
    topTrap = createTrapBoundary();
    outerTrapBefore = topTrap.cloneNode();
    innerTrapBefore = topTrap.cloneNode();
    innerTrapAfter = topTrap.cloneNode();
    outerTrapAfter = topTrap.cloneNode();
    botTrap = topTrap.cloneNode();

    topTrap.addEventListener('focus', setFocusToFirstFocusableElement);
    outerTrapBefore.addEventListener('focus', setFocusToFirstFocusableElement);
    innerTrapBefore.addEventListener('focus', setFocusToLastFocusableElement);
    innerTrapAfter.addEventListener('focus', setFocusToFirstFocusableElement);
    outerTrapAfter.addEventListener('focus', setFocusToLastFocusableElement);
    botTrap.addEventListener('focus', setFocusToLastFocusableElement);
}

function untrap() {
    if (trappedEl) {
        topTrap = body.removeChild(topTrap);
        outerTrapBefore = trappedEl.parentNode.removeChild(outerTrapBefore);
        innerTrapBefore = trappedEl.removeChild(innerTrapBefore);
        innerTrapAfter = trappedEl.removeChild(innerTrapAfter);
        outerTrapAfter = trappedEl.parentNode.removeChild(outerTrapAfter);
        botTrap = body.removeChild(botTrap);

        trappedEl.classList.remove('keyboard-trap--active');

        // let observers know the keyboard is no longer trapped
        trappedEl.dispatchEvent(new CustomEvent('keyboardUntrap', { bubbles: true }));

        trappedEl = null;
    }
    return trappedEl;
}

function trap(el) {
    if (!topTrap) {
        createTraps();
    } else {
        untrap();
    }

    trappedEl = el;

    var focusableElements = focusables(trappedEl);
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];

    body.insertBefore(topTrap, body.childNodes[0]);
    trappedEl.parentNode.insertBefore(outerTrapBefore, trappedEl);
    trappedEl.insertBefore(innerTrapBefore, trappedEl.childNodes[0]);
    trappedEl.appendChild(innerTrapAfter);
    trappedEl.parentNode.insertBefore(outerTrapAfter, trappedEl.nextElementSibling);
    body.appendChild(botTrap);

    // let observers know the keyboard is now trapped
    trappedEl.dispatchEvent(new CustomEvent('keyboardTrap', { bubbles: true }));

    trappedEl.classList.add('keyboard-trap--active');

    return trappedEl;
}

module.exports = {
    trap: trap,
    untrap: untrap
};

});
$_mod.installed("makeup-modal$0.0.2", "makeup-screenreader-trap", "0.0.4");
$_mod.main("/makeup-screenreader-trap$0.0.4", "");
$_mod.installed("makeup-screenreader-trap$0.0.4", "custom-event-polyfill", "0.3.0");
$_mod.def("/makeup-screenreader-trap$0.0.4/util", function(require, exports, module, __filename, __dirname) { 'use strict';

// filter function for ancestor elements

var filterAncestor = function filterAncestor(item) {
    return item.nodeType === 1 && item.tagName.toLowerCase() !== 'body' && item.tagName.toLowerCase() !== 'html';
};

// filter function for sibling elements
var filterSibling = function filterSibling(item) {
    return item.nodeType === 1 && item.tagName.toLowerCase() !== 'script';
};

// reducer to flatten arrays
var flattenArrays = function flattenArrays(a, b) {
    return a.concat(b);
};

// recursive function to get previous sibling nodes of given element
function getPreviousSiblings(el) {
    var siblings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var previousSibling = el.previousSibling;

    if (!previousSibling) {
        return siblings;
    }

    siblings.push(previousSibling);

    return getPreviousSiblings(previousSibling, siblings);
}

// recursive function to get next sibling nodes of given element
function getNextSiblings(el) {
    var siblings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var nextSibling = el.nextSibling;

    if (!nextSibling) {
        return siblings;
    }

    siblings.push(nextSibling);

    return getNextSiblings(nextSibling, siblings);
}

// returns all sibling element nodes of given element
function getSiblings(el) {
    var allSiblings = getPreviousSiblings(el).concat(getNextSiblings(el));

    return allSiblings.filter(filterSibling);
}

// recursive function to get all ancestor nodes of given element
function getAllAncestors(el) {
    var ancestors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var nextAncestor = el.parentNode;

    if (!nextAncestor) {
        return ancestors;
    }

    ancestors.push(nextAncestor);

    return getAllAncestors(nextAncestor, ancestors);
}

// get ancestor nodes of given element
function getAncestors(el) {
    return getAllAncestors(el).filter(filterAncestor);
}

// get siblings of ancestors (i.e. aunts and uncles) of given el
function getSiblingsOfAncestors(el) {
    return getAncestors(el).map(function (item) {
        return getSiblings(item);
    }).reduce(flattenArrays, []);
}

module.exports = {
    getSiblings: getSiblings,
    getAncestors: getAncestors,
    getSiblingsOfAncestors: getSiblingsOfAncestors
};

});
$_mod.def("/makeup-screenreader-trap$0.0.4/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var util = require('/makeup-screenreader-trap$0.0.4/util'/*'./util.js'*/);

// the main landmark
var mainEl = void 0;

// the element that will be trapped
var trappedEl = void 0;

// collection of elements that get 'dirtied' with aria-hidden attr
var dirtyObjects = void 0;

function prepareAttribute(el, dirtyValue) {
    return {
        el: el,
        cleanValue: el.getAttribute('aria-hidden'),
        dirtyValue: dirtyValue
    };
}

function dirtyAttribute(preparedObj) {
    preparedObj.el.setAttribute('aria-hidden', preparedObj.dirtyValue);
}

function cleanAttribute(preparedObj) {
    if (preparedObj.cleanValue) {
        preparedObj.el.setAttribute('aria-hidden', preparedObj.cleanValue);
    } else {
        preparedObj.el.removeAttribute('aria-hidden');
    }
}

function untrap() {
    if (trappedEl) {
        // restore 'dirtied' elements to their original state
        dirtyObjects.forEach(function (item) {
            return cleanAttribute(item);
        });

        dirtyObjects = [];

        // 're-enable' the main landmark
        if (mainEl) {
            mainEl.setAttribute('role', 'main');
        }

        // let observers know the screenreader is now untrapped
        trappedEl.dispatchEvent(new CustomEvent('screenreaderUntrap', { bubbles: true }));

        trappedEl = null;
    }
}

function trap(el) {
    // ensure current trap is deactivated
    untrap();

    // update the trapped el reference
    trappedEl = el;

    // update the main landmark reference
    mainEl = document.querySelector('main, [role="main"]');

    // we must remove the main landmark to avoid issues on voiceover iOS
    if (mainEl) {
        mainEl.setAttribute('role', 'presentation');
    }

    // cache all ancestors, siblings & siblings of ancestors for trappedEl
    var ancestors = util.getAncestors(trappedEl);
    var siblings = util.getSiblings(trappedEl);
    var siblingsOfAncestors = util.getSiblingsOfAncestors(trappedEl);

    // prepare elements
    dirtyObjects = [prepareAttribute(trappedEl, 'false')].concat(ancestors.map(function (item) {
        return prepareAttribute(item, 'false');
    })).concat(siblings.map(function (item) {
        return prepareAttribute(item, 'true');
    })).concat(siblingsOfAncestors.map(function (item) {
        return prepareAttribute(item, 'true');
    }));

    // update DOM
    dirtyObjects.forEach(function (item) {
        return dirtyAttribute(item);
    });

    // let observers know the screenreader is now trapped
    trappedEl.dispatchEvent(new CustomEvent('screenreaderTrap', { bubbles: true }));
}

module.exports = {
    trap: trap,
    untrap: untrap
};

});
$_mod.def("/makeup-modal$0.0.2/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var keyboardTrap = require('/makeup-keyboard-trap$0.0.7/index'/*'makeup-keyboard-trap'*/);
var screenreaderTrap = require('/makeup-screenreader-trap$0.0.4/index'/*'makeup-screenreader-trap'*/);

var modalEl = void 0;

function unmodal() {
    if (modalEl) {
        screenreaderTrap.untrap(modalEl);
        keyboardTrap.untrap(modalEl);

        // let observers know the keyboard is now trapped
        var event = document.createEvent('Event');
        event.initEvent('unmodal', false, true);
        modalEl.dispatchEvent(event);

        modalEl = null;
    }
    return modalEl;
}

function modal(el) {
    unmodal();
    modalEl = el;
    screenreaderTrap.trap(modalEl);
    keyboardTrap.trap(modalEl);

    // let observers know the element is now modal
    var event = document.createEvent('Event');
    event.initEvent('modal', false, true);
    modalEl.dispatchEvent(event);

    return modalEl;
}

module.exports = {
    modal: modal,
    unmodal: unmodal
};

});