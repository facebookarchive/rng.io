test("IFrame", function() {
  var iframe = document.createElement("iframe");

  assert( !!iframe, "iframe supported" );
});

// test("IFrame Seamless", function() {
//   var iframe = document.createElement("iframe");

//   assert( "seamless" in iframe );
// });

test("IFrame Sandbox", function() {
  var iframe = document.createElement("iframe");

  assert( "sandbox" in iframe, "iframe.sandbox supported" );
});

asyncTest("IFrame Sandbox Sanity", function( async ) {
  var regular = document.getElementById("regular"),
      sandbox = document.getElementById("sandbox");

  assert( !!regular.contentWindow, "regular iframe is accessible" );
  assert( !sandbox.contentWindow, "sandbox iframe is blocked" );

  async.done();
});

asyncTest("IFrame Sandbox allow-scripts", function( async ) {
  var fixture = document.getElementById("iframe"),
      iframe = document.createElement("iframe"),
      isDead = false;

  function allowScripts( event ) {
    async.step(function() {
      assert( event.data === "?allow-scripts", "allowScripts allowed JS to execute in iframe" );

      H.off( window, "message", allowScripts );
      async.done();
    });
  }

  H.on( window, "message", allowScripts );

  iframe.sandbox = "allow-scripts";
  iframe.src = "/tests/iframe/allow-scripts.html?allow-scripts";
  fixture.appendChild( iframe );

  // 5s cutoff to avoid dead hang
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "allowScripts failed" );
        isDead = true;
        H.off( window, "message", allowScripts );
        async.done();
      });
    }
  }, 5000);
});

asyncTest("IFrame Sandbox allow-scripts allow-forms", function( async ) {
  var fixture = document.getElementById("iframe"),
      iframe = document.createElement("iframe"),
      isDead = false;

  function allowScriptsForms( event ) {
    async.step(function() {
      if ( !isDead ) {
        assert( true, "allowScripts allowed JS to execute in iframe and submit a form" );
        isDead = true;
        H.off( window, "message", allowScriptsForms );
        async.done();
      }
    });
  }

  H.on( window, "message", allowScriptsForms );

  iframe.sandbox = "allow-scripts allow-forms";
  iframe.src = "/tests/iframe/allow-scripts-forms.html?allow-scripts-forms";
  fixture.appendChild( iframe );

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "allowScriptsForms failed" );
        isDead = true;
        H.off( window, "message", allowScriptsForms );
        async.done();
      });
    }
  }, 5000);
});

// allow-forms, allow-same-origin, allow-scripts, and allow-top-navigation
//
// allow-same-origin keyword allows the content to be
// treated as being from the same origin instead of
// forcing it into a unique origin,
//
// allow-top-navigation keyword allows the content to
// navigate its top-level browsing context.
//
// allow-forms and allow-scripts keywords re-enable
// forms and scripts respectively
// (though scripts are still prevented from creating popups).
