test("CSS Images linear-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:linear-gradient(to bottom right, #9f9, white);";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "linear-gradient standard, supported" );

});

test("CSS Images repeating-linear-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:repeating-linear-gradient(-22deg, #f99 20px, #fff 40px)";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "repeating" ), "repeating-linear-gradient standard, supported" );

});

test("CSS Images radial-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:radial-gradient(ellipse closest-side at 75% 50%, #99ff99, #ffffff 50%);";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "radial-gradient standard, supported" );

});

test("CSS Images repeating-radial-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:repeating-radial-gradient(ellipse closest-side at 75% 50%, #99ff99, #ffffff 50%);";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "repeating" ), "repeating-radial-gradient standard, supported" );

});

test("CSS Images object-fit, standard", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "objectFit" ), "object-fit standard, supported" );

});

test("CSS Images object-position, standard", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "objectPosition" ), "object-position standard, supported" );

});

test("CSS Images image-orientation", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "imageOrientation" ), "imageOrientation supported" );
});

test("CSS Images image-resolution", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "imageResolution" ), "imageResolution supported" );
});
