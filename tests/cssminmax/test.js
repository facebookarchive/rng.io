test("CSS min-width", function() {
  var fixture = document.querySelector("#cssminmax #css-min-width");

  assert( getComputedStyle( fixture ).getPropertyValue("width") === "20px", "min-width supported" );
});

test("CSS max-width", function() {
  var fixture = document.querySelector("#cssminmax #css-max-width");

  assert( getComputedStyle( fixture ).getPropertyValue("width") === "20px", "max-width supported" );
});

test("CSS min-height", function() {
  var fixture = document.querySelector("#cssminmax #css-min-height");

  assert( getComputedStyle( fixture ).getPropertyValue("height") === "20px", "min-height supported" );
});

test("CSS max-height", function() {
  var fixture = document.querySelector("#cssminmax #css-max-height");

  assert( getComputedStyle( fixture ).getPropertyValue("height") === "20px", "max-height supported" );
});
