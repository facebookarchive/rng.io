test("FileReader", function() {
  var FileReader = H.API( window, "FileReader", true );

  assert( FileReader, "FileReader supported" );
});

test("FileReader Events", function() {
  var FileReader = H.API( window, "FileReader", true ),
      reader;

  if ( !FileReader ) {
    assert( false, "FileReader not supported, skipping tests" );
  } else {
    reader = new FileReader();

    [
      "onabort",
      "onerror",
      "onload",
      "onloadend",
      "onloadstart",
      "onprogress"
    ].forEach(function( event ) {
      assert( event in reader, event + " supported" );
    });

  }
});

test("FileReader API", function() {
  var FileReader = H.API( window, "FileReader", true ),
      reader;

  if ( !FileReader ) {
    assert( false, "FileReader not supported, skipping tests" );
  } else {
    reader = new FileReader();

    [
      "readAsText",
      "readAsDataURL",
      "readAsArrayBuffer"
    ].forEach(function( method ) {
      assert( method in reader, method + " supported" );
    });
  }
});
