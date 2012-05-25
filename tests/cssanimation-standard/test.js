test("CSS Animation, standard", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "animationName" ), "animationName standard, supported" );
});
