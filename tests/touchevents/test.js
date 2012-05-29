// test("Touch", function() {
//   var Touch = H.API( window, "Touch", true );

//   assert( !!Touch, "Touch supported" );
// });

test("TouchEvent", function() {
  var TouchEvent = H.API( window, "TouchEvent", true );

  assert( !!TouchEvent, "TouchEvent supported" );
});

// test("TouchList", function() {
//   var TouchList = H.API( window, "TouchList", true );

//   assert( !!TouchList, "TouchList supported" );
// });

// test("DocumentTouch", function() {
//   var DocumentTouch = H.API( window, "DocumentTouch", true );
//
//
//   assert( !!DocumentTouch );
// });

test("createTouch", function() {
  assert( "createTouch" in document, "createTouch supported" );
});


[ "touchstart", "touchend", "touchcancel", "touchmove"/*, "touchleave"*/ ].forEach(function( event ) {
  event = "on" + event;

  test("Touch Events: " + event, function() {
    assert( event in window, event + " supported" );
  });
});

// #444 Disable gesture event tests until further notice
// [ "gesturestart", "gestureend", "gesturechange" ].forEach(function( event ) {
//   event = "on" + event;

//   test("Gesture Events: " + event, function() {
//     assert( event in window, event + " supported" );
//   });
// });
