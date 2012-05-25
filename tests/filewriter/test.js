test("FileWriter", function() {
  var FileWriter = H.API( window, "FileWriter", true );

  assert( FileWriter, "FileWriter supported" );
});
