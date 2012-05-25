test("postMessage", function() {
  var postMessage = window.postMessage;

  assert( !!postMessage, "postMessage supported" );
});

test("onmessage", function() {
  assert( "onmessage" in window, "onmessage supported" );
});

asyncTest("postMessage/onmessage In Practice", function( async ) {
  window.onmessage = function( event ) {
    async.step(function() {
      assert( true, "onmessage event fired" );
      assert( event.data === "This is Ground Control", "message content matched expected" );
      async.done();
    });
  };

  window.postMessage( "This is Ground Control", "*" );
});
