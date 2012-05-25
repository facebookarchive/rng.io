test("CSS Transforms (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transform", true ), "Transforms supported" );
});

// test("CSS Transforms (3d)", function() {
//   var elem = document.createElement("div");
//
//   assert( H.test.cssProp( elem, "transform-3d", true ) );
// });
//

test("CSS Transforms Perspective (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "perspective", true ), "Perspective supported" );
});
