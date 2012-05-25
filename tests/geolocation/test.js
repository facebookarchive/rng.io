test("Geolocation exists", function() {
  assert( navigator.geolocation, "navigator.geolocation supported" );
});

test("Geolocation getCurrentPosition exists and is a function", function() {
  assert( H.isFunction( navigator.geolocation.getCurrentPosition ), "getCurrentPosition supported" );
});

test("Geolocation watchPosition exists and is a function", function() {
  assert( H.isFunction( navigator.geolocation.watchPosition ), "watchPosition supported" );
});

test("Geolocation clearWatch exists and is a function", function() {
  assert( H.isFunction( navigator.geolocation.clearWatch ), "clearWatch supported" );
});
