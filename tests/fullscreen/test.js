test("FullScreen", function() {
  var fixture = document.createElement("div"),
      request = H.API( fixture, "requestFullScreen", true );

  request = request || H.API( fixture, "requestFullscreen", true );

  assert( request, "requestFullScreen supported" );
  assert( H.isFunction( request ), "requestFullScreen or requestFullscreen is a function" );
});


test("FullScreen document", function() {
  var fullscreenElement = H.get.domProp( document, "fullscreenElement", true ) !== false,
      fullscreenEnabled = H.API( document, "fullscreenEnabled", true ),
      exitFullscreen = H.API( document, "exitFullscreen", true );

  assert( fullscreenElement, "fullscreenElement supported" );
  assert( fullscreenEnabled, "fullscreenEnabled supported" );
  assert( H.isFunction( exitFullscreen ), "exitFullscreen is a function" );
});
