test("WebRTC getUserMedia", function() {
  var gUM = H.API( navigator, "getUserMedia", true );
  assert( gUM, "navigator.getUserMedia supported" );
});

test("WebRTC getUserMedia & createObjectURL", function() {
  var URL = H.API( window, URL, true );
  assert( URL, "URL.create supported" );
  assert( URL.createObjectURL, "" );
});

// TODO: translate platoon and dmv use cases into real functionality tests
