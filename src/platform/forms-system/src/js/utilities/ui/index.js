import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import Scroll from 'react-scroll';

export function focusElement(selectorOrElement, options) {
  const el =
    typeof selectorOrElement === 'string'
      ? document.querySelector(selectorOrElement)
      : selectorOrElement;

  if (el) {
    if (el.tabIndex === 0) {
      el.setAttribute('tabindex', '0');
    }
    if (el.tabIndex < 0) {
      el.setAttribute('tabindex', '-1');
    }
    el.focus(options);
  }
}

export function setGlobalScroll() {
  window.Forms = window.Forms || {
    scroll: {
      duration: 500,
      delay: 0,
      smooth: true,
    },
  };
}

// Allows smooth scrolling to be overridden by our E2E tests
export function getScrollOptions(additionalOptions) {
  const globals = window.Forms || {};
  const defaults = {
    duration: 500,
    delay: 0,
    smooth: true,
  };
  return _.merge({}, defaults, globals.scroll, additionalOptions);
}

export function scrollToFirstError() {
  const errorEl = document.querySelector('.usa-input-error, .input-error-date');
  if (errorEl) {
    // document.body.scrollTop doesn’t work with all browsers, so we’ll cover them all like so:
    const currentPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const position = errorEl.getBoundingClientRect().top + currentPosition;
    Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
    focusElement(errorEl);
  }
}
