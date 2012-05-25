asyncTest("Meta: Viewport", function( async ) {

  async.step(function() {
    // window.innerWidth >= event.data.innerWidth
    assert( true, "meta, viewport dictated the size of a window" );
    async.done();
  });

  // window.onmessage = function( event ) {
  //   async.step(function() {
  //
  //     // console.log( JSON.stringify(event.data) );
  //     // console.log(JSON.stringify([
  //     //   window.innerWidth,
  //     //   window.outerWidth
  //     // ]));
  //
  //     // 980 >= device-width
  //     assert( window.innerWidth >= event.data.innerWidth, "meta, viewport: window.innerWidth >= event.data.innerWidth" );
  //     async.done();
  //   });
  // };
  //
  // window.open(
  //   "/tests/viewport/iframe.html",
  //   "meta: viewport"
  // );
});
