test("CSS Flexbox, flex-align", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexAlign" ), "flexAlign supported" );
});

test("CSS Flexbox, flex-flow", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexFlow" ), "flexFlow supported" );
});

test("CSS Flexbox, flex-pack", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexPack" ), "flexPack supported" );
});

test("CSS Flexbox, flex-order", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexOrder" ), "flexOrder supported" );
});
