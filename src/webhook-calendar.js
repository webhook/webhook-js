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

      this.fixDatetime();

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

    fixDatetime: function () {
      this.setDatetime(this.$element.val());
    },

    setDatetime: function (datetime) {
      this.datetime = datetime ? moment(datetime) : moment();
    },

    getDatetime: function () {
      return this.datetime;
    },

    calendar: function () {

      if (this.calendarDate === this.datetime) {
        return this.$calendar;
      } else if (this.calendarDate) {
        this.$calendar.remove();
      }

      this.calendarDate = this.datetime;

      var template,
          verbose_day,
          daysInMonth = this.datetime.daysInMonth(),
          leadDays = moment(this.datetime).date(1).day(),
          numWeeks = Math.ceil((leadDays + daysInMonth) / 7),
          today = this.datetime.date(),
          dow, wom, calendarPosition = 1, printDate = '';

      template = "<span>" + this.datetime.format('MMMM YYYY') + "</span>";

      template += '<table><thead><tr>';
      for (dow = 0; dow < 7; dow++) {
        verbose_day = moment(this.datetime).day(dow).format('dd');
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
            template += '<td><strong>' + printDate + '</strong></td>';
          } else {
            template += '<td>' + printDate + '</td>';
          }

          calendarPosition++;

        }
        template += '</tr>';
      }
      template += '</tbody></table>';

      this.$calendar = $("<div class='webhook-calendar'>" + template + "</div>");

      this.$calendar.on('click.calendar.day', 'td:not(:empty)', $.proxy(function (event) {
        var datetime = moment(this.calendarDate).date(parseInt($(event.target).text(), 10));
        if (datetime && datetime.isValid()) {
          this.$element.val(datetime.format(this.options.format));
          this.$element.trigger('change');
        }
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
      this.fixDatetime();
      var $calendar = this.calendar();
      $calendar.insertAfter(this.$element);
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
    format: 'MMM D, YYYY'
  };


 /* CALENDAR DATA-API
  * ================= */

  $(window).on('load', function () {
    $('[data-calendar]:input').each(function () {
      var $element = $(this),
          data = $element.data();

      $element.calendar(data);
    });
  });


}(window.jQuery));
