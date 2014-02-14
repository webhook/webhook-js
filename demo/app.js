/* global $:false */
(function () {

  'use strict';

  // This is so I don't have to put these values in the repo
  ['uploadUrl', 'uploadSite', 'uploadToken'].forEach(function (option) {
    if (localStorage.getItem(option)) {
      $('#' + option).val(localStorage.getItem(option));
    }
    $('#' + option).on('change', function () {
      localStorage.setItem(option, $(this).val());
    });
  });

  var resetButton = function () {
    $(this)
      .removeClass('icon-desktop icon-arrow-down btn-success')
      .addClass('icon-image btn-neutral')
      .text(' Drag or select image');
  };

  $('[data-upload][data-dropzone]').on({
    dropzonewindowenter: function () {
      $(this)
        .removeClass('icon-image icon-desktop btn-neutral')
        .addClass('icon-arrow-down btn-success')
        .text(' Drop files here');
    },
    dropzonewindowdrop: resetButton,
    dropzonewindowleave: resetButton,
    drop: function (event) {
      $(this).upload('upload', event.originalEvent.dataTransfer.files[0]);
      resetButton.call(this);
    },
    error: function (event, response) {
      window.alert(response);
    },
    start: function () {
      $(this).data('upload').options.uploadUrl   = $('#uploadUrl').val();
      $(this).data('upload').options.uploadSite  = $('#uploadSite').val();
      $(this).data('upload').options.uploadToken = $('#uploadToken').val();
      $('.wy-form-upload-container').show();
      $('.wy-form-upload-url').hide();
      $(this).hide();
      $('.wy-form-upload .image-loading').css('display', 'inline-block');
      $('.wy-form-upload .image-loading span').html('Uploading <span>0%</span>');
    },
    thumb: function (event, thumb) {
      var widget = $('.wy-form-upload');
      widget.find('.wy-form-upload-image').remove();
      $('<div class="wy-form-upload-image">').append(thumb).prependTo(widget);
    },
    progress: function (event, percentage) {
      if (percentage < 100) {
        $('.wy-form-upload .image-loading span').html('Uploading <span>' + percentage + '%</span>');
      } else {
        $('.wy-form-upload .image-loading span').text('Finishing up...');
      }
    },
    load: function (event, response) {
      $(this).data('upload').$element.val(response.url);
    },
    done: function () {
      $('.wy-form-upload .image-loading').hide();
      $(this).show();
    },
    mouseenter: function () {
      $(this)
        .removeClass('icon-image icon-arrow-down btn-success')
        .addClass('icon-desktop btn-neutral')
        .text(' Select from desktop');
    },
    mouseleave: resetButton
  });

  $('.wy-form-upload-url .upload-url').on('click', function () {
    $('[data-upload]:input').upload('upload', $('.wy-form-upload-url input').val());
    $('.wy-form-upload-url input').val('');
  });

  $('.upload-method-toggle').on('click', function () {
    $('.wy-form-upload-container, .wy-form-upload-url').toggle();
  });

  $('.wy-alert[data-dropzone]').on('drop', function (event) {
    var files = event.originalEvent.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      $('<p>').appendTo(this).text(files[i].name);
    }
  });

})();
