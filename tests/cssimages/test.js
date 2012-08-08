test("CSS Images url()", function() {
  var elem = document.createElement("div");

  elem.style.cssText = "background-image: url(https://);";

  assert( H.test.string( elem.style.backgroundImage, "url" ), "images with url() supported" );
});

test("CSS Images linear-gradient", function() {
  /**
  * Logic sourced from Modernizr
  * https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
  */

  var elem = document.createElement("div"),
      str1 = "background-image:",
      str2 = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
      str3 = "linear-gradient(left top,#9f9, white);",

  rules =
    // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
    (str1 + "-webkit- ".split(" ").join(str2 + str1) +
    // standard syntax             // trailing "background-image:"
    H.prefixes.css.join(str3 + str1)).slice(0, -str1.length);

  elem.style.cssText = rules;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "linear-gradient supported" );
});

test("CSS Images repeating-linear-gradient", function() {
  var elem = document.createElement("div"),
      rule = "background-image:",
      value = "repeating-linear-gradient(-22deg, #f99 20px, #fff 40px)",
      l = H.prefixes.css.length - 1,
      expanded = H.prefixes.css.slice( 0, l ).map(function(prefix) {
        return rule + prefix + value;
      }).join(";") + ";";

  elem.style.cssText = expanded;

  assert( H.test.string( elem.style.backgroundImage, "repeating" ), "repeating-linear-gradient supported" );
});

test("CSS Images radial-gradient", function() {
  var elem = document.createElement("div"),
      rule = "background-image:",
      value = "radial-gradient(75% 50%, ellipse closest-side, #99ff99, #ffffff 50%)",
      l = H.prefixes.css.length - 1,
      expanded = H.prefixes.css.slice( 0, l ).map(function(prefix) {
        return rule + prefix + value;
      }).join(";") + ";";

  elem.style.cssText = expanded;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "radial-gradient supported" );
});

test("CSS Images repeating-radial-gradient", function() {
  var elem = document.createElement("div"),
      rule = "background-image:",
      value = "repeating-radial-gradient(75% 50%, ellipse closest-side, #99ff99, #ffffff 50%)",
      l = H.prefixes.css.length - 1,
      expanded = H.prefixes.css.slice( 0, l ).map(function(prefix) {
        return rule + prefix + value;
      }).join(";") + ";";

  elem.style.cssText = expanded;

  assert( H.test.string( elem.style.backgroundImage, "repeating" ), "repeating-radial-gradient supported" );
});

test("CSS Images object-fit", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "objectFit", true ), "object-fit supported" );
});

test("CSS Images object-position", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "objectPosition", true ), "object-position supported" );
});

test("CSS Images image-orientation", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "imageOrientation", true ), "imageOrientation supported" );
});

test("CSS Images image-resolution", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "imageResolution", true ), "imageResolution supported" );
});
