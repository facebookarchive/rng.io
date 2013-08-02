test("Canvas 3D Context, standard", function() {
  assert( document.createElement("canvas").getContext("webgl"), "webgl standard, supported" );
});
