(function( exports ) {

  var _test, _async;

  if ( !exports.QUnit ) {
    _test = exports.test;
    _async = exports.async_test;


    // Assertions Map
    exports.assertEqual = exports.equal = exports.assert_equals;
    exports.deepEqual = exports.assert_object_equals;

    exports.assert = exports.ok = function( condition, description ) {
      // Coerce to true, because the test should JUST DO THAT.
      exports.assert_true( !!condition, description );
    };

    exports.module = function( title, opts ) {
      exports.setup( opts.setup );
    };

    exports.test = function( desc, callback ) {
      _test( callback, desc );
    };

    // Make w3c Test Harness Compatible
    exports.asyncTest = function( desc, optCallback ) {

      var callback,
          testObj = _async( desc, { timeout: 5000 });

      if ( optCallback ) {
        testObj.step(function() {
          optCallback( testObj );
        });
      }
      return testObj;
    };
  }

  // Make QUnit Compatible
  if ( exports.QUnit ) {

    _async = exports.QUnit.asyncTest;

    exports.assert = exports.test.assert = exports.ok;

    exports.asyncTest = function( desc, expect, optCallback ) {

      if ( typeof expect === "function" ) {
        optCallback = expect;
      }

      var testObj = {
        done: function() {
          start();
        },
        step: function( step ) {
          setTimeout(step, 0);
        }
      };

      _async( desc, function() {
        optCallback( testObj );
      });
    };

    exports.QUnit.config.autostart = false;
  }

}( this ));
