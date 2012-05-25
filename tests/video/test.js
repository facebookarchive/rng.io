test("Video", function() {
  var video = document.createElement("video");

  assert( !!video.canPlayType, "video supported" );
});

test("Video Codec: mp4/MPEG-4", function() {
  var video = document.createElement("video");

  assert( video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.8"') !== "no", 'MPEG-4 supported (codecs="avc1.42E01E, mp4a.40.8")' );
});


test("Video Codec: mp4/H.264", function() {
  var video = document.createElement("video");

  assert( video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') !== "no", 'H.264 supported (codecs="avc1.42E01E, mp4a.40.2")' );
  assert( video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== "no", 'H.264 supported (codecs="avc1.42E01E")' );
});

test("Video Codec: ogg", function() {
  var video = document.createElement("video");
  assert( video.canPlayType('video/ogg; codecs="theora"') !== "no", 'OGG supported (codecs="theora")' );
});

test("Video Codec: WebM", function() {
  var video = document.createElement("video");
  assert( video.canPlayType('video/webm; codecs="vp8, vorbis"') !== "no", 'WebM supported (codecs="vp8, vorbis")' );
  assert( video.canPlayType('video/webm; codecs="vp8"') !== "no", 'WebM supported (codecs="vp8")' );
});
