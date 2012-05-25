test("CSS Masks", function() {
  var namespace = "http://www.w3.org/2000/svg",
      elem = document.createElement("div"),
      supported = H.test.cssProp( elem, "maskImage", true ),
      svg, mask;


  if ( !supported ) {
    svg = document.createElementNS( namespace, "svg" );
    mask = document.createElementNS( namespace, "mask" );

    if ( "ownerSVGElement" in svg ) {

      assert( ("maskContentUnits" in mask) && ("maskUnits" in mask), "image masking supported" );

    } else {
      assert( false, "no image masking is supported" );
    }
  } else {
    assert( supported, "image masking supported" );
  }
});
