asyncTest("CSS Font Face", function( async ) {
  var isCompleted = false;

  function fontface( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "fontface" && !isCompleted ) {
      isCompleted = true;
      async.step(function() {
        data.results.forEach(function( set ) {
          assert( set.result, set.desc );
        });
        H.off( window, "message", fontface );
        async.done();
      });
    }
  }

  H.on( window, "message", fontface );

  document.getElementById("cssfont-face").src = "/tests/cssfont/fontface.html";
});


asyncTest("CSS EOT/OTF/SVG", function( async ) {
  var isCompleted = false;

  function practical( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "practical" && !isCompleted ) {
      isCompleted = true;
      async.step(function() {
        data.results.forEach(function( set ) {
          assert( set.result, set.desc );
        });
        H.off( window, "message", practical );
        async.done();
      });
    }
  }

  H.on( window, "message", practical );

  document.getElementById("cssfont-load").src = "/tests/cssfont/iframe.html";
});
