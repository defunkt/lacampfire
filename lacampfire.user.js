// ==UserScript==
// @name          Logically awesome Campfire enhancements
// @namespace     http://logicalawesome.com/
// @description   Stuff we added that's cool.
// @author        Chris Wanstrath
// @homepage      http://github.com/
// @include       *.campfirenow.com/room*
// ==/UserScript==

if ('Campfire' in window) {
  (function() {
    Campfire.Speaker.prototype.send = function(forcePaste) {  
      var value = $F(this.input);
      if (value.blank()) return;
      var pasting = forcePaste || value.match(/\r|\n/);
      value = tweetToTwicture(value) || value;
      this.speak(value, pasting);
      this.input.value = '';
    }
    
    function tweetToTwicture(value) {
      var matches = value.match(/^http:\/\/twitter.com\/(.+?)\/statuses\/(\d+)$/);
      return matches ? "http://twictur.es/" + matches[2] + ".gif" : null;
    }
  })();
}