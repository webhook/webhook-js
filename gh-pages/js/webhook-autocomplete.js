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
      this.$input   = $('<input type="text" autocomplete="off">').insertAfter(this.$element);
      this.$results = $('<ul class="wh-autocomplete-results">');
      this.options  = this.getOptions(options);

      this.data = typeof this.options.source === 'object' ? this.options.source : [];

      if (!this.data.length && this.options.source) {
        $.getJSON(this.options.source).done($.proxy(this.setData, this));
      }

      this.$input.on({
        'keydown.autocomplete': $.proxy(this.keydown, this),
        'keyup.autocomplete': $.proxy(this.keyup, this)
      });

    },

    getOptions: function (options) {
      return $.extend({}, $.fn.autocomplete.defaults, this.$element.data(), options);
    },

    setData: function (data) {

      if ($.isFunction(this.options.formatdata)) {
        data = this.options.formatdata(data);
      }

      this.data = data;
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
          this.select();
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

      if (!this.query.length) {
        this.hide();
        return;
      }

      var results = this.process(this.data.slice());

      if (results.length) {
        this.show(results);
      } else {
        this.hide();
      }

    },

    process: function (items) {
      items = this.match(items);
      items = this.sort(items);
      return items;
    },

    match: function (items) {

      var query = this.query.toLowerCase();

      items = $.grep(items, function (item) {
        return ~item.toLowerCase().indexOf(query);
      });

      return items;
    },

    sort: function (items) {

      var beginswith = [],
          caseSensitive = [],
          caseInsensitive = [],
          item;

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) {
          beginswith.push(item);
        } else if (~item.indexOf(this.query)) {
          caseSensitive.push(item);
        } else {
          caseInsensitive.push(item);
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

    select: function () {
      var val = this.$results.find('.on').text();
      this.$element.val(val).trigger('change');
      this.hide();
      this.$input.val('');
    },

    show: function (items) {
      this.$results.empty().insertAfter(this.$input);
      $.each(items.slice(0, 10), $.proxy(function (index, item) {
        $('<li>').text(item).appendTo(this.$results);
      }, this));
      this.$results.find('li').first().addClass('on');
    },

    hide: function () {
      this.$results.detach();
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

  $.fn.autocomplete.defaults = {};


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
<div class="wh-control-group">
<label for="right-label" >Author(s)</label>
<div class="wh-tag-input-group">
  <span class="wh-tag">Dave Snider<a href="" class="wh-tag-remove"></a></span>
  <span class="wh-tag">Andy McCurdy<a href="" class="wh-tag-remove"></a></span>
  <span class="wh-tag">Mike Horn<a href="" class="wh-tag-remove"></a></span>
  <div class="wh-autocomplete-group">
    <input type="text" id="right-label" placeholder="Search users">
    <div class="wh-autocomplete-dropdown">
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
