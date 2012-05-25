test("CSS background shorthand property supports multiple images", function() {

  var elem = document.createElement("div");

  // Setting multiple images AND a color on the background shorthand property
  //  and then querying the style.background property value for the number of
  //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

  elem.style.cssText = "background:url(https://),url(https://),red url(https://)";

  // If the UA supports multiple backgrounds, there should be three occurrences
  //   of the string "url(" in the return value for elem.style.background

  assert( /(url\s*\(.*?){3}/.test( elem.style.background ), "background shorthand, multiple images supported" );

});

test("CSS box-shadow", function() {
  // According to the Modernizr source
  // This test false-positives in WebOS
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "boxShadow", true ), "CSS box-shadow supported" );

});

test("CSS border-radius", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderRadius", true ), "CSS border-radius supported" );

});
