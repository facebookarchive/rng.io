asyncTest("Framerate for 10 sprites", function( async ) {


  var completed = false;

  window.onmessage = function( event ) {
    var data = JSON.parse( event.data );

    if ( data.avg && data.avg.fps && !completed ) {
      completed = true;
      async.step(function() {

        assert(
          data.avg.fps >= 30,
          "Moving 10 sprites, with 10 frames each (" + data.avg.fps + ")"
        );

        window.onmessage = null;
        async.done();
      });
    }
    async.done();
  };
});
