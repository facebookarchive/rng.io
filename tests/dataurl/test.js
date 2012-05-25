asyncTest("Data URL", function( async ) {

  var fixture = document.getElementById("dataurl"),
      clone = document.getElementById("dataurl-data").cloneNode(true);

  fixture.appendChild( clone );

  clone.onload = clone.onerror = function() {
    async.step(function() {
      if ( clone.width === 1 && clone.height === 1 ) {
        assert( true, "Data URL Loading: success" );
      } else {
        assert( false, "Data URL Loading: failed" );
      }

      async.done();
    });
  };
});

// TEMPORARILY BLOCKED
// Need to investigate issue surrounding different
// implementations of toDataURL
// asyncTest("Derived Data URL ", function( async ) {
//   var data = document.getElementById("dataurl-data"),
//       png = document.getElementById("dataurl-png"),
//       context = document.createElement("canvas").getContext("2d");
//
//   context.canvas.width = 1;
//   context.canvas.height= 1;
//
//   png.onload = function() {
//     async.step(function() {
//       context.drawImage( png, 0, 0 );
//       //"context.canvas.toDataURL() === data.src"
//       assert( context.canvas.toDataURL() === data.src, "Data URL supported" );
//
//       async.done();
//     });
//   };
// });
