// ##View
Patchbay.View = (function() {
  // array of options that will be extended
  // to the view when initialized
  var viewOptions = ['el', 'ui', 'template', 'model', 'data'];

  // `View` constructor returns a View object
  // that contains methods for template/model
  // rendering, dom caching, and event listening.
  var View = Struck.EventObject.extend();

  View.prototype.initializeObject = function() {
    var self = this;
    
    Struck.EventObject.prototype.initializeObject.apply(this, arguments);

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
      self.setUI(result(self.ui));

      // run setup function
      forceHook(self, 'setup', self.options);
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
    } else {
      this.setElement(document.createElement('div'));
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
    if(_.isUndefined(firstDef(this.el, template))) { 
      return; 
    }

    if (_.isFunction(template)) {
      this.setElement(template(firstDef(model.data, {})));
    } else if (_.isString(template)) {
      this.setElement(_.template(template, firstDef(model.data, {})));
    }
  });

  View.prototype.state = function(prop, active) {
    if (_.isUndefined(active)) {
      return this.$el.hasClass("is-" + prop);
    } else {
      if (active) {
        this.$el.addClass("is-" + prop);
      } else {
        this.$el.removeClass("is-" + prop);
      }
    }
  };

  // overwritable `setup` function
  // called when View is initialized
  View.prototype.setup = _.noop;

  View.prototype.cleanup = _.noop;

  // overwritable `destroys` function
  // that should be called when removing
  // a view to remove event listeners
  // or any possible memory leaks
  View.prototype.destroy = function() {
    Struck.EventObject.prototype.destroy.apply(this, arguments);
    
    // destroy model from view
    this.model.destroy();
    
    // run view cleanup
    forceHook(this, 'cleanup');
  };

  function forceHook(self, name) {
    self.hook(name, 'before');
    self[name].apply(self, _.rest(arguments, 2));
    self.hook(name);
    self.hook(name, 'after');
  }

  return View;
})();