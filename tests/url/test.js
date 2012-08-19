test("URL", function() {
  var URL = H.API( window, "URL", true );

  assert( URL, "URL.create supported" );
});

test("URL createObjectURL", function() {
  var URL = H.API( window, "URL", true ),
    createObjectURL;

  if ( URL === undefined ) {
    assert( false, "URL.createObjectURL not supported, skipping tests" );
  }
  else {
    createObjectURL = H.API( URL, "createObjectURL", true );
    assert( URL.createObjectURL, "URL.createObjectURL supported" );
  }
});
