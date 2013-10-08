(function( window ) {
  if ( !Array.prototype.forEach || !Array.isArray ) {
    window.location.href = "/about/index.html";
  }
}( this ));

// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());


// place any jQuery/helper plugins in here, instead of separate, slower script files.


/**
 * QUnit v1.3.0pre-Frankenstein.
 *
 * http://docs.jquery.com/QUnit
 *
 * Copyright (c) 2011 John Resig, Jörn Zaefferer
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * or GPL (GPL-LICENSE.txt) licenses.
 */

(function(window) {

var defined = {
  setTimeout: typeof window.setTimeout !== "undefined",
  sessionStorage: (function() {
    try {
      return !!sessionStorage.getItem;
    } catch(e) {
      return false;
    }
  })()
};

var testId = 0,
  toString = Object.prototype.toString,
  hasOwn = Object.prototype.hasOwnProperty;


var Assertions = {};

var Test = function(name, testName, expected, testEnvironmentArg, async, callback) {
  this.name = name;
  this.testName = testName;
  this.expected = expected;
  this.feature = "";
  this.title = "";
  this.ring = 0;
  this.testEnvironmentArg = testEnvironmentArg;
  this.async = async;
  this.callback = callback;
  this.assertions = [];
};
Test.prototype = {
  init: function() {
    var tests = id("qunit-tests");
    if (tests) {
      var b = document.createElement("strong");
        b.innerHTML = "Running " + this.name;
      var li = document.createElement("li");
        li.appendChild( b );
        li.className = "running";
        li.id = this.id = "test-output" + testId++;
      tests.appendChild( li );
    }
  },
  setup: function() {

    // var assertions;

    if (this.module != config.previousModule) {
      if ( config.previousModule ) {
        runLoggingCallbacks("moduleDone", QUnit, {
          name: config.previousModule,
          failed: config.moduleStats.bad,
          passed: config.moduleStats.all - config.moduleStats.bad,
          total: config.moduleStats.all
        });
      }
      config.previousModule = this.module;
      config.moduleStats = { all: 0, bad: 0 };
      runLoggingCallbacks( "moduleStart", QUnit, {
        name: this.module,
        ring: this.ring
      });
    }


    if (this.feature != config.previousFeature) {
      // if ( !Assertions[ this.feature ] ) {
      //   Assertions[ this.feature ] = this.assertions;
      // }
      if ( config.previousFeature ) {
        runLoggingCallbacks("featureDone", QUnit, {
          title: config.previousTitle,
          ring: config.ring,
          name: config.previousFeature,
          failed: config.featureStats.bad,
          passed: config.featureStats.all - config.featureStats.bad,
          total: config.featureStats.all,
          assertions: Assertions[ config.previousFeature ]
        });
      }
      // console.log( this.feature );
      config.previousRing = this.ring;
      config.previousFeature = this.feature;
      config.previousTitle = this.title;
      config.featureStats = { all: 0, bad: 0 };

      runLoggingCallbacks( "featureStart", QUnit, {
        title: this.title,
        name: this.feature,
        ring: this.ring
      });
    }


    config.current = this;

    this.testEnvironment = extend({
      setup: function() {},
      teardown: function() {}
    }, this.moduleTestEnvironment);

    if (this.testEnvironmentArg) {
      extend(this.testEnvironment, this.testEnvironmentArg);
    }

    runLoggingCallbacks( "testStart", QUnit, {
      name: this.testName,
      module: this.module,
      feature: this.feature,
      title: this.title,
      ring: this.ring
    });

    // allow utility functions to access the current test environment
    // TODO why??
    QUnit.current_testEnvironment = this.testEnvironment;

    try {
      if ( !config.pollution ) {
        saveGlobal();
      }

      this.testEnvironment.setup.call(this.testEnvironment);
    } catch(e) {
      QUnit.ok( false, "Setup failed on " + this.testName + ": " + e.message );
    }
  },
  run: function() {
    config.current = this;
    if ( this.async ) {
      QUnit.stop();
    }

    QUnit.reset();

    if ( config.notrycatch ) {
      this.callback.call(this.testEnvironment);
      return;
    }
    try {
      this.callback.call(this.testEnvironment);
    } catch(e) {
      fail("Test " + this.testName + " died, exception and test follows", e, this.callback);
      QUnit.ok( false, "Died on test #" + (this.assertions.length + 1) + ": " + e.message + " - " + QUnit.jsDump.parse(e) );
      // else next test will carry the responsibility
      saveGlobal();

      // Restart the tests if they're blocking
      if ( config.blocking ) {
        QUnit.start();
      }
    }
  },
  teardown: function() {
    config.current = this;
    try {
      this.testEnvironment.teardown.call(this.testEnvironment);
      checkPollution();
    } catch(e) {
      QUnit.ok( false, "Teardown failed on " + this.testName + ": " + e.message );
    }
  },
  finish: function() {

    try {
      QUnit.reset();
    } catch(e) {
      fail("reset() failed, following Test " + this.testName + ", exception and reset fn follows", e, QUnit.reset);
    }


    config.current = this;
    if ( this.expected != null && this.expected != this.assertions.length ) {
      QUnit.ok( false, "Expected " + this.expected + " assertions, but " + this.assertions.length + " were run" );
    }

    var good = 0, bad = 0,
      tests = id("qunit-tests");

    config.stats.all += this.assertions.length;
    config.moduleStats.all += this.assertions.length;
    config.featureStats.all += this.assertions.length;


    if ( tests ) {
      var ol = document.createElement("ol");

      for ( var i = 0; i < this.assertions.length; i++ ) {
        var assertion = this.assertions[i];

        var li = document.createElement("li");
        li.className = assertion.result ? "pass" : "fail";
        li.innerHTML = assertion.message || (assertion.result ? "okay" : "failed");
        ol.appendChild( li );

        if ( assertion.result ) {
          good++;
        } else {
          bad++;
          config.stats.bad++;
          config.moduleStats.bad++;
          config.featureStats.bad++;
        }
      }

      // store result when possible
      if ( QUnit.config.reorder && defined.sessionStorage ) {
        if (bad) {
          sessionStorage.setItem("qunit-" + this.module + "-" + this.testName, bad);
        } else {
          sessionStorage.removeItem("qunit-" + this.module + "-" + this.testName);
        }
      }

      if (bad == 0) {
        ol.style.display = "none";
      }

      var b = document.createElement("strong");
      b.innerHTML = this.name + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>";

      var a = document.createElement("a");
      a.innerHTML = "Rerun";
      a.href = QUnit.url({ filter: getText([b]).replace(/\([^)]+\)$/, "").replace(/(^\s*|\s*$)/g, "") });

      addEvent(b, "click", function() {
        var next = b.nextSibling.nextSibling,
          display = next.style.display;
        next.style.display = display === "none" ? "block" : "none";
      });

      addEvent(b, "dblclick", function(e) {
        var target = e && e.target ? e.target : window.event.srcElement;
        if ( target.nodeName.toLowerCase() == "span" || target.nodeName.toLowerCase() == "b" ) {
          target = target.parentNode;
        }
        if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
          window.location = QUnit.url({ filter: getText([target]).replace(/\([^)]+\)$/, "").replace(/(^\s*|\s*$)/g, "") });
        }
      });

      var li = id(this.id);
      li.className = bad ? "fail" : "pass";
      li.removeChild( li.firstChild );
      li.appendChild( b );
      li.appendChild( a );
      li.appendChild( ol );

    } else {
      for ( var i = 0; i < this.assertions.length; i++ ) {
        if ( !this.assertions[i].result ) {
          bad++;
          config.stats.bad++;
          config.moduleStats.bad++;
          config.featureStats.bad++;
        }
      }
    }

    // try {
    //   QUnit.reset();
    // } catch(e) {
    //   fail("reset() failed, following Test " + this.testName + ", exception and reset fn follows", e, QUnit.reset);
    // }


    if ( !Assertions[ this.feature ] ) {
      Assertions[ this.feature ] = [];
    }

    // console.log( "testDone", this.feature, this.assertions.length );

    // Update Assertions as each test completes
    Assertions[ this.feature ] = Assertions[ this.feature ].concat( this.assertions );

    runLoggingCallbacks( "testDone", QUnit, {
      name: this.testName,
      module: this.module,
      feature: this.feature,
      title: this.title,
      ring: this.ring,
      failed: bad,
      passed: this.assertions.length - bad,
      total: this.assertions.length
    });
  },

  queue: function() {
    var test = this;

    // console.log( "Queuing: ", test );

    synchronize(function() {
      test.init();
    });
    function run() {
      // each of these can by async
      synchronize(function() {
        test.setup();
      });
      synchronize(function() {
        test.run();
      });
      synchronize(function() {
        test.teardown();
      });
      synchronize(function() {
        test.finish();
      });
    }
    // defer when previous test run passed, if storage is available
    var bad = QUnit.config.reorder && defined.sessionStorage && +sessionStorage.getItem("qunit-" + this.module + "-" + this.testName);
    if (bad) {
      run();
    } else {
      synchronize(run, true);
    };
  }

};

var QUnit = {

  Assertions: Assertions,

  // call on start of module test to prepend name to all tests
  module: function(name, testEnvironment) {
    config.currentModule = name;
    config.currentModuleTestEnviroment = testEnvironment;
  },

  feature: function(name, ring, title) {
    config.currentFeature = name;
    config.currentRing = ring;
    config.currentTitle = title;
    config.ring = ring;
  },

  asyncTest: function(testName, expected, callback) {
    if ( arguments.length === 2 ) {
      callback = expected;
      expected = null;
    }

    QUnit.test(testName, expected, callback, true);
  },

  test: function(testName, expected, callback, async) {
    var name = '<span class="test-name">' + escapeInnerText(testName) + '</span>', testEnvironmentArg;

    if ( arguments.length === 2 ) {
      callback = expected;
      expected = null;
    }
    // is 2nd argument a testEnvironment?
    if ( expected && typeof expected === "object") {
      testEnvironmentArg = expected;
      expected = null;
    }

    if ( config.currentModule ) {
      name = '<span class="module-name">' + config.currentModule + "</span>: " + name;
    }

    if ( !validTest(config.currentModule + ": " + testName) ) {
      return;
    }

    var test = new Test(name, testName, expected, testEnvironmentArg, async, callback);

    test.ring = config.currentRing;
    test.feature = config.currentFeature;
    test.title = config.currentTitle;


    test.module = config.currentModule;
    test.moduleTestEnvironment = config.currentModuleTestEnviroment;

    test.queue();
  },

  /**
   * Featureify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
   */
  expect: function(asserts) {
    config.current.expected = asserts;
  },

  /**
   * Asserts true.
   * @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
   */
  ok: function(a, msg) {
    a = !!a;
    var details = {
      result: a,
      message: msg
    };
    msg = escapeInnerText(msg);
    runLoggingCallbacks( "log", QUnit, details );
    config.current.assertions.push({
      result: a,
      message: msg
    });
  },

  /**
   * Checks that the first two arguments are equal, with an optional message.
   * Prints out both actual and expected values.
   *
   * Prefered to ok( actual == expected, message )
   *
   * @example equal( format("Received {0} bytes.", 2), "Received 2 bytes." );
   *
   * @param Object actual
   * @param Object expected
   * @param String message (optional)
   */
  equal: function(actual, expected, message) {
    QUnit.push(expected == actual, actual, expected, message);
  },

  notEqual: function(actual, expected, message) {
    QUnit.push(expected != actual, actual, expected, message);
  },

  deepEqual: function(actual, expected, message) {
    QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
  },

  notDeepEqual: function(actual, expected, message) {
    QUnit.push(!QUnit.equiv(actual, expected), actual, expected, message);
  },

  strictEqual: function(actual, expected, message) {
    QUnit.push(expected === actual, actual, expected, message);
  },

  notStrictEqual: function(actual, expected, message) {
    QUnit.push(expected !== actual, actual, expected, message);
  },

  raises: function(block, expected, message) {
    var actual, ok = false;

    if (typeof expected === "string") {
      message = expected;
      expected = null;
    }

    try {
      block();
    } catch (e) {
      actual = e;
    }

    if (actual) {
      // we don't want to validate thrown error
      if (!expected) {
        ok = true;
      // expected is a regexp
      } else if (QUnit.objectType(expected) === "regexp") {
        ok = expected.test(actual);
      // expected is a constructor
      } else if (actual instanceof expected) {
        ok = true;
      // expected is a validation function which returns true is validation passed
      } else if (expected.call({}, actual) === true) {
        ok = true;
      }
    }

    QUnit.ok(ok, message);
  },

  start: function(count) {
    config.semaphore -= count || 1;
    if (config.semaphore > 0) {
      // don't start until equal number of stop-calls
      return;
    }
    if (config.semaphore < 0) {
      // ignore if start is called more often then stop
      config.semaphore = 0;
    }
    // A slight delay, to avoid any current callbacks
    if ( defined.setTimeout ) {
      window.setTimeout(function() {
        if (config.semaphore > 0) {
          return;
        }
        if ( config.timeout ) {
          clearTimeout(config.timeout);
        }

        config.blocking = false;
        process(true);
      }, 13);
    } else {
      config.blocking = false;
      process(true);
    }
  },

  stop: function(count) {
    config.semaphore += count || 1;
    config.blocking = true;

    if ( config.testTimeout && defined.setTimeout ) {
      clearTimeout(config.timeout);
      config.timeout = window.setTimeout(function() {
        QUnit.ok( false, "Test timed out" );
        config.semaphore = 1;
        QUnit.start();
      }, config.testTimeout);
    }
  }
};

//We want access to the constructor's prototype
(function() {
  function F(){};
  F.prototype = QUnit;
  QUnit = new F();
  //Make F QUnit's constructor so that we can add to the prototype later
  QUnit.constructor = F;
})();

// Backwards compatibility, deprecated
QUnit.equals = QUnit.equal;
QUnit.same = QUnit.deepEqual;

// Maintain internal state
var config = {
  // The queue of tests to run
  queue: [],

  // block until document ready
  blocking: true,

  // when enabled, show only failing tests
  // gets persisted through sessionStorage and can be changed in UI via checkbox
  hidepassed: false,

  // by default, run previously failed tests first
  // very useful in combination with "Hide passed tests" checked
  reorder: true,

  // by default, modify document.title when suite is done
  altertitle: true,

  // Fixture Id
  fixtureId: "qunit-fixture",

  urlConfig: ["noglobals", "notrycatch"],

  //logging callback queues
  begin: [],
  done: [],
  log: [],
  testStart: [],
  testDone: [],
  featureStart: [],
  featureDone: [],
  moduleStart: [],
  moduleDone: []
};

// Load paramaters
(function() {
  var location = window.location || { search: "", protocol: "file:" },
    params = location.search.slice( 1 ).split( "&" ),
    length = params.length,
    urlParams = {},
    current;

  if ( params[ 0 ] ) {
    for ( var i = 0; i < length; i++ ) {
      current = params[ i ].split( "=" );
      current[ 0 ] = decodeURIComponent( current[ 0 ] );
      // allow just a key to turn on a flag, e.g., test.html?noglobals
      current[ 1 ] = current[ 1 ] ? decodeURIComponent( current[ 1 ] ) : true;
      urlParams[ current[ 0 ] ] = current[ 1 ];
    }
  }

  QUnit.urlParams = urlParams;
  config.filter = urlParams.filter;

  // Figure out if we're running the tests from a server or not
  QUnit.isLocal = !!(location.protocol === "file:");
})();

// Expose the API as global variables, unless an 'exports'
// object exists, in that case we assume we're in CommonJS
if ( typeof exports === "undefined" || typeof require === "undefined" ) {
  extend(window, QUnit);
  window.QUnit = QUnit;
} else {
  extend(exports, QUnit);
  exports.QUnit = QUnit;
}

// define these after exposing globals to keep them in these QUnit namespace only
extend(QUnit, {
  config: config,

  // Initialize the configuration options
  init: function() {
    extend(config, {
      stats: { all: 0, bad: 0 },
      moduleStats: { all: 0, bad: 0 },
      featureStats: { all: 0, bad: 0 },
      started: +new Date,
      updateRate: 1000,
      blocking: false,
      autostart: true,
      autorun: false,
      filter: "",
      queue: [],
      semaphore: 0
    });

    var tests = id( "qunit-tests" ),
      banner = id( "qunit-banner" ),
      result = id( "qunit-testresult" );

    if ( tests ) {
      tests.innerHTML = "";
    }

    if ( banner ) {
      banner.className = "";
    }

    if ( result ) {
      result.parentNode.removeChild( result );
    }

    if ( tests ) {
      result = document.createElement( "p" );
      result.id = "qunit-testresult";
      result.className = "result";
      tests.parentNode.insertBefore( result, tests );
      result.innerHTML = "Running...<br/>&nbsp;";
    }
  },

  /**
   * Resets the test setup. Useful for tests that modify the DOM.
   *
   * If jQuery is available, uses jQuery's html(), otherwise just innerHTML.
   */
  reset: function() {
    // if ( window.jQuery ) {
    //   jQuery( "#" + config.fixtureId ).html( config.fixture );
    // } else {
      var main = id( config.fixtureId ),
          fixtureHTML;


      if ( main ) {
        if ( typeof App !== "undefined" ) {
          fixtureHTML = App.Cache.get("fixtures").by( "name", config.current.feature ).source;
        } else {

          if ( typeof Visual !== "undefined" ) {
            fixtureHTML = Visual.fixture;
          } else {
            fixtureHTML = config.fixture;
          }
        }
        main.innerHTML = fixtureHTML;
      }
    // }
  },

  /**
   * Trigger an event on an element.
   *
   * @example triggerEvent( document.body, "click" );
   *
   * @param DOMElement elem
   * @param String type
   */
  triggerEvent: function( elem, type, event ) {
    if ( document.createEvent ) {
      event = document.createEvent("MouseEvents");
      event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);
      elem.dispatchEvent( event );

    } else if ( elem.fireEvent ) {
      elem.fireEvent("on"+type);
    }
  },

  // Safe object type checking
  is: function( type, obj ) {
    return QUnit.objectType( obj ) == type;
  },

  objectType: function( obj ) {
    if (typeof obj === "undefined") {
        return "undefined";

    // consider: typeof null === object
    }
    if (obj === null) {
        return "null";
    }

    var type = toString.call( obj ).match(/^\[object\s(.*)\]$/)[1] || "";

    switch (type) {
        case "Number":
            if (isNaN(obj)) {
                return "nan";
            } else {
                return "number";
            }
        case "String":
        case "Boolean":
        case "Array":
        case "Date":
        case "RegExp":
        case "Function":
            return type.toLowerCase();
    }
    if (typeof obj === "object") {
        return "object";
    }
    return undefined;
  },

  push: function(result, actual, expected, message) {
    var details = {
      result: result,
      message: message,
      actual: actual,
      expected: expected
    };

    message = escapeInnerText(message) || (result ? "okay" : "failed");
    message = '<span class="test-message">' + message + "</span>";
    expected = escapeInnerText(QUnit.jsDump.parse(expected));
    actual = escapeInnerText(QUnit.jsDump.parse(actual));
    var output = message + '<table><tr class="test-expected"><th>Expected: </th><td><pre>' + expected + '</pre></td></tr>';
    if (actual != expected) {
      output += '<tr class="test-actual"><th>Result: </th><td><pre>' + actual + '</pre></td></tr>';
      output += '<tr class="test-diff"><th>Diff: </th><td><pre>' + QUnit.diff(expected, actual) +'</pre></td></tr>';
    }
    if (!result) {
      var source = sourceFromStacktrace();
      if (source) {
        details.source = source;
        output += '<tr class="test-source"><th>Source: </th><td><pre>' + escapeInnerText(source) + '</pre></td></tr>';
      }
    }
    output += "</table>";

    runLoggingCallbacks( "log", QUnit, details );

    config.current.assertions.push({
      result: !!result,
      message: output
    });
  },

  url: function( params ) {
    params = extend( extend( {}, QUnit.urlParams ), params );
    var querystring = "?",
      key;
    for ( key in params ) {
      if ( !hasOwn.call( params, key ) ) {
        continue;
      }
      querystring += encodeURIComponent( key ) + "=" +
        encodeURIComponent( params[ key ] ) + "&";
    }
    return window.location.pathname + querystring.slice( 0, -1 );
  },

  extend: extend,
  id: id,
  addEvent: addEvent
});

//QUnit.constructor is set to the empty F() above so that we can add to it's prototype later
//Doing this allows us to tell if the following methods have been overwritten on the actual
//QUnit object, which is a deprecated way of using the callbacks.
extend(QUnit.constructor.prototype, {
  // Logging callbacks; all receive a single argument with the listed properties
  // run test/logs.html for any related changes
  begin: registerLoggingCallback("begin"),
  // done: { failed, passed, total, runtime }
  done: registerLoggingCallback("done"),
  // log: { result, actual, expected, message }
  log: registerLoggingCallback("log"),
  // testStart: { name }
  testStart: registerLoggingCallback("testStart"),
  // testDone: { name, failed, passed, total }
  testDone: registerLoggingCallback("testDone"),
  // featureStart: { name }
  featureStart: registerLoggingCallback("featureStart"),
  // featureDone: { name, failed, passed, total }
  featureDone: registerLoggingCallback("featureDone"),

  // moduleStart: { name }
  moduleStart: registerLoggingCallback("moduleStart"),
  // moduleDone: { name, failed, passed, total }
  moduleDone: registerLoggingCallback("moduleDone")
});

if ( typeof document === "undefined" || document.readyState === "complete" ) {
  config.autorun = true;
}

QUnit.load = function() {
  runLoggingCallbacks( "begin", QUnit, {} );

  // Initialize the config, saving the execution queue
  var oldconfig = extend({}, config);
  QUnit.init();
  extend(config, oldconfig);

  config.blocking = false;

  var urlConfigHtml = "", len = config.urlConfig.length;
  for ( var i = 0, val; i < len, val = config.urlConfig[i]; i++ ) {
    config[val] = QUnit.urlParams[val];
    urlConfigHtml += '<label><input name="' + val + '" type="checkbox"' + ( config[val] ? ' checked="checked"' : '' ) + '>' + val + '</label>';
  }

  var userAgent = id("qunit-userAgent");
  if ( userAgent ) {
    userAgent.innerHTML = navigator.userAgent;
  }
  var banner = id("qunit-header");
  if ( banner ) {
    banner.innerHTML = '<a href="' + QUnit.url({ filter: undefined }) + '"> ' + banner.innerHTML + '</a> ' + urlConfigHtml;
    addEvent( banner, "change", function( event ) {
      var params = {};
      params[ event.target.name ] = event.target.checked ? true : undefined;
      window.location = QUnit.url( params );
    });
  }

  var toolbar = id("qunit-testrunner-toolbar");
  if ( toolbar ) {
    var filter = document.createElement("input");
    filter.type = "checkbox";
    filter.id = "qunit-filter-pass";
    addEvent( filter, "click", function() {
      var ol = document.getElementById("qunit-tests");
      if ( filter.checked ) {
        ol.className = ol.className + " hidepass";
      } else {
        var tmp = " " + ol.className.replace( /[\n\t\r]/g, " " ) + " ";
        ol.className = tmp.replace(/ hidepass /, " ");
      }
      if ( defined.sessionStorage ) {
        if (filter.checked) {
          sessionStorage.setItem("qunit-filter-passed-tests", "true");
        } else {
          sessionStorage.removeItem("qunit-filter-passed-tests");
        }
      }
    });
    if ( config.hidepassed || defined.sessionStorage && sessionStorage.getItem("qunit-filter-passed-tests") ) {
      filter.checked = true;
      var ol = document.getElementById("qunit-tests");
      ol.className = ol.className + " hidepass";
    }
    toolbar.appendChild( filter );

    var label = document.createElement("label");
    label.setAttribute("for", "qunit-filter-pass");
    label.innerHTML = "Hide passed tests";
    toolbar.appendChild( label );
  }

  var main = id(config.fixtureId);
  if ( main ) {
    //console.log( "main.innerHTML", main.innerHTML );
    config.fixture = main.innerHTML;
  }

  if (config.autostart) {
    QUnit.start();
  }
};

addEvent(window, "load", QUnit.load);

// addEvent(window, "error") gives us a useless event object
window.onerror = function( message, file, line ) {
  if ( QUnit.config.current ) {
    ok( false, message + ", " + file + ":" + line );
  } else {
    test( "global failure", function() {
      ok( false, message + ", " + file + ":" + line );
    });
  }
};

function done() {
  config.autorun = true;


  if ( config.currentFeature ) {
    runLoggingCallbacks( "featureDone", QUnit, {
      title: config.currentTitle,
      name: config.currentFeature,
      ring: config.currentRing,
      failed: config.featureStats.bad,
      passed: config.featureStats.all - config.featureStats.bad,
      total: config.featureStats.all,
      assertions: Assertions[ config.currentFeature ]
    });
  }

  // Log the last module results
  if ( config.currentModule ) {
    runLoggingCallbacks( "moduleDone", QUnit, {
      name: config.currentModule,
      ring: config.ring,
      failed: config.moduleStats.bad,
      passed: config.moduleStats.all - config.moduleStats.bad,
      total: config.moduleStats.all
    });
  }


  var banner = id("qunit-banner"),
    tests = id("qunit-tests"),
    runtime = +new Date - config.started,
    passed = config.stats.all - config.stats.bad,
    html = [
      'Tests completed in ',
      runtime,
      ' milliseconds.<br/>',
      '<span class="passed">',
      passed,
      '</span> tests of <span class="total">',
      config.stats.all,
      '</span> passed, <span class="failed">',
      config.stats.bad,
      '</span> failed.'
    ].join('');

  if ( banner ) {
    banner.className = (config.stats.bad ? "qunit-fail" : "qunit-pass");
  }

  if ( tests ) {
    id( "qunit-testresult" ).innerHTML = html;
  }

  // if ( config.altertitle && typeof document !== "undefined" && document.title ) {
  //   // show ✖ for good, ✔ for bad suite result in title
  //   // use escape sequences in case file gets loaded with non-utf-8-charset
  //   document.title = [
  //     (config.stats.bad ? "\u2716" : "\u2714"),
  //     document.title.replace(/^[\u2714\u2716] /i, "")
  //   ].join(" ");
  // }

  runLoggingCallbacks( 'done', QUnit, {
    failed: config.stats.bad,
    passed: passed,
    total: config.stats.all,
    runtime: runtime
  });
}

function validTest( name ) {
  var filter = config.filter,
    run = false;

  if ( !filter ) {
    return true;
  }

  var not = filter.charAt( 0 ) === "!";
  if ( not ) {
    filter = filter.slice( 1 );
  }

  if ( name.indexOf( filter ) !== -1 ) {
    return !not;
  }

  if ( not ) {
    run = true;
  }

  return run;
}

// so far supports only Firefox, Chrome and Opera (buggy)
// could be extended in the future to use something like https://github.com/csnover/TraceKit
function sourceFromStacktrace() {
  try {
    throw new Error();
  } catch ( e ) {
    if (e.stacktrace) {
      // Opera
      return e.stacktrace.split("\n")[6];
    } else if (e.stack) {
      // Firefox, Chrome
      return e.stack.split("\n")[4];
    } else if (e.sourceURL) {
      // Safari, PhantomJS
      // TODO sourceURL points at the 'throw new Error' line above, useless
      //return e.sourceURL + ":" + e.line;
    }
  }
}

function escapeInnerText(s) {
  if (!s) {
    return "";
  }
  s = s + "";
  return s.replace(/[\&<>]/g, function(s) {
    switch(s) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      default: return s;
    }
  });
}

function synchronize( callback, last ) {
  config.queue.push( callback );

  if ( config.autorun && !config.blocking ) {
    process(last);
  }
}

function process( last ) {
  // console.log( "process", last );
  var start = new Date().getTime();
  config.depth = config.depth ? config.depth + 1 : 1;

  while ( config.queue.length && !config.blocking ) {
    if ( !defined.setTimeout || config.updateRate <= 0 || ( ( new Date().getTime() - start ) < config.updateRate ) ) {
      config.queue.shift()();
    } else {
      window.setTimeout( function(){
        process( last );
      }, 13 );
      break;
    }
  }
  config.depth--;
  if ( last && !config.blocking && !config.queue.length && config.depth === 0 ) {
    done();
  }
}

function saveGlobal() {
  config.pollution = [];

  if ( config.noglobals ) {
    for ( var key in window ) {
      if ( !hasOwn.call( window, key ) ) {
        continue;
      }
      config.pollution.push( key );
    }
  }
}

function checkPollution( name ) {
  var old = config.pollution;
  saveGlobal();

  var newGlobals = diff( config.pollution, old );
  if ( newGlobals.length > 0 ) {
    ok( false, "Introduced global variable(s): " + newGlobals.join(", ") );
  }

  var deletedGlobals = diff( old, config.pollution );
  if ( deletedGlobals.length > 0 ) {
    ok( false, "Deleted global variable(s): " + deletedGlobals.join(", ") );
  }
}

// returns a new Array with the elements that are in a but not in b
function diff( a, b ) {
  var result = a.slice();
  for ( var i = 0; i < result.length; i++ ) {
    for ( var j = 0; j < b.length; j++ ) {
      if ( result[i] === b[j] ) {
        result.splice(i, 1);
        i--;
        break;
      }
    }
  }
  return result;
}

function fail(message, exception, callback) {
  if ( typeof console !== "undefined" && console.error && console.warn ) {
    console.error(message);
    console.error(exception);
    console.error(exception.stack);
    console.warn(callback.toString());

  } else if ( window.opera && opera.postError ) {
    opera.postError(message, exception, callback.toString);
  }
}

function extend(a, b) {
  for ( var prop in b ) {
    if ( b[prop] === undefined ) {
      delete a[prop];

    // Avoid "Member not found" error in IE8 caused by setting window.constructor
    } else if ( prop !== "constructor" || a !== window ) {
      a[prop] = b[prop];
    }
  }

  return a;
}

function addEvent(elem, type, fn) {
  if ( elem.addEventListener ) {
    elem.addEventListener( type, fn, false );
  } else if ( elem.attachEvent ) {
    elem.attachEvent( "on" + type, fn );
  } else {
    fn();
  }
}

function id(name) {
  return !!(typeof document !== "undefined" && document && document.getElementById) &&
    document.getElementById( name );
}

function registerLoggingCallback(key){
  return function(callback){
    config[key].push( callback );
  };
}

// Supports deprecated method of completely overwriting logging callbacks
function runLoggingCallbacks(key, scope, args) {
  //debugger;
  var callbacks;
  if ( QUnit.hasOwnProperty(key) ) {
    QUnit[key].call(scope, args);
  } else {
    callbacks = config[key];
    for( var i = 0; i < callbacks.length; i++ ) {
      callbacks[i].call( scope, args );
    }
  }
}

// Test for equality any JavaScript type.
// Author: Philippe Rathé <prathe@gmail.com>
QUnit.equiv = function () {

  var innerEquiv; // the real equiv function
  var callers = []; // stack to decide between skip/abort functions
  var parents = []; // stack to avoiding loops from circular referencing

  // Call the o related callback with the given arguments.
  function bindCallbacks(o, callbacks, args) {
    var prop = QUnit.objectType(o);
    if (prop) {
      if (QUnit.objectType(callbacks[prop]) === "function") {
        return callbacks[prop].apply(callbacks, args);
      } else {
        return callbacks[prop]; // or undefined
      }
    }
  }

  var getProto = Object.getPrototypeOf || function (obj) {
    return obj.__proto__;
  };

  var callbacks = function () {

    // for string, boolean, number and null
    function useStrictEquality(b, a) {
      if (b instanceof a.constructor || a instanceof b.constructor) {
        // to catch short annotaion VS 'new' annotation of a
        // declaration
        // e.g. var i = 1;
        // var j = new Number(1);
        return a == b;
      } else {
        return a === b;
      }
    }

    return {
      "string" : useStrictEquality,
      "boolean" : useStrictEquality,
      "number" : useStrictEquality,
      "null" : useStrictEquality,
      "undefined" : useStrictEquality,

      "nan" : function(b) {
        return isNaN(b);
      },

      "date" : function(b, a) {
        return QUnit.objectType(b) === "date"
            && a.valueOf() === b.valueOf();
      },

      "regexp" : function(b, a) {
        return QUnit.objectType(b) === "regexp"
            && a.source === b.source && // the regex itself
            a.global === b.global && // and its modifers
                          // (gmi) ...
            a.ignoreCase === b.ignoreCase
            && a.multiline === b.multiline;
      },

      // - skip when the property is a method of an instance (OOP)
      // - abort otherwise,
      // initial === would have catch identical references anyway
      "function" : function() {
        var caller = callers[callers.length - 1];
        return caller !== Object && typeof caller !== "undefined";
      },

      "array" : function(b, a) {
        var i, j, loop;
        var len;

        // b could be an object literal here
        if (!(QUnit.objectType(b) === "array")) {
          return false;
        }

        len = a.length;
        if (len !== b.length) { // safe and faster
          return false;
        }

        // track reference to avoid circular references
        parents.push(a);
        for (i = 0; i < len; i++) {
          loop = false;
          for (j = 0; j < parents.length; j++) {
            if (parents[j] === a[i]) {
              loop = true;// dont rewalk array
            }
          }
          if (!loop && !innerEquiv(a[i], b[i])) {
            parents.pop();
            return false;
          }
        }
        parents.pop();
        return true;
      },

      "object" : function(b, a) {
        var i, j, loop;
        var eq = true; // unless we can proove it
        var aProperties = [], bProperties = []; // collection of
                            // strings

        // comparing constructors is more strict than using
        // instanceof
        if (a.constructor !== b.constructor) {
          // Allow objects with no prototype to be equivalent to
          // objects with Object as their constructor.
          if (!((getProto(a) === null && getProto(b) === Object.prototype) ||
              (getProto(b) === null && getProto(a) === Object.prototype)))
          {
            return false;
          }
        }

        // stack constructor before traversing properties
        callers.push(a.constructor);
        // track reference to avoid circular references
        parents.push(a);

        for (i in a) { // be strict: don't ensures hasOwnProperty
                // and go deep
          loop = false;
          for (j = 0; j < parents.length; j++) {
            if (parents[j] === a[i])
              loop = true; // don't go down the same path
                      // twice
          }
          aProperties.push(i); // collect a's properties

          if (!loop && !innerEquiv(a[i], b[i])) {
            eq = false;
            break;
          }
        }

        callers.pop(); // unstack, we are done
        parents.pop();

        for (i in b) {
          bProperties.push(i); // collect b's properties
        }

        // Ensures identical properties name
        return eq
            && innerEquiv(aProperties.sort(), bProperties
                .sort());
      }
    };
  }();

  innerEquiv = function() { // can take multiple arguments
    var args = Array.prototype.slice.apply(arguments);
    if (args.length < 2) {
      return true; // end transition
    }

    return (function(a, b) {
      if (a === b) {
        return true; // catch the most you can
      } else if (a === null || b === null || typeof a === "undefined"
          || typeof b === "undefined"
          || QUnit.objectType(a) !== QUnit.objectType(b)) {
        return false; // don't lose time with error prone cases
      } else {
        return bindCallbacks(a, callbacks, [ b, a ]);
      }

      // apply transition with (1..n) arguments
    })(args[0], args[1])
        && arguments.callee.apply(this, args.splice(1,
            args.length - 1));
  };

  return innerEquiv;

}();

/**
 * jsDump Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com |
 * http://flesler.blogspot.com Licensed under BSD
 * (http://www.opensource.org/licenses/bsd-license.php) Date: 5/15/2008
 *
 * @projectDescription Advanced and extensible data dumping for Javascript.
 * @version 1.0.0
 * @author Ariel Flesler
 * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
 */
QUnit.jsDump = (function() {
  function quote( str ) {
    return '"' + str.toString().replace(/"/g, '\\"') + '"';
  };
  function literal( o ) {
    return o + '';
  };
  function join( pre, arr, post ) {
    var s = jsDump.separator(),
      base = jsDump.indent(),
      inner = jsDump.indent(1);
    if ( arr.join )
      arr = arr.join( ',' + s + inner );
    if ( !arr )
      return pre + post;
    return [ pre, inner + arr, base + post ].join(s);
  };
  function array( arr, stack ) {
    var i = arr.length, ret = Array(i);
    this.up();
    while ( i-- )
      ret[i] = this.parse( arr[i] , undefined , stack);
    this.down();
    return join( '[', ret, ']' );
  };

  var reName = /^function (\w+)/;

  var jsDump = {
    parse:function( obj, type, stack ) { //type is used mostly internally, you can fix a (custom)type in advance
      stack = stack || [ ];
      var parser = this.parsers[ type || this.typeOf(obj) ];
      type = typeof parser;
      var inStack = inArray(obj, stack);
      if (inStack != -1) {
        return 'recursion('+(inStack - stack.length)+')';
      }
      //else
      if (type == 'function')  {
          stack.push(obj);
          var res = parser.call( this, obj, stack );
          stack.pop();
          return res;
      }
      // else
      return (type == 'string') ? parser : this.parsers.error;
    },
    typeOf:function( obj ) {
      var type;
      if ( obj === null ) {
        type = "null";
      } else if (typeof obj === "undefined") {
        type = "undefined";
      } else if (QUnit.is("RegExp", obj)) {
        type = "regexp";
      } else if (QUnit.is("Date", obj)) {
        type = "date";
      } else if (QUnit.is("Function", obj)) {
        type = "function";
      } else if (typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined") {
        type = "window";
      } else if (obj.nodeType === 9) {
        type = "document";
      } else if (obj.nodeType) {
        type = "node";
      } else if (
        // native arrays
        toString.call( obj ) === "[object Array]" ||
        // NodeList objects
        ( typeof obj.length === "number" && typeof obj.item !== "undefined" && ( obj.length ? obj.item(0) === obj[0] : ( obj.item( 0 ) === null && typeof obj[0] === "undefined" ) ) )
      ) {
        type = "array";
      } else {
        type = typeof obj;
      }
      return type;
    },
    separator:function() {
      return this.multiline ?  this.HTML ? '<br />' : '\n' : this.HTML ? '&nbsp;' : ' ';
    },
    indent:function( extra ) {// extra can be a number, shortcut for increasing-calling-decreasing
      if ( !this.multiline )
        return '';
      var chr = this.indentChar;
      if ( this.HTML )
        chr = chr.replace(/\t/g,'   ').replace(/ /g,'&nbsp;');
      return Array( this._depth_ + (extra||0) ).join(chr);
    },
    up:function( a ) {
      this._depth_ += a || 1;
    },
    down:function( a ) {
      this._depth_ -= a || 1;
    },
    setParser:function( name, parser ) {
      this.parsers[name] = parser;
    },
    // The next 3 are exposed so you can use them
    quote:quote,
    literal:literal,
    join:join,
    //
    _depth_: 1,
    // This is the list of parsers, to modify them, use jsDump.setParser
    parsers:{
      window: '[Window]',
      document: '[Document]',
      error:'[ERROR]', //when no parser is found, shouldn't happen
      unknown: '[Unknown]',
      'null':'null',
      'undefined':'undefined',
      'function':function( fn ) {
        var ret = 'function',
          name = 'name' in fn ? fn.name : (reName.exec(fn)||[])[1];//functions never have name in IE
        if ( name )
          ret += ' ' + name;
        ret += '(';

        ret = [ ret, QUnit.jsDump.parse( fn, 'functionArgs' ), '){'].join('');
        return join( ret, QUnit.jsDump.parse(fn,'functionCode'), '}' );
      },
      array: array,
      nodelist: array,
      arguments: array,
      object:function( map, stack ) {
        var ret = [ ];
        QUnit.jsDump.up();
        for ( var key in map ) {
            var val = map[key];
          ret.push( QUnit.jsDump.parse(key,'key') + ': ' + QUnit.jsDump.parse(val, undefined, stack));
                }
        QUnit.jsDump.down();
        return join( '{', ret, '}' );
      },
      node:function( node ) {
        var open = QUnit.jsDump.HTML ? '&lt;' : '<',
          close = QUnit.jsDump.HTML ? '&gt;' : '>';

        var tag = node.nodeName.toLowerCase(),
          ret = open + tag;

        for ( var a in QUnit.jsDump.DOMAttrs ) {
          var val = node[QUnit.jsDump.DOMAttrs[a]];
          if ( val )
            ret += ' ' + a + '=' + QUnit.jsDump.parse( val, 'attribute' );
        }
        return ret + close + open + '/' + tag + close;
      },
      functionArgs:function( fn ) {//function calls it internally, it's the arguments part of the function
        var l = fn.length;
        if ( !l ) return '';

        var args = Array(l);
        while ( l-- )
          args[l] = String.fromCharCode(97+l);//97 is 'a'
        return ' ' + args.join(', ') + ' ';
      },
      key:quote, //object calls it internally, the key part of an item in a map
      functionCode:'[code]', //function calls it internally, it's the content of the function
      attribute:quote, //node calls it internally, it's an html attribute value
      string:quote,
      date:quote,
      regexp:literal, //regex
      number:literal,
      'boolean':literal
    },
    DOMAttrs:{//attributes to dump from nodes, name=>realName
      id:'id',
      name:'name',
      'class':'className'
    },
    HTML:false,//if true, entities are escaped ( <, >, \t, space and \n )
    indentChar:'  ',//indentation unit
    multiline:true //if true, items in a collection, are separated by a \n, else just a space.
  };

  return jsDump;
})();

// from Sizzle.js
function getText( elems ) {
  var ret = "", elem;

  for ( var i = 0; elems[i]; i++ ) {
    elem = elems[i];

    // Get the text from text nodes and CDATA nodes
    if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
      ret += elem.nodeValue;

    // Traverse everything else, except comment nodes
    } else if ( elem.nodeType !== 8 ) {
      ret += getText( elem.childNodes );
    }
  }

  return ret;
};

//from jquery.js
function inArray( elem, array ) {
  if ( array.indexOf ) {
    return array.indexOf( elem );
  }

  for ( var i = 0, length = array.length; i < length; i++ ) {
    if ( array[ i ] === elem ) {
      return i;
    }
  }

  return -1;
}

/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 *
 * Usage: QUnit.diff(expected, actual)
 *
 * QUnit.diff("the quick brown fox jumped over", "the quick fox jumps over") == "the  quick <del>brown </del> fox <del>jumped </del><ins>jumps </ins> over"
 */
QUnit.diff = (function() {
  function diff(o, n) {
    var ns = {};
    var os = {};

    for (var i = 0; i < n.length; i++) {
      if (ns[n[i]] == null)
        ns[n[i]] = {
          rows: [],
          o: null
        };
      ns[n[i]].rows.push(i);
    }

    for (var i = 0; i < o.length; i++) {
      if (os[o[i]] == null)
        os[o[i]] = {
          rows: [],
          n: null
        };
      os[o[i]].rows.push(i);
    }

    for (var i in ns) {
      if ( !hasOwn.call( ns, i ) ) {
        continue;
      }
      if (ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1) {
        n[ns[i].rows[0]] = {
          text: n[ns[i].rows[0]],
          row: os[i].rows[0]
        };
        o[os[i].rows[0]] = {
          text: o[os[i].rows[0]],
          row: ns[i].rows[0]
        };
      }
    }

    for (var i = 0; i < n.length - 1; i++) {
      if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
      n[i + 1] == o[n[i].row + 1]) {
        n[i + 1] = {
          text: n[i + 1],
          row: n[i].row + 1
        };
        o[n[i].row + 1] = {
          text: o[n[i].row + 1],
          row: i + 1
        };
      }
    }

    for (var i = n.length - 1; i > 0; i--) {
      if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
      n[i - 1] == o[n[i].row - 1]) {
        n[i - 1] = {
          text: n[i - 1],
          row: n[i].row - 1
        };
        o[n[i].row - 1] = {
          text: o[n[i].row - 1],
          row: i - 1
        };
      }
    }

    return {
      o: o,
      n: n
    };
  }

  return function(o, n) {
    o = o.replace(/\s+$/, '');
    n = n.replace(/\s+$/, '');
    var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));

    var str = "";

    var oSpace = o.match(/\s+/g);
    if (oSpace == null) {
      oSpace = [" "];
    }
    else {
      oSpace.push(" ");
    }
    var nSpace = n.match(/\s+/g);
    if (nSpace == null) {
      nSpace = [" "];
    }
    else {
      nSpace.push(" ");
    }

    if (out.n.length == 0) {
      for (var i = 0; i < out.o.length; i++) {
        str += '<del>' + out.o[i] + oSpace[i] + "</del>";
      }
    }
    else {
      if (out.n[0].text == null) {
        for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
          str += '<del>' + out.o[n] + oSpace[n] + "</del>";
        }
      }

      for (var i = 0; i < out.n.length; i++) {
        if (out.n[i].text == null) {
          str += '<ins>' + out.n[i] + nSpace[i] + "</ins>";
        }
        else {
          var pre = "";

          for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
            pre += '<del>' + out.o[n] + oSpace[n] + "</del>";
          }
          str += " " + out.n[i].text + nSpace[i] + pre;
        }
      }
    }

    return str;
  };
})();

})(this);

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

(function( exports, QUnit ) {

  var muted = [
    /* list of logging methods to optionally mute */
    // "testStart", "testDone",
    // "moduleStart", "moduleDone"
  ];


  [ "begin", "log", "done",
    "testStart", "testDone",
    "moduleStart", "moduleDone",
    "featureStart", "featureDone"
  ].filter(function( log ) {
    return !~muted.indexOf( log );
  }).forEach(function( log ) {
    // Define optional QUnit logging function
    QUnit[ log ] = function( data ) {
      //console.log( log, data );
      var type = log;

      if ( log === "log" ) {
        if ( !data.result ) {
          // console.log( "FAIL: ", data.message );
        }
      } else {
        // console.log( log, data )
      }

      Hat.emit( "runner:" + type.replace("module", "ring"), data );
    };
  });

}( this, this.QUnit ));
