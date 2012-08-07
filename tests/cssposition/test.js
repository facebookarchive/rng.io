asyncTest("CSS Fixed Position", function( async ) {

  function position( event ) {
    async.step(function() {
      assert( event.data, "Fixed Position supported" );
      H.off( window, "message", position );
      async.done();
    });
  }

  H.on( window, "message", position );

  // Ensure the iframe fixture is loaded _after_ the onmessage is attached
  document.getElementById("cssposition").src = "/tests/cssposition/iframe.html";

});
