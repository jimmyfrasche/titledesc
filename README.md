# titledesc

Polyfill for https://github.com/whatwg/html/issues/4596 discussion. It is authored in ES6 and requires polyfills for custom elements in some browsers.

This polyfill introduces two custom elements, x-title and x-desc.

The contents of x-title are used as the target for aria-labelledby.

The contents of x-desc are used as the target for aria-describedby.

If a *for* attribute is specified, the element with that id gets the respective label or description. Otherwise, the parent of the x-title or x-desc gets the label or description. This is primarily useful for adding a description to an input element.

See https://jimmyfrasche.github.io/titledesc for test page with examples.
