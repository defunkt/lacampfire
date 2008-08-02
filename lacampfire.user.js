// ==UserScript==
// @name          Logically awesome Campfire enhancements
// @namespace     http://logicalawesome.com/
// @description   Stuff we added that's cool.
// @author        Chris Wanstrath
// @homepage      http://github.com/
// @include       *.campfirenow.com/room*
// ==/UserScript==

function LALog(e) {
  new Insertion.Bottom('chat', "<tr><td colspan='2' style='color: red'>A Javascript Error Occurred in the campfire grease monkey script: " + e + "</td></tr>");
}

if (MessageTransformers) {
  MessageTransformers = {
    list: [ImageAutolink, YoutubeVideoAutolink, Autolink],
    
    applyFirst: function(text) {
      return MessageTransformers.list.returnFirstApplication(function(transformer) {
        return transformer.transform(text);
      });
    }
  };
  
  MessageTransformers.list.unshift({
    transform: function(text) {
      var matches = text.match(/^http:\/\/gist.github.com\/(\d+)$/);
      if (!matches) return;

      var iframe = '<iframe src="#{url}" width="100%" frameborder="0" style="border:0;padding:0;margin:0;"></iframe>';
      
      return iframe.interpolate({url: "http://gist.github.com/" + matches[1] + ".pibb"});
    }
  });
}

if (Campfire) {
  // tweetToTwicture
  Campfire.Speaker.Filters.push(function(value) {
    var matches = value.match(/^http:\/\/twitter.com\/.+?\/statuses\/(\d+)$/);
    return matches ? 'http://twictur.es/' + matches[1] + '.gif' : value;
  });
  
  window.chat['speaker'].filters = Campfire.Speaker.Filters.toArray();
}

if (Growler) {
  // remove the built-in growl stuff if a growl userscript is detected
  Campfire.Responders = Campfire.Responders.without('GrowlNotifier')
}