/*! webhook-js - v0.0.1 - 2013-06-26
* https://github.com/webhook/webhook-js
* Copyright (c) 2013 Mike Horn; Licensed MIT */
(function ($) {

  "use strict";

  var Affix = function (element, options) {
    this.init(element, options);
  };

  Affix.prototype = {
    init: function (element, options) {
      return [element, options];
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

  $.fn.affix.defaults = {};

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
      return [element, options];
    }
  };

  /* CALENDAR PLUGIN DEFINITION
   * ========================== */

  $.fn.calendar = function (option) {
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

  $.fn.calendar.defaults = {};

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
      return [element, options];
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

  $.fn.tab.defaults = {};

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

  var Toggle = function (element, options) {
    this.init(element, options);
  };

  Toggle.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* TOGGLE PLUGIN DEFINITION
   * ======================== */

  $.fn.toggle = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('toggle'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('toggle', (data = new Toggle(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.toggle.Constructor = Toggle;

  $.fn.toggle.defaults = {};

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

    setContent: function (content) {
      this.tip().find('.tooltip-inner')[this.options.html ? 'html' : 'text'](content || this.getTitle());
    },

    show: function () {
      var $tip = this.tip();
      this.setContent();
      $tip.addClass('on');
      $tip.insertAfter(this.$element);
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
          data = $element.data();

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
