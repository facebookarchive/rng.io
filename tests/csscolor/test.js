test("CSS opacity", function() {

  // Browsers that actually have CSS Opacity implemented have done so
  //  according to spec, which means their return values are within the
  //  range of [0.0,1.0] - including the leading zero.

  var
  elem = document.createElement("div"),
  baseRule = "opacity:.55",
  rules = H.prefixes.expandCss( baseRule );

  elem.style.cssText = rules;

  // The non-literal . in this regex is intentional:
  //   German Chrome returns this value as 0,55
  // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
  assert( /^0.55$/.test( elem.style.opacity ), "CSS opacity supported" );

});

test("CSS color properties, RGBA support", function() {

  var elem = document.createElement("div");

  // Set an rgba() color and check the returned value

  elem.style.cssText = "background-color:rgba(150,255,150,.5)";

  assert( H.test.string( elem.style.backgroundColor, "rgba" ), "RGBA color supported" );

});

test("CSS color properties, HSLA support", function() {

  var bgcolor,
  elem = document.createElement("div");

  // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
  //   except IE9 who retains it as hsla

  elem.style.cssText = "background-color:hsla(120,40%,100%,.5)";

  bgcolor = elem.style.backgroundColor;

  assert( H.test.string( bgcolor, "rgba" ) || H.test.string( bgcolor, "hsla" ), "HSLA color supported" );

});
