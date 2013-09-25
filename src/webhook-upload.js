/*
 * Webhook Upload
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 *
 * Todo:
 * - read exif to detect rotation. rotate thumbnail.
 */

(function ($) {

  "use strict";

  // todo: extract CSRF stuff
  function getCookie (name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  var csrftoken = getCookie('csrftoken');

  var Upload = function (element, options) {
    this.init(element, options);
  };

  Upload.prototype = {
    init: function (element, options) {

      this.$element = $(element);

      this.options = this.getOptions(options);

      var uploader = this;

      // we need this for OS file selection
      this.$fileinput = $('<input type="file" multiple>').hide().insertAfter(element).on({
        change: function () {
          uploader.upload(this.files);
        },
        click: function (event) {
          event.stopPropagation();
        }
      });

      this.initTriggers();
      this.initDropzones();

      return [element, options];

    },

    getOptions: function (options) {
      return $.extend({}, $.fn.upload.defaults, this.$element.data(), options);
    },

    initTriggers: function () {
      $("[data-upload-trigger='" + this.options.uploadGroup + "']").on('click', $.proxy(function () {
        this.$fileinput.trigger('click.wh.upload');
      }, this));
    },

    initDropzones: function () {

      var dropzone = this.$dropzone = $("[data-upload-dropzone='" + this.options.uploadGroup + "']");

      if (!dropzone.length) {
        return;
      }

      var windowlayer = 0;

      // prevent miss-drops
      $(window).on({
        dragover: $.proxy(function (event) {
          event.preventDefault();
          this.$element.trigger('dragover.wh.upload');
        }, this),
        dragenter: $.proxy(function (event) {
          event.preventDefault();
          windowlayer++;
          if (windowlayer) {
            this.$element.trigger('dragenter.wh.upload');
          }
        }, this),
        dragleave: $.proxy(function (event) {
          event.preventDefault();
          windowlayer--;
          if (!windowlayer) {
            this.$element.trigger('dragleave.wh.upload');
          }
        }, this),
        drop: $.proxy(function (event) {
          event.preventDefault();
          windowlayer--;
          this.$element.trigger('dragdrop.wh.upload');
        }, this)
      });

      var dropzonelayer = 0;

      // Handle drag and drop from OS.
      dropzone.on({
        dragover: function (event) {
          event.preventDefault();
          event.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        },
        dragenter: $.proxy(function (event) {
          event.preventDefault();
          dropzonelayer++;
          if (dropzonelayer) {
            this.$element.trigger('dragenterdropzone.wh.upload');
          }
        }, this),
        dragleave: $.proxy(function (event) {
          event.preventDefault();
          dropzonelayer--;
          if (!dropzonelayer) {
            this.$element.trigger('dragleavedropzone.wh.upload');
          }
        }, this),
        drop: $.proxy(function (event) {
          event.preventDefault();
          dropzonelayer--;
          this.$element.trigger('dragdropdropzone.wh.upload');
          this.upload(event.originalEvent.dataTransfer.files);
        }, this)
      });

    },

    upload: function (files) {

      // var reader = new FileReader();
      var xhr  = new XMLHttpRequest(),
          data = new FormData();

      this.xhr = xhr;

      // var self = this;
      this.xhr.upload.addEventListener("progress", $.proxy(function (event) {
        if (event.lengthComputable) {
          this.$element.trigger('progress.wh.upload', Math.ceil((event.loaded * 100) / event.total));
        }
      }, this), false);

      this.xhr.upload.addEventListener("load", $.proxy(function () {
        this.$element.trigger('progress.wh.upload', 100);
        setTimeout($.proxy(function () {
          this.$element.trigger('load.wh.upload', JSON.parse(this.xhr.responseText));
        }, this));
      }, this), false);

      data.append('asset_type', this.options.uploadType);
      data.append('file', files[0]);

      // todo: extract CSRF stuff
      xhr.setRequestHeader("X-CSRFToken", csrftoken);

      xhr.open("POST", this.options.uploadUrl);
      xhr.send(data);

      this.createThumbnails(files, $.proxy(function (thumb) {
        this.$element.trigger('thumb.wh.upload', thumb);
      }, this));
    },

    createThumbnails: function (files, callback) {
      $.each(files, $.proxy(function (index, file) {
        var thumb = $('<img>').attr({
          src: (window.URL || window.webkitURL).createObjectURL(file)
        }).css({
          'max-width': this.options.thumbmax,
          'max-height': this.options.thumbmax
        });

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = function(evt) {
          try {
            var exif = new ExifReader(),
                orientation = 1;

            // Parse the Exif tags.
            exif.load(evt.target.result);
            orientation = exif.getTagValue('Orientation');

            switch (orientation) {
              case 3:
              case 4:
                thumb.addClass('rotate-180');
                break;
              case 5:
              case 6:
                thumb.addClass('rotate-90');
                break;
              case 7:
              case 8:
                thumb.addClass('rotate-270');
                break;
            }

            if ([2, 4, 5, 7].inArray(orientation)) {
              thumb.addClass('flip-h');
            }
          }
          catch (error) {
            window.console.log(error);
          }
          callback(thumb);
        };

        // Read in the image file as a data URL.
        reader.readAsArrayBuffer(file);
      }, this));
    }
  };

  /* UPLOAD PLUGIN DEFINITION
   * ======================== */

  $.fn.upload = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('upload'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('upload', (data = new Upload(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.upload.Constructor = Upload;

  $.fn.upload.defaults = {
    thumbmax: 100
  };

 /* UPLOAD DATA-API
  * =============== */

  $(window).on('load', function () {
    $('[data-upload]:input').each(function () {

      var $element = $(this),
          data     = $element.data();

      $element.upload(data);

    });
  });

}(window.jQuery));
