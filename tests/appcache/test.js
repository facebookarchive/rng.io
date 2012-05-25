test("applicationCache (Offline Support)", function() {
  var applicationCache = H.API( window, "applicationCache", true );

  assert( applicationCache, "applicationCache supported" );
});

// oncached: null
// onchecking: null
// ondownloading: null
// onerror: null
// onnoupdate: null
// onobsolete: null
// onprogress: null
// onupdateready: null
// status: 0


// asyncTest("applicationCache In Practice", function( async ) {
//   var iframe = document.getElementById("appcache").contentWindow,
//       appcache = iframe.applicationCache,
//       // TODO: Refactor this to be used with any cookie key=value
//       setCookie = function( time ) {
//         document.cookie = "online=true; expires=" + ((new Date()).getTime() + time);
//       };
//
//   // Set a cookie to be read by example.appcache.php,
//   // this is _required_ to work around issues with the
//   // applicationCache spec behaviour where it caches the
//   // first time, but will not re-read the cache unless
//   // otherwise told to do so. Normally, this might involve
//   // manually clearing the application cache - such facilities
//   // are available in limited access forms,
//   // eg. chrome://appcache-internals/
//   //
//   // In order to artificially cause an update to occur, we can
//   // set a cookie here, that will be read by example.appcache.php
//   // and respond with a HTTP 410
//   // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.11
//   // ... this will effectively "trick" the applicationCache API
//   // into believing the manifest is gone, causing the "checking"
//   // process to be re-run.
//   setCookie( 2600 );
//
//   setTimeout(function ready() {
//     if ( appcache.status > 0 ) {
//
//       assert( !!appcache.status, "appcache.status" );
//
//       async.done();
//
//       // Expire the cookie to enusre the test is run correctly,
//       // without interference from applicationCache, every time.
//       setCookie( -2600 );
//
//     } else {
//       setTimeout( ready, 10 );
//     }
//   }, 10);
// });
