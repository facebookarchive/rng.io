test("postMessage", function() {
  var postMessage = window.postMessage;

  assert( !!postMessage, "postMessage supported" );
});

test("onmessage", function() {
  assert( "onmessage" in window, "onmessage supported" );
});

asyncTest("postMessage/onmessage In Practice", function( async ) {
  // This use of window.onmessage is intentional and must remain intact
  window.onmessage = function( event ) {
    async.step(function() {
      assert( true, "onmessage event fired" );
      assert( event.data === "This is Ground Control", "message content matched expected" );

      window.onmessage = null;
      async.done();
    });
  };

  window.postMessage( "This is Ground Control", "*" );
});
