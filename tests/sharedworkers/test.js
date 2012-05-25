test("Shared Web Workers", function() {
  var SharedWorker = H.API( window, "SharedWorker", true ),
      shared;

  if ( !SharedWorker ) {
    assert( false, "SharedWorker not supported, skipping tests" );
  } else {
    shared = new SharedWorker("/tests/webworkers/worker.js");
    assert( !!SharedWorker, "SharedWorker supported" );
    assert( shared instanceof SharedWorker, "shared instanceof SharedWorker" );
  }
});
