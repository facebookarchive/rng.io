// FF3.0 will false positive on this test. Source: Modernizr
test("CSS text-shadow", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textShadow", true ), "textShadow supported" );
});

test("CSS word-wrap", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordWrap", true ), "wordWrap supported" );
});

test("CSS word-break", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordBreak", true ), "wordBreak supported" );
});

test("CSS word-spacing", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordSpacing", true ), "wordSpacing supported" );
});
