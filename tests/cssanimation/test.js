test("CSS Animation", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "animationName", true ), "animationName supported" );
});
