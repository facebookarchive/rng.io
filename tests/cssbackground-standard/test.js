test("CSS border-image, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderImageSource" ), "border-image-source standard, supported" );
  assert( H.test.cssProp( elem, "borderImageSlice" ), "border-image-slice standard, supported" );
  assert( H.test.cssProp( elem, "borderImageWidth" ), "border-image-width standard, supported" );
  assert( H.test.cssProp( elem, "borderImageOutset" ), "border-image-outset standard, supported" );
  assert( H.test.cssProp( elem, "borderImageRepeat" ), "border-image-repeat standard, supported" );
  assert( H.test.cssProp( elem, "borderImage" ), "Shorthand border-image standard, supported" );
});

test("CSS box-shadow, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "boxShadow" ), "CSS box-shadow standard, supported" );
});


test("CSS border-radius, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderRadius" ), "CSS border-radius standard, supported" );
});
