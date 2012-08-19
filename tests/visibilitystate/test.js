test("visibilityState", function() {
  var visibilityState = H.API( document, "visibilityState", true );

  assert( visibilityState, "visibilityState supported" );
});

test("visibilityState visible", function() {
  var visibilityState = H.API( document, "visibilityState", true );

  if ( !visibilityState ) {
    assert( false, "visibilityState not supported, skipping tests" );
  } else {
    assert( visibilityState === "visible", "document is visible" );
  }
});



test("visibilityState hidden", function() {
  // Look in document, for "hidden", allow prefixes, the value will be false
  var hidden = H.API( document, "hidden", true, false );

  // hidden can correctly be true or false
  assert( hidden !== undefined, "hidden supported" );
});



//document.addEventListener("mozvisibilitychange", console.log, false);
//
// asyncTest("Spec Async Test", function( async ) {
//   // asyncTest callback receives "async" object as first argument
//
//
//   // async object
//   // @instance
//   // @type Object
//
//   // step
//   // @method
//   // @memberOf async
//   // @param callback function, wraps async assertions.
//
//   async.step(function() {
//
//     // Assertions
//     assert( true, "This thing is true" );
//
//
//   // done
//   // @method
//   // @memberOf async
//   // @param indicate async test is complete.
//
//     async.done();
//   });
// });
