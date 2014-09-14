(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'jquery', 'exports'], function(_, $, exports) {
      root.Patchbay = factory(root, exports, _, $);
    });
  } else if (typeof exports !== 'undefined') {
    var _ = require('lodash'), $ = require('jquery');
    exports = factory(root, exports, _, $);
  } else {
    root.Patchbay = factory(root, {}, root._, root.jQuery);
  }
}(this, function(root, Patchbay, _, $) {