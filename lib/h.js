/*
 * H
 *
 * Licensed W3C 3-clause BSD License.
 */

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
