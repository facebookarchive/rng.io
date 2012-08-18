test("Network Connection", function() {
  var connection = H.API( navigator, "connection", true );

  assert( connection, "navigator.connection supported" );
});

test("Network Connection bandwidth", function() {
  var connection = H.API( navigator, "connection", true );

  if ( !connection ) {
    assert( false, "navigator.connection not supported, skipping tests" );
  } else {
    assert( "bandwidth" in connection, "navigator.connection.bandwidth supported" );
  }
});

test("Network Connection metered", function() {
  var connection = H.API( navigator, "connection", true );

  if ( !connection ) {
    assert( false, "navigator.connection not supported, skipping tests" );
  } else {
    assert( "metered" in connection, "navigator.connection.metered supported" );
  }
});

test("Network Connection onchange", function() {
  var connection = H.API( navigator, "connection", true );

  if ( !connection ) {
    assert( false, "navigator.connection not supported, skipping tests" );
  } else {
    assert( "onchange" in connection, "navigator.connection.onchange supported" );
  }
});
