asyncTest("CSS 2.1 Selectors", function( async ) {
  var isCompleted = false;

  function selectors( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "selectors" && !isCompleted ) {
      isCompleted = true;
      async.step(function() {
        assert( data.results === "truetruetruetrue",
          "CSS 2.1 Selectors are supported"
        );
        H.off( window, "message", selectors );
        async.done();
      });
    }
  }

  H.on( window, "message", selectors );

  // Ensure the iframe fixture is loaded _after_ the onmessage is attached
  document.getElementById("css2-1selectors").src = "/tests/css2-1selectors/iframe.html";
});

asyncTest("CSS Generated Content", function( async ) {
  var isCompleted = false;

  function generated( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "generated" && !isCompleted ) {
      isCompleted = true;
      async.step(function() {
        assert( data.results >= 1,
          "CSS generated content modifies the offsetHeight as expected"
        );
        H.off( window, "message", generated );
        async.done();
      });
    }
  }

  H.on( window, "message", generated );

  // Ensure the iframe fixture is loaded _after_ the onmessage is attached
  document.getElementById("css2-1selectors").src = "/tests/css2-1selectors/iframe.html";
});
