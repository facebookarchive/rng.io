/*
* text-stroke, text-stroke-width, and text-stroke-color
* are only supported in Webkit browsers with -webkit prefix
* The property has not even been specced by W3C
*/

test("CSS Text Stroke", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textStroke", true ), "textStroke supported" );
  assert( H.test.cssProp( elem, "textStrokeColor", true ), "textStrokeColor supported" );
  assert( H.test.cssProp( elem, "textStrokeWidth", true ), "textStrokeWidth supported" );

});

// test("Standard-compliant CSS Text Stroke properties", function() {
//
//   var elem = document.createElement("div");
//
//   assert( H.test.cssProp( elem, "textStroke" ), "Shorthand textStroke supported" );
//   assert( H.test.cssProp( elem, "textStrokeColor" ), "textStrokeColor supported" );
//   assert( H.test.cssProp( elem, "textStrokeWidth" ), "textStrokeWidth supported" );
//
// });
