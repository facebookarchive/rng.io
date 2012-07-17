// FF3.0 will false positive on this test. Source: Modernizr
test("CSS text-shadow, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textShadow" ), "textShadow supported, standard" );
});

test("CSS word-wrap, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordWrap" ), "wordWrap supported, standard" );
});

test("CSS word-break, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordBreak" ), "wordBreak supported, standard" );
});

test("CSS word-spacing, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordSpacing" ), "wordSpacing supported, standard" );
});
