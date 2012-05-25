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

// <iframe id="allowScripts" sandbox="allow-scripts" src="/tests/iframe/allow-scripts.html?allow-scripts"></iframe>
// <iframe id="allowScriptsForms" sandbox="allow-scripts allow-forms" src="/tests/iframe/allow-scripts-forms.html?allow-scripts-forms"></iframe>

asyncTest("IFrame Sandbox Sanity", function( async ) {
  var regular = document.getElementById("regular"),
      sandbox = document.getElementById("sandbox");

  assert( !!regular.contentWindow, "regular iframe is accessible" );
  assert( !sandbox.contentWindow, "sandbox iframe is blocked" );

  async.done();
});

asyncTest("IFrame Sandbox allow-scripts", function( async ) {
  var fixture = document.getElementById("iframe"),
      iframe = document.createElement("iframe");

  iframe.sandbox = "allow-scripts";
  iframe.src = "/tests/iframe/allow-scripts.html?allow-scripts";
  fixture.appendChild( iframe );

  window.onmessage = function( event ) {
    async.step(function() {
      assert( event.data === "?allow-scripts", "allowScripts allowed JS to execute in iframe" );
      async.done();
    });
  };
});

asyncTest("IFrame Sandbox allow-scripts allow-forms", function( async ) {
  var fixture = document.getElementById("iframe"),
      iframe = document.createElement("iframe"),
      dead = false,
      pass = false,
      assertion = function() {
        async.step(function() {
          if ( !dead ) {
            dead = true;
            assert( pass, "allowScripts allowed JS to execute in iframe and submit a form" );
            async.done();
          }
        });
      };

  iframe.sandbox = "allow-scripts allow-forms";
  iframe.src = "/tests/iframe/allow-scripts-forms.html?allow-scripts-forms";
  fixture.appendChild( iframe );


  window.onmessage = function( event ) {
    pass = true;
    assertion();
  };

  setTimeout(assertion, 2000);
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
