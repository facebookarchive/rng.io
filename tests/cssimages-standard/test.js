test("CSS Images linear-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:linear-gradient(left top,#9f9, white);";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "linear-gradient standard, supported" );

});

test("CSS Images repeating-linear-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "repeating-linear-gradient(-22deg, #f99 20px, #fff 40px)";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "repeating" ), "repeating-linear-gradient standard, supported" );

});

test("CSS Images radial-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:radial-gradient(75% 50%, ellipse closest-side, #99ff99, #ffffff 50%);";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "radial-gradient standard, supported" );

});

test("CSS Images repeating-radial-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:repeating-radial-gradient(75% 50%, ellipse closest-side, #99ff99, #ffffff 50%);";

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
