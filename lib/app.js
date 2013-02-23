(function( window, _, $ ) {

  var Rng, stored, Params,
      templates = {},
      nodes = {},
      cache = [],
      storage = {},
      appTypes = {
        rings: []
      },
      failed = false;

  Params = (function() {
    var query, keyvals, pair, pairs;

    query = window.location.search;
    keyvals = [];
    pairs = {};

    if ( query ) {
      query = query.replace(/\?|\#\w+/g, "");
      keyvals = query.split("&");

      while ( keyvals.length ) {
        pair = keyvals.shift().split("=");
        pairs[ pair[0] ] = pair[1] ? decodeURIComponent( pair[1] ) : true;
      }
    }
    return pairs;
  }());

  // Force all rings to run, all the time.
  Params.all = true;

  Rng = {

    // node and templates point at the closed over
    // vars of the same name
    nodes: nodes,
    templates: templates,

    fragments: {
      features: {}
    },

    isRoot: (function() {
      return location.pathname === "/";
    }()),

    // Create key=>value object containing parsed
    // query string params
    params: Params,

    isFake: (function() {
      return !!Params.device;
    }()),

    // Execute Ring Runner
    run: function() {

      // Create a section elem for use as a temporary container
      // of feature summary HTML.
      var featureSummary, features, apptypes, ringheaders, featureCount,
          section, ul;

      // Derive Feature Test data lists from in-memory data store
      features = Rng.Cache.get("features");

      // Derive App Types data lists from in-memory data store
      // apptypes = Rng.Cache.get("apptypes");

      // Derive Ring Headers content from in-memory data store
      ringheaders = Rng.Cache.get("ringheaders");

      // Initialize feature counter, used to display number of
      // features that are tested in each ring.
      featureCount = 0;

      // Clonable section node
      // make intuitive alias
      section = featureSummary = document.createElement("section");

      // Clonable ul node
      ul = document.createElement("ul");

      // Collect Ring numbers associated with App Types,
      // Get all App Types that are _NOT_ set to defer
      // apptypes.filter( "defer", false ).forEach(function( type ) {
      //   if ( appTypes.rings.indexOf( type.ring ) === -1 ) {
      //     appTypes.rings.push( type.ring );
      //   }
      // });

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

        // Set the display content of the summary block to show
        // the currently running Feature Test
        nodes.summary.innerHTML = templates["testing-tpl"]( data );
      });

      // Upon completion of each feature, update the UI to
      // reflect the result of support tests
      Hat.on("runner:featureDone", function( data ) {
        // Log out the feature summary
        console.log( "(" + data.name + "): ", data );

        var renderedSummary,
            ring = Ring.get( data.ring ),
            feature = features.by( "name", data.name ),
            displayClass = "pass";

        if ( ring && !Array.isArray(ring) ) {
          ring.tick( data );
        }

        // If this test failed, set the displayClass to fail.
        if ( data.failed ) {
          displayClass = "fail";
        }

        // Render the feature's test result summary,
        // add to cumulative innerHTML string value
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

        // Register feature results to in-memory storage table
        storage[ data.name ] = {
          results: data,
          rendered: renderedSummary
        };

        // If this Ring has no associated App Types, display test results
        // directly under Ring header
        if ( !Rng.isFake ) {
          featureSummary.innerHTML += renderedSummary;
        }

        // Register the newly rendered summary in the cache of feature
        // test result fragments (which are actually strings of HTML)
        Rng.fragments.features[ data.name ] = renderedSummary;

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

        if ( !Rng.isFake ) {
          // Add the new Ring container to the DOM.
          nodes.report.innerHTML += html.report;

          // Change DOM text from saying "running..." to "Completed X Features"
          // when the runner is complete
          nodes.summary.innerHTML = html.summary;

          // Once the summary block is completely injected,
          // get a reference to the current ring's summary element
          details = document.getElementById( "ring" + data.ring );

          // Fill the ring container that we just added with feature
          // summaries..
          details.innerHTML += featureSummary.innerHTML;

          // If the test has failed, set the lexical `failed` flag to true
          // Update the ringSummaryClass to display grey text
          if ( data.failed ) {
            failed = true;
            ringSummaryClass = "ringfailed";
          }

          details.querySelector("summary").setAttribute("class", "ring " + ringSummaryClass );


          // ringdetail
          // Add the proper behaviour for the <details>
          // element where it doesn't exist
          // if ( !$.fn.details.support ) {
          //   $("details").details();
          // }

          // Clear the detached section elem.
          featureSummary.innerHTML = "";
        } else {

          nodes.summary.innerHTML = Rng.params.device;
        }
      });

      // Change DOM text from saying "running..." to "tests complete"
      // when the runner is complete
      var completed, isPosted;

      completed = 0;
      isPosted = false;

      Hat.on("runner:done", function( data ) {
        var override;

        override = false;

        completed++;

        if ( !Rng.params.all && completed < Hat.ring.cache.length && failed ) {
          override = true;
        }

        if ( completed === Hat.ring.cache.length || override ) {
          //    ( ( ( ) ) )
          // Completed X of Y (Update final results display here)
          // r0.-------------
          // r1.-------------
          // r2.-------------

          if ( !Rng.isFake ) {
            nodes.summary.innerHTML = templates["finished-tpl"]();

            nodes.completed.innerHTML = templates["completed-tpl"]({
              featureCount: featureCount,
              total: Hat.ring.totals().all
            });


            // Store results of tests on this particular device;
            // These will be used by the App Types feature
            Rng.Store.set( "results", storage );

            // ?output
            // If the ?output parameter was used,
            // call Rng.output() to prepare and output results in
            // requested format
            if ( Rng.params.output ) {
              Rng.output();
            }

            // ?post=endpoint
            // If the ?post parameter was used,
            // serialized the results and post to top-most window
            if ( Rng.params.post && !isPosted ) {
              isPosted = true;

              console.log( "Post: Results posted to provided endpoint" );

              Rng.post( storage );
            }
          }
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

        if ( !$.fn.details.support && completed < 4 ) {
          $("details").details();
        }
      });


      // Only run the rings if we're in the site's root
      // Prevent running on /about, /developer, etc.
      if ( Rng.isRoot ) {

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // TODO: Rng.run() needs to determine if this is a
        //       normal run or a "recreation" and substitute
        //       the data accordingly
        if ( Rng.params.device ) {

          Rng.regenerate();

        } else {

          // Begin normal run
          Hat.start();
        }
      }
    },

    output: function() {
      var data, prepare, finalized, prefix, type, encodetype, records;

      // Localize the output type
      type = Rng.params.output;

      // If no type is actually assigned, return
      if ( type === undefined ) {
        return;
      }

      encodetype = {
        json: "application/json",
        csv: "text/plain"
      }[ type ];

      // If the given "type" does not actually match one of
      // the accepted output formats, return.
      if ( encodetype === undefined ) {
        return;
      }

      // Initialize and assign the forwarding data url prefix
      prefix = "data:" + encodetype + ";charset=utf-8;base64,";

      // If the type is json, serialize the test collection
      // object, remove the markup strings by known property names.
      // Base64 Encode the resulting string
      if ( type === "json" ) {
        finalized = window.btoa(
          JSON.stringify( storage, function( key, val ) {
            if ( key === "assertion" || key === "rendered" ) {
              return undefined;
            }
            return val;
          })
        );
      }

      if ( type === "csv" ) {
        // Will hold all line items
        records = [];

        // Filter and prepare data props
        data = JSON.parse(
          JSON.stringify( storage, function( key, val ) {
            if ( key === "assertion" || key === "rendered" ) {
              return undefined;
            }
            return val;
          })
        );

        // Columns:
        //  title, feature, ring, assertion, passed
        //  string, string, number, string, boolean
        //
        // Map to:
        //  results.title, results.name,
        //  results.ring, assertion.message, assertion.result
        //
        Object.keys( data ).forEach(function( feature ) {
          var assertions, results;

          results = data[ feature ].results;

          if ( results.assertions.length ) {
            assertions = results.assertions.map(function( assertion ) {
              return [

                results.title,
                results.name,
                results.ring,
                assertion.message,
                assertion.result

              ].map(function( v ) {
                // Wrap strings in double quotes
                if ( isNaN(+v) ) {
                  return '"' + v.replace(/"/g, "'") + '"';
                }
                // Booleans and numbers can go bare
                return v;
              }).join(",");
            });
          }

          // Add assertions set to running records tally
          records = records.concat( assertions );
        });

        // Prepare joined records entries with header
        prepare = "title,test,ring,assertion,passed\n";
        prepare += records.join("\n");

        // This is awful, need a better way to address the removal of
        // the prefix-allowed test titles
        prepare = prepare.replace(/&#8253;/g, "(prefixed)");

        // Encode for output
        finalized = window.btoa( prepare );
      }

      // Concatenate the data-url prefix and encoded data
      // forward the browser to this new url to display
      // test results with correct header
      window.location.href = prefix + finalized;
    },
    // post the results to provided endpoint
    post: function( data ) {
      var xhr = new window.XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4 ) {
          console.log( "Post Results Complete" );
        }
      };

      if ( typeof Rng.params.post !== "string" ) {
        Rng.params.post = "/";
      }


      xhr.open( "POST", Rng.params.post, true );
      xhr.send(
        JSON.stringify( data, function( key, val ) {
          // Removed the rendered HTML key/vals
          if ( key === "rendered" || key === "assertion" ) {
            return undefined;
          }
          return val;
        })
      );
    },

    regenerate: function() {
      var browserscope, process;

      browserscope = Rng.Store.get("browserscope");

      process = function() {
        var data, features;

        data = browserscope.all.results[ Rng.params.device ].results;

        features = Rng.Cache.get("features");

        // console.log( data );
        // console.log( features );

        // filter("ring", 2)


        [ 0, 1, 2 ].forEach(function( ring, k ) {

          var feats = features.filter( "ring", ring ),
              failed = 0,
              passed = 0;

          feats.forEach(function( feat ) {
            var isOk = true;

            // console.log( feat );

            // Hat.emit( "runner:featureStart", feat );

            // Make async by waiting until the stack unwinds...
            setTimeout(function() {
              var result = data[ feat.name ] ?
                    +data[ feat.name ].result : isOk;

              isOk = !!result;

              // console.log( feat.name, isOk, data[ feat.name ].result );
              Hat.emit( "runner:featureDone", {
                assertion: "",
                assertions: [],
                displayClass: isOk ? "pass" : "fail",
                failed: isOk ? 0 : 1,
                passed: isOk ? 1 : 0,
                name: feat.name,
                ring: feat.ring,
                title: feat.title,
                total: 1,
                url: feat.url
                // assertion: "↵  <dt class="fail">&nbsp;</dt><dd>animationName standard, supported</dd>↵  "
                // assertions: Array[1]
                // displayClass: "fail"
                // failed: 1
                // name: "cssanimation-standard"
                // passed: 0
                // ring: 1
                // title: "CSS3 Animation, Standard"
                // total: 1
                // url: "http://www.w3.org/TR/css3-animations/"
              });
            }, 0);

            failed += !isOk ? 1 : 0;
            passed += isOk ? 1 : 0;
          });

          Hat.emit( "runner:ringDone", {
            ring: ring,
            failed: failed,
            passed: passed,
            name: "ring:" + ring,
            total: failed + passed
            // description: "This is functionality that's widely available and mobile web app developers build upon today."
            // failed: 0
            // name: "ring:0"
            // passed: 97
            // ring: 0
            // total: 97
          });
        });
      };

      if ( browserscope === null ) {

        // request and process
      } else {

        // process
        //
        process();
      }
    },

    // Cache register (get it??)
    register: function( key, array ) {
      new Rng.Cache( key, array );
    }
  };



  // Store
  // parsed localStorage object accessors
  //
  // initialized at top of scope
  stored = JSON.parse( localStorage.getItem("ringmark") );

  // If nothing has been stored previouslt (first visit?),
  // set up an empty localStorage slot and an empty stored object
  if ( stored === null ) {
    localStorage.setItem( "ringmark", JSON.stringify({}) );
    stored = {};
  }

  Rng.Store = {
    get: function( key ) {
      // References closed over |stored| var
      return stored[ key ];
    },
    set: function( key, value ) {
      var current = JSON.parse( localStorage.getItem("ringmark") );

      // If no current data stored in localStorage
      if ( current === null ) {
        current = {};
      }

      // Define and Assign |value| to property |key|
      current[ key ] = value;

      // Update the "ringmark" storage
      localStorage.setItem( "ringmark", JSON.stringify(current) );

      stored = current;

      return true;
    }
  };

  // Cache( key, array )
  // construct cached data array instances
  Rng.Cache = function( key, array ) {
    this.key = key;
    this.array = array;

    // Push new data array instance into locally
    // bound `cache` array
    cache.push( this );
  };


  // Get cached objects from instance array by matching property to value
  Rng.Cache.prototype.by = function( prop, value ) {
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
  Rng.Cache.prototype.first = function( prop, value ) {
    return this.array[ 0 ];
  };

  // Get an array of cached objects from instance array
  // by matching property to value
  Rng.Cache.prototype.filter = function( prop, value ) {
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
  Rng.Cache.get = function( key ) {
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

  // Rng.Views() <constructor function>
  //
  // Initialize primary view and any subviews
  // if they exist and were requested.
  //
  // Rng.Views <function object>
  //
  // Attach all sub views as "static" props to this function
  // Views should be used for special UI handler cases,
  // including:
  //
  //  - Display
  //  - Events
  //  - UI Manipulation
  //

  Rng.Views = function( initializer, callback ) {
    var context, isValid;

    context = context || Rng.Views[ initializer ];
    isValid = !!(context && context.init);

    // console.log( initializer, context, callback );

    if ( isValid ) {
      // Initialize and cache DOM nodes for this view
      // providing the initializer context
      Rng.Views.dom.init( context, function() {
        callback.call( context );
      });
    }
  };

  Rng.Views.dom = {
    ready: false,
    init: function( context, callback ) {

      if ( !this.ready ) {

        // Inject <details> support where nec.
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

          // This "templates" is a closed over var in IIFE scope
          templates[ tpl.id ] = _.template( tpl.innerHTML );
        });

        // Iterate list of common view selectors and cache matching nodes
        this.common.selectors.forEach(function( key ) {
          var node;

          // Omitting the usual try/catch in favor of simplifying selectors
          // this way, they shouldn't be hard to add new and find them
          node = document.querySelector( "#rng-view-" + key );

          // If a valid node was found, add it to the closed over "nodes"
          if ( node ) {
            nodes[ key ] = node;
          }
        });

        // console.log( "DOM View nodes prepared", nodes );
        // console.log( "Rng.Views.dom.ready set", Rng.Views.dom );

        // Set DOM View ready flag to true
        this.ready = true;
      }

      // Call async
      setTimeout(function() {
        callback.call( context );
      }, 0 );
    },
    common: {

      selectors: [
        // These are auto-prefixed with
        // "#rng-view-" when qS is called
        "back",
        "completed",
        "more",
        "report",
        "summary",
        "title",
        "devices",
        "adevices",
        "sdevices",
        "notable"
      ]
    }
  };


  // The Default "Ring Runner" view
  Rng.Views.Default = {
    init: function() {

      // Immediately begin requesting browserscope data
      Rng.Request.jsonp(
        "http://www.browserscope.org/user/tests/table/" + Rng.Browserscope.keys.all + "?v=top-m&o=json",
        function( data ) {

          Rng.Store.set( "browserscope", {
            all: data,
            rings: null
          });

          nodes.devices.innerHTML = templates["devices-tpl"]({
            options: (function() {
              return [
                // Show "Your Device" option when _not_ viewing
                // your device's results
                Rng.params.device && "<option value='yours'>Your Device</option>",

                // Build other device options
                Object.keys( data.results ).map(function( key ) {
                  return "<option value='" + key + "'>" + key + "</option>";
                })
              ].join("");
            }())
          });

          // Let the stack unwind, then add an event listener
          // TODO: FIX THIS. IT'S AWFUL
          setTimeout(function() {
            nodes.devices.querySelector("select").addEventListener("change", function() {
              if ( this.value ) {
                window.location = "/" + ( this.value === "yours" ?
                  "" : "?device=" + encodeURIComponent(this.value) );
              }
            });
          }, 0);
      });

      // console.log( "Rng.Views.Default", this );
    }
  };

  // The "History" view, when accessed from rng.io/history
  Rng.Views.History = {
    init: function() {
      // console.log( "INITIALIZE APP.VIEW: History" );
      //
      var keys, params;

      // Derive first record of browserscopekeys from cache
      keys = Rng.Cache.get("browserscopekeys").first();

      // Build a set of interesting URLs to link to from /history.
      // This was added at the last minute and may need some fine
      // tuning or refactoring in the not-so-distant future

      params = [
        {
          type: "JSON",
          query: "v=3&o=json"
        },
        {
          type: "CSV",
          query: "v=3&o=csv"
        },
        {
          type: "Table",
          query: "layout=simple&highlight=true"
        }
      ];

      // For each type of browserscope key, construct
      // a set of urls using the params array and
      // inject the urls as anchors into the "notable" UL
      [ "rings", "all" ].forEach(function( set, k ) {
        var node = nodes.notable.children[ k ],
            key = keys[ set ];

        // Reduce the params array above into a
        // string of injectable innerHTML
        node.innerHTML += params.reduce(function( concat, param ) {
          return concat + templates["notable-tpl"]({
            key: key,
            param: param.query,
            type: param.type
          });
        }, "");
      });

      // Display the bare keys.
      $("[data-browserscope]").html(function() {
        return Rng.Cache.get("browserscopekeys").first()[ $(this).data("browserscope") ];
      });
    }
  };

  // The "Apps" view, when accessed from rng.io/apps
  Rng.Views.Apps = {
    init: function() {
      // console.log( "INITIALIZE APP.VIEW: Apptypes", nodes );

      var apptypes, features, html, results;

      // Derive stored Ring result data
      results = Rng.Store.get("results");

      // If nothing was previously stored, the tests must
      // be run on this device, prompt user to return to
      // main rng.io for device tests
      if ( results === null ) {

        nodes.back.parentNode.removeChild( nodes.back );

        nodes.title.innerHTML =
          templates["url-tpl"]({
            href: "/",
            text: "Run tests for this device"
          });
        return;
      }

      // Derive App Types data lists from in-memory data store
      apptypes = Rng.Cache.get("apptypes");

      // Collect Ring numbers associated with App Types,
      // Get all App Types that are _NOT_ set to defer
      apptypes.filter( "defer", false ).forEach(function( type ) {
        if ( appTypes.rings.indexOf( type.ring ) === -1 ) {
          appTypes.rings.push( type.ring );
        }
      });

      // console.log( "appTypes", appTypes );
      // console.log( "apptypes", apptypes );


      // Set an initial empty string value to `html`
      // to concat with compound arg += without exception
      html = "";


      // Allow only apptypes whose `defer` property is set to false
      appTypes.filtered = apptypes.filter( "defer", false ).filter(function( apptype ) {
        return !apptype.defer;
      });


      appTypes.rings.forEach(function( ring, k ) {

        // If a param id is present, coerce the string
        // value to a number for comparison to the ring number
        //
        // If this ring does not match the param id, then
        // app types will not be displayed.
        if ( Object.keys(Rng.params).length && !Rng.params[ring] ) {
          return;
        }


        // Create a new array of rendered HTML strings based on the
        // filtered app types for this Ring number
        appTypes.rendered = appTypes.filtered.filter(function( apptype ) {
          return apptype.ring === ring;
        }).map(function( apptype ) {

          // console.log( apptype, apptype.ring, apptype.name );

          // Return the fully rendered "apptype" fragment
          return templates[ "apptype-tpl" ]({
            ring: ring,
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
                var fromCache = results[ feature ];

                if ( fromCache !== undefined ) {
                  inner += fromCache.rendered || "";
                }
              });

              // Return the local variable containing the
              // concatenation result of all feature HTML
              return inner;
            }())
          });
        });

        html += appTypes.rendered.join("\n");
      });

      // Inject the rendered HTML string into the report area
      if ( !Rng.isFake ) {
        nodes.report.innerHTML = html;
      }
    }
  };


  // Make async resources requests
  // (Use to request JSONP from Browserscope)
  Rng.Request = {

    uid: 0,

    // JSONP callback cache
    callbacks: {},

    // Request JSONP rfom Remote resource
    jsonp: function( url, callback ) {
      var name, head, script;

      name = "rng_" + (Rng.Request.uid++);
      head = document.head;
      script = document.createElement("script");

      // Register a callback in Rng.Request.callbacks
      this.callbacks[ name ] = function( data ) {
        callback( data );

        delete Rng.Request.callbacks[ name ];
      };

      // When the script is loaded, remove the node from the head
      // remove the callback from the cache;
      script.onload = function( ) {
        head.removeChild( script );
      };

      // Any benefits?
      script.async = true;

      // Set script element src
      // Instead of polluting the global object with callbacks,
      // use callbacks cache object instead
      script.src = url + "&callback=Rng.Request.callbacks." + name;

      // Insert script node into document head to
      // initialize HTTP load request
      head.appendChild( script );
    }
  };


  // Expose Rng namespace w/ legacy identifier
  window.App = window.Rng = Rng;

  window.Ringmark = function( initializer ) {
    initializer = initializer !== null ? initializer : "Default";


    Rng.Views( initializer, function() {
      Rng.Views[ initializer ].init();

      if ( Rng.isRoot ) {
        Rng.run();
      }
    });
  };


}( this, this._, this.jQuery ));
