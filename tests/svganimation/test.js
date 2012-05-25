test("SVG Element (Animation)", function() {
  var namespace = "http://www.w3.org/2000/svg",
      animate = document.createElementNS( namespace, "animate" );

  assert( !!animate, "svg animate" );

  // try {
  //   assert( animate.ownerSVGElement == null, "svg Animation ownerSVGElement supported" );
  // } catch( error ) {
  //   assert( false, "Accessing ownerSVGElement throws a " + error.name + " Exception" );
  // }
  // TODO: Improve these tests
});
