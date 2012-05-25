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
      dead = false;

  iframe.onhashchange = function( event ) {
    if ( !dead ) {
      async.step(function() {
        assert( true, "onhashchange event fired" );
        dead = true;
        async.done();
      });
    }
  };

  setTimeout(function() {
    if ( !dead ) {
      async.step(function() {
        assert( false, "onhashchange event did not fire" );
        dead = true;
        async.done();
      });
    }
  }, 1000);
});
