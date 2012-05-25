test("CSS text-overflow, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textOverflow" ), "textOverflow standard, supported" );
});

test("CSS box-sizing, standard", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "boxSizing" ), "boxSizing standard, supported" );

});

// TODO: Add functional tests to determine that content-box, padding-box, and border-box work properly
