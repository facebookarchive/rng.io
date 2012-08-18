test("URL", function() {
  var URL = H.API( window, "URL", true );

  assert( URL, "URL.create supported" );
});

test("URL createObjectURL", function() {
  var URL = H.API( window, "URL", true ),
    createObjectURL = H.API( URL, "createObjectURL", true );

  assert( URL.createObjectURL, "URL.createObjectURL supported" );
});
