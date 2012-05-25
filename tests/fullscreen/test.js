test("FullScreen API, vendor-prefixed", function() {
  var request = H.test.domProp(document.documentElement, "requestFullScreen", true),
  cancel = H.test.domProp(document, "cancelFullScreen", true) ;

  assert( request, "requestFullScreen supported" );
  assert( H.isFunction( request ), "requestFullScreen is a function" );
  assert( cancel, "cancelFullScreen supported" );
  assert( H.isFunction( cancel ), "cancelFullScreen is a function");
});

/*
* The standard Fullscreen API isn't implemented anywhere yet
test("FullScreen API, standard", function() {
  var request = H.test.domProp(document.documentElement, "requestFullscreen", true),
  exit = H.test.domProp(document, "exitFullscreen", true)

  assert( request, "document.documentElement.requestFullscreen supported" );
  assert( H.isFunction( request ), "requestFullscreen is a function" );
  assert( exit, "document.exitFullscreen supported" );
  assert( H.isFunction( exit ), "exitFullscreen is a function");
});
*/
