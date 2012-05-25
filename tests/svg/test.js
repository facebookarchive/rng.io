test("SVG", function() {
  var createElementNS = document.createElementNS;

  assert( !!createElementNS, "SVG createElementNS supported" );
});

test("SVG Element (Namespace)", function() {
  var namespace = "http://www.w3.org/2000/svg",
      svg = document.createElementNS( namespace, "svg" );

  assert( !!svg, "svg supported" );
  assert( !!svg.getCurrentTime, "svg Namespace getCurrentTime" );
  assert( svg.ownerSVGElement === null, "svg Namespace ownerSVGElement supported" );
});
