/*! webhook-js - v0.0.1 - 2013-07-01
* https://github.com/webhook/webhook-js
* Copyright (c) 2013 Mike Horn; Licensed MIT */
(function ($) {

  "use strict";

  var Affix = function (element, options) {
    this.init(element, options);
  };

  Affix.prototype = {
    init: function (element, options) {
      this.$element = $(element);
      this.options  = this.getOptions(options);
      this.$window  = $(window);

      if (!this.options.offset.top) {
        this.options.offset.top = this.$element.offset().top - 10;
      }

      this.$window.on({
        'scroll.affix': $.proxy(this.checkPosition, this),
        'click.affix': $.proxy(function () {
          setTimeout($.proxy(this.checkPosition, this), 1);
        }, this)
      });

      this.checkPosition();
    },

    getOptions: function (options) {
      return $.extend({}, $.fn.affix.defaults, this.$element.data(), options);
    },

    checkPosition: function () {
      if (!this.$element.is(':visible')) {
        return;
      }

      var scrollHeight = $(document).height(),
          scrollTop    = this.$window.scrollTop(),
          position     = this.$element.offset(),
          offset       = this.options.offset,
          offsetBottom = offset.bottom,
          offsetTop    = offset.top,
          reset        = 'affix affix-top affix-bottom',
          affix;

      if (typeof offset !== 'object') {
        offsetBottom = offsetTop = offset;
      }

      if (typeof offsetTop === 'function') {
        offsetTop = offset.top();
      }

      if (typeof offsetBottom === 'function') {
        offsetBottom = offset.bottom();
      }

      affix =     this.unpin   !== null && (scrollTop + this.unpin <= position.top) ?
        false   : offsetBottom !== null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
        'bottom': offsetTop    !== null && scrollTop <= offsetTop ?
        'top'   : false;

      if (this.affixed === affix) {
        return;
      }

      this.affixed = affix;
      this.unpin = affix === 'bottom' ? position.top - scrollTop : null;

      this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''));
    }

  };


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('affix'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('affix', (data = new Affix(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.affix.Constructor = Affix;

  $.fn.affix.defaults = {
    offset: {}
  };


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this),
          data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom) {
        data.offset.bottom = data.offsetBottom;
      }

      if (data.offsetTop) {
        data.offset.top = data.offsetTop;
      }

      $spy.affix(data);
    });
  });

}(window.jQuery));

(function ($) {

  "use strict";

  var Autocomplete = function (element, options) {
    this.init(element, options);
  };

  Autocomplete.prototype = {
    init: function (element, options) {
      return [element, options];
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

(function ($) {

  "use strict";

  var Button = function (element, options) {
    this.init(element, options);
  };

  Button.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* BUTTON PLUGIN DEFINITION
   * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('button'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('button', (data = new Button(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.button.Constructor = Button;

  $.fn.button.defaults = {};

}(window.jQuery));

(function ($) {

  "use strict";

  var Calendar = function (element, options) {
    this.init(element, options);
  };

  Calendar.prototype = {
    init: function (element, options) {

      this.$element = $(element);

      this.options  = this.getOptions(options);

      this.$element.attr('placeholder', this.options.format);

      this.setDatetime(this.$element.val());
      this.updateInput();

      this.$element.on({
        'focus.calendar': $.proxy(this.show, this),
        'keyup.calendar': $.proxy(this.tryDatetime, this),
        'change.calendar': $.proxy(this.tryDatetime, this),
        'click.calendar': function (event) {
          event.stopPropagation();
        }
      });

      $(document).on('click.calendar', $.proxy(this.hide, this));
    },

    getOptions: function (options) {
      return $.extend({}, $.fn.calendar.defaults, this.$element.data(), options);
    },

    tryDatetime: function () {
      var datetime = moment(this.$element.val());
      if (datetime && datetime.isValid()) {
        this.show();
      }
    },

    setDatetime: function (datetime) {
      this.datetime = moment(datetime);
      this.updateInput();
    },

    getDatetime: function () {
      return this.datetime;
    },

    getFormattedDatetime: function () {
      return this.datetime && this.datetime.format(this.options.format);
    },

    updateInput: function () {
      this.$element.val(this.getFormattedDatetime());
      this.$element.trigger('change');
    },

    calendar: function () {

      if (this.calendarDate === this.datetime) {
        return this.$calendar;
      } else if (this.calendarDate) {
        this.$calendar.remove();
      }

      this.calendarDate = this.datetime || moment();

      var template,
          verbose_day,
          daysInMonth = this.calendarDate.daysInMonth(),
          leadDays = moment(this.calendarDate).date(1).day(),
          numWeeks = Math.ceil((leadDays + daysInMonth) / 7),
          targetDate = this.calendarDate.date(),
          thisMoment = moment(),
          today = thisMoment.month() === this.calendarDate.month() && thisMoment.year() === this.calendarDate.year() && moment().date(),
          dow, wom, calendarPosition = 1, printDate = '';

      template = "<header>";
      template += "<span>" + this.calendarDate.format('MMMM YYYY') + "</span>";
      template += "<nav><button data-prev>&lt;</button><button data-today>&middot;</button><button data-next>&gt;</button></nav>";
      template += "</header>";

      template += '<table><thead><tr>';
      for (dow = 0; dow < 7; dow++) {
        verbose_day = moment(this.calendarDate).day(dow).format('ddd');
        template += '<th>' + verbose_day + '</th>';
      }
      template += '</tr></thead>';

      template += '<tbody>';
      for (wom = 0; wom < numWeeks; wom++) {
        template += '<tr>';
        for (dow = 0; dow < 7; dow++) {

          if (calendarPosition > leadDays && calendarPosition <= daysInMonth + leadDays) {
            printDate = calendarPosition - leadDays;
          } else {
            printDate = '';
          }

          if (printDate === today) {
            template += '<td class="today">';
          } else {
            template += '<td>';
          }

          if (printDate === targetDate) {
            template += '<strong>' + printDate + '</strong>';
          } else {
            template += printDate;
          }

          template += '</td>';

          calendarPosition++;

        }
        template += '</tr>';
      }
      template += '</tbody></table>';

      this.$calendar = $("<div class='webhook-calendar'>" + template + "</div>");

      this.$calendar.on('click.calendar.day', 'td:not(:empty)', $.proxy(function (event) {
        var datetime = moment(this.calendarDate).date(parseInt($(event.target).text(), 10));
        if (datetime && datetime.isValid()) {
          this.setDatetime(datetime);

        }
      }, this));

      this.$calendar.on('click.calendar.nav', 'button', $.proxy(function (event) {
        var data = $(event.target).data(), datetime;
        if (data.prev !== undefined) {
          datetime = moment(this.calendarDate).subtract('months', 1);
        } else if (data.next !== undefined) {
          datetime = moment(this.calendarDate).add('months', 1);
        } else if (data.today !== undefined) {
          datetime = moment();
        }
        this.setDatetime(datetime);
      }, this));

      this.$calendar.on('click.calendar', function (event) {
        event.stopPropagation();
      });

      return this.$calendar;

    },

    widget: function () {
      return this.calendar();
    },

    show: function () {
      var $calendar = this.calendar(),
          offset = this.$element.offset();

      $calendar.appendTo('body');

      $calendar.offset({
        top: offset.top + this.$element.outerHeight(),
        left: offset.left
      });
    },

    hide: function () {
      var $calendar = this.calendar();
      $calendar.detach();
    }
  };


 /* CALENDAR PLUGIN DEFINITION
  * ========================== */

  $.fn.calendar = function (option) {

    if (typeof option === "string" && option === "widget") {
      return $(this).data('calendar')[option]();
    }

    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('calendar'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('calendar', (data = new Calendar(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.calendar.Constructor = Calendar;

  $.fn.calendar.defaults = {
    polyfill: true,
    format: 'MM/DD/YYYY hh:mm A'
  };


 /* CALENDAR DATA-API
  * ================= */

  $(window).on('load', function () {
    $('[type=datetime-local]').each(function () {

      // automatic polyfill
      if ($.fn.calendar.defaults.polyfill && this.type === 'datetime-local') {
        return;
      }

      var $element = $(this),
          data     = $element.data();

      $element.calendar(data);

    });
  });


}(window.jQuery));

(function ($) {

  "use strict";

  var Defer = function (element, options) {
    this.init(element, options);
  };

  Defer.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* DEFER PLUGIN DEFINITION
   * ======================= */

  $.fn.defer = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('defer'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('defer', (data = new Defer(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.defer.Constructor = Defer;

  $.fn.defer.defaults = {};

}(window.jQuery));

(function ($) {

  "use strict";

  var Menu = function (element, options) {
    this.init(element, options);
  };

  Menu.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* MENU PLUGIN DEFINITION
   * ====================== */

  $.fn.menu = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('menu'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('menu', (data = new Menu(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.menu.Constructor = Menu;

  $.fn.menu.defaults = {};

}(window.jQuery));

(function ($) {

  "use strict";

  var Modal = function (element, options) {
    this.init(element, options);
  };

  Modal.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* MODAL PLUGIN DEFINITION
   * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('modal'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('modal', (data = new Modal(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.modal.Constructor = Modal;

  $.fn.modal.defaults = {};

}(window.jQuery));

(function ($) {

  "use strict";

  var Tab = function (element, options) {
    this.init(element, options);
  };

  Tab.prototype = {
    init: function (element, options) {
      this.$element = $(element);
      this.options = this.getOptions(options);
    },

    getOptions: function (options) {
      return $.extend({}, $.fn.tab.defaults, this.$element.closest('[data-toggle-group]').data(), this.$element.data(), options);
    },

    show: function () {

      var selector, $target, $targetGroup, groupOptions;

      this.$element.closest('[data-toggle-group]').find('[data-toggle]').parent().removeClass(this.options.activetabclass);
      this.$element.parent().addClass(this.options.activetabclass);

      selector = this.$element.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');

      $target = $(selector);
      $targetGroup = $target.closest('[data-toggle-target-group]');

      groupOptions = $.extend({}, this.options, $targetGroup.data());

      $targetGroup.children().removeClass(groupOptions.activepaneclass);
      $target.addClass(groupOptions.activepaneclass);

    }
  };


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('tab'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('tab', (data = new Tab(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.tab.Constructor = Tab;

  $.fn.tab.defaults = {
    activetabclass: 'active',
    activepaneclass: 'active'
  };


 /* TAB DATA-API
  * ============== */

  $(document).on('click.tab.data-api', '[data-toggle=tab]', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

}(window.jQuery));

(function ($) {

  "use strict";

  var Toc = function (element, options) {
    this.init(element, options);
  };

  Toc.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* TOC PLUGIN DEFINITION
   * ===================== */

  $.fn.toc = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('toc'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('toc', (data = new Toc(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.toc.Constructor = Toc;

  $.fn.toc.defaults = {};

}(window.jQuery));

(function ($) {

  "use strict";


  /* TOOLTIP PUBLIC CLASS DEFINITION
   * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options);
  };

  Tooltip.prototype = {
    constructor: Tooltip,

    init: function (type, element, options) {
      this.type     = type;
      this.$element = $(element);
      this.options  = this.getOptions(options);
      this.enabled  = true;

      this.fixTitle();

      this.$element.on('mouseenter.tooltip', $.proxy(this.show, this));
      this.$element.on('mouseleave.tooltip', $.proxy(this.hide, this));

    },

    getOptions: function (options) {
      return $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);
    },

    fixTitle: function () {
      var $element = this.$element;
      $element.attr('data-original-title', this.options.title || $element.attr('title') || '').attr('title', '');
    },

    getTitle: function () {
      return this.$element.attr('data-original-title');
    },

    tip: function () {
      return this.$tip = this.$tip || $(this.options.template);
    },

    adjustPosition: function () {
      var $tip = this.tip(),
          elementOffset = this.$element.offset(),
          tipOffset = {},
          placement = this.options.placement;

      if (placement === "top" || placement === "bottom") {
        tipOffset.left = elementOffset.left - (($tip.outerWidth() - this.$element.outerWidth()) / 2);
      }

      if (placement === "right" || placement === "left") {
        tipOffset.top = elementOffset.top - (($tip.outerHeight() - this.$element.outerHeight()) / 2);
      }

      if (placement === "top") {
        tipOffset.top = elementOffset.top - $tip.outerHeight() - 5;
      }

      if (placement === "bottom") {
        tipOffset.top = elementOffset.top + this.$element.outerHeight() + 5;
      }

      if (placement === "right") {
        tipOffset.left = elementOffset.left + this.$element.outerWidth() + 5;
      }

      if (placement === "left") {
        tipOffset.left = elementOffset.left - this.$tip.outerWidth() - 5;
      }

      $tip.offset(tipOffset).removeClass("top right bottom left").addClass(placement);

    },

    setContent: function (content) {
      this.tip().find('.tooltip-inner')[this.options.html ? 'html' : 'text'](content || this.getTitle());
    },

    show: function () {
      var $tip = this.tip();
      this.setContent();
      $tip.addClass('on');
      $tip.insertAfter(this.$element);
      this.adjustPosition();
    },

    hide: function () {
      var $tip = this.tip();
      $tip.removeClass('on');
      $tip.detach();
    },

    enable: function () {
      this.enabled = true;
    },

    disable: function () {
      this.enabled = false;
    },

    destroy: function () {

    }

  };


  /* TOOLTIP PLUGIN DEFINITION
   * ========================= */

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('tooltip'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('tooltip', (data = new Tooltip(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.tooltip.Constructor = Tooltip;

  $.fn.tooltip.defaults = {
    placement: 'top',
    template : '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    title    : '',
    html     : false
  };


 /* TOOLTIP DATA-API
  * ================ */

  $(window).on('load', function () {
    $('[data-toggle="tooltip"]').each(function () {
      var $element = $(this),
          data     = $element.data();

      $element.tooltip(data);
    });
  });

}(window.jQuery));

(function ($) {

  "use strict";

  var Validate = function (element, options) {
    this.init(element, options);
  };

  Validate.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* VALIDATE PLUGIN DEFINITION
   * ========================== */

  $.fn.validate = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('validate'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('validate', (data = new Validate(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.validate.Constructor = Validate;

  $.fn.validate.defaults = {};

}(window.jQuery));
