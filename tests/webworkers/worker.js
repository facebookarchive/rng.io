importScripts( "worker-setup.js" );

var replies = {
  navigator: function() {
    var obj = {};

    [ "appName", "appVersion", "platform", "userAgent" ].forEach(function( prop ) {
      obj[ prop ] = navigator[ prop ];
    });
    return obj;
  },
  location: function() {
    var obj = {};

    [ "hash", "href", "host", "hostname", "pathname", "port", "protocol", "search" ].forEach(function( prop ) {
      obj[ prop ] = location[ prop ];
    });
    return obj;
  },
  worker: function() {
    var obj = {};

    [
      "addEventListener", "removeEventListener", "dispatchEvent",
      "importScripts", "close",
      "location", "navigator", "postMessage",
      "self"
    ].forEach(function( prop ) {
      obj[ prop ] = (prop in self);
    });
    return obj;
  },
  nesting: function() {
    return self.Worker;
  },
  messaging: function( args ) {
    var correct = true;

    args.forEach(function( arg, index ) {
      correct = JSON.stringify( arg ) === JSON.stringify( self.array[ index ] );
    });
    return correct ? self.data : "";
  }
};


self.addEventListener("message", function( event ) {
  var test = event.data.test,
      args = event.data.args;

  self.postMessage(
    test ?
    replies[ test ]( args ) :
    "pass"
  );
}, false);
