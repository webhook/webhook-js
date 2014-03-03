/*
 * Webhook Upload
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 *
 */

(function ($) {

  "use strict";

  var Upload = function (element, options) {
    this.init(element, options);
  };

  Upload.prototype = {
    init: function (element, options) {

      this.$element = $(element);

      this.options = this._getOptions(options);

      this._initTriggers();

      return [element, options];

    },

    _getOptions: function (options) {
      return $.extend({}, $.fn.upload.defaults, this.$element.data(), options);
    },

    _initTriggers: function () {

      var uploader = this;

      // we need this for OS file selection
      this.$fileinput = $('<input type="file">').hide().appendTo('body').on({
        change: function () {
          uploader.upload(this.files[0]);
          $(this).replaceWith($(this).clone(true));
        },
        click: function (event) {
          event.stopPropagation();
        }
      });

      this.$element.on('click', $.proxy(this.selectFile, this));
    },

    selectFile: function () {
      this.$fileinput.trigger('click');
    },

    upload: function (file) {

      this.$element.trigger('start');

      if (!this.options.uploadUrl) {
        this.$element.trigger('error', 'No upload url specified.');
        this.$element.trigger('done');
        return;
      }

      if (typeof file === 'string') {
        this.uploadUrl(file);
      } else {
        this.uploadFile(file);
      }

    },

    uploadFile: function (file) {

      if (!file) {
        this.$element.trigger('error', 'No file selected.');
        this.$element.trigger('done');
        return;
      }

      if (file.type.match(/^image/)) {
        this.createThumbnail(file, $.proxy(function (thumb) {
          this.$element.trigger('thumb', thumb);
        }, this));
      }

      var data = new FormData();
      data.append('payload', file);
      data.append('site', this.options.uploadSite);
      data.append('token', this.options.uploadToken);

      var self = this;

      return $.ajax({

        // Upload progress
        xhr: function () {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (event) {
            if (event.lengthComputable) {
              self.$element.trigger('progress', Math.ceil((event.loaded * 100) / event.total));
            }
          }, false);
          return xhr;
        },

        url: this.options.uploadUrl + 'upload-file/',
        type: 'post',
        data: data,
        dataType: 'json',
        contentType: false,
        processData: false
      }).done(function (response) {
        self.$element.trigger('load', response);
      }).fail(function (response) {
        self.$element.trigger('error', response);
      }).always(function () {
        self.$element.trigger('done');
      });

    },

    uploadUrl: function (url) {

      if (!url) {
        this.$element.trigger('error', 'No URL given.');
        this.$element.trigger('done');
        return;
      }

      this.$element.trigger('progress', 100);

      var self = this;

      return $.ajax({
        url: this.options.uploadUrl + 'upload-url/',
        type: 'post',
        data: {
          url  : url,
          site : this.options.uploadSite,
          token: this.options.uploadToken
        },
        dataType: 'json'
      }).done(function (response) {
        self.$element.trigger('load', response);

        if (/\.(?:jpe?g|png|gif)$/.test(response.url)) {
          self.$element.trigger('thumb', $('<img>').attr('src', response.url));
        }

      }).fail(function (response) {
        self.$element.trigger('error', response);
      }).always(function () {
        self.$element.trigger('done');
      });

    },

    createThumbnail: function (file, callback) {

      var thumb = $('<img>').attr({
        src: (window.URL || window.webkitURL).createObjectURL(file)
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

          if ($.inArray(orientation, [2, 4, 5, 7]) >= 0) {
            thumb.addClass('flip-h');
          }
        }
        catch (error) {
          // Ignore for now
        }

        callback(thumb);
      };

      // Read in the image file as a data URL.
      reader.readAsArrayBuffer(file);

    }
  };

  /* UPLOAD PLUGIN DEFINITION
   * ======================== */

  $.fn.upload = function (option) {

    var uploadArguments = arguments;

    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('upload'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('upload', (data = new Upload(this, options)));
      }

      if (typeof option === 'string') {
        data[option].apply(data, Array.prototype.slice.call(uploadArguments, 1));
      }
    });

  };

  $.fn.upload.Constructor = Upload;

  $.fn.upload.defaults = {};

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
