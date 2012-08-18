test("WebRTC getUserMedia", function() {
  var gUM = H.API( navigator, "getUserMedia", true );
  assert( gUM, "navigator.getUserMedia supported" );
});

// test("WebRTC getUserMedia practical", function() {
//   var gUM = H.API( navigator, "getUserMedia", true );

//   if ( !gUM ) {
//     assert( false, "navigator.getUserMedia not supported, skipping tests" );
//   }
//   else {
//     // practical testing
//     //
//   }

// });
