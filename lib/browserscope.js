(function( window ) {

  var beacon = 0,
      completed = 0,
      failed = false,
      keys = Rng.Cache.get("browserscopekeys").first(),
      scripts = {
        all: document.createElement("script"),
        rings: document.createElement("script")
      },
      results = {
        all: {},
        rings: {}
      },
      first = document.getElementsByTagName("script")[0],
      _bTestResults = {};

  Hat.on("runner:featureDone", function( data ) {
    results.all[ data.name ] = data.failed ? 0 : 1;
  });

  Hat.on("runner:ringDone", function( data ) {
    results.rings[ data.name ] = data.failed ? 0 : 1;

    if ( data.failed ) {
      failed = true;
    }
  });

  Hat.on("runner:done", function( data ) {
    var override = false;

    completed++;

    if ( Rng.isFake ) {
      return;
    }

    // console.log( completed, Hat.ring.cache.length, failed, all );
    if ( !Rng.params.all && completed < Hat.ring.cache.length && failed ) {
      override = true;
    }

    if ( completed === Hat.ring.cache.length || override ) {

      // Ensure this isn't repeated by strange JavaScript ghosts...
      if ( beacon === 0 ) {

        // Allow devices to run rng.io "confidentially"
        // use: ?confidential
        if ( Rng.params.confidential ) {
          console.log( "Confidential: No results logged" );
          return;
        }

        console.log( "Beacon Results to Browserscope" );

        if ( /localhost|dev|10/.test( window.location.hostname ) ) {
          console.log(
            "Just kidding, we're testing locally, no need to beacon....Calling _bTestBeaconCallback directly." );

          // FAKE CALLS
          window._bTestBeaconCallback({});
          window._bTestBeaconCallback({});
        } else {
          Object.keys( results ).forEach(function( key ) {

            scripts[ key ].src = [
              "http://www.browserscope.org/user/beacon/",
              keys[ key ],
              "?test_results_var=__results." + key + "&callback=_bTestBeaconCallback"
            ].join("");

            first.parentNode.insertBefore( scripts[ key ], first );
          });
        }
      }

      // $("details").details();
    }
  });

  // Initialize and expose globally
  window.__results = results;

  window._bTestBeaconCallback = function( data ) {
    if ( ++beacon === 2 && Rng.params.referrer ) {
      // If sent from browserscope, return to browserscope. #454
      if ( Rng.params.referrer === "browserscope" && Rng.params["continue"] ) {
        // console.log( window.decodeURIComponent(Rng.params["continue"]) );
        window.location.href = window.decodeURIComponent( Rng.params["continue"] );
      }
    }

    console.log( "_bTestBeaconCallback completed: ", beacon );
  };

  window.Rng.Browserscope = window.Rng.Browserscope || {
    keys: keys
  };
}( this ) );
