(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'jquery', 'struck', 'exports'], function(_, $, Struck, exports) {
      root.Patchbay = factory(root, exports, _, $, Struck);
    });
  } else if (typeof exports !== 'undefined') {
    var _ = require('lodash'), $ = require('jquery'), Struck = require('struck');
    exports = factory(root, exports, _, $, Struck);
  } else {
    root.Patchbay = factory(root, {}, root._, root.jQuery, root.Struck);
  }
}(this, function(root, Patchbay, _, $, Struck) {