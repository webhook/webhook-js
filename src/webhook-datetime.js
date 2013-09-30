/*
 * Webhook Calendar
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Datetime = function (element, options) {
    this.init(element, options);
  };

  Datetime.prototype = {
    init: function (element, options) {

      this.isPolyfill = element !== 'datetime-local';

      this.$element = $(element);

      this.options  = this.getOptions(options);

      $('<button type="button" class="btn">Now</button>').insertAfter(this.$element).on('click', $.proxy(this.setNow, this));

      // automatic polyfill
      if ($.fn.datetime.defaults.polyfill && !this.isPolyfill) {
        return;
      }

      this.$element.attr('placeholder', this.options.format);

      this.setDatetime(this.$element.val());
      this.updateInput();

      this.$element.on({
        'focus.datetime': $.proxy(this.show, this),
        'keyup.datetime': $.proxy(this.tryDatetime, this),
        'change.datetime': $.proxy(this.tryDatetime, this),
        'click.datetime': function (event) {
          event.stopPropagation();
        }
      });

      $(document).on('click.datetime', $.proxy(this.hide, this));
    },

    getOptions: function (options) {
      return $.extend({}, $.fn.datetime.defaults, this.$element.data(), options);
    },

    tryDatetime: function () {
      var datetime = moment(this.$element.val());
      if (datetime && datetime.isValid()) {
        this.show();
      }
    },

    setNow: function () {
      this.setDatetime(moment());
    },

    setDatetime: function (datetime) {
      this.datetime = moment(datetime);
      this.updateInput();
    },

    getDatetime: function () {
      return this.datetime;
    },

    getFormattedDatetime: function () {
      // use datetime-local format if not polyfill
      var format = this.isPolyfill ? this.options.format : 'YYYY-MM-DDTHH:mm';
      return this.datetime && this.datetime.format(format);
    },

    updateInput: function () {
      this.$element.val(this.getFormattedDatetime());
      this.$element.trigger('change');
    },

    calendar: function () {

      if (this.datetimeDate === this.datetime) {
        return this.$calendar;
      } else if (this.datetimeDate) {
        this.$calendar.remove();
      }

      this.datetimeDate = this.datetime || moment();

      var template,
          verbose_day,
          daysInMonth = this.datetimeDate.daysInMonth(),
          leadDays = moment(this.datetimeDate).date(1).day(),
          numWeeks = Math.ceil((leadDays + daysInMonth) / 7),
          targetDate = this.datetimeDate.date(),
          thisMoment = moment(),
          today = thisMoment.month() === this.datetimeDate.month() && thisMoment.year() === this.datetimeDate.year() && moment().date(),
          dow, wom, datetimePosition = 1, printDate = '';

      template = "<header>";
      template += "<span>" + this.datetimeDate.format('MMMM YYYY') + "</span>";
      template += "<nav><button data-prev>&lt;</button><button data-today>&middot;</button><button data-next>&gt;</button></nav>";
      template += "</header>";

      template += '<table><thead><tr>';
      for (dow = 0; dow < 7; dow++) {
        verbose_day = moment(this.datetimeDate).day(dow).format('ddd');
        template += '<th>' + verbose_day + '</th>';
      }
      template += '</tr></thead>';

      template += '<tbody>';
      for (wom = 0; wom < numWeeks; wom++) {
        template += '<tr>';
        for (dow = 0; dow < 7; dow++) {

          if (datetimePosition > leadDays && datetimePosition <= daysInMonth + leadDays) {
            printDate = datetimePosition - leadDays;
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

          datetimePosition++;

        }
        template += '</tr>';
      }
      template += '</tbody></table>';

      this.$calendar = $("<div class='wh-datetime'>" + template + "</div>");

      this.$calendar.on('click.datetime.day', 'td:not(:empty)', $.proxy(function (event) {
        var datetime = moment(this.datetimeDate).date(parseInt($(event.target).text(), 10));
        if (datetime && datetime.isValid()) {
          this.setDatetime(datetime);

        }
      }, this));

      this.$calendar.on('click.datetime.nav', 'button', $.proxy(function (event) {
        var data = $(event.target).data(), datetime;
        if (data.prev !== undefined) {
          datetime = moment(this.datetimeDate).subtract('months', 1);
        } else if (data.next !== undefined) {
          datetime = moment(this.datetimeDate).add('months', 1);
        } else if (data.today !== undefined) {
          datetime = moment();
        }
        this.setDatetime(datetime);
      }, this));

      this.$calendar.on('click.datetime', function (event) {
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

  $.fn.datetime = function (option) {

    if (typeof option === "string" && option === "widget") {
      return $(this).data('datetime')[option]();
    }

    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('datetime'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('datetime', (data = new Datetime(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.datetime.Constructor = Datetime;

  $.fn.datetime.defaults = {
    // polyfill: true,
    // format
    format: 'MM/DD/YYYY hh:mm A'
  };


 /* CALENDAR DATA-API
  * ================= */

  $(window).on('load', function () {
    $('[type=datetime-local]').each(function () {

      var $element = $(this),
          data     = $element.data();

      $element.datetime(data);

    });
  });


}(window.jQuery));
