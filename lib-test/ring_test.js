/*global require:true */
global.Hat = require("../lib/h.js").Hat;

var Ring = require("../lib/ring.js").Ring,
    jsdom = require("jsdom"),
    Canvas = require("canvas"),
    jsDOM;


//Canvas = require("canvas");

Hat.Ring = Ring;

jsdom.defaultDocumentFeatures = {
  QuerySelector: true
};

jsDOM = jsdom.jsdom;

// console.log( jsdom );



exports["Ring"] = {
  "create": function(test) {
    test.expect(4);

    test.ok( Ring.create, "Ring.create exists" );
    test.ok( typeof Ring.create === "function", "Ring.create is a function" );

    test.ok( Ring.create.all, "Ring.create.all exists" );
    test.ok( typeof Ring.create.all === "function", "Ring.create.all is a function" );

    test.done();
  },


  "create functional": function(test) {
    test.expect(12);
    var ring,
        document = jsDOM( "<html><body><canvas id='testcanvas' width='300' height='300'></body></html>", jsdom.dom.level3.core, {
          features: {
            QuerySelector: true
          }
        }),
        window = document.createWindow();

    global.document = document;

    Ring.config.contexts["testcanvas"] = (new Canvas(150, 150)).getContext("2d");



    Ring.create( "testcanvas", {
      features: 20,
      ring: 0
    });

    ring = Ring.get(0);

    /*
    EXAMPLE

        Ring {
          circ: 157.07963267948966
          ctx: CanvasRenderingContext2D
          diameter: 50
          history: Array[39]
          index: 0
          line: 50
          radius: 25
          step: 0.16534698176788384
          ticks: 38
        }
    */

    test.ok( ring, "Ring instance created" );

    [ "features",
      "ring",
      "index",
      "ticks",
      "diameter",
      "radius",
      "line",
      "circ",
      "step",
      "ctx",
      "history"
    ].forEach(function( prop ) {

      test.ok( prop in ring, prop + " in ring" );

    });

    ring = Ring.get(0);

    test.done();
  },
  "get": function(test) {
    test.expect(1);

    test.ok( Ring.get, "Ring.get" );

    test.done();
  },
  "config": function(test) {
    test.expect(1);

    test.ok( Ring.config, "Ring.get" );

    test.done();
  }
};
