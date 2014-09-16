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
// ###Utilities
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// #####splitName
// split "event1 event2" into an
// array of event names
function splitName(names, context) {
  // get result of name if defined as a function
  var events = result(names, context);

  // split by spaces if result isn't an array
  // always returns an array
  return _.isArray(events) ? events : events && events.split(' ');
}

// #####result
// returns get result of an expression
function result(expr, context) {
  return _.isFunction(expr) ? expr.apply(context) : expr;
}

function firstDef() {
  return _.find(arguments, function(arg) { 
    return !_.isUndefined(arg);
  });
}
Patchbay.Model = (function() {
	var Model = Struck.EventObject.extend();

  // ###create
  // prefered method of creating new objects
  // over using the `new` style
  Model.create = function(data, props, opts) {
    _.extend(props, { data: data });
    var Creator = this.extend(props);
    return new Creator(_.extend({}, props, opts));
  };

	return Model;
})();
// ##View
Patchbay.View = (function() {
  // array of options that will be extended
  // to the view when initialized
  var viewOptions = ['el', 'ui', 'template', 'model', 'data'];

  // `View` constructor returns a View object
  // that contains methods for template/model
  // rendering, dom caching, and event listening.
  var View = Struck.EventObject.extend();

  View.prototype.baseConstructor = function() {
    var self = this;
    
    Struck.EventObject.prototype.baseConstructor.apply(this, arguments);

    // extend selected instance opitions to object
    _.extend(this, _.pick(this.options, viewOptions));

    // gets model
    this.setModel(this.model, this.data);

    // setup view elements
    this.setElement(result(this.el));

    // render template with model if defined
    this.render(this.model);

    _.defer(function() {
      // cache jquery elements
      self.setUI(self, result(self.ui));

      // run setup function
      self.setup(self.options);
    });
  };

  View.prototype.setModel = function(model, data) {
    data = firstDef(data, {});

    if (model) {
      if (model instanceof Patchbay.Model) {
        this.model = model;
        this.model.set(data);
      } else if (typeof model === 'function' && !!model.create) {
        this.model = model.create(data);
      } else if (typeof model === 'object') {
        this.model = Patchbay.Model.create(model);
      }
    } else {
      this.model = Patchbay.Model.create(data);
    }
  };

  // caches the dom object and creates scoped find function
  View.prototype.setElement = function(el) {
    var self = this;
    if (el) {
      this.$el = $(el).eq(0);
      this.el = this.$el[0];
      this.$ = function(el) {
        return self.$el.find(el);
      };
    }
  };

  View.prototype.setUI = function(ui) {
    // cache dom objects from UI object
    this.ui = _.reduce(ui, function(result, selector, name) {
      result[name] = this.$(selector);
      return result;
    }, {}, this);
  };

  // `render` function that runs
  // template function with model data
  View.prototype.render = Struck.hook('render', function(template, model) {
    if(_.isUndefined(template)) { 
      return; 
    }

    if (_.isFunction(template)) {
      this.setElement(template(firstDef(model.data, {})));
    } else if (_.isString(template)) {
      this.setElement(_.template(template, firstDef(model.data, {})));
    }
  });

  // overwritable `setup` function
  // called when View is initialized
  View.prototype.setup = _.noop;

  // overwritable `destroys` function
  // that should be called when removing
  // a view to remove event listeners
  // or any possible memory leaks
  View.prototype.destroy = function() {
    Struck.EventObject.prototype.destroy.apply(this, arguments);
    
    // destroy model from view
    this.model.destroy();
  };

  return View;
})();
  return Patchbay;
}));
