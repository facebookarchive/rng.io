asyncTest("Framerate for 100 sprites", function( async ) {
  var isCompleted = false,
      isDead = false;


  function ringTwoPerf( event ) {
    var data = JSON.parse( event.data );

    if ( data.avg && data.avg.fps && !isCompleted && !isDead ) {
      isCompleted = true;
      async.step(function() {

        assert(
          data.avg.fps >= 30,
          "Moving 100 sprites, with 10 frames each (" + data.avg.fps + ")"
        );

        // Shut off and remove this message event handler
        H.off( window, "message", ringTwoPerf );

        // Indicate test completion
        async.done();
      });
    }
    async.done();
  }

  H.on( window, "message", ringTwoPerf );

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      // Shut off and remove this message event handler
      // to prevent leaking test results
      H.off( window, "message", ringTwoPerf );

      async.step(function() {
        assert( false, "Browser failed to complete performance test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});
