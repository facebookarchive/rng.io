asyncTest("CSS 2.1 Selectors", function( async ) {
  var completed = false;
  window.onmessage = function( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "selectors" && !completed ) {
      completed = true;
      async.step(function() {
        assert( data.results === "truetruetruetrue",
          "CSS 2.1 Selectors are supported"
        );
        window.onmessage = null;
        async.done();
      });
    }
  };

  // Ensure the iframe fixture is loaded _after_ the onmessage is attached
  document.getElementById("css2-1selectors").src = "/tests/css2-1selectors/iframe.html";
});

asyncTest("CSS Generated Content", function( async ) {
  var completed = false;
  window.onmessage = function( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "generated" && !completed ) {
      completed = true;
      async.step(function() {
        assert( data.results >= 1,
          "CSS generated content modifies the offsetHeight as expected"
        );
        window.onmessage = null;
        async.done();
      });
    }
  };

  // Ensure the iframe fixture is loaded _after_ the onmessage is attached
  document.getElementById("css2-1selectors").src = "/tests/css2-1selectors/iframe.html";
});
