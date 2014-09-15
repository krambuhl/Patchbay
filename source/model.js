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
});