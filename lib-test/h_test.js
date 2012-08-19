/*global require:true */
var H = require("../lib/h.js").Hat,
    jsdom = require("jsdom"),
    jsDOM;

jsdom.defaultDocumentFeatures = {
  QuerySelector: true
};

jsDOM = jsdom.jsdom;

// console.log( jsdom );

// Utilities
exports["H.uniqueId()"] = {
  "exists": function(test) {
    test.expect(1);
    test.ok( H.uniqueId, "H.uniqueId() exists");
    test.done();
  },
  "returns": function(test) {
    test.expect(6);

    var subject = H.uniqueId();

    test.ok( subject.length, "H.uniqueId() returns 36 character strings");

    [
      { idx: 8, tok: "-" },
      { idx: 13, tok: "-" },
      { idx: 14, tok: "4" },
      { idx: 18, tok: "-" },
      { idx: 23, tok: "-" }
    ].forEach(function( assert ) {
      test.equal( subject[ assert.idx ], assert.tok,
        "Found " + assert.tok + " at index: " + assert.idx + " of " + subject
      );
    });
    test.done();
  }
};

// Tests by Ben Alman
// https://github.com/cowboy/javascript-getclass/
// https://raw.github.com/cowboy/javascript-getclass/kindof/test/kindof_test.js
var ConstructNumber = Number,
    ConstructString = String,
    ConstructBoolean = Boolean;

exports["kindOf (non-specific)"] = {
  "exists": function(test) {
    test.expect(1);
    test.ok( H.kindOf, "H.kindOf() exists");
    test.done();
  },
  "Number": function(test) {
    test.expect(5);
    test.strictEqual(H.kindOf(123), "Number", "should work");
    test.strictEqual(H.kindOf(Number(123)), "Number", "should work");
    test.strictEqual(H.kindOf(new ConstructNumber(123)), "Number", "should work");
    test.strictEqual(H.kindOf(NaN), "Number", "should work");
    test.strictEqual(H.kindOf(Infinity), "Number", "should work");
    test.done();
  },
  "String": function(test) {
    test.expect(3);
    test.strictEqual(H.kindOf("foo"), "String", "should work");
    test.strictEqual(H.kindOf(String("foo")), "String", "should work");
    test.strictEqual(H.kindOf(new ConstructString("foo")), "String", "should work");
    test.done();
  },
  "Boolean": function(test) {
    test.expect(6);
    test.strictEqual(H.kindOf(true), "Boolean", "should work");
    test.strictEqual(H.kindOf(Boolean(true)), "Boolean", "should work");
    test.strictEqual(H.kindOf(new ConstructBoolean(true)), "Boolean", "should work");
    test.strictEqual(H.kindOf(false), "Boolean", "should work");
    test.strictEqual(H.kindOf(Boolean(false)), "Boolean", "should work");
    test.strictEqual(H.kindOf(new ConstructBoolean(false)), "Boolean", "should work");
    test.done();
  },
  "Function": function(test) {
    test.expect(3);
    function fn1() {}
    var fn2 = function() {};
    var fn3 = new Function("return 1;");
    test.strictEqual(H.kindOf(fn1), "Function", "should work");
    test.strictEqual(H.kindOf(fn2), "Function", "should work");
    test.strictEqual(H.kindOf(fn3), "Function", "should work");
    test.done();
  },
  "RegExp": function(test) {
    test.expect(2);
    var re1 = /foo/;
    var re2 = new RegExp("foo");
    test.strictEqual(H.kindOf(re1), "RegExp", "should work");
    test.strictEqual(H.kindOf(re2), "RegExp", "should work");
    test.done();
  },
  "Array": function(test) {
    test.expect(3);
    test.strictEqual(H.kindOf([1, 2, 3]), "Array", "should work");
    test.strictEqual(H.kindOf(new Array(10)), "Array", "should work");
    test.strictEqual(H.kindOf(new Array(1, 2, 3)), "Array", "should work");
    test.done();
  },
  "Date": function(test) {
    test.expect(1);
    test.strictEqual(H.kindOf(new Date()), "Date", "should work");
    test.done();
  },
  "Error": function(test) {
    test.expect(6);
    test.strictEqual(H.kindOf(new Error("foo")), "Error", "should work");
    test.strictEqual(H.kindOf(new EvalError("foo")), "Error", "should work");
    test.strictEqual(H.kindOf(new RangeError("foo")), "Error", "should work");
    test.strictEqual(H.kindOf(new ReferenceError("foo")), "Error", "should work");
    test.strictEqual(H.kindOf(new SyntaxError("foo")), "Error", "should work");
    test.strictEqual(H.kindOf(new TypeError("foo")), "Error", "should work");
    test.done();
  },
  "Object": function(test) {
    test.expect(2);
    function Foo() {}
    test.strictEqual(H.kindOf(new Foo()), "Object", "should work");
    test.strictEqual(H.kindOf({}), "Object", "should work");
    test.done();
  },
  "Non-Native": function(test) {
    test.expect(1);
    test.strictEqual(H.kindOf(new ArrayBuffer()), "ArrayBuffer", "should work");
    test.done();
  }
};

exports["generated helpers"] = {
  "isNumber": function(test) {
    test.expect(5);
    test.ok(H.isNumber(123), "should work");
    test.ok(H.isNumber(Number(123)), "should work");
    test.ok(H.isNumber(new ConstructNumber(123)), "should work");
    test.ok(H.isNumber(NaN), "should work");
    test.ok(H.isNumber(Infinity), "should work");
    test.done();
  },
  "isString": function(test) {
    test.expect(3);
    test.ok(H.isString("foo"), "should work");
    test.ok(H.isString(String("foo")), "should work");
    test.ok(H.isString(new ConstructString("foo")), "should work");
    test.done();
  },
  "isBoolean": function(test) {
    test.expect(6);
    test.ok(H.isBoolean(true), "should work");
    test.ok(H.isBoolean(Boolean(true)), "should work");
    test.ok(H.isBoolean(new ConstructBoolean(true)), "should work");
    test.ok(H.isBoolean(false), "should work");
    test.ok(H.isBoolean(Boolean(false)), "should work");
    test.ok(H.isBoolean(new ConstructBoolean(false)), "should work");
    test.done();
  },
  "isFunction": function(test) {
    test.expect(3);
    function fn1() {}
    var fn2 = function() {};
    var fn3 = new Function("return 1;");
    test.ok(H.isFunction(fn1), "should work");
    test.ok(H.isFunction(fn2), "should work");
    test.ok(H.isFunction(fn3), "should work");
    test.done();
  },
  "isRegExp": function(test) {
    test.expect(2);
    var re1 = /foo/;
    var re2 = new RegExp("foo");
    test.ok(H.isRegExp(re1), "should work");
    test.ok(H.isRegExp(re2), "should work");
    test.done();
  },
  "isArray": function(test) {
    test.expect(3);
    test.ok(H.isArray([1, 2, 3]), "should work");
    test.ok(H.isArray(new Array(10)), "should work");
    test.ok(H.isArray(new Array(1, 2, 3)), "should work");
    test.done();
  },
  "isDate": function(test) {
    test.expect(1);
    test.ok(H.isDate(new Date()), "should work");
    test.done();
  },
  "isError": function(test) {
    test.expect(6);
    test.ok(H.isError(new Error("foo")), "should work");
    test.ok(H.isError(new EvalError("foo")), "should work");
    test.ok(H.isError(new RangeError("foo")), "should work");
    test.ok(H.isError(new ReferenceError("foo")), "should work");
    test.ok(H.isError(new SyntaxError("foo")), "should work");
    test.ok(H.isError(new TypeError("foo")), "should work");
    test.done();
  },
  "isObject": function(test) {
    test.expect(2);
    function Foo() {}
    test.ok(H.isObject(new Foo()), "should work");
    test.ok(H.isObject({}), "should work");
    test.done();
  }
};

exports["H.clone()"] = {
  "exists": function(test) {
    test.expect(1);
    test.ok( H.clone, "H.clone() exists");
    test.done();
  },
  "object": function(test) {
    test.expect(7);

    var orig, cloned;

    orig = {
      foo: "bar",
      inner: {
        prop: false,
        array: [ 1, 2, 3, 4, 5 ]
      },
      deepArray: [ 0, 1, 2, 3, [ 4, 5, 6 ] ]
    };

    cloned = H.clone( orig );

    test.ok( cloned.hasOwnProperty("foo"), "cloned.hasOwnProperty('foo')" );
    test.ok( cloned.hasOwnProperty("inner"), "cloned.hasOwnProperty('inner')" );
    test.ok( cloned.inner.hasOwnProperty("prop"), "cloned.inner.hasOwnProperty('prop')" );
    test.ok( cloned.inner.hasOwnProperty("array"), "cloned.inner.hasOwnProperty('array')" );

    // Change a value of the original `inner.array`
    orig.inner.array[0] = "a";
    cloned.deepArray[4][0] = 7;

    test.notEqual( orig.inner.array[0], cloned.inner.array[0],
      "(notEqual) Changing an array property value of the original object doesn't effect the clone" );

    test.notEqual( cloned.deepArray[4][0], orig.deepArray[4][0],
      "(notEqual) Changing an array property value in an array of the cloned object doesn't effect the original" );

    orig.foo = "qux";

    test.notEqual( orig.foo, cloned.foo,
      "(notEqual) Changing a property value of the cloned object doesn't effect the original" );

    test.done();
  },
  "array": function(test) {
    test.expect(2);


    var orig = [ 1, 2, 3, 4, 5 ],
        cloned = H.clone( orig );

    test.equal( orig[0], cloned[0], "orig[0] === cloned[0]" );

    // Change value of orig[0]
    orig[0] = "a";

    test.notEqual( cloned[0], orig[0],
      "(notEqual) Changing an array property value doesn't effect the clone" );

    test.done();
  },
  "mega-deep": function(test) {
    test.expect(5);

    var orig = [ 1, 2, 3, [ "deep", "array", { holy: "cow" } ], { foo: "bar", deeper: { prop: "stuff" } } ],
        cloned = H.clone( orig );

    test.equal( orig[0], cloned[0], "orig[0] === cloned[0]" );

    orig[3][0] = "throat";
    orig[3][2].holy = "moly";
    orig[4].foo = "qux";
    orig[4].deeper.prop = "yikes!";

    test.equal( cloned[3][0], "deep", "Deep array clones" );
    test.equal( cloned[3][2].holy, "cow", "Deep array, object item clones" );
    test.equal( cloned[4].foo, "bar", "Deep array, object item property clones" );
    test.equal( cloned[4].deeper.prop, "stuff", "Deep array, object property value clones" );

    test.done();
  }
};


exports["H.extend()"] = {
  "exists": function(test) {
    test.expect(1);
    test.ok( H.extend, "H.extend() exists");
    test.done();
  },
  "returns": function(test) {
    test.expect(12);

    var obj1 = {
      "key11": "value",
      "key12": 9001,
      "key13": function() { return true; }
    },
    obj2 = {
      "key21": "String",
      "key22": 9002,
      "key23": function() { return false; }
    },
    prop, dest;

    dest = H.extend( {}, obj1 );

    for ( prop in obj1 ) {
      test.equal( dest.hasOwnProperty( prop ), true, "{dest} has property: " + prop );
    }
    test.equal( typeof dest[ "key13" ], "function", "dest[key13] is a function" );

    dest = {};
    H.extend( dest, obj1, obj2 );

    for ( prop in obj1 ) {
      test.equal( dest.hasOwnProperty( prop ), true, "{dest} has property: " + prop + ", when extending 2 objects" );
    }
    for ( prop in obj2 ) {
      test.equal( dest.hasOwnProperty( prop ), true, "{dest} has property: " + prop + ", when extending 2 objects" );
    }
    test.equal( typeof dest[ "key13" ], "function", "dest[key13] is a function" );
    test.equal( typeof dest[ "key23" ], "function", "dest[key23] is a function" );

    test.done();
  }
};


// Constructors
// exports["H.Register"] = {
//   "exists": function(test) {
//     test.expect(1);
//     test.ok( H.Register, "H.Register() exists" );
//     test.done();
//   },
//   "instances": function(test) {
//     test.expect(7);
//
//     var subject = H.Register({});
//
//     test.equal( H.kindOf( subject.title ), "String", "title prop is string" );
//     test.equal( H.kindOf( subject.key ), "String", "key prop is string" );
//     test.equal( H.kindOf( subject.category ), "String", "category prop is string" );
//     test.equal( H.kindOf( subject.test ), "Function", "test prop is function" );
//     test.equal( H.kindOf( subject.ring ), "Number", "ring prop is number" );
//     test.equal( H.kindOf( subject.score ), "Number", "score prop is number" );
//     test.equal( H.kindOf( subject.value ), "Number", "value prop is number" );
//
//     test.done();
//   }
// };

// Prefixs lists and helpers
exports["H.prefixes"] = {
  exists: function(test) {
    test.expect(5);
    test.ok( H.prefixes );
    test.ok( H.prefixes.css );
    test.ok( H.prefixes.dom );
    test.ok( H.prefixes.cssom );
    test.ok( H.prefixes.expandCss );
    test.done();
  },
  css: function(test) {
    test.expect(1);

    test.deepEqual( H.prefixes.css, ["", "-webkit-", "-moz-", "-o-", "-ms-", ""] );

    test.done();

  },
  dom: function(test) {
    test.expect(1);

    test.deepEqual( H.prefixes.dom, ["webkit", "moz", "o", "ms", "WebKit", "Moz", "MS", "O"] );

    test.done();

  },
  cssom: function(test) {
    test.expect(1);

    test.deepEqual( H.prefixes.cssom, ["Webkit", "Moz", "O", "ms", "WebKit", "Moz", "MS", "O"] );

    test.done();
  },
  expandCss: function(test) {
    test.expect(2);

    var rule = "key:value",
    expectedExpansion = "key:value;-webkit-key:value;-moz-key:value;-o-key:value;-ms-key:value;" ;

    test.ok( H.prefixes.expandCss( rule ), expectedExpansion, "CSS rule expanded to rule for each prefix" );
    test.ok( H.prefixes.expandCss( rule, "more:rules;" ), expectedExpansion + "more:rules;", "Additional rules can be appended afterward to generate a single string" );

    test.done();
  }
};

// Test Helpers
exports["H.get"] = {
  "exists:": function(test) {
    test.expect(1);
    test.ok( H.get );
    test.done();
  },
  "string": function(test) {
    test.expect(1);

    var str = "foobar",
    sub = "oba";

    test.equal( H.get.string( str, sub ), str.indexOf( sub ) > -1, "Identifies the existence of a substring in a string" );

    test.done();
  },
  cssProp: function(test) {
    test.expect(7);

    var standardElem = {
      style: {
        thing: ""
      }
    },
    webkitElem = {
      style: {
        WebkitThing: ""
      }
    },
    mozElem = {
      style: {
        MozThing: ""
      }
    },
    oElem = {
      style: {
        OThing: ""
      }
    },
    msElem = {
      style: {
        msThing: ""
      }
    };

    test.ok( H.get.cssProp( standardElem, "thing" ), "Finds 'thing' property on element.style without prefixes" );
    test.ok( !H.get.cssProp( webkitElem, "thing" ), "Doesn't find 'thing' property on element.style when searching for standard but only prefixed exists" );

    test.ok( H.get.cssProp( standardElem, "thing", true ), "Finds standard 'thing' property on element.style when searching for all variants, including prefixed" );
    test.ok( H.get.cssProp( webkitElem, "thing", true ), "Finds webkit-prefixed 'thing' property on element.style when searching for all variants" );
    test.ok( H.get.cssProp( mozElem, "thing", true ), "Finds moz-prefixed 'thing' property on element.style when searching for all variants" );
    test.ok( H.get.cssProp( oElem, "thing", true ), "Finds o-prefixed 'thing' property on element.style when searching for all variants" );
    test.ok( H.get.cssProp( msElem, "thing", true ), "Finds ms-prefixed 'thing' property on element.style when searching for all variants" );

    test.done();
  },
  domProp: function(test) {
    test.expect(7);

    var standardElem = {
      thing: {}
    },
    webkitElem = {
      webkitThing: {}
    },
    mozElem = {
      mozThing: {}
    },
    oElem = {
      oThing: {}
    },
    msElem = {
      msThing: {}
    };

    test.ok( H.get.domProp( standardElem, "thing" ), "Finds 'thing' property on element without prefixes" );
    test.ok( !H.get.domProp( webkitElem, "thing" ), "Doesn't find 'thing' property on element when searching for standard but only prefixed exists" );

    test.ok( H.get.domProp( standardElem, "thing", true ), "Finds standard 'thing' property on element when searching for all variants, including prefixed" );
    test.ok( H.get.domProp( webkitElem, "thing", true ), "Finds webkit-prefixed 'thing' property on element when searching for all variants" );
    test.ok( H.get.domProp( mozElem, "thing", true ), "Finds moz-prefixed 'thing' property on element when searching for all variants" );
    test.ok( H.get.domProp( oElem, "thing", true ), "Finds o-prefixed 'thing' property on element when searching for all variants" );
    test.ok( H.get.domProp( msElem, "thing", true ), "Finds ms-prefixed 'thing' property on element when searching for all variants" );

    test.done();
  },
  hostAPI: function(test) {
    test.expect(4);

    global.window = global;
    window.oFoo = {};

    window.WebKitConstructor = function() {};
    window.msPerformance = {};

    test.ok( H.hostAPI("setTimeout"), "Finds a global setTimeout function" );
    test.deepEqual( H.hostAPI( "foo", true ), window.oFoo, "Finds a global, prefixed foo" );
    test.equal( H.hostAPI( "Constructor", true ), window.WebKitConstructor, "Finds a global, prefixed Constructor" );
    test.deepEqual( H.hostAPI( "performance", true ), window.msPerformance, "Finds a global, prefixed performance" );

    delete global.window;

    test.done();
  }
};

exports["H.API"] = {

  "exists": function(test) {
    test.expect(1);
    test.ok( H.API, "H.API exists" );
    test.done();
  },
  "functional": function(test) {
    test.expect(5);

    var api = {
      foo: function() {
      },
      MozBar: function() {
      },
      OHidden: false,
      mozNull: null,
      WebKitUndefined: undefined
    };

    test.deepEqual( H.API( api, "foo" ), api.foo, "Finds `foo` on `api` object" );
    test.deepEqual( H.API( api, "bar", true ), api.MozBar, "Finds `bar` on `api` object, as mozBar when withPrefixes is true" );

    test.equal( H.API( api, "hidden", true, false ), false, "Returns even if value is false" );
    test.equal( H.API( api, "null", true ), null, "Returns even if value is null" );
    test.equal( H.API( api, "undefined", true ), undefined, "Returns even if value is undefined" );


    test.done();
  },
  "options object": function(test) {
    test.expect(4);

    var host, expects;

    host = {
      A: false,
      B: null,
      C: undefined,
      D: function(x) { return x; }
    };

    expects = {
      A: false,
      B: null,
      C: undefined
    };

    [ "A", "B", "C", "D" ].forEach(function( api ) {
      var derived, options;

      options = {
        host: host,
        api: api,
        withPrefixes: true
      };

      if ( api in expects ) {
        options.expect = expects[ api ];
      }

      derived = H.API( options );

      if ( "expect" in options ) {
        test.equal( derived, options.expect, "derived matches expected value" );
      } else {
        test.equal( derived, host[ api ], "derived matches host api" );
      }
    });

    test.done();
  },

  "returns undefined": function(test) {
    test.expect(3);

    var host = {
      A: false,
      B: null,
      C: undefined
    };


    [ "A", "B", "C" ].forEach(function( api ) {

      var derived = H.API( host, api, true );

      test.equal( derived, undefined, api + " returns undefined when expectDefault is not set" );
    });

    test.done();
  },
  "does not throw": function(test) {
    test.expect(3);

    [
      false, null, undefined
    ].forEach(function( host ) {

      var derived = H.API( host, "foo", true );

      test.equal( derived, undefined, "when host object is " + host + ", return undefined" );
    });

    test.done();
  }
};


exports["H.inject"] = {
  "exists:": function(test) {
    test.expect(1);
    test.ok( H.inject );
    test.done();
  },
  "non-html-string": function(test) {
    test.expect(1);
    test.equal( H.inject( "hello", { innerText: "" }).innerText, "hello", "Object returned by H.inject() has expected non-html string within innerText" );

    test.done();
  },
  "html-string": function(test) {
    test.expect(1);
    test.equal( H.inject( "<div></div>", { innerHTML: "" }).innerHTML, "<div></div>", "Object returned by H.inject() has expected non-html string within innerHTML" );

    test.done();
  },
  "string, createElement": function(test) {
    test.expect(2);

    var doc = jsDOM( "<html><body></body></html>", null );

    /*

    H.inject( "hello", doc.createElement("span") );
    H.inject( "<p>hi</p>", doc.createElement("span") );

    */


    test.equal( H.inject( "hello", doc.createElement("span") ).innerHTML, "hello", 'H.inject( "hello", doc.createElement("span") ).innerHTML' );
    test.equal( H.inject( "<p>hi</p>", doc.createElement("span") ).innerHTML, "<p>hi</p>", 'H.inject( "<p>hi</p>", doc.createElement("span") ).innerHTML' );

    test.done();
  },
  "string, <html>": function(test) {
    test.expect(2);

    global.document = new jsdom.dom.level3.core.Document();


    /*

    H.inject( "hello", "<span>" );
    H.inject( "<p>hi</p>", "<span>" );

    */

    test.equal( H.inject( "hello", "<span>" ).innerHTML, "hello", 'H.inject( "hello", "<span>" ).innerHTML' );
    test.equal( H.inject( "<p>hi</p>", "<span>" ).innerHTML, "<p>hi</p>", 'H.inject( "<p>hi</p>", "<span>" ).innerHTML' );

    test.done();
  },

  "string, selector": function(test) {
    test.expect(2);

    var document = jsDOM( "<html><body><span id='foo'></span></body></html>", jsdom.dom.level3.core, {
      features: {
        QuerySelector: true
      }
    });

    global.document = document;

    /*

    H.inject( "hello", "span#foo" );
    H.inject( "<p>hi</p>", "span#foo" );

    */

    test.equal( H.inject( "hello", "span#foo" ).innerHTML, "hello", 'H.inject( "hello", doc.createElement("span") ).innerHTML' );

    document.querySelector("span#foo").innerHTML = "";

    test.equal( H.inject( "<p>hi</p>", "span#foo" ).innerHTML, "<p>hi</p>", 'H.inject( "<p>hi</p>", doc.createElement("span") ).innerHTML' );

    test.done();
  }
};

exports["H.on/off/emit"] = {

  "on": function( test ) {
    test.expect(1);

    var count = 0;

    H.on("event", function () {
      count++;
    });

    H.emit("event");
    test.equal(count, 1, "count is correct");

    test.done();
  },

  "off": function( test ) {
    test.expect(1);

    var count = 0;

    H.on("event", function () {
      count++;
    });

    H.emit("event");

    H.off("event");

    H.emit("event");

    test.equal(count, 1, "count is correct");

    test.done();
  }
};

exports["H.on/off/emit (DOM)"] = {

  "on": function( test ) {
    var document, count, event;

    // Create a Document
    document = jsDOM("<html><body></body></html>", jsdom.level( 3, "core" ));

    // Globalize the document reference
    global.document = document;

    // Initialize a test count
    count = 0;


    // Declare a handler
    // This should only fire ONCE.
    function handler() {
      count++;

      H.off( document, "foo", handler );
    }

    // Bind the handler
    H.on( document, "foo", handler );

    // Create a generic event object
    event = document.createEvent( "Events" );

    event.initEvent( "foo", true, false );

    // Dispatch/emit
    document.dispatchEvent( event );

    // Again... (this should actually result in NO-OP)
    document.dispatchEvent( event );

    test.expect(1);
    test.equal( count, 1, "count is correct" );
    test.done();
  }
};
