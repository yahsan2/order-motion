var OrderMotion;

OrderMotion = (function() {
  function OrderMotion(options) {
    this.options = {
      'attr': 'data-order',
      '$el': $('html'),
      'interval': 100,
      'autoStart': true,
      'motion': this.addClass,
      'reverse': this.removeClass,
      'cls': 'is-active',
      'beforeFn': function() {},
      'afterFn': function() {}
    };
    $.extend(this.options, options);
    this.$el = this.options.$el.find('[' + this.options.attr + ']');
    this.attr = this.options.attr;
    this.interval = this.options.interval;
    this.maxOrder = 0;
    this.cls = this.options.cls;
    this.init();
  }

  OrderMotion.prototype.init = function() {
    var fn, key, _ref;
    if (this.options.custom) {
      _ref = this.options.custom;
      for (key in _ref) {
        fn = _ref[key];
        if (!this[key]) {
          this[key] = fn;
        }
      }
    }
    this.setElems();
    if (this.options.autoStart) {
      return this.start();
    }
  };

  OrderMotion.prototype.setElems = function() {
    this.elems = [];
    return this.$el.each((function(_this) {
      return function(i, el) {
        var $el, attr, motionFn, motionParam, order, reverseFn, reverseParam;
        $el = $(el);
        attr = $el.attr(_this.attr);
        order = 0;
        motionFn = _this.options.motion;
        motionParam = _this.options.cls;
        reverseFn = null;
        reverseParam = _this.options.cls;
        if (attr.indexOf('|') !== -1) {
          attr = attr.split('|')[0];
          reverseFn = attr.split('|')[1] ? attr.split('|')[1] : _this.options.reverse;
        }
        if (attr) {
          $.each(attr.split(','), function(i, opt) {
            var motionStr;
            if (Number(opt).toString() !== 'NaN') {
              order = Number(opt);
              if (order > _this.maxOrder) {
                return _this.maxOrder = order;
              }
            } else {
              motionStr = opt;
              if (motionStr.indexOf(':') !== -1) {
                if (_this[motionStr.split(':')[0]]) {
                  motionFn = _this[motionStr.split(':')[0]];
                }
                return motionParam = motionStr.split(':')[1];
              } else {
                if (_this[motionStr]) {
                  return motionFn = _this[motionStr];
                } else {
                  return motionParam = motionStr;
                }
              }
            }
          });
        }
        return _this.elems.push({
          '$el': $el,
          'order': order,
          'motion': {
            'func': motionFn,
            'param': motionParam
          },
          'reverse': {
            'func': reverseFn,
            'param': reverseParam
          }
        });
      };
    })(this));
  };

  OrderMotion.prototype.start = function() {
    return $.each(this.elems, (function(_this) {
      return function(i, elem) {
        return setTimeout(function() {
          return _this.doMotion(elem.$el, elem.motion);
        }, _this.interval * elem.order);
      };
    })(this));
  };

  OrderMotion.prototype.reverse = function() {
    return $.each(this.elems, (function(_this) {
      return function(i, elem) {
        return setTimeout(function() {
          return _this.doMotion(elem.$el, elem.motion);
        }, _this.interval * (_this.elems.length - elem.order));
      };
    })(this));
  };

  OrderMotion.prototype.doMotion = function($el, motion) {
    if (typeof motion === 'function') {
      return motion($el);
    } else if (motion.func) {
      return motion.func($el, motion.param);
    }
  };

  OrderMotion.prototype.addClass = function($el, param) {
    return $el.addClass(param);
  };

  OrderMotion.prototype.removeClass = function($el, param) {
    return $el.removeClass(param);
  };

  return OrderMotion;

})();
