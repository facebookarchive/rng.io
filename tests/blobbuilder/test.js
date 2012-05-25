test("BlobBuilder", function() {
  var BlobBuilder = H.API( window, "BlobBuilder", true );

  assert( !!BlobBuilder, "BlobBuilder supported" );
});

test("BlobBuilder, Blob Slice", function() {
  var BlobBuilder = H.API( window, "BlobBuilder", true ),
      value = "Oh Hai!",
      builder, blob, slice;

  if ( !BlobBuilder ) {
    assert( false, "BlobBuilder not supported, skipping tests" );
  } else {
    blob = (new BlobBuilder()).getBlob();
    slice = H.API( blob, "slice", true );

    assert( slice, "blob.slice supported (" + slice.name + ")" );
  }
});

test("BlobBuilder In Practice", function() {
  var BlobBuilder = H.API( window, "BlobBuilder", true ),
      value = "Oh Hai!",
      builder, blob;

  if ( !BlobBuilder ) {
    assert( false, "BlobBuilder not supported, skipping tests" );
  } else {
    builder = new BlobBuilder();
    builder.append("Oh Hai!");

    blob = builder.getBlob();

    assert( H.isKindOf( blob, "Blob" ), "getBlob() supported" );
    assert( blob.size === value.length, "blob.size is correct");
    assert( "type" in blob, "blob.type supported" );
  }
});
