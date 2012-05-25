test("CSS Transitions", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transition", true ), "transitions supported" );
});
