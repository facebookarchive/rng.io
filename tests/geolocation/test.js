test("Geolocation exists", function() {
  var geolocation = H.API( navigator, "geolocation", true );

  assert( navigator.geolocation, "navigator.geolocation supported" );
});

test("Geolocation getCurrentPosition exists and is a function", function() {
  var geolocation = H.API( navigator, "geolocation", true ),
      getCurrentPosition;

  if ( !geolocation ) {
    assert( false, "geolocation not supported, skipping tests." );
  }
  else {
    getCurrentPosition = H.API( navigator, "getCurrentPosition", true );

    assert( getCurrentPosition, "getCurrentPosition supported" );
  }
});

test("Geolocation watchPosition exists and is a function", function() {
  var geolocation = H.API( navigator, "geolocation", true ),
      watchPosition;

  if ( !geolocation ) {
    assert( false, "geolocation not supported, skipping tests." );
  }
  else {
    watchPosition = H.API( navigator, "watchPosition", true );

    assert( watchPosition, "watchPosition supported" );
  }
});

test("Geolocation clearWatch exists and is a function", function() {
  var geolocation = H.API( navigator, "geolocation", true ),
      clearWatch;

  if ( !geolocation ) {
    assert( false, "geolocation not supported, skipping tests." );
  }
  else {
    clearWatch = H.API( navigator, "clearWatch", true );

    assert( clearWatch, "clearWatch supported" );
  }
});
