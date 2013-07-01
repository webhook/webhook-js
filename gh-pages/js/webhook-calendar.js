/*
 * Webhook Calendar
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

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
