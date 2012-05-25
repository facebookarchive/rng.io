test("ProgressEvent", function() {
  var ProgressEvent = H.API( window, "ProgressEvent", true );

  assert( ProgressEvent, "A ProgressEvent constructor supported" );
});

asyncTest("ProgressEvent in Practice", function( async ) {
  var ProgressEvent = H.API( window, "ProgressEvent", true ),
      xhr = new XMLHttpRequest();

  if ( !ProgressEvent ) {
    assert( false, "ProgressEvent is not supported, skipping tests" );
    async.done();
  } else {
    xhr.open( "GET", "/tests/_server/echo.php", true );

    xhr.onload = function( event ) {
      if ( this.status === 200 ) {

        async.step(function() {
          // Instance confirmation
          assert( event instanceof ProgressEvent, "XHR onload callback event argument is instanceof ProgressEvent" );

          // Property confirmation
          assert( "lengthComputable" in event, "event.lengthComputable supported" );
          assert( "loaded" in event, "event.loaded supported" );
          assert( "total" in event, "event.total supported" );

          // Property value/type confirmation
          assert( typeof event.lengthComputable === "boolean", "event.lengthComputable is boolean" );
          assert( typeof event.loaded === "number", "event.loaded is number" );
          assert( typeof event.total === "number", "event.total is number" );

          async.done();
        });
      }
    };
    xhr.send();
  }
});
