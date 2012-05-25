test("CSS border-image", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderImageSource", true ), "border-image-source supported" );
  assert( H.test.cssProp( elem, "borderImageSlice", true ), "border-image-slice supported" );
  assert( H.test.cssProp( elem, "borderImageWidth", true ), "border-image-width supported" );
  assert( H.test.cssProp( elem, "borderImageOutset", true ), "border-image-outset supported" );
  assert( H.test.cssProp( elem, "borderImageRepeat", true ), "border-image-repeat supported" );
  assert( H.test.cssProp( elem, "borderImage", true ), "Shorthand border-image supported" );

});

test("CSS border-image shorthand property", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderImage", true ), "CSS border-image shorthand property supported" );

});
