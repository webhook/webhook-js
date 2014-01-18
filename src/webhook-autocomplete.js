/*
 * Webhook Autocomplete
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var keyCode = {
    BACKSPACE: 8,
    COMMA    : 188,
    DELETE   : 46,
    DOWN     : 40,
    END      : 35,
    ENTER    : 13,
    ESCAPE   : 27,
    HOME     : 36,
    LEFT     : 37,
    PAGE_DOWN: 34,
    PAGE_UP  : 33,
    PERIOD   : 190,
    RIGHT    : 39,
    SPACE    : 32,
    TAB      : 9,
    UP       : 38,
    SHIFT    : 16,
    CTRL     : 17,
    ALT      : 18
  };

  var Autocomplete = function (element, options) {
    this.init(element, options);
  };

  Autocomplete.prototype = {
    init: function (element, options) {
      this.$element = $(element).prop('readonly', true);

      this.$tagGroup = $('<div class="wy-tag-input-group">').insertAfter(this.$element);
      this.$autocompleteGroup = $('<div class="wy-autocomplete-group">').appendTo(this.$tagGroup);

      this.$input    = $('<input type="text" autocomplete="off">').appendTo(this.$autocompleteGroup);
      this.$results  = $('<div class="wy-autocomplete-dropdown">').append('<ul>');
      this.options   = this.getOptions(options);
      this.selected  = [];
      this.$selected = $([]);
      this.keyedData = {};

      this.$input.attr('placeholder', this.options.placeholder || this.$element.attr('placeholder'));

      this.listen();

      this.getSource(this.options.source);

    },

    getOptions: function (options) {
      return $.extend({}, $.fn.autocomplete.defaults, this.$element.data(), options);
    },

    getSource: function (source) {
      if (typeof source === 'object') {
        this.setData(this.options.formatSource(source));
      } else if (typeof source === 'string') {
        $.getJSON(source).done($.proxy(function (data) {
          this.setData(this.options.formatSource(data));
        }, this));
      }
    },

    setData: function (data) {
      this.data = data;
      this.formattedData = this.options.formatData(data);

      $.each(this.data, $.proxy(function (index, item) {
        this.keyedData[this.options.formatSelect(item)] = item;
      }, this));

      // initial data
      if (this.$element.val()) {
        $.each(this.$element.val().split(','), $.proxy(function (index, value) {
          this.selectItem(this.keyedData[value]);
        }, this));
      }
    },

    listen: function () {

      this.$input.on({
        'keydown.autocomplete': $.proxy(this.keydown, this),
        'keyup.autocomplete': $.proxy(this.keyup, this)
      });

      this.$results.on('mouseenter.autocomplete', 'li', function () {
        $(this).addClass('on').siblings().removeClass('on');
      });

      this.$results.on('click.autocomplete', 'li', $.proxy(this.selectCurrent, this));

      this.$element.on({
        'selectItem.autocomplete': $.proxy(function (event, item) {

          var $selected = $('<span class="wy-tag">')
                            .text(this.options.formatDisplay(item))
                            .data('item', item)
                            .attr('data-val', this.options.formatSelect(item))
                            .insertBefore(this.$autocompleteGroup);

          $('<a class="wy-tag-remove">').appendTo($selected).on('click', $.proxy(function () {
            this.removeItem(item);
          }, this));

          this.$selected = this.$selected.add($selected);
        }, this),
        'removeItem.autocomplete': $.proxy(function (event, item) {
          this.$selected.filter('[data-val="' + this.options.formatSelect(item) + '"]').remove();
        }, this)
      });

    },

    keydown: function (event) {

      switch (event.keyCode) {
        case keyCode.UP:
          event.preventDefault();
          this.prev();
          break;

        case keyCode.DOWN:
          event.preventDefault();
          this.next();
          break;

        case keyCode.TAB:
        case keyCode.ENTER:
        case keyCode.ESCAPE:
          event.preventDefault();
          break;

      }
    },

    keyup: function (event) {

      switch (event.keyCode) {
        case keyCode.UP:
        case keyCode.DOWN:
        case keyCode.CTRL:
        case keyCode.SHIFT:
        case keyCode.ALT:
          break;

        case keyCode.ENTER:
          this.selectCurrent();
          break;

        case keyCode.ESCAPE:
          this.hide();
          break;

        default:
          this.search(this.$input.val());
          break;
      }

      event.stopPropagation();
      event.preventDefault();
    },

    search: function (query) {

      this.query = query || this.$input.val();

      if (this.query.length < this.options.minLength) {
        return this.hide();
      }

      return this.process(this.formattedData.slice());
    },

    process: function (items) {
      items = this.match(items);
      items = this.sort(items);
      return this.render(items.slice(0, this.options.perPage)).show();
    },

    match: function (items) {

      var query = this.query.toLowerCase(),
          matched = this.matched = [];

      return $.grep(items, function (item, index) {
        return ~item.toLowerCase().indexOf(query) && matched.push(index);
      });
    },

    sort: function (items) {

      var beginswith = [],
          caseSensitive = [],
          caseInsensitive = [],
          item, mappedItem, count = 0;

      while (item = items.shift()) {
        mappedItem = this.matched[count++];
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) {
          beginswith.push(mappedItem);
        } else if (~item.indexOf(this.query)) {
          caseSensitive.push(mappedItem);
        } else {
          caseInsensitive.push(mappedItem);
        }
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    },

    next: function () {
      var on = this.$results.find('.on').removeClass('on'),
          next = on.next();

      if (!next.length) {
        next = this.$results.find('li').first();
      }

      next.addClass('on');
    },

    prev: function () {
      var on = this.$results.find('.on').removeClass('on'),
          prev = on.prev();

      if (!prev.length) {
        prev = this.$results.find('li').last();
      }

      prev.addClass('on');
    },

    selectCurrent: function () {
      return this.selectItem(this.$results.find('.on').data('item'));
    },

    selectItem: function (item) {

      var val = this.options.formatSelect(item);

      if (~this.selected.indexOf(val)) {
        return this;
      }

      if (this.options.limit && this.selected.length >= this.options.limit) {
        return this;
      } else if (this.options.limit === 1) {
        this.selected = [val];
      } else {
        this.selected.push(val);
      }

      this.updateSelection();

      this.$element.trigger('selectItem.autocomplete', item);
      this.hide();
      this.$input.val('');

      return this;
    },

    updateSelection: function () {
      this.$element.val(this.selected.join(this.options.separator)).trigger('change');
    },

    removeItem: function (item) {
      this.selected.splice(this.selected.indexOf(this.options.formatSelect(item)), 1);
      this.updateSelection();
      this.$element.trigger('removeItem.autocomplete', item);
      return this;
    },

    render: function (orderedKeys) {

      this.$results.find('ul').empty();

      $.each(orderedKeys, $.proxy(function (index, key) {
        $('<li>').text(this.options.formatDisplay(this.data[key])).data('item', this.data[key]).appendTo(this.$results.find('ul'));
      }, this));

      this.$results.find('li').first().addClass('on');

      return this;
    },

    show: function () {

      if (!this.$results.is(':empty')) {
        this.$results.appendTo(this.$autocompleteGroup);
      }

      return this;
    },

    hide: function () {
      this.$results.detach();

      return this;
    }

  };


 /* AUTOCOMPLETE PLUGIN DEFINITION
  * ============================== */

  $.fn.autocomplete = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('autocomplete'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('autocomplete', (data = new Autocomplete(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.autocomplete.Constructor = Autocomplete;

  $.fn.autocomplete.defaults = {
    separator: ',',
    limit: 1,
    perPage: 10,
    minLength: 2,
    formatSource: function (data) {
      return data;
    },
    formatData: function (data) {
      return data;
    },
    formatDisplay: function (result) {
      return result;
    },
    formatSelect: function (item) {
      return item;
    }
  };


 /* AUTOCOMPLETE DATA API
  * ===================== */

  $(window).on('load', function () {
    $('[data-provide=autocomplete]').each(function () {
      var $element = $(this),
          data     = $element.data();

      $element.autocomplete(data);
    });
  });

}(window.jQuery));

/*
<div class="wy-control-group">
<label for="right-label" >Author(s)</label>
<div class="wy-tag-input-group">
  <span class="wy-tag">Dave Snider<a href="" class="wy-tag-remove"></a></span>
  <span class="wy-tag">Andy McCurdy<a href="" class="wy-tag-remove"></a></span>
  <span class="wy-tag">Mike Horn<a href="" class="wy-tag-remove"></a></span>
  <div class="wy-autocomplete-group">
    <input type="text" id="right-label" placeholder="Search users">
    <div class="wy-autocomplete-dropdown">
      <ul>
        <li class="on">
          <img src="https://secure.gravatar.com/avatar/701bba3438bca23aed0079226247c308?s=140&d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" />
          Dave snider
        </li>
        <li>
          <img src="http://static.giantbomb.com/uploads/square_tiny/0/29/955845-177637_410709_soundwave_copy.jpg" />
          Andy McCurdy
        </li>
        <li>
          <img src="http://static.giantbomb.com/uploads/square_tiny/0/5761/1630113-1446558_tronpreorder.png" />
          Mike Horn
        </li>
      </ul>
    </div>
  </div>
</div>
*/
