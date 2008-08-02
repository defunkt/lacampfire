// ==UserScript==
// @name          Logically awesome Campfire enhancements
// @namespace     http://logicalawesome.com/
// @description   Stuff we added that's cool.
// @author        Chris Wanstrath
// @homepage      http://github.com/
// @include       *.campfirenow.com/room*
// ==/UserScript==

// Logical and awesome
LA = {}

////
// Aliases - whatever is typed is expanded to something else
LA.Aliases = []

// tweet status url => twicture.gif
LA.Aliases.push(function(text) {
  var matches = text.match(/^http:\/\/twitter.com\/.+?\/statuses\/(\d+)$/)
  return matches ? 'http://twictur.es/' + matches[1] + '.gif' : text
})

////
// Transforms - plaintext stored in campfire's db is expanded on
//              receipt or load into something else
LA.Transformers = []

// gist url => gist embed
LA.Transformers.push(function(text) {
  var matches = text.match(/^http:\/\/gist.github.com\/(\d+)$/);
  if (!matches) return;

  var url   = "http://gist.github.com/" + matches[1] + ".pibb";
  var divId = 'gist-div-' + (new Date).valueOf()
  
  var iframe = new Element('iframe', { 
    src: url, 
    height: "200px",
    width: "100%",
    style: 'border:0;padding:0;margin:0;display:none;',
    onload: 'LA.gistFromIframe(this, "' + divId + '")'
  })  
  
  var div = new Element('div', { id: divId }).update('Loading Gist ' + matches[1] + '...')
  
  return new Element('div').insert(div).insert(iframe)
})

LA.gistFromIframe = function(iframe, id) {
  $(id).remove()
  $(iframe).show()
}

if (Campfire) {  
  ////
  // Plumbing for the alises
  chat.speaker.filters = LA.Aliases.concat(Campfire.Speaker.Filters).toArray();  
  
  ////
  // Plumbing for the transforms
  LA.Transform = function(messages) {
    $A(messages || chat.transcript.messages).each(function(message) {
      if (message.kind != "text") return
      var text = message.bodyElement().innerText

      var newText = LA.Transformers.returnFirstApplication(function(transformer) {
        return transformer(text)
      })

      if (newText) {
        message.updateBody(newText)
        if (messages) chat.windowmanager.scrollToBottom()      
      }
    }) 
  }
  
  // hook into campfire receive event - called by foreign and local message inserts
  Campfire.Transformer = Class.create()
  Campfire.Transformer.prototype = {
    initialize: function() {},
    onMessagesInserted: LA.Transform
  }
  
  Campfire.Responders.push("Transformer")
  chat.register.apply(chat, Campfire.Responders)
  
  // run transforms on load
  LA.Transform()
  chat.windowmanager.scrollToBottom()
}

if (Growler) {
  // remove the built-in growl stuff if a growl userscript is detected
  delete chat.growlnotifier
}

// debug
function LALog(e) {
  new Insertion.Bottom('chat', "<tr><td colspan='2' style='color: red'>" + e + "</td></tr>");
}
