test("Notifications", function() {
  var Notifications = H.API( window, "notifications", true );

  assert( Notifications, "Notifications supported" );
});

test("Notifications API", function() {
  var Notifications = H.API( window, "notifications", true );

  if ( !Notifications ) {
    assert( false, "Notifications not supported, skipping tests" );
  } else {

    [
      "createHTMLNotification",
      "checkPermission",
      "createNotification",
      "requestPermission"
    ].forEach(function( method ) {
      assert( method in Notifications, method + " is supported" );
    });
  }
});

test("Notifications checkPermission", function() {
  var Notifications = H.API( window, "notifications", true );

  if ( !Notifications ) {
    assert( false, "Notifications not supported, skipping tests" );
  } else {

    // PERMISSION_ALLOWED = 0;
    // PERMISSION_NOT_ALLOWED = 1;
    // PERMISSION_DENIED = 2;

    assert( Notifications.checkPermission() === 1, "Initial permission not allowed" );
  }
});
