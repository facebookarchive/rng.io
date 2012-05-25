test("SVG Element (Inline)", function() {
  var container = document.createElement("div"),
      svg;

  container.innerHTML = "<svg>";

  svg = container.children[ 0 ];

  assert( !!svg, "svg inline" );
  assert( svg.nodeName === "svg", "svg inline nodeName is correct" );
  assert( !!svg.getCurrentTime, "svg Inline getCurrentTime" );
  assert( svg.ownerSVGElement === null, "svg Inline ownerSVGElement supported" );
});
