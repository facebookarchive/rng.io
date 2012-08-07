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

  assert( "sandbox" in iframe, "Sandbox iframe supported" );
});

asyncTest("IFrame Sandbox Sanity", function( async ) {
  var regular = document.getElementById("regular"),
      sandbox = document.getElementById("sandbox"),
      iframe = document.createElement("iframe");

  if ( !("sandbox" in iframe) ) {
    assert( false, "Sandbox iframe not support, skipping tests" );
    async.done();
  } else {
    assert( !!regular.contentWindow, "regular iframe is accessible" );
    assert( !sandbox.contentWindow, "sandbox iframe is blocked" );

    async.done();
  }
});

asyncTest("IFrame Sandbox allow-scripts", function( async ) {
  var fixture = document.getElementById("iframe"),
      iframe = document.createElement("iframe"),
      isDead = false;

  function allowScripts( event ) {
    if ( !isDead && event.data.type === "allow-scripts" ) {
      async.step(function() {
        assert( event.data.result === "?allow-scripts", "allowScripts allowed JS to execute in iframe" );

        H.off( window, "message", allowScripts );
        isDead = true;
        async.done();
      });
    }
  }


  if ( !("sandbox" in iframe) ) {
    assert( false, "Sandbox iframe not support, skipping tests" );
    async.done();
  } else {

    H.on( window, "message", allowScripts );

    iframe.sandbox = "allow-scripts";
    iframe.src = "/tests/iframe/allow-scripts.html?allow-scripts";
    fixture.appendChild( iframe );

    // Bailout
    setTimeout(function() {
      if ( !isDead ) {
        async.step(function() {
          assert( false, "allowScripts failed" );

          H.off( window, "message", allowScripts );
          isDead = true;
          async.done();
        });
      }
    }, 1000);
  }
});

asyncTest("IFrame Sandbox allow-scripts allow-forms", function( async ) {
  var fixture = document.getElementById("iframe"),
      iframe = document.createElement("iframe"),
      isDead = false;

  function allowScriptsForms( event ) {
    async.step(function() {
      if ( !isDead && event.data.type === "allow-scripts-forms" ) {
        assert( true, "allowScripts allowed JS to execute in iframe and submit a form" );

        H.off( window, "message", allowScriptsForms );
        isDead = true;
        async.done();
      }
    });
  }

  if ( !("sandbox" in iframe) ) {
    assert( false, "Sandbox iframe not support, skipping tests" );
    async.done();
  } else {

    H.on( window, "message", allowScriptsForms );

    iframe.sandbox = "allow-scripts allow-forms";
    iframe.src = "/tests/iframe/allow-scripts-forms.html?allow-scripts-forms";
    fixture.appendChild( iframe );

    // Bailout
    setTimeout(function() {
      if ( !isDead ) {
        async.step(function() {
          assert( false, "allowScriptsForms failed" );

          H.off( window, "message", allowScriptsForms );
          isDead = true;
          async.done();
        });
      }
    }, 1000);
  }
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
