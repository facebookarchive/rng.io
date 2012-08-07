test("HashChangeEvent", function() {
  var HashChangeEvent = window.HashChangeEvent;

  assert( !!HashChangeEvent, "HashChangeEvent supported" );
});

test("onhashchange", function() {
  assert( "onhashchange" in window, "onhashchange exists in some form" );
  assert( window.onhashchange == null, "onhashchange is TreatNonCallableAsNull" );
});

// test("HashChangeEvent in Practice", function( async ) {
//   var HashChangeEvent = window.HashChangeEvent,
//       event;
//
//   if ( !HashChangeEvent ) {
//     assert( false, "HashChangeEvent is not implemented" );
//   } else {
//     event = typeof HashChangeEvent === "function" ?
//             document.createEvent("HashChangeEvent") : HashChangeEvent;
//
//     assert( "oldURL" in event, "event.oldURL supported" );
//     assert( "newURL" in event, "event.newURL supported" );
//   }
// });

asyncTest("onhashchange In Practice", function( async ) {
  var iframe = document.getElementById("hashchange").contentWindow,
      isDead = false;

  iframe.onhashchange = function( event ) {
    if ( !isDead ) {
      async.step(function() {
        assert( true, "onhashchange event fired" );
        isDead = true;
        iframe.onhashchange = null;
        async.done();
      });
    }
  };

  // Pre
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "onhashchange event did not fire" );
        isDead = true;
        async.done();
      });
    }
  }, 1000);
});
