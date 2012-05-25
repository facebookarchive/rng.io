test("CSS Transforms (2d), standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem ), "transform, standard supported" );
});

test("CSS Transforms (3d), standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem ), "transform-3d, standard supported" );
});

test("CSS Transforms Perspective (3d), standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem ), "perspective, standard supported" );
});
