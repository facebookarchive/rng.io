test("Blob", function() {
  var Blob = H.API( window, "Blob", true );

  assert( !!Blob, "Blob supported" );
});

// test("Blob, Blob Slice", function() {
//   var Blob = H.API( window, "Blob", true ),
//       value = "Oh Hai!",
//       builder, blob, slice;

//   if ( !Blob ) {
//     assert( false, "Blob not supported, skipping tests" );
//   } else {
//     blob = new Blob();
//     slice = H.API( blob, "slice", true );

//     assert( slice, "blob.slice supported (" + slice.name + ")" );
//   }
// });

// test("Blob In Practice", function() {
//   var Blob = H.API( window, "Blob", true ),
//       value = "Oh Hai!",
//       blob;

//   if ( !Blob ) {
//     assert( false, "Blob not supported, skipping tests" );
//   } else {
//     blob = new Blob(["Oh Hai!"], { type: "text\/plain" });

//     assert( blob.size === value.length, "blob.size is correct");
//     assert( "type" in blob, "blob.type supported" );
//   }
// });
