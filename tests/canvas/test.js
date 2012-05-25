test("Canvas", function() {
  var canvas = document.createElement("canvas");

  assert( "getContext" in canvas, "canvas getContext supported" );
  assert( "toDataURL" in canvas, "canvas toDataURL supported" );
});

test("Canvas 2D Context", function() {
  var CanvasRenderingContext2D = window.CanvasRenderingContext2D,
      canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");

  assert( !!CanvasRenderingContext2D, "CanvasRenderingContext2D supported" );
  assert( context instanceof CanvasRenderingContext2D, "context instanceof CanvasRenderingContext2D" );
});

test("Canvas 2D Text", function() {
  var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");

  assert( !!context.fillText, "2D Text supported" );
});
