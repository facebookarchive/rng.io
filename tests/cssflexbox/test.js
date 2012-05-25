// test("CSS Flexbox", function() {
//   // Need baseline test
// });

test("CSS Flexbox, flex-align", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexAlign", true ), "flexAlign supported" );
});

test("CSS Flexbox, flex-flow", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexFlow", true ), "flexFlow supported" );
});

test("CSS Flexbox, flex-pack", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexPack", true ), "flexPack supported" );
});

test("CSS Flexbox, flex-order", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexOrder", true ), "flexOrder supported" );
});
