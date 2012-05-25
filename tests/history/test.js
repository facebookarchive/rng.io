test("history", function() {
  var history = window.history;
  assert( !!history, "history supported" );
});

test("history.pushState", function() {
  var history = window.history;
  assert( !!history.pushState, "history.pushState supported" );
  assert( typeof history.pushState === "function", "history.pushState is a function" );
});

test("history.replaceState", function() {
  var history = window.history;
  assert( typeof history.replaceState === "function", "history.replaceState is a function" );
});

test("history PopStateEvent", function() {
  var PopStateEvent = window.PopStateEvent,
      event;

  if ( !PopStateEvent ) {
    assert( false, "PopStateEvent not supported, skipping tests" );
  } else {
    event = document.createEvent("PopStateEvent");
    assert( "state" in event, "event.state supported" );
  }
});

// TODO: Move this to run in a pop-up window
// asyncTest("history In Practice", function( async ) {
//   var history = window.history;
//
//   window.onpopstate = function( event ) {
//
//     async.step(function() {
//
//       assert( !!event.state.a, "event.state is as we expected" );
//
//       // Restore
//       history.replaceState({ spec: "history" }, "Spec", "" );
//
//       async.done();
//     });
//     window.onpopstate = null;
//   };
//
//   history.pushState({ a: "alpha" }, "Alpha", "?" + (new Date()).getTime() );
//   history.pushState({ b: "beta" }, "Beta" );
//   // This will push back to "alpha"
//   history.back();
// });
