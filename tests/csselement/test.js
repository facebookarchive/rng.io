test("CSS Element", function() {
  // Mozilla: http://jsbin.com/ixunun/
  // WebKit: http://jsbin.com/ubopig

  var elem = document.createElement("div"),
      expanded = H.prefixes.expandCss("element(#csselement)").split(";"),
      concated = "",
      result;

  expanded.forEach(function( rule ) {
    if ( rule ) {
      concated += "background: " + rule + ";";
    }
  });

  elem.style.cssText = concated;

  // Test for capability via element() rule
  // eg. Mozilla: http://jsbin.com/ixunun/
  if ( /-element/.test(elem.style.background) && /csselement/.test(elem.style.background) ) {
    result = "CSS Element supported via (possibly prefixed) -element() rule";
  } else {
  // Test for capability via document.getCSSCanvasContext
  // eg. WebKit: http://jsbin.com/ubopig
    if ( H.API( document, "getCSSCanvasContext", true ) ) {
      result = "CSS Element supported via document.getCSSCanvasContext";
    }
  }

  // result will be undefined if no support can be found
  assert( result, result || "CSS Element not supported" );
});
