test("Online Events, basic support", function() {
  assert( "onLine" in navigator, "navigator.onLine supported" );
  assert( "ononline" in document.body, "document.body.ononline supported" );
  assert( "onoffline" in document.body, "document.body.onoffline supported" );
});
