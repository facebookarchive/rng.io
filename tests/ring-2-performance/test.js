asyncTest("Framerate for 100 sprites", function( async ) {
  var completed = false,
      dead = false;

  window.onmessage = function( event ) {
    var data = JSON.parse( event.data );

    if ( data.avg && data.avg.fps && !completed && !dead ) {
      completed = true;
      async.step(function() {

        assert(
          data.avg.fps >= 30,
          "Moving 100 sprites, with 10 frames each (" + data.avg.fps + ")"
        );

        window.onmessage = null;
        async.done();
      });
    }
    async.done();
  };


  // Bailout
  setTimeout(function() {
    if ( !dead ) {
      async.step(function() {
        assert( false, "Browser failed to complete performance test in allotted time" );
        dead = true;
        async.done();
      });
    }
  }, 7000);
});
