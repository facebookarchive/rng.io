/*! ringmark - v1.4.0 - 10/8/2013
* Copyright ( c ) 2013 Facebook Licensed W3C 3-clause BSD License, W3C Test Suite License */

(function( exports ) {

  var // Store instance safe, generic
  slice = [].slice,
  toString = {}.toString,
  hasOwn = {}.hasOwnProperty,

  // ES Types (for determining host objects)
  esMap = {},
  esTypes = [
    "Object", "Number", "String", "Boolean", "Function", "RegExp", "Array", "Date", "Error"
  ],

  // Query Params array of key:val objects
  params = (function( window ) {
    var query = (window.location && window.location.search || "");

    return query.replace(/^\?/, "").split("&").map(function( set ) {
      var keyVal = set.split("=");

      return {
        key: keyVal[ 0 ],
        value: keyVal[ 1 ] || true
      };
    });
  }( exports )),

  // Storage for registered test instances
  cache = [],

  // Storage for event listening
  events = [],

  // Initialize and assign TopHat namespace with Hat shorthand
  Hat = {
    // Hat.nop()
    nop: function() {},
    // Hat.uniqueId()
    uniqueId: function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(chr) {
        var rnd = Math.random() * 16 | 0;
        return (chr === "x" ? rnd : (rnd & 0x3 | 0x8)).toString(16);
      }).toUpperCase();
    },
    // Hat.isKindOf( value , kind )
    // Inspired by and derived from getClass by Ben Alman
    // https://github.com/cowboy/javascript-getclass/blob/master/lib/getclass.js
    isKindOf: function( val, name ) {
      return val != null && toString.call( val ) === "[object " + name + "]";
    },
    // Hat.kindOf( obj  )
    // Returns value of object's [[Class]] internal property
    // Inspired by and derived from getClass by Ben Alman
    // https://github.com/cowboy/javascript-getclass/blob/master/lib/getclass.js
    kindOf: function( val ) {
      return val != null && /^\[object (.*)\]$/.exec( toString.call(val) )[ 1 ];
    },
    // Hat.clone( obj )
    // Returns deep copy of obj
    clone: function( obj ) {
      var val, length, i,
        temp = [];

      if ( Array.isArray(obj) ) {
        for ( i = 0, length = obj.length; i < length; i++ ) {
          // Store reference to this array item's value
          val = obj[ i ];

          // If array item is an object (including arrays), derive new value by cloning
          if ( typeof val === "object" ) {
            val = Hat.clone( val );
          }
          temp[ i ] = val;
        }
        return temp;
      }

      // Create a new object whose prototype is a new, empty object,
      // Using the second properties Object argument to copy the source properties
      return Object.create({}, (function( src ) {
        // Initialize a cache for non-inherited properties
        var props = {};

        Object.getOwnPropertyNames( src ).forEach(function( name ) {
          // Store short reference to property descriptor
          var descriptor = Object.getOwnPropertyDescriptor( src, name );

          // Recurse on properties whose value is an object or array
          if ( typeof src[ name ] === "object" ) {
            descriptor.value = Hat.clone( src[ name ] );
          }
          props[ name ] = descriptor;
        });
        return props;
      }( obj )));
    },
    // Hat.extend( dest [, ... ] )
    // Returns object extended with a variable number of passed objects
    extend: function( dest /*, ... */ ) {
      var copy, prop,
          sources = slice.call( arguments, 1 ),
          length = sources.length,
          i = 0;

      for ( ; i < length; i++ ) {
        // Create clone to avoid bound references
        copy = Hat.clone( sources[ i ] );

        // Copy clone's properties to destination
        for ( prop in copy ) {
          dest[ prop ] = copy[ prop ];
        }
      }
      return dest;
    }
  },

  // Helpers for dealing with vendor-prefixed CSS reles and JS properties/APIs
  // From Modernizr
  // https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
  // https://github.com/Modernizr/Modernizr/issues/21
  prefixes = " -webkit- -moz- -o- -ms- ".split(" "),

  omPrefixes = "Webkit Moz O ms",

  cssomPrefixes = omPrefixes.split(" "),

  domPrefixes = omPrefixes.toLowerCase().split(" ");

  // -- End of Var Declaration List

  // Add special case prefixes
  cssomPrefixes.push("WebKit", "Moz", "MS", "O");
  domPrefixes.push("WebKit", "Moz", "MS", "O");


  // Generate is___ methods and populate esMap
  esTypes.forEach(function( kind ) {
    // Add to the kind map
    esMap["[object " + kind + "]"] = kind;

    // Create convenience methods
    Hat[ "is" + kind ] = function( val ) {
      return Hat.kindOf( val ) === kind;
    };
  });

  Hat.isHTML = function( string ) {
    string = string.trim();
    // Can this reasonably be a string of HTML?
    return string.charAt(0) === "<" && string.charAt( string.length - 1 ) === ">" && string.length >= 3;
  };

  // End is___ method assignent


  Hat.prefixes = {
    css: prefixes,
    dom: domPrefixes,
    cssom: cssomPrefixes,
    // Expands a CSS rule into all vendor-specific CSS Strings
    // Essentially borrowed from Modernizr
    expandCss: function( rule, extra ) {
      return prefixes.join( rule + ";" ) + ( extra || "" );
    }
  };

  Hat.get = {
    // Returns a boolean indicating whether str contains substr
    // From Modernizr
    // https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
    string: function( str, substr ) {
      return !!~( "" + str ).indexOf( substr );
    },
    // Tests if a CSS property exists on an element's style property
    // By default, only searches for the standard property
    // Largely inspired by Modernizr
    cssProp: function( elem, prop, withPrefixes ) {
      var ucProp, props, i, l;

      withPrefixes = withPrefixes || false;

      if ( !withPrefixes ) {
        // If testing for only the "standard" property, do a direct check
        return prop in elem.style;
      } else {
        // If testing for at least a matching vendor prefix, expand and then check
        ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
        props = ( prop + " " + cssomPrefixes.join(ucProp + " ") + ucProp ).split(" ");
        i = 0;
        l = props.length;

        for( i = 0; i < l; i++ ) {
          if ( props[i] in elem.style ) {
            return true;
          }
        }
      }
      return false;
    },
    // Tests if a JS property exists directly on an element and returns the property
    // if a browser supports a certain property, it won't return undefined for it.
    // By default, only searches for the standard property
    // Largely inspired by Modernizr
    domProp: function( elem, prop, withPrefixes ) {
      var ucProp, props, i, l;

      withPrefixes = withPrefixes || false;

      if ( !withPrefixes ) {
        // If testing for only the "standard" property, do a direct check
        return elem[ prop ] !== undefined ? elem[ prop ] : false;
      } else {
        // If testing for at least a matching vendor prefix, expand and then check
        ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
        props = ( prop + " " + domPrefixes.join(ucProp + " ") + ucProp ).split(" ");
        i = 0;
        l = props.length;

        for ( i = 0; i < l; i++ ) {
          if ( props[i] in elem ) {
             // console.log( props[i], "found", elem[ props[i] ] );
            return elem[ props[i] ];
          }
        }
      }
      return false;
    }
  };

  // Inject some "content" into a "target"
  //
  // Hat.inject( node, document.body );
  // Hat.inject( "css rules", style node );
  Hat.inject = function( content, target ) {
    var prop, name, children;

    if ( typeof target === "string" ) {
      if ( Hat.isHTML(target) ) {

        name = /^<(\w+)\s*\/?>(?:<\/\1>)?$/.exec( target );

        if ( name && name.length && name[ 1 ] ) {
          target = document.createElement( name[ 1 ] );
        }
      } else {
        // This is a little presumptuous,
        // but will be fine for now
        target = document.querySelector( target );
      }
    }

    if ( typeof content === "string" ) {

      if ( Hat.isHTML(content) && !/^<style/.test(content) ) {
        prop = "innerHTML";
      } else {
        prop = "innerText" in target ? "innerText" : "textContent";

        if ( /^<style/.test(content) ) {
          prop = "textContent";
        }
      }

      target[ prop ] += content;
    } else {

      if ( content.nodeType === 1 ) {
        target.appendChild( content );
      }
    }

    return target;
  };


  // Checks for and returns a property on the window object,
  // optionally looking for the prefixed version
  Hat.hostAPI = function( api, withPrefixes ) {
    return Hat.get.domProp( window, api, withPrefixes ) || false;
  };

  // Get any API on any object, can test with prefixes or without
  // eg
  //
  // var geolocation = H.API( navigator, "geolocation", true );
  //
  // var Blob = H.API( window, "Blob", true );
  //
  //
  Hat.API = function( object, api, withPrefixes, expect ) {
    var found;

    if ( arguments.length === 1 ) {
      // Could be falsey value
      if ( "expect" in object ) {
        expect = object.expect;
      }
      // Could be falsey value
      if ( "withPrefixes" in object ) {
        withPrefixes = object.withPrefixes;
      }

      api = object.api;
      object = object.host;
    }

    if ( !object || object == null ) {
      return undefined;
    }

    found = Hat.get.domProp( object, api, withPrefixes );

    // When full params list or options objects
    if ( (arguments.length === 1 || arguments.length === 4) &&
          found === expect ) {

      return found;
    }

    return found || undefined;
  };

  // A helper for simulating native DOM events,
  // and passes on to the handler that the event
  // has been synthetically fired.
  // Should be improved as needed for different W3C Event modules
  Hat.simulate = function( type, elem, props ) {
    var evt;
    if ( type === "click" ) {
      evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);
    } else {
      evt = document.createEvent("HTMLEvents");
      evt.initEvent( type, true, false );
    }

    evt.synthetic = true;
    if ( props ) {
      Hat.extend( evt, props );
    }

    elem.dispatchEvent( evt );
  };


  Hat.on = function( type, handler ) {
    // Refers to the `events` cache scoped to IIFE
    ( events[type] || (events[type] = []) ).push( handler );
  };

  Hat.once = function( type, handler ) {
    function proxyHandler() {
      handler.apply( this, arguments );
      Hat.off( type, handler );
    }

    Hat.on( type, proxyHandler );
  };

  Hat.off = function( type, handler ) {
    var array = events[ type ];

    if ( array ) {
      if ( !handler ) {
        events[ type ] = [];
      } else {
        array.splice( array.indexOf(handler), 1 );
      }
    }
  };

  Hat.emit = function( type /*, ..args */ ) {
    var i = 0,
        args = [].slice.call( arguments, 1 ),
        array = events[ type ] || [],
        length = array.length;

    for ( ; i < length; i++ ) {
      if ( array[ i ] ) {
        array[ i ].apply( this, args );
      }
    }
  };

  // Allow H.* Event as a facade over:
  // - internal event system
  // - DOM event system.
  [
    [ "on", "addEventListener" ],
    [ "off", "removeEventListener" ]
  ].forEach(function( set ) {
    var alias, api, orig;

    alias = set[0];
    api = set[1];
    orig = Hat[ alias ];

    Hat[ alias ] = function() {
      var target, type, handler, useCapture;

      // The internal event system is a 2 parameter call:
      // @param {string} target => type
      // @param {function} name => handler
      if ( typeof arguments[0] === "string" ) {
        // type = target;
        // handler = name;
        return orig.apply( Hat, [].slice.call( arguments ) );
      }

      target = arguments[0];
      type = arguments[1];
      handler = arguments[2];
      useCapture = arguments[3] || false;

      // Bridge to DOM EventTarget APIs
      // One of: addEventListener, removeEventListener
      if ( target[ api ] ) {
        // eg document.addEventListener( "click", handler, useCapture );
        target[ api ].call( target, type, handler, useCapture );
      }
    };

  });




  Hat.results = {};

  var currentRing = 0,
      runnerConfig = {
        all: false
      };

  Hat.ring = function( opts ) {
    Hat.ring.cache.push( opts );
  };

  Hat.ring.cache = [];

  Hat.ring.getCount = function( index ) {
    var ring = Hat.ring.cache[ index ];
    return ring && ring.features || 0;
  };

  Hat.ring.totals = function() {
    return exports.QUnit.config.stats;
  };


  Hat.next = function() {
    var ring = Hat.ring.cache[ currentRing ];

    if ( ring ) {
      ring.test();
    }

    setTimeout(function() {
      exports.QUnit.start();
    }, 1000);
  };

  Hat.start = function() {
    Hat.next();
    Hat.emit("runner:start");
  };

  // Special, Prioritized Event Handlers

  // This is required for clearing, reseting and recalibrating QUnit
  Hat.on("runner:done", function() {
    if ( exports.Rng && exports.Rng.isFake ) {
      return;
    }
    exports.QUnit.config.autorun = false;
    exports.QUnit.config.blocking = false;
    exports.QUnit.config.semaphore = 0;
    exports.QUnit.load();
  });

  // This is required for clearing, reseting and recalibrating QUnit
  // Will also queue
  Hat.on("runner:ringDone", function( data ) {
    console.log( "exports.Rng!!!!!!!", exports.Rng );
    if ( exports.Rng && exports.Rng.isFake ) {
      return;
    }

    if ( exports.QUnit ) {
      [
        "previousFeature", "previousModule", "previousRing",
        "currentFeature", "currentModule"
      ].forEach(function( prop ) {
        exports.QUnit.config[ prop ] = "";
      });

      exports.QUnit.config.autorun = false;
      exports.QUnit.config.blocking = false;
      exports.QUnit.config.semaphore = 0;
      exports.QUnit.stop();

      console.log( "Stopped (" + currentRing + ")" );
      console.log( "Waiting..." );
    }

    currentRing++;

    // Unless overridden by user, immediately begin next set
    // of registered Ring tests
    if ( runnerConfig.all || data.failed === 0 ) {
      Hat.next();
    }
  });


  Hat.Runner = function() {};

  // External, third party override mappings
  Hat.Runner.config = function( prop, value ) {
    if ( QUnit.config[ prop ] ) {
      exports.QUnit.config[ prop ] = value;
    }

    runnerConfig[ prop ] = value;
  };

  // `params` initialized at top of program file
  // Force all rings to run, all the time.
  params.push({ key: "all", value: true });

  if ( params ) {
    params.forEach(function( obj ) {
      runnerConfig[ obj.key ] = obj.value;
    });
  }

  Hat.prefixes.expand = Hat.prefixes.expandCss;
  Hat.test = Hat.check = Hat.get;

  exports.TopHat = exports.Hat = exports.H = Hat;

}( typeof exports === "object" && exports || this) );

(function( exports, Hat ) {
  // References
  // https://developer.mozilla.org/en/Canvas_tutorial/Compositing
  // http://www.html5canvastutorials.com/tutorials/html5-canvas-arcs/


  // private: `rings` cache array for storing instances of Ring,
  //          `contexts` cache object for storing DOM canvas contexts
  var rings = [] ,
      contexts = {},
      colors = {
        // Color Constants
        // grey
        running: "255, 255, 255",
        // white
        clear: "255, 255, 255",
        // green
        pass: "0, 199, 59",
        // gray
        fail: "182, 184, 186"
      },
      lang = {
        nomore: "No more ticks available for this ring"
      };

  // Ring Constructor
  function Ring( opts ) {
    var prop;

    // Iterate options, intialize as instance properties, assign value
    for ( prop in opts ) {
      this[ prop ] = opts[ prop ];
    }

    // Initialize a history of ticks,
    // (Math.PI * 1.5) => 12 o'clock
    this.history = [ Math.PI * 1.5 ];
  }

  Ring.prototype.draw = function( start, end, color, alpha ) {


    var strokeStyle = "rgba(" + color + ", " + alpha + ")";

    // Begin drawing arc path
    this.ctx.beginPath();

    // Draw the arc to the next ending angle
    // x, y, radius, startAngle,endAngle, clockwise
    this.ctx.arc(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2,
      this.radius,
      start, end,
      false
    );

    // Set color of arc line
    this.ctx.strokeStyle = strokeStyle;
    // Set size of arc line
    this.ctx.lineWidth = this.line;
    // Draw the line
    this.ctx.stroke();
    // Close the arc path
    this.ctx.closePath();
  };

  Ring.prototype.tick = function( type, data ) {

    // Prevent (over)lapping ticks
    if ( this.history.length > this.ticks ) {
      console.log( lang.nomore );
      return;
    }

    // Normalize default calls to .tick() or .tick( data )
    if ( !type || typeof type !== "string" ) {
      data = type;
      type = "tick";
    }

    var start = this.history[ this.history.length - 1 ],
        end = start + this.step,
        alpha = 1,
        color = colors.running;

    // Determine color to draw slice.
    if ( data ) {
      color = colors[ !data.failed ? "pass" : "fail" ];
    }

    // Clear the grey "running" tick by overwriting
    // with a white "clearing" tick
    // if ( type === "tick" ) {
    //   this.draw( start, end, colors.clear, alpha );
    // }

    // Failed tests should adjust the alpha
    // channel of the display color to
    // indicate degree of the failure.
    // Light (less fail) <------> Dark (more fail)
    // if ( data && data.failed ) {
    //   alpha = data.failed / data.total;
    // }


    this.draw( start, end + 0.009, color, alpha );


    // If non- "running" or "clear" ticks...
    if ( type === "tick" ) {

      this.draw( start, end + 0.009, color, alpha );

      // Push the tick into the ring instance's history
      this.history.push( end );
    }
  };

  Ring.trace = function() {

    var ctx, line,
        trace = document.createElement("canvas"),
        dims = {
          width: null,
          height: null
        },
        canvas = (function() {
          var prop;

          for ( prop in contexts ) {
            return contexts[ prop ].canvas;
          }
        }());

    // Setup position of trace overlay
    trace.style.position = "relative";
    trace.style.top = "-305px";
    trace.style.left = "-5px";

    // Setup size of trace overlay
    trace.width = canvas.width + 10;
    trace.height = canvas.height + 10;

    // Insert into DOM, directly following canvas to overlay
    canvas.parentNode.insertBefore( trace, canvas.nextSibling );

    // Capture trace overlay canvas context
    ctx = trace.getContext("2d");

    dims.width = ctx.canvas.width / 2;
    dims.height = ctx.canvas.height / 2;

    line = Ring.get(0).line * rings.length + 1;

    // Starting point line
    ctx.fillRect( dims.width - 4, 10, 8, line );

    // Draw label bar
    ctx.fillRect(
      dims.width + 65,
      dims.height - 10,
      line, 21
    );

    // Set Label properties
    ctx.font = "bold 12px Helvetica";

    // Iterate over an array of radius
    // Adds a padding ring [ { line: 25 } ] for outline outline
    rings.concat([ { line: 25 } ]).forEach(function( ring, index ) {
      // Begin drawing the ring outline arc path
      ctx.beginPath();

      // x, y, radius, startAngle,endAngle, clockwise
      ctx.arc(
        dims.width,
        dims.height - 3,
        ring.line * (index + 1) + 40,
        Math.PI * 2, 0,
        false
      );

      // Set color of the ring outline arc line
      ctx.strokeStyle = "rgba( 0, 0, 0, 1 )";
      // Set size of ring outline arc line
      ctx.lineWidth = 8;
      // Draw the ring outline
      ctx.stroke();
      // Close the ring outline arc path
      ctx.closePath();


      // Set fillStyle for text drawing
      ctx.fillStyle = "rgba( 255, 255, 255, 1 )";

      // Draw label names
      if ( index < rings.length ) {
        ctx.fillText(
          "r." + index,
          dims.width + (ring.line * (index + 1) + 45),
          dims.height + 5
        );
      }
    });
  };



  Ring.create = function( nodeId, opts ) {
    var ring,
      config = exports.Ring.config;

    // Allow Ring to be created without requiring an index,
    // assume it's the next ring of the concentric set
    if ( opts.index == null ) {
      opts.index = rings.length;
    }

    // If no ticks specific for this ring
    // assume only one tick will occur. When ticks = 0,
    // a call to ring.tick() will "tick" the entire circle
    if ( opts.ticks == null ) {
      opts.ticks = 0;
    }

    // If it's set, use the pre-calculated next diameter
    // otherwise, use the configurable initial value
    opts.diameter = config.diameter.next || config.diameter.initial;

    // Pre-calculate the next ring diameter
    config.diameter.next = (config.diameter.next || config.diameter.initial) +
                            (config.diameter.padding * 2);
                            // ((config.diameter.padding * 2) + 10);

    // Calculate this ring's radius - is used in arc drawing arguments
    opts.radius = opts.diameter / 2;

    // If this is not the first, inner-most ring, artificially pad
    // the radius with an additional 1/2 of the radius size, to
    // clear the width of the line
    if ( opts.index > 0 ) {
      // opts.radius += config.diameter.initial / 2;
      // opts.radiusIsPadded = true;
    }

    // Set the line width to the configurable line initial value
    // this is used by the canvas api to determine visual width of
    // of the displayable line/arc
    opts.line = config.line.initial;

    // Capture the circumference - it's not used, but could be useful
    // in the future.
    opts.circ = opts.diameter * Math.PI;

    // Calculate the size a step for this ring will be
    opts.step = Math.PI * 2 / opts.ticks;

    // If context has no been cached, do so
    if ( !contexts[ nodeId ] ) {
      contexts[ nodeId ] = document.getElementById( nodeId ).getContext("2d");
    }

    // Assign a context to this ring, from the cache of contexts
    opts.ctx = contexts[ nodeId ];

    // Push a new Ring instance into the private `rings` cache array
    // `rings` are accessible via Ring.get([index])
    rings.push( new Ring(opts) );

    // Return the newly created ring from the `rings` cache array
    return rings[ rings.length - 1 ];
  };

  // Generate all visual ring instances based on the cached rings
  // in Hat.ring.cache
  // Ring instances require a canvas node ID
  Ring.create.all = function( nodeId ) {
    if ( Hat.ring.cache.length ) {
      Hat.ring.cache.forEach(function( ring ) {
        Ring.create( nodeId, {
          ticks: ring.features
        });
      });

      Ring.trace();
    }
  };

  // `rings` cache array access
  Ring.get = function( index ) {
    return index != null && rings[ index ];
  };

  // Configuration object
  Ring.config = {
    diameter: {
      padding: 25,
      initial: 150,
      next: 0
    },
    line: {
      initial: 25
    }
  };

  if ( typeof global !== "undefined" ) {
    Ring.config.contexts = {};
    contexts = Ring.config.contexts;
  }

  // Expose Ring API
  exports.Ring = Ring;

  if ( exports.Hat ) {
    exports.Hat.Ring = exports.Ring;
  }
}( typeof exports === "object" && exports || this, this.Hat || {} ) );
