/*
 * Webhook Autocomplete
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

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
