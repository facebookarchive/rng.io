test("requestFileSystem", function() {
  var requestFileSystem = H.API( window, "requestFileSystem", true );

  assert( requestFileSystem, "requestFileSystem supported" );
});
