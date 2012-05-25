asyncTest("CSS Font Face", function( async ) {
  var completed = false;

  window.onmessage = function( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "fontface" && !completed ) {
      completed = true;
      async.step(function() {
        data.results.forEach(function( set ) {
          assert( set.result, set.desc );
        });
        window.onmessage = null;
        async.done();
      });
    }
  };
});


asyncTest("CSS EOT/OTF/SVG", function( async ) {
  var completed = false;

  window.onmessage = function( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "practical" && !completed ) {
      completed = true;
      async.step(function() {
        data.results.forEach(function( set ) {
          assert( set.result, set.desc );
        });
        window.onmessage = null;
        async.done();
      });
    }
  };
});
