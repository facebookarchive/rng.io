test("CSS 3D Transforms: perspective", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "perspective", true ), "perspective supported" );
});

test("CSS 3D Transforms: perspective-origin", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "perspectiveOrigin", true ), "perspectiveOrigin supported" );
});

test("CSS 3D Transforms: transform", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "transform", true ), "transform supported" );
});

test("CSS 3D Transforms: transform-origin", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "transformOrigin", true ), "transformOrigin supported" );
});

test("CSS 3D Transforms: backfaceVisibility", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "backfaceVisibility", true ), "backfaceVisibility supported" );
});


// asyncTest("CSS 3D Transforms, basic inference", function( async ) {
//   var iframe = document.getElementById("css3dtransforms");
//
//   iframe.contentWindow.addEventListener("load", function(e) {
//     async.step(function() {
//       var doc = iframe.contentDocument,
//           elem = doc.getElementById("inference"),
//           transform, property;
//
// // Need prefixing...
//       transform = iframe.contentWindow.getComputedStyle( elem ).getPropertyValue("-moz-transform");
//
//       assert( transform !== "none",
//         "-transform supported"
//       );
//
//       async.done();
//     });
//   });
// });
