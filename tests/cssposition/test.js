asyncTest("CSS Fixed Position", function( async ) {
  window.onmessage = function( event )  {
    async.step(function() {
      assert( event.data, "Fixed Position supported" );
      window.onmessage = null;
      async.done();
    });
  };
});
