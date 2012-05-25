test("Canvas 3D", function() {
  var WebGLRenderingContext = window.WebGLRenderingContext;

  assert( !!WebGLRenderingContext, "WebGLRenderingContext supported" );
});


test("Canvas 3D Context", function() {
  var WebGLRenderingContext = window.WebGLRenderingContext,
      canvas = document.createElement("canvas"),
      contexts = [
        "3d", "webgl", "experimental-webgl",
        "moz-webgl", "webkit-3d", "opera-3d", "ms-webgl", "ms-3d"
      ],
      which,
      context;

  while ( contexts.length ) {
    which = contexts.pop();
    context = canvas.getContext( which );

    if ( context ) {
      break;
    }
  }

  assert( !!WebGLRenderingContext, "WebGLRenderingContext supported (" + which + ")" );
});
