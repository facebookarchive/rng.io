test("DeviceOrientationEvent", function() {
  assert( "DeviceOrientationEvent" in window, "DeviceOrientationEvent supported" );
});

test("DeviceMotionEvent", function() {
  assert( "DeviceMotionEvent" in window, "DeviceMotionEvent supported");
});

// test("DeviceOrientationEvent Object", function( async ) {
//   var DeviceOrientationEvent = H.API( window, "DeviceOrientationEvent", true ),
//       event;
//
//   if ( !DeviceOrientationEvent ) {
//     assert( false, "DeviceOrientationEvent not supported, skipping tests" );
//   } else {
//     // WebKit has a DeviceOrientationEvent constructor
//     // Firefox has a DeviceOrientationEvent prototype object
//     event = typeof DeviceOrientationEvent === "function" ?
//             document.createEvent("DeviceOrientationEvent") : DeviceOrientationEvent.prototype;
//
//     assert( "alpha" in event, "event.alpha supported" );
//     assert( "beta" in event, "event.beta supported" );
//     assert( "gamma" in event, "event.gamma supported" );
//   }
// });
//
//
// test("DeviceMotionEvent Object", function( async ) {
//   var DeviceMotionEvent = H.API( window, "DeviceMotionEvent", true ),
//       event;
//
//   if ( !DeviceMotionEvent ) {
//     assert( false, "DeviceMotionEvent not supported, skipping tests" );
//   } else {
//     // WebKit has a DeviceMotionEvent constructor
//     // Firefox has a DeviceMotionEvent prototype object
//     event = typeof DeviceMotionEvent === "function" ?
//             document.createEvent("DeviceMotionEvent") : DeviceMotionEvent.prototype;
//
//     assert( "acceleration" in event, "event.acceleration supported" );
//     assert( "accelerationIncludingGravity" in event, "event.accelerationIncludingGravity supported" );
//     assert( "rotationRate" in event, "event.rotationRate supported" );
//     assert( "interval" in event, "event.interval supported" );
//
//     assert( event.acceleration && "x" in event.acceleration, "event.acceleration.x supported" );
//     assert( event.acceleration && "y" in event.acceleration, "event.acceleration.y supported" );
//     assert( event.acceleration && "x" in event.acceleration, "event.acceleration.z supported" );
//
//     assert( event.rotationRate && "alpha" in event.rotationRate, "event.rotationRate.alpha supported" );
//     assert( event.rotationRate && "beta" in event.rotationRate, "event.rotationRate.beta supported" );
//     assert( event.rotationRate && "gamma" in event.rotationRate, "event.rotationRate.gamma supported" );
//   }
// });
//

// Simulated or Real DeviceOrientationEvent/DeviceMotionEvent will crash Android 4
// Way to go.

// asyncTest("DeviceOrientationEvent In Practice", function( async ) {
//   var iframe, timeout, handler;
//
//   if ( !H.isFunction( window.DeviceOrientationEvent ) ) {
//     assert( false, "DeviceOrientationEvent not supported, skipping tests" );
//     async.done();
//   } else {
//     iframe = document.createElement("iframe");
//     timeout = setTimeout(function() {
//       H.simulate( "devicemotion", iframe.contentWindow );
//     }, 2000);
//
//     iframe.src = "/tests/deviceorientation/iframe.html";
//
//     document.getElementById("deviceorientation").appendChild( iframe );
//
//     handler = function handler( event ) {
//       iframe.contentWindow.removeEventListener("deviceorientation", handler, false );
//       clearTimeout( timeout );
//       async.step(function() {
//         assert( !event.synthetic, "deviceorientation fired" );
//         assert( "alpha" in event, "alpha supported" );
//         assert( "beta" in event, "beta supported" );
//         assert( "gamma" in event, "gamma supported" );
//         // assert( "absolute" in event, "absolute supported" );
//         async.done();
//       });
//     };
//
//     iframe.contentWindow.addEventListener("deviceorientation", handler, false );
//   }
// });
//
// test("DeviceMotionEvent", function() {
//   assert( "DeviceMotionEvent" in window, "DeviceMotionEvent supported");
//   assert( H.isFunction( window.DeviceMotionEvent ), "DeviceMotionEvent is function" );
// });
//
// asyncTest("DeviceMotionEvent In Practice", function( async ) {
//   var timeout, handler;
//
//   if ( !H.isFunction( window.DeviceMotionEvent ) ) {
//     assert( false, "DeviceMotionEvent not supported, skipping tests" );
//     async.done();
//   } else {
//     timeout = setTimeout(function() {
//       H.simulate( "devicemotion", window );
//     }, 2000);
//
//     handler = function handler( event ) {
//       clearTimeout( timeout );
//       window.removeEventListener( "devicemotion", handler, false );
//       async.step(function() {
//         assert( !event.synthetic, "devicemotion fired" );
//
//         assert( "acceleration" in event, "acceleration supported" );
//         assert( "accelerationIncludingGravity" in event, "accelerationIncludingGravity supported" );
//         assert( "rotationRate" in event, "rotationRate supported" );
//         assert( "interval" in event, "interval supported" );
//
//         assert( event.acceleration && "x" in event.acceleration, "acceleration.x supported" );
//         assert( event.acceleration && "y" in event.acceleration, "acceleration.y supported" );
//         assert( event.acceleration && "x" in event.acceleration, "acceleration.z supported" );
//
//         assert( event.rotationRate && "alpha" in event.rotationRate, "rotationRate.alpha supported" );
//         assert( event.rotationRate && "beta" in event.rotationRate, "rotationRate.beta supported" );
//         assert( event.rotationRate && "gamma" in event.rotationRate, "rotationRate.gamma supported" );
//
//         async.done();
//       });
//     };
//     window.addEventListener( "devicemotion", handler, false );
//   }
// });
