(function( window, _, $ ) {

  var App,
      templates = {},
      cache = [],
      storage = {},
      appTypes = {
        rings: []
      },
      failed = false;

  App = {

    fragments: {},

    root: (function() {
      return location.pathname === "/";
    }()),

    // Create key=>value object containing parsed
    // query string params
    params: (function() {
      var query = window.location.search,
          keyvals = [],
          pairs = {};

      if ( query ) {
        query = query.replace(/\?|\#\w+/g, "");
        keyvals = query.split("&");

        keyvals.forEach(function( keyval ) {
          var pair = keyval.split("=");

          pairs[ pair[0] ] = pair[1] ? pair[1] : true;
        });
      }
      return pairs;
    }()),

    // Pre run initialization tasks
    init: function() {
      // Add a styling hook for whether the browser supports the <details> element
      if ( !$.fn.details.support ) {
        document.documentElement.className += " no-details-elem";
      }

      // Template pre-compiled and caching technique based on
      // Irene Ros's approach here:
      // http://bit.ly/yj5dSb
      // Query for inline templates
      var tpls = document.querySelectorAll("script[type='text/template']");

      // Initialize, compile and cache templates
      [].forEach.call( tpls, function( tpl ) {
        templates[ tpl.id ] = _.template( tpl.innerHTML );
      });

      // Run app
      if ( App.root ) {
        this.run();
      }

      this.Templates = templates;
    },

    // Main execution
    run: function() {
      // Create a section elem for use as a temporary container
      // of feature summary HTML.
      var featureSummary,
          features = App.Cache.get("features"),
          apptypes = App.Cache.get("apptypes"),
          ringheaders = App.Cache.get("ringheaders"),
          featureCount = 0,
          section = document.createElement("section"),
          ul = document.createElement("ul"),
          ringElems = [],
          nodes = {
            report: document.getElementById("report"),
            summary: document.getElementById("summary"),
            completed: document.getElementById("completed")
          };

      // Collect Ring numbers associated with App Types,
      // Get all App Types that are _NOT_ set to defer
      apptypes.filter( "defer", false ).forEach(function( type ) {
        if ( appTypes.rings.indexOf( type.ring ) === -1 ) {
          appTypes.rings.push( type.ring );
        }
      });

      // Reassign an intuitive alias
      featureSummary = section;

      // Configure the id for this runner's universal fixture
      // ** NOTE ** this fixture should _not_ be visible
      Hat.Runner.config( "fixtureId", "hat-fixture" );

      // With a canvas node id, create all Ring instances
      // this will be automattically built from cached ring objects
      // in Hat.ring.cache
      Hat.Ring.create.all("canvas");

      // Upon start of each feature test, update the UI to
      // reflect "running" test with a grey slice. These
      // tick slices are _not_ added to the Ring instance's
      // `history` array
      Hat.on("runner:featureStart", function( data ) {
        var ring = Ring.get( data.ring );

        if ( ring && !Array.isArray(ring) ) {
          ring.tick("running");
        }

        nodes.summary.innerHTML = templates["testing-tpl"]( data );
      });

      // Upon completion of each feature, update the UI to
      // reflect the result of support tests
      Hat.on("runner:featureDone", function( data ) {
        // Log out the feature summary
        console.log( "(" + data.name + "): ", data );

        // storage[ data.name ] = data;

        var renderedSummary,
            ring = Ring.get( data.ring ),
            feature = features.by("name", data.name ),
            displayClass = "pass";

        if ( ring && !Array.isArray(ring) ) {
          ring.tick( data );
        }

        // If this test failed, set the displayClass to fail.
        if ( data.failed ) {
          displayClass = "fail";
        }

        // Render the feature's test result summary, add to running
        // innerHTML string
        renderedSummary = templates["feature-tpl"](
          _.extend( data, {
            url: feature.spec || "",
            displayClass: displayClass,
            assertion: (function() {
              var inner = "";

              if ( data.assertions ) {
                data.assertions.forEach(function( asserted ) {
                  inner += templates["assertion-tpl"]({
                    message: asserted.message,
                    result: asserted.result ? "pass" : "fail"
                  });
                });
              }

              return inner;
            }())
          })
        );

        // If this Ring has no associated App Types, display test results
        // directly under Ring header
        if ( appTypes.rings.indexOf( data.ring ) === -1 ) {
          featureSummary.innerHTML += renderedSummary;
        }

        App.fragments[ data.name ] = renderedSummary;

        featureCount++;
      });

      // Put the ring summary on the DOM when the ring is complete
      // when the runner is complete
      Hat.on("runner:ringDone", function( data ) {
        // Log out the ring summary
        console.log( "runner:ringDone -> (" + data.name + "): ", data );

        _.extend( data, ringheaders.by("ring", data.ring) );

        // Create a new ring container elem with the compile ring
        // container template.
        var details,
            ringSummaryClass = "ringpassed",
            html = {};

        // TODO: derive this list from some available data?
        [ "report", "summary" ].forEach(function( key ) {
          html[ key ] = templates[ key + "-tpl" ]( data );
        });

        // Add the new Ring container to the DOM.
        nodes.report.innerHTML += html.report;

        // Change DOM text from saying "running..." to "Completed X Features"
        // when the runner is complete
        nodes.summary.innerHTML = html.summary;

        // Once the summary block is completely injected,
        // get a reference to the current ring's summary element
        details = document.getElementById( "ring" + data.ring );

        // If this Ring has no associated App Types, display test results
        // directly under Ring header
        if ( appTypes.rings.indexOf( data.ring ) === -1 ) {
          // Fill the ring container that we just added with feature
          // summaries..
          details.innerHTML += featureSummary.innerHTML;
        } else {

          // Filter stored app types by Ring number
          appTypes.filtered = apptypes.filter( "ring", data.ring );

          // Allow only apptypes whose `defer` property is set to false
          appTypes.filtered = appTypes.filtered.filter(function( apptype ) {
            return !apptype.defer;
          });

          // Create a new array of rendered HTML strings based on the
          // filtered app types for this Ring number
          appTypes.rendered = appTypes.filtered.map(function( apptype ) {

            // Return the fully rendered "apptype" fragment
            return templates[ "apptype-tpl" ]({
              // Set the "apptype" display name
              name: apptype.name,
              // Apptype description
              description: apptype.description,
              // Set the features listed for this "apptype" to
              // a rendered string of HTML fragments, derived from
              // previously rendered templates stored in memory.
              // These map 1-to-1, "feature" => "feature"
              features: (function() {
                var inner = "";

                // Iterate all features associated with this "apptype"
                // and concatenate the existing, rendered HTML fragment
                // string to a local variable.
                apptype.features.sort().forEach(function( feature ) {
                  inner += App.fragments[ feature ];
                });

                // Return the local variable containing the
                // concatenation result of all feature HTML
                return inner;
              }())
            });
          });

          details.innerHTML += appTypes.rendered.join("\n");
        }

        // If the test has failed, set the lexical `failed` flag to true
        // Update the ringSummaryClass to display grey text
        if ( data.failed ) {
          failed = true;
          ringSummaryClass = "ringfailed";
        }

        details.querySelector("summary").setAttribute("class", "ring " + ringSummaryClass );

        // ringdetail
        // Add the proper behaviour for the <details> element where it doesn't exist
        if ( !$.fn.details.support ) {
          $("details").details();
        }

        // Clear the detached section elem.
        featureSummary.innerHTML = "";
      });

      // Change DOM text from saying "running..." to "tests complete"
      // when the runner is complete
      var completed = 0;

      Hat.on("runner:done", function( data ) {
        var override = false;

        completed++;

        if ( !App.params.all && completed < Hat.ring.cache.length && failed ) {
          override = true;
        }

        if ( completed === Hat.ring.cache.length || override ) {
          //    ( ( ( ) ) )
          // Completed X of Y (Update final results display here)
          // r0.-------------
          // r1.-------------
          // r2.-------------
          nodes.summary.innerHTML = templates["finished-tpl"]();

          nodes.completed.innerHTML = templates["completed-tpl"]({
            featureCount: featureCount,
            total: Hat.ring.totals().all
          });

          // Store results of tests on this particular device;
          // These will be used by the App Types feature
          // localStorage.setItem( "ringmark", JSON.stringify({
          //   results: storage
          // }));
        }

        // If no override flag was present and the current ring has failed,
        // and we haven't made it to the end, we need to create a dummy ring
        // detail and summary that indicates why the next ring will not run
        if ( override ) {
          nodes.report.innerHTML += templates["interrupted-tpl"]({
            ring: completed,
            previous: completed - 1
          });
        }

        if ( !$.fn.details.support ) {
          $("details").details();
        }
      });


      // Only run the rings if we're in the site's root
      // Prevent running on /about, /developer, etc.
      if ( App.root ) {
        Hat.start();
      }
    },

    // Caching interface
    register: function( key, array ) {
      new App.Cache( key, array );
    }
  };

  // Cache( key, array )
  // construct cached data array instances
  App.Cache = function( key, array ) {
    this.key = key;
    this.array = array;

    // Push new data array instance into locally
    // bound `cache` array
    cache.push( this );
  };


  // Get cached objects from instance array by matching property to value
  App.Cache.prototype.by = function( prop, value ) {
    var ret,
        i = 0,
        length = this.array.length;

    for ( ; i < length; i++ ) {
      if ( this.array[ i ][ prop ] === value ) {
        return this.array[ i ];
      }
    }
    // If cache[ key ] exists, it was returned.
    // otherwise return empty array
    return [];
  };

  // Get the first cached object from instance array
  App.Cache.prototype.first = function( prop, value ) {
    return this.array[ 0 ];
  };

  // Get an array of cached objects from instance array
  // by matching property to value
  App.Cache.prototype.filter = function( prop, value ) {
    var ret = [],
        i = 0,
        length = this.array.length;

    for ( ; i < length; i++ ) {
      if ( this.array[ i ][ prop ] === value ) {
        ret.push( this.array[ i ] );
      }
    }
    // If cache[ key ] exists, it was returned.
    // otherwise return empty array
    return ret;
  };

  // Static function for cache instance retrieval
  App.Cache.get = function( key ) {
    var ret,
        i = 0,
        length = cache.length;

    for ( ; i < length; i++ ) {
      if ( cache[ i ].key === key ) {
        return cache[ i ];
      }
    }
    // If cache[ key ] exists, it was returned.
    // otherwise return empty array
    return [];
  };


  App.History = {
    init: function() {
      $("[data-browserscope]").html(function() {
        return App.Cache.get("browserscopekeys").first()[ $(this).data("browserscope") ];
      });
    }
  };

  window.App = App;


}( this, this._, this.jQuery ));
