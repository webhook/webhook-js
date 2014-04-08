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

  var Uploader = function () {
    this.init.apply(this, arguments);
  };

  Uploader.prototype = {
    init: function (url, uploadSite, uploadToken, options) {
      this.url         = url;
      this.uploadSite  = uploadSite;
      this.uploadToken = uploadToken;
      this.options     = options;
    },

    upload: function (file) {
      if (typeof file === 'string') {
        return this.uploadUrl(file);
      } else {
        return this.uploadFile(file);
      }
    },

    uploadFile: function (file) {

      var data = new FormData();
      data.append('payload', file);
      data.append('site', this.uploadSite);
      data.append('token', this.uploadToken);

      if (this.options && this.options.data) {
        $.each(this.options.data, function (key, value) {
          data.append(key, value);
        });
      }

      var dfd = $.Deferred();

      $.ajax({

        // Upload progress
        xhr: function () {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (event) {
            if (event.lengthComputable) {
              dfd.notify(event);
            }
          }, false);
          return xhr;
        },

        url: this.url + 'upload-file/',
        type: 'post',
        data: data,
        dataType: 'json',
        contentType: false,
        processData: false
      }).done(function () {
        dfd.resolve.apply(this, arguments);
      }).fail(function () {
        dfd.reject.apply(this, arguments);
      }).always(function () {
        dfd.always.apply(this, arguments);
      });

      return dfd;

    },

    uploadUrl: function (url) {

      var data = {
        url  : url,
        site : this.uploadSite,
        token: this.uploadToken
      };

      if (this.options && this.options.data) {
        $.each(this.options.data, function (key, value) {
          data[key] = value;
        });
      }

      return $.ajax({
        url: this.url + 'upload-url/',
        type: 'post',
        data: data,
        dataType: 'json'
      });
    }
  };

  window.Webhook = window.Webhook || {};
  window.Webhook.Uploader = Uploader;

}(window.jQuery));
