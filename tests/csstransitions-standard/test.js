test("CSS Transitions, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transition" ), "transitions standard, supported" );
});
