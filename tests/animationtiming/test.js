test("Animation Timing requestAnimationFrame", function() {
  var requestAnimationFrame = H.API( window, "requestAnimationFrame", true );

  assert( requestAnimationFrame, "requestAnimationFrame supported" );
});

test("Animation Timing cancelAnimationFrame", function() {
  var cancelAnimationFrame = H.API( window, "cancelAnimationFrame", true ) ||
                              H.API( window, "cancelRequestAnimationFrame", true );

  assert( cancelAnimationFrame, "cancelAnimationFrame supported" );
});

asyncTest("Animation Timing in Practice", function( async ) {
  var rafAnimate, rafStart, rafStop, animationStartTime,
      requestId = 0,
      frames = 0,
      div = document.getElementById("animationtiming"),
      requestAnimationFrame = H.API( window, "requestAnimationFrame", true ),
      cancelAnimationFrame = H.API( window, "cancelAnimationFrame", true ) ||
                              H.API( window, "cancelRequestAnimationFrame", true );

  // var div = document.createElement("div");
  // document.body.appendChild(div);
  if ( !requestAnimationFrame || !cancelAnimationFrame ) {
    assert( false, "requestAnimationFrame or cancelAnimationFrame is not supported, skipping tests" );
    async.done();
  } else {
    rafAnimate = function( time ) {
      frames++;

      div.style.left = (Date.now() - animationStartTime) % 2000 / 4 + "px";

      requestId = requestAnimationFrame( rafAnimate );
    };

    rafStart = function() {
      animationStartTime = Date.now();

      requestId = requestAnimationFrame( rafAnimate );
    };

    rafStop = function() {
      if ( requestId ) {
        cancelAnimationFrame( requestId );
      }
      requestId = 0;
    };

    rafStart();

    setTimeout(function() {
      rafStop();
      async.step(function() {

        // requestAnimationFrame is capable of up to 60 fps
        // how can we best test frame rates?
        assert( frames / 3 > 30, "> 30 fps" );

        async.done();
      });
    }, 3000 );
  }
});
