test("Network Information", function() {
  var connection = H.API( navigator, "connection", true );

  assert( connection, "navigator.connection supported" );
});

test("Network Information API", function() {
  var connection = H.API( navigator, "connection", true );

  if ( !connection ) {
    assert( false, "navigator.connection not supported, skipping tests" );
  } else {
    assert( "type" in connection, "navigator.connection.type supported" );
  }
});
