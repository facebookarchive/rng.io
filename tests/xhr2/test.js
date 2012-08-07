test("XHR2", function() {
  var xhr = new XMLHttpRequest();

  // Property confirmation
  assert( "upload" in xhr, "xhr.upload is supported" );
});

test("XHR2 Prerequisite: ArrayBuffer", function() {
  var ArrayBuffer = H.API( window, "ArrayBuffer", true );

  assert( ArrayBuffer, "ArrayBuffer supported" );
});

test("XHR2 Prerequisite: Blob", function() {
  var Blob = H.API( window, "Blob", true );

  assert( Blob, "Blob supported" );
});

test("XHR2 Prerequisite: URL", function() {
  var URL = H.API( window, "URL", true );

  assert( !!URL, "URL supported" );
});
//
test("XHR2 Upload", function() {
  var xhr = new XMLHttpRequest();

  if ( !xhr.upload ) {
    assert( false, "xhr.upload not supported, skipping tests" );
  } else {
    [ "onabort", "onerror", "onload", "onloadstart", "onprogress" ].forEach(function( handler ) {

      // Property confirmation
      assert( handler in xhr.upload, "xhr.upload." + handler + " supported" );

      // Property value/type confirmation
      assert( xhr.upload[ handler ] == null, "xhr.upload." + handler + " is TreatNonCallableAsNull" );
    });
  }
});

// TEMPORARY BLOCK - Causing deadstop in Android 4, WebKit
// asyncTest("XHR2 Upload In Practice", function( async ) {
//   var Blob = H.API( window, "Blob", true ),
//       xhr = new XMLHttpRequest(),
//       builder, size;
//
//
//   if ( !Blob ) {
//     assert( false, "Blob not supported, skipping tests" );
//     async.done();
//   } else {
//     builder = new Blob();
//     builder.append("The Future is Cool");
//
//     size = builder.getBlob().size;
//
//     xhr.open( "POST", "/tests/_server/echo.php", true );
//
//     // Firefox Mobile never returns on this?
//     xhr.upload.onprogress = function( event ) {
//       if ( event.lengthComputable ) {
//         async.step(function() {
//           assert( event.total === size, "event.total matches expected size" );
//           async.done();
//         });
//       }
//     };
//
//     // Firefox Mobile will return on this
//     xhr.onload = function( event ) {
//       if ( event.lengthComputable ) {
//         async.step(function() {
//           assert( event.total === size, "event.total matches expected size" );
//           async.done();
//         });
//       }
//     };
//
//     xhr.send( builder.getBlob("text/plain") );
//   }
// });


asyncTest("XHR2 ArrayBuffer Response Type", function( async ) {
  var Blob = H.API( window, "Blob", true ),
      xhr = new XMLHttpRequest(),
      isDead = false;

  if ( !Blob ) {
    assert( false, "Blob not supported, skipping tests" );
    isDead = true;
    async.done();
  } else {

    xhr.open( "GET", "/tests/xhr2/png.png", true );
    xhr.responseType = "arraybuffer";

    xhr.onload = function( event ) {
      var blob,
          data = this;

      if ( !isDead && data.status === 200 ) {

        // WARNING: Without these "step" calls,
        // testharness.js will lose track of async assertions
        async.step(function() {
          // Instance confirmation
          assert( data.response instanceof ArrayBuffer, "ArrayBuffer data.response supported" );

          // Property confirmation
          assert( "byteLength" in data.response, "data.response.byteLength supported" );

          // Property value/type confirmation
          assert( typeof data.response.byteLength === "number", "data.response.byteLength is number" );


          if ( !Blob ) {
            assert( false, "Blob not supported, skipping tests" );
            async.done();
          } else {

            blob = new Blob([ data.response ], { type: "image\/png" });


            // Instance confirmation
            assert( blob instanceof Blob, "blob is an instance of Blob" );

            // Property confirmation
            assert( "size" in blob, "blob.size supported" );
            assert( "type" in blob, "blob.type supported" );

            // Property value/type confirmation
            assert( typeof blob.size === "number", "typeof blob.size is number" );
            assert( blob.size === 23115, "blob.size of fixture png.png is 23115" );

            assert( typeof blob.type === "string", "typeof blob.type is string" );
            assert( blob.type === "image/png", "blob.type of fixture png.png is image/png" );

            // Miscellaneous Confirmation
            assert( {}.toString.call(blob) === "[object Blob]", "Correct Blob type" );

            isDead = true;
            // Finalize async test
            async.done();
          }
        });
      }
    };
    xhr.send();
  }

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "Browser ArrayBuffer Response test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});

asyncTest("XHR2 Text Send/Response Type", function( async ) {
  var xhr = new XMLHttpRequest(),
      isDead = false;

  if ( !("responseType" in xhr) ) {
    assert( false, "xhr.responseType not supported, skipping tests" );
    isDead = true;
    async.done();
  } else {
    xhr.open( "POST", "/tests/_server/data.php", true );
    xhr.responseType = "text";

    xhr.onload = function( event ) {
      var data = this;

      if ( !isDead && data.status === 200 ) {
        async.step(function() {

          assert( typeof data.response === "string", "Text Response supported (strings)" );

          isDead = true;
          async.done();
        });
      }
    };
    xhr.send("Just a string");
  }

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "Browser Text Response test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});

asyncTest("XHR2 Blob Response Type", function( async ) {
  var Blob = H.API( window, "Blob", true ),
      URL = H.API( window, "URL", true ),
      xhr = new XMLHttpRequest(),
      isDead = false;

  if ( !Blob ) {
    assert( false, "Blob not supported, skipping tests" );
    isDead = true;
    async.done();
  } else {

    xhr.open( "GET", "/tests/xhr2/png.png", true );
    xhr.responseType = "blob";

    xhr.onload = function( event ) {
      var data = this;

      if ( !isDead && data.status === 200 ) {
        async.step(function() {

          // console.log( data.response );
          // CURRENTLY UNSUPPORTED IN WEBKIT/CHROME
          // console.log( URL.createObjectURL(data.response) );

          assert( data.response instanceof Blob, "Blob Response supported (images)" );

          isDead = true;
          async.done();
        });
      }
    };
    xhr.send();
  }

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "Browser Blob Response test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});

asyncTest("XHR2 Document Response Type", function( async ) {
  var xhr = new XMLHttpRequest(),
      Document = window.Document,
      isDead = false;

  if ( !("responseType" in xhr) ) {
    assert( false, "xhr.responseType not supported, skipping tests" );
    async.done();
  } else {
    xhr.open( "GET", window.location.href, true );
    xhr.responseType = "document";

    xhr.onload = function( event ) {
      var data = this;

      if ( !isDead && data.status === 200 ) {
        async.step(function() {
          // CURRENTLY UNSUPPORTED IN WEBKIT? CHROME?
          // console.log( data, data.response );
          assert( data.responseXML instanceof Document, "Document Response supported (XML, HTML documents)" );

          isDead = true;
          async.done();
        });
      }
    };
    xhr.send();
  }

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "Browser Document Response test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});
