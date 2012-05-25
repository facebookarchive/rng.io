test("Multi Touch Events in Practice", function( async ) {
  var TouchEvent = H.API( window, "TouchEvent", true ),
      event = {};

  if ( !TouchEvent ) {
    assert( false, "TouchEvent not supported, skipping tests" );
  } else {
    // WebKit has a TouchEvent constructor
    // Firefox has a TouchEvent prototype object (untouchable)

    // There seems to be no way to confirm the Firefox implements the required
    // properties without an actual event. This is incredibly frustrating
    if ( window.MozTouchEvent ) {
      // /^\[object (.*)\]$/.exec( TouchEvent.toString() )[ 1 ] == MozTouchEvent
      assert( true, "TouchEvent supported, cannot confirm implementation" );
    } else {
      try {
        event = document.createEvent("TouchEvent");
      } catch(e) {}


      assert( "touches" in event, "event.touches supported" );
      assert( "changedTouches" in event, "event.changedTouches supported" );
      assert( "targetTouches" in event, "event.targetTouches supported" );
    }
  }
});
