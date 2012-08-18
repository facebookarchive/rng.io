test("Video Track", function() {
  var video = document.createElement("video"),
      track = document.createElement("track");

  assert( !!video.addTextTrack, "video.addTextTrack supported" );

  if ( !track ) {
    assert( false, "track elements are not supported, skipping tests" );
  } else {
    // HTMLTrackElement
    assert( "kind" in track, "track.kind supported" );
    assert( "src" in track, "track.src supported" );
    assert( "srclang" in track, "track.srclang supported" );
    assert( "label" in track, "track.label supported" );
    assert( "default" in track, "track.default supported" );
  }
});
