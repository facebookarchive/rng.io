test("Vibration", function() {
  var vibrate = H.API( navigator, "vibrate", true );

  assert( vibrate, "vibrate supported" );
});
