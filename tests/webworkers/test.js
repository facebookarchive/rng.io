// TODO: transferable objects

test("Web Workers", function() {
  var Worker = H.API( window, "Worker", true );

  assert( !!Worker, "Worker supported" );
});

asyncTest("Web Worker navigator", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      worker;


  if ( !Worker ) {
    assert( false, "Workers not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");

    worker.postMessage({
      test: "navigator"
    });

    worker.onmessage = function( event ) {
      async.step(function() {
        var data = event.data,
            pass = false;

        pass = [ "appName", "appVersion", "platform", "userAgent" ].every(function( key ) {
          assert( data[ key ] === navigator[ key ], data[ key ] + " === " + navigator[ key ] );
          return data[ key ] === navigator[ key ];
        });

        assert( pass, "Worker correctly implements navigator" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});

asyncTest("Web Worker location", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      worker;


  if ( !Worker ) {
    assert( false, "Workers not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");


    worker.postMessage({
      test: "location"
    });

    worker.onmessage = function( event ) {
      async.step(function() {
        var data = event.data,
            pass = false;

        pass = Object.keys( data ).every(function( key ) {

          assert( key in location, key + " in location" );
          return key in location;
        });

        assert( pass, "Worker implements location" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});

asyncTest("Web Worker global", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      worker;


  if ( !Worker ) {
    assert( false, "Workers not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");

    worker.postMessage({
      test: "worker"
    });

    worker.onmessage = function( event ) {
      async.step(function() {
        var data = event.data,
            pass = false;

        pass = Object.keys( data ).every(function( key ) {

          assert( key, "WorkerGlobalScope implements " + key );
          return data[ key ];
        });

        assert( pass, "Worker implements global properties" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});

asyncTest("Web Worker data messaging", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      prop, array, data, worker;


  if ( !Worker ) {
    assert( false, "Workers not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");
    array = [];
    data = {
      objectA: {
        a: 1,
        b: null,
        c: [{}],
        d: {
          a: 3.14159,
          b: false,
          c: {
            d: 0,
            f: [[[]]],
            g: {
              j: {
                k: {
                  n: {
                    r: "r",
                    s: [1, 2, 3],
                    u: 0,
                    v: {
                      w: {
                        x: {
                          y: "Yahoo!",
                          z: null
                        }
                      }
                    }
                  },
                  o: 99,
                  q: []
                },
                m: null
              }
            },
            h: "false",
            i: true
          }
        },
        e: String("constructed string"),
        f: {},
        g: "",
        h: "h",
        i: []
      },
      array: [ 1, 2, 3, 4, 5, 6, 7, 8, 9,  [
            1, 2, 3, 4, 5, 6, 7, 8, 9,  [
              1, 2, 3, 4, 5, [
                [6, 7, 8, 9,  [
                  [
                    1, 2, 3, 4, [
                      2, 3, 4, [
                        1, 2, [
                          1, 2, 3, 4, [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, [ 0 ], 1, 2, 3, 4, 5, 6, 7, 8, 9
                          ], 5, 6, 7, 8, 9
                        ], 4, 5, 6, 7, 8, 9
                      ], 5, 6, 7, 8, 9
                    ], 5, 6, 7
                  ]
                ]
              ]
            ]
          ]
        ]
      ],
      string: "this is a standard string",
      bool: true,
      loc: {},
      ua: navigator.userAgent
    };

    for ( prop in data ) {
      array.push( data[ prop ] );
    }

    worker.postMessage({
      test: "messaging",
      args: array
    });

    worker.onmessage = function( event ) {
      async.step(function() {

        assert( JSON.stringify(event.data) === JSON.stringify(data), "Worker supports complex data objects" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});


asyncTest("Web Worker Blob URL", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      URL = H.API( window, "URL", true ),
      Blob = H.API( window, "Blob", true ),
      worker, blob;


  if ( !Worker || !Blob ) {
    assert( false, "Workers or Blob not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");
    blob = new Blob([ "onmessage = function( event ) { postMessage( event.data ) };" ], { type: "text\/plain" });


    worker = new Worker(
      URL.createObjectURL( blob )
    );

    worker.postMessage("The Blob!");

    worker.onmessage = function( event ) {
      async.step(function() {
        assert( event.data === "The Blob!", "Blob Web Worker" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});


// asyncTest("Web Worker Data URL", function( async ) {
//
//   var source = [
//         "data:text/javascript;base64,",
//         window.btoa("onmessage = function( event ) { postMessage( event.data ) };")
//       ].join(""),
//       worker = new Worker(source);
//
//   worker.postMessage("The Data!");
//
//   worker.onmessage = function( event ) {
//     async.step(function() {
//       assert( event.data === "The Data!", "Data Web Worker" );
//
//       async.done();
//
//       worker.terminate();
//       worker = null;
//     });
//   };
// });
