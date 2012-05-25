test("window.alert is treated as a function", function() {
  assert( H.isFunction( window.alert ), "alert supported" );
});

test("window.confirm is treated as a function", function() {
  assert( H.isFunction( window.confirm ), "confirm supported" );
});

test("window.prompt is treated as a function", function() {
  assert( H.isFunction( window.prompt ), "prompt supported" );
});
