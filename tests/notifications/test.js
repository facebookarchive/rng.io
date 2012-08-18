test("Notifications", function() {
  var Notification = H.API( window, "Notification", true );

  // If no standard, check for previous implementations
  Notification = Notification || H.API( window, "notifications", true );
  assert( Notification, "Notification supported" );
});


//
// Omitted.
//
// test("Notifications API", function() {
//   var Notification = H.API( window, "Notification", true ),
//       notification;

//   if ( !Notification ) {
//     assert( false, "Notifications not supported, skipping tests" );
//   } else {
//     notification = new Notification();

//     [
//       "createHTMLNotification",
//       "checkPermission",
//       "createNotification",
//       "requestPermission"
//     ].forEach(function( prop ) {
//       assert( method in notification, method + " is supported" );
//     });
//   }
// });

// test("Notifications checkPermission", function() {
//   var Notifications = H.API( window, "notifications", true );

//   if ( !Notifications ) {
//     assert( false, "Notifications not supported, skipping tests" );
//   } else {

//     // PERMISSION_ALLOWED = 0;
//     // PERMISSION_NOT_ALLOWED = 1;
//     // PERMISSION_DENIED = 2;

//     assert( Notifications.checkPermission() === 1, "Initial permission not allowed" );
//   }
// });
