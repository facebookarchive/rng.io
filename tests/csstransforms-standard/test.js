test("CSS Transform (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transform" ), "transform supported" );
});

test("CSS transform-origin (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transformOrigin" ), "transformOrigin supported" );
});

test("CSS transform-style (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transformStyle" ), "transformStyle supported" );
});

test("CSS Perspective (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "perspective" ), "perspective supported" );
});

test("CSS perspective-origin (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "perspectiveOrigin" ), "perspectiveOrigin supported" );
});

test("CSS backface-visibility (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "backfaceVisibility" ), "backfaceVisibility supported" );
});
