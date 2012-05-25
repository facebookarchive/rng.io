test("FileSaver", function() {
  var FileSaver = H.API( window, "FileSaver", true );

  assert( !!FileSaver, "FileSaver supported" );
});

test("FileSaver Events", function() {
  var FileSaver = H.API( window, "FileSaver", true ),
      saver;

  if ( !FileSaver ) {
    assert( false, "FileSaver not supported, skipping tests" );
  } else {
    saver = new FileSaver();

    [
      "onabort",
      "onerror",
      "onwrite",
      "onwriteend",
      "onwritestart",
      "onprogress"
    ].forEach(function( event ) {
      assert( event in saver, event + " supported" );
    });
  }
});

test("FileSaver API", function() {
  var FileSaver = H.API( window, "FileSaver", true );

  if ( !FileSaver ) {
    assert( false, "FileSaver not supported, skipping tests" );
  } else {
    [
      "write",
      "seek",
      "truncate"
    ].forEach(function( method ) {
      assert( method in FileSaver.prototype, method + " supported" );
    });
  }
});
