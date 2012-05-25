test("CSS UI text-overflow", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textOverflow", true ), "textOverflow" );
});

test("CSS UI box-sizing", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "boxSizing", true ), "boxSizing" );
});

test("CSS UI Pointer Events", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "pointerEvents", true ), "pointerEvents supported" );
});
