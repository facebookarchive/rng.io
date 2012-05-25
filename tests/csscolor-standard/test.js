test("CSS opacity, standard", function() {

  var elem = document.createElement("div");

  elem.style.cssText = "opacity:.55";

  assert( /^0.55$/.test( elem.style.opacity ), "elem.style.opacity standard, supported" );

});
