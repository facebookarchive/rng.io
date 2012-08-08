test("WebRTC getUserMedia", function() {
  var gUM = H.API( navigator, "getUserMedia", true );
  assert( gUM, "navigator.getUserMedia supported" );
});

test("WebRTC getUserMedia & createObjectURL", function() {
  var URL = H.API( window, "URL", true ),
    createObjectURL = H.API( URL, "createObjectURL", true );

  assert( URL, "URL.create supported" );
  assert( URL.createObjectURL, "URL.createObjectURL supported" );
});

// TODO: translate platoon and dmv use cases into real functionality tests
