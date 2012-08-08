test("CSS Transform (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transform", true ), "transform supported" );
});

test("CSS transform-origin (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transformOrigin", true ), "transformOrigin supported" );
});

test("CSS transform-style (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transformStyle", true ), "transformStyle supported" );
});

// test("CSS Transforms (3d)", function() {
//   var elem = document.createElement("div");
//
//   assert( H.test.cssProp( elem, "transform-3d", true ) );
// });
//

test("CSS Perspective (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "perspective", true ), "perspective supported" );
});

test("CSS perspective-origin (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "perspectiveOrigin", true ), "perspectiveOrigin supported" );
});

test("CSS backface-visibility (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "backfaceVisibility", true ), "backfaceVisibility supported" );
});
