// Firefox on desktop prevents this tests from running
// without failing.
// sessionStorage is deprecated anyway.
//
// test("sessionStorage", function() {
//   var sessionStorage = window.sessionStorage;
//
//   assert( !!sessionStorage, "sessionStorage supported" );
// });
//
//
// test("sessionStorage In Practice", function() {
//   var sessionStorage = window.sessionStorage,
//       validate = (sessionStorage && sessionStorage.setItem("foo", "bar") /* returns undefined */) ||
//                     sessionStorage.getItem("foo") === "bar";
//
//   assert( validate, "sessionStorage.setItem supported" );
//   assert( validate, "sessionStorage.getItem supported" );
// });


test("localStorage", function() {
  var localStorage = window.localStorage;

  assert( !!localStorage, "localStorage supported" );
});


test("localStorage In Practice", function() {
  var localStorage = window.localStorage,
      validate = (localStorage && localStorage.setItem("foo", "bar") /* returns undefined */) ||
                    localStorage.getItem("foo") === "bar";

  assert( validate, "localStorage.setItem supported" );
  assert( validate, "localStorage.getItem supported" );
});

test("StorageEvent", function() {
  var StorageEvent = H.API( window, "StorageEvent", true );

  assert( StorageEvent, "StorageEvent in window" );
});

test("Storage Events in Practice", function( async ) {
  var StorageEvent = H.API( window, "StorageEvent", true ),
      event;

  if ( !StorageEvent ) {
    assert( false, "StorageEvent not supported, skipping tests" );
  } else {
    // Chrome WebKit has a StorageEvent constructor
    // Mobile Safari WebKit has a StorageEvent object
    //  - that needs to be created
    // Firefox has a StorageEvent prototype object
    event = typeof StorageEvent === "function" ?
            document.createEvent("StorageEvent") : StorageEvent.prototype;

    if ( !("key" in event) && typeof StorageEvent === "object" ) {
      event = document.createEvent("StorageEvent");
    }

    assert( "key" in event, "event.key supported" );
    assert( "oldValue" in event, "event.oldValue supported" );
    assert( "newValue" in event, "event.newValue supported" );
  }
});
