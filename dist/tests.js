
window.spec = "animationtiming";


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

window.spec = "appcache";


test("applicationCache (Offline Support)", function() {
  var applicationCache = H.API( window, "applicationCache", true );

  assert( applicationCache, "applicationCache supported" );
});

// oncached: null
// onchecking: null
// ondownloading: null
// onerror: null
// onnoupdate: null
// onobsolete: null
// onprogress: null
// onupdateready: null
// status: 0


// asyncTest("applicationCache In Practice", function( async ) {
//   var iframe = document.getElementById("appcache").contentWindow,
//       appcache = iframe.applicationCache,
//       // TODO: Refactor this to be used with any cookie key=value
//       setCookie = function( time ) {
//         document.cookie = "online=true; expires=" + ((new Date()).getTime() + time);
//       };
//
//   // Set a cookie to be read by example.appcache.php,
//   // this is _required_ to work around issues with the
//   // applicationCache spec behaviour where it caches the
//   // first time, but will not re-read the cache unless
//   // otherwise told to do so. Normally, this might involve
//   // manually clearing the application cache - such facilities
//   // are available in limited access forms,
//   // eg. chrome://appcache-internals/
//   //
//   // In order to artificially cause an update to occur, we can
//   // set a cookie here, that will be read by example.appcache.php
//   // and respond with a HTTP 410
//   // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.11
//   // ... this will effectively "trick" the applicationCache API
//   // into believing the manifest is gone, causing the "checking"
//   // process to be re-run.
//   setCookie( 2600 );
//
//   setTimeout(function ready() {
//     if ( appcache.status > 0 ) {
//
//       assert( !!appcache.status, "appcache.status" );
//
//       async.done();
//
//       // Expire the cookie to enusre the test is run correctly,
//       // without interference from applicationCache, every time.
//       setCookie( -2600 );
//
//     } else {
//       setTimeout( ready, 10 );
//     }
//   }, 10);
// });

window.spec = "audio-multi";


asyncTest("Audio: Multiple Playback", function( async ) {
  var type,
      isDead = false,
      tick = 0,
      loaded = 0,
      codecs = {
        "mp3": 'audio/mpeg; codecs="mp3"',
        "ogg": 'audio/ogg; codecs="vorbis"',
        "wav": 'audio/wav; codecs="1"',
        "aac": 'audio/mp4; codecs="mp4a.40.2"'
      },
      audios = [
        new Audio(),
        new Audio()
      ];

  type = Object.keys( codecs ).filter(function( ext ) {
    return (/probably|maybe/).test( audios[ 0 ].canPlayType( codecs[ ext ] ) );
  })[ 0 ];

  audios[ 0 ].src = "/tests/audio-multi/amp." + type;
  audios[ 1 ].src = "/tests/audio-multi/chirp." + type;

  async.step(function() {
    audios.forEach(function( audio ) {
      audio.addEventListener( "playing", function() {
        tick++;

        if ( tick === audios.length && !isDead ) {
          async.step(function() {
            assert( true, "Multiple audio playback supported (used: " + type + ")" );
            isDead = true;
            async.done();
          });
        }
      }, false );

      audio.addEventListener( "loadeddata", function() {
        loaded++;
        audio.play();
        audio.volume = 0;
        audio.muted = true;

        if ( loaded === audios.length ) {
          setTimeout(function() {
            if ( !isDead ) {
              async.step(function() {
                assert( false, "Browser failed to load audio" );
                isDead = true;
                async.done();
              });
            }
          }, 1000 );
        }
      }, false );
    });
  });

  // Previous fix did not account for browsers that are incapable of
  // loading the two files, leaving the test "hung"
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "Browser failed to load audio" );
        isDead = true;
        async.done();
      });
    }
  }, 5000 );
});

window.spec = "blob";


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

window.spec = "blobbuilder";


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

window.spec = "canvas";


test("Canvas", function() {
  var canvas = document.createElement("canvas");

  assert( "getContext" in canvas, "canvas getContext supported" );
  assert( "toDataURL" in canvas, "canvas toDataURL supported" );
});

test("Canvas 2D Context", function() {
  var CanvasRenderingContext2D = window.CanvasRenderingContext2D,
      canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");

  assert( !!CanvasRenderingContext2D, "CanvasRenderingContext2D supported" );
  assert( context instanceof CanvasRenderingContext2D, "context instanceof CanvasRenderingContext2D" );
});

test("Canvas 2D Text", function() {
  var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");

  assert( !!context.fillText, "2D Text supported" );
});

window.spec = "canvas-3d";


test("Canvas 3D", function() {
  var WebGLRenderingContext = window.WebGLRenderingContext;

  assert( !!WebGLRenderingContext, "WebGLRenderingContext supported" );
});


test("Canvas 3D Context", function() {
  var WebGLRenderingContext = window.WebGLRenderingContext,
      canvas = document.createElement("canvas"),
      contexts = [
        "3d", "webgl", "experimental-webgl",
        "moz-webgl", "webkit-3d", "opera-3d", "ms-webgl", "ms-3d"
      ],
      which,
      context;

  while ( contexts.length ) {
    which = contexts.pop();
    context = canvas.getContext( which );

    if ( context ) {
      break;
    }
  }

  assert( !!WebGLRenderingContext, "WebGLRenderingContext supported (" + which + ")" );
});

window.spec = "canvas-3d-standard";


test("Canvas 3D Context, standard", function() {
  assert( document.createElement("canvas").getContext("webgl"), "webgl standard, supported" );
});

window.spec = "css-unspecified";


/*
* text-stroke, text-stroke-width, and text-stroke-color
* are only supported in Webkit browsers with -webkit prefix
* The property has not even been specced by W3C
*/

test("CSS Text Stroke", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textStroke", true ), "textStroke supported" );
  assert( H.test.cssProp( elem, "textStrokeColor", true ), "textStrokeColor supported" );
  assert( H.test.cssProp( elem, "textStrokeWidth", true ), "textStrokeWidth supported" );

});

// test("Standard-compliant CSS Text Stroke properties", function() {
//
//   var elem = document.createElement("div");
//
//   assert( H.test.cssProp( elem, "textStroke" ), "Shorthand textStroke supported" );
//   assert( H.test.cssProp( elem, "textStrokeColor" ), "textStrokeColor supported" );
//   assert( H.test.cssProp( elem, "textStrokeWidth" ), "textStrokeWidth supported" );
//
// });

window.spec = "css2-1selectors";


asyncTest("CSS 2.1 Selectors", function( async ) {
  var isCompleted = false;

  function selectors( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "selectors" && !isCompleted ) {
      isCompleted = true;
      async.step(function() {
        assert( data.results === "truetruetruetrue",
          "CSS 2.1 Selectors are supported"
        );
        H.off( window, "message", selectors );
        async.done();
      });
    }
  }

  H.on( window, "message", selectors );

  // Ensure the iframe fixture is loaded _after_ the onmessage is attached
  document.getElementById("css2-1selectors").src = "/tests/css2-1selectors/iframe.html";
});

asyncTest("CSS Generated Content", function( async ) {
  var isCompleted = false;

  function generated( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "generated" && !isCompleted ) {
      isCompleted = true;
      async.step(function() {
        assert( data.results >= 1,
          "CSS generated content modifies the offsetHeight as expected"
        );
        H.off( window, "message", generated );
        async.done();
      });
    }
  }

  H.on( window, "message", generated );

  // Ensure the iframe fixture is loaded _after_ the onmessage is attached
  document.getElementById("css2-1selectors").src = "/tests/css2-1selectors/iframe.html";
});

window.spec = "css3dtransforms";


test("CSS 3D Transforms: perspective", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "perspective", true ), "perspective supported" );
});

test("CSS 3D Transforms: perspective-origin", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "perspectiveOrigin", true ), "perspectiveOrigin supported" );
});

test("CSS 3D Transforms: transform", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "transform", true ), "transform supported" );
});

test("CSS 3D Transforms: transform-origin", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "transformOrigin", true ), "transformOrigin supported" );
});

test("CSS 3D Transforms: backfaceVisibility", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "backfaceVisibility", true ), "backfaceVisibility supported" );
});


// asyncTest("CSS 3D Transforms, basic inference", function( async ) {
//   var iframe = document.getElementById("css3dtransforms");
//
//   iframe.contentWindow.addEventListener("load", function(e) {
//     async.step(function() {
//       var doc = iframe.contentDocument,
//           elem = doc.getElementById("inference"),
//           transform, property;
//
// // Need prefixing...
//       transform = iframe.contentWindow.getComputedStyle( elem ).getPropertyValue("-moz-transform");
//
//       assert( transform !== "none",
//         "-transform supported"
//       );
//
//       async.done();
//     });
//   });
// });

window.spec = "cssanimation";


test("CSS Animation", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "animationName", true ), "animationName supported" );
});

window.spec = "cssanimation-standard";


test("CSS Animation, standard", function() {
  var div = document.createElement("div");
  assert( H.test.cssProp( div, "animationName" ), "animationName standard, supported" );
});

window.spec = "cssbackground";


test("CSS background shorthand property supports multiple images", function() {

  var elem = document.createElement("div");

  // Setting multiple images AND a color on the background shorthand property
  //  and then querying the style.background property value for the number of
  //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

  elem.style.cssText = "background:url(https://),url(https://),red url(https://)";

  // If the UA supports multiple backgrounds, there should be three occurrences
  //   of the string "url(" in the return value for elem.style.background

  assert( /(url\s*\(.*?){3}/.test( elem.style.background ), "background shorthand, multiple images supported" );

});

test("CSS box-shadow", function() {
  // According to the Modernizr source
  // This test false-positives in WebOS
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "boxShadow", true ), "CSS box-shadow supported" );

});

test("CSS border-radius", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderRadius", true ), "CSS border-radius supported" );

});

window.spec = "cssbackground-standard";


test("CSS border-image, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderImageSource" ), "border-image-source standard, supported" );
  assert( H.test.cssProp( elem, "borderImageSlice" ), "border-image-slice standard, supported" );
  assert( H.test.cssProp( elem, "borderImageWidth" ), "border-image-width standard, supported" );
  assert( H.test.cssProp( elem, "borderImageOutset" ), "border-image-outset standard, supported" );
  assert( H.test.cssProp( elem, "borderImageRepeat" ), "border-image-repeat standard, supported" );
  assert( H.test.cssProp( elem, "borderImage" ), "Shorthand border-image standard, supported" );
});

test("CSS box-shadow, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "boxShadow" ), "CSS box-shadow standard, supported" );
});


test("CSS border-radius, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderRadius" ), "CSS border-radius standard, supported" );
});

window.spec = "cssborderimage";


test("CSS border-image", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderImageSource", true ), "border-image-source supported" );
  assert( H.test.cssProp( elem, "borderImageSlice", true ), "border-image-slice supported" );
  assert( H.test.cssProp( elem, "borderImageWidth", true ), "border-image-width supported" );
  assert( H.test.cssProp( elem, "borderImageOutset", true ), "border-image-outset supported" );
  assert( H.test.cssProp( elem, "borderImageRepeat", true ), "border-image-repeat supported" );
  assert( H.test.cssProp( elem, "borderImage", true ), "Shorthand border-image supported" );

});

test("CSS border-image shorthand property", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "borderImage", true ), "CSS border-image shorthand property supported" );

});

window.spec = "csscolor";


test("CSS opacity", function() {

  // Browsers that actually have CSS Opacity implemented have done so
  //  according to spec, which means their return values are within the
  //  range of [0.0,1.0] - including the leading zero.

  var
  elem = document.createElement("div"),
  baseRule = "opacity:.55",
  rules = H.prefixes.expandCss( baseRule );

  elem.style.cssText = rules;

  // The non-literal . in this regex is intentional:
  //   German Chrome returns this value as 0,55
  // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
  assert( /^0.55$/.test( elem.style.opacity ), "CSS opacity supported" );

});

test("CSS color properties, RGBA support", function() {

  var elem = document.createElement("div");

  // Set an rgba() color and check the returned value

  elem.style.cssText = "background-color:rgba(150,255,150,.5)";

  assert( H.test.string( elem.style.backgroundColor, "rgba" ), "RGBA color supported" );

});

test("CSS color properties, HSLA support", function() {

  var bgcolor,
  elem = document.createElement("div");

  // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
  //   except IE9 who retains it as hsla

  elem.style.cssText = "background-color:hsla(120,40%,100%,.5)";

  bgcolor = elem.style.backgroundColor;

  assert( H.test.string( bgcolor, "rgba" ) || H.test.string( bgcolor, "hsla" ), "HSLA color supported" );

});

window.spec = "csselement";


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

window.spec = "cssflexbox";


test("CSS Flexbox, align-content", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "alignContent", true ), "alignContent supported" );
});

test("CSS Flexbox, align-items", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "alignItems", true ), "alignItems supported" );
});

test("CSS Flexbox, align-self", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "alignSelf", true ), "alignSelf supported" );
});

test("CSS Flexbox, flex", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flex", true ), "flex supported" );
});

test("CSS Flexbox, flex-basis", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexBasis", true ), "flexBasis supported" );
});

test("CSS Flexbox, flex-direction", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexDirection", true ), "flexDirection supported" );
});

test("CSS Flexbox, flex-flow", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexFlow", true ), "flexFlow supported" );
});

test("CSS Flexbox, flex-grow", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexGrow", true ), "flexGrow supported" );
});

test("CSS Flexbox, flex-shrink", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexShrink", true ), "flexShrink supported" );
});

test("CSS Flexbox, flex-wrap", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexWrap", true ), "flexWrap supported" );
});

test("CSS Flexbox, justify-content", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "justifyContent", true ), "justifyContent supported" );
});

test("CSS Flexbox, order", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "order", true ), "order supported" );
});








test("CSS Flexbox, align-flow", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "alignFlow", true ), "alignFlow supported" );
});

test("CSS Flexbox, align-pack", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "alignPack", true ), "alignPack supported" );
});

test("CSS Flexbox, align-order", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "alignOrder", true ), "alignOrder supported" );
});

window.spec = "cssflexbox-standard";


test("CSS Flexbox, align-content", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "alignContent" ), "alignContent supported" );
});

test("CSS Flexbox, align-items", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "alignItems" ), "alignItems supported" );
});

test("CSS Flexbox, align-self", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "alignSelf" ), "alignSelf supported" );
});

test("CSS Flexbox, flex", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flex" ), "flex supported" );
});

test("CSS Flexbox, flex-basis", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexBasis" ), "flexBasis supported" );
});

test("CSS Flexbox, flex-direction", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexDirection" ), "flexDirection supported" );
});

test("CSS Flexbox, flex-flow", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexFlow" ), "flexFlow supported" );
});

test("CSS Flexbox, flex-grow", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexGrow" ), "flexGrow supported" );
});

test("CSS Flexbox, flex-shrink", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexShrink" ), "flexShrink supported" );
});

test("CSS Flexbox, flex-wrap", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "flexWrap" ), "flexWrap supported" );
});

test("CSS Flexbox, justify-content", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "justifyContent" ), "justifyContent supported" );
});

test("CSS Flexbox, order", function() {
  var div = document.createElement("div");

  assert( H.test.cssProp( div, "order" ), "order supported" );
});

window.spec = "cssfont";


asyncTest("CSS Font Face", function( async ) {
  var isCompleted = false;

  function fontface( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "fontface" && !isCompleted ) {
      isCompleted = true;
      async.step(function() {
        data.results.forEach(function( set ) {
          assert( set.result, set.desc );
        });
        H.off( window, "message", fontface );
        async.done();
      });
    }
  }

  H.on( window, "message", fontface );

  document.getElementById("cssfont-face").src = "/tests/cssfont/fontface.html";
});


asyncTest("CSS EOT/OTF/SVG", function( async ) {
  var isCompleted = false;

  function practical( event ) {
    var data = JSON.parse( event.data );

    if ( data.which === "practical" && !isCompleted ) {
      isCompleted = true;
      async.step(function() {
        data.results.forEach(function( set ) {
          assert( set.result, set.desc );
        });
        H.off( window, "message", practical );
        async.done();
      });
    }
  }

  H.on( window, "message", practical );

  document.getElementById("cssfont-load").src = "/tests/cssfont/iframe.html";
});

window.spec = "cssimages";


test("CSS Images url()", function() {
  var elem = document.createElement("div");

  elem.style.cssText = "background-image: url(https://);";

  assert( H.test.string( elem.style.backgroundImage, "url" ), "images with url() supported" );
});

test("CSS Images linear-gradient", function() {
  /**
  * Logic sourced from Modernizr
  * https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
  */

  var elem = document.createElement("div"),
      str1 = "background-image:",
      str2 = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
      str3 = "linear-gradient(left top,#9f9, white);",

  rules =
    // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
    (str1 + "-webkit- ".split(" ").join(str2 + str1) +
    // standard syntax             // trailing "background-image:"
    H.prefixes.css.join(str3 + str1)).slice(0, -str1.length);

  elem.style.cssText = rules;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "linear-gradient supported" );
});

test("CSS Images repeating-linear-gradient", function() {
  var elem = document.createElement("div"),
      rule = "background-image:",
      value = "repeating-linear-gradient(-22deg, #f99 20px, #fff 40px)",
      l = H.prefixes.css.length - 1,
      expanded = H.prefixes.css.slice( 0, l ).map(function(prefix) {
        return rule + prefix + value;
      }).join(";") + ";";

  elem.style.cssText = expanded;

  assert( H.test.string( elem.style.backgroundImage, "repeating" ), "repeating-linear-gradient supported" );
});

test("CSS Images radial-gradient", function() {
  var elem = document.createElement("div"),
      rule = "background-image:",
      value = "radial-gradient(75% 50%, ellipse closest-side, #99ff99, #ffffff 50%)",
      l = H.prefixes.css.length - 1,
      expanded = H.prefixes.css.slice( 0, l ).map(function(prefix) {
        return rule + prefix + value;
      }).join(";") + ";";

  elem.style.cssText = expanded;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "radial-gradient supported" );
});

test("CSS Images repeating-radial-gradient", function() {
  var elem = document.createElement("div"),
      rule = "background-image:",
      value = "repeating-radial-gradient(75% 50%, ellipse closest-side, #99ff99, #ffffff 50%)",
      l = H.prefixes.css.length - 1,
      expanded = H.prefixes.css.slice( 0, l ).map(function(prefix) {
        return rule + prefix + value;
      }).join(";") + ";";

  elem.style.cssText = expanded;

  assert( H.test.string( elem.style.backgroundImage, "repeating" ), "repeating-radial-gradient supported" );
});

test("CSS Images object-fit", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "objectFit", true ), "object-fit supported" );
});

test("CSS Images object-position", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "objectPosition", true ), "object-position supported" );
});

test("CSS Images image-orientation", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "imageOrientation", true ), "imageOrientation supported" );
});

test("CSS Images image-resolution", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "imageResolution", true ), "imageResolution supported" );
});

window.spec = "cssimages-standard";


test("CSS Images linear-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:linear-gradient(to bottom right, #9f9, white);";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "linear-gradient standard, supported" );

});

test("CSS Images repeating-linear-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:repeating-linear-gradient(-22deg, #f99 20px, #fff 40px)";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "repeating" ), "repeating-linear-gradient standard, supported" );

});

test("CSS Images radial-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:radial-gradient(ellipse closest-side at 75% 50%, #99ff99, #ffffff 50%);";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "gradient" ), "radial-gradient standard, supported" );

});

test("CSS Images repeating-radial-gradient, standard", function() {

  var elem = document.createElement("div"),
  rule = "background-image:repeating-radial-gradient(ellipse closest-side at 75% 50%, #99ff99, #ffffff 50%);";

  elem.style.cssText = rule;

  assert( H.test.string( elem.style.backgroundImage, "repeating" ), "repeating-radial-gradient standard, supported" );

});

test("CSS Images object-fit, standard", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "objectFit" ), "object-fit standard, supported" );

});

test("CSS Images object-position, standard", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "objectPosition" ), "object-position standard, supported" );

});

test("CSS Images image-orientation", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "imageOrientation" ), "imageOrientation supported" );
});

test("CSS Images image-resolution", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "imageResolution" ), "imageResolution supported" );
});

window.spec = "cssmediaqueries";


test("Media Queries matchMedia API exists", function() {
  assert( H.API( window, "matchMedia", true ), "matchMedia supported" );
});

test("Media Queries matchMedia querying", function( async ) {
  var iframe = document.getElementById("cssmediaqueries"),
      iwindow = iframe.contentWindow,
      matches = {};

  if ( !iwindow.matchMedia ) {
    assert( false, "matchMedia is not supported, skipping tests" );
  } else {

    matches.pass = iwindow.matchMedia("screen and (max-width: 500px)");
    matches.fail = iwindow.matchMedia("example { body { background:red } }");

    assert( matches.pass && matches.pass.matches, "matchMedia expects passing results" );
    assert( matches.fail && !matches.fail.matches, "matchMedia expects failing results" );
  }
});

window.spec = "cssminmax";


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

window.spec = "cssopacity";


test("CSS opacity", function() {
  var elem = document.createElement("div");

  elem.style.cssText = "opacity:.55";

  assert( /^0.55$/.test( elem.style.opacity ), "opacity supported" );
});

window.spec = "cssoverflow";


test("CSS Overflow Scrolling", function() {
  var elem = document.createElement("div");
  assert( H.test.cssProp( elem, "overflowScrolling", true ), "overflowScrolling supported" );
});

window.spec = "cssoverflow-standard";


test("CSS Overflow Scrolling, standard", function() {
  var elem = document.createElement("div");
  assert( H.test.cssProp( elem, "overflowScrolling" ), "overflowScrolling standard, supported" );
});

window.spec = "cssposition";


asyncTest("CSS Fixed Position", function( async ) {

  function position( event ) {
    async.step(function() {
      assert( event.data, "Fixed Position supported" );
      H.off( window, "message", position );
      async.done();
    });
  }

  H.on( window, "message", position );

  // Ensure the iframe fixture is loaded _after_ the onmessage is attached
  document.getElementById("cssposition").src = "/tests/cssposition/iframe.html";

});

window.spec = "csstext";


// FF3.0 will false positive on this test. Source: Modernizr
test("CSS text-shadow", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textShadow", true ), "textShadow supported" );
});

test("CSS word-wrap", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordWrap", true ), "wordWrap supported" );
});

test("CSS word-break", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordBreak", true ), "wordBreak supported" );
});

test("CSS word-spacing", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordSpacing", true ), "wordSpacing supported" );
});

window.spec = "csstext-standard";


// FF3.0 will false positive on this test. Source: Modernizr
test("CSS text-shadow, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textShadow" ), "textShadow supported, standard" );
});

test("CSS word-wrap, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordWrap" ), "wordWrap supported, standard" );
});

test("CSS word-break, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordBreak" ), "wordBreak supported, standard" );
});

test("CSS word-spacing, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "wordSpacing" ), "wordSpacing supported, standard" );
});

window.spec = "csstransforms";


test("CSS Transform (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transform", true ), "transform supported" );
});

test("CSS transform-origin (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transformOrigin", true ), "transformOrigin supported" );
});

test("CSS transform-style (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transformStyle", true ), "transformStyle supported" );
});

// test("CSS Transforms (3d)", function() {
//   var elem = document.createElement("div");
//
//   assert( H.test.cssProp( elem, "transform-3d", true ) );
// });
//

test("CSS Perspective (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "perspective", true ), "perspective supported" );
});

test("CSS perspective-origin (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "perspectiveOrigin", true ), "perspectiveOrigin supported" );
});

test("CSS backface-visibility (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "backfaceVisibility", true ), "backfaceVisibility supported" );
});

window.spec = "csstransforms-standard";


test("CSS Transform (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transform" ), "transform supported" );
});

test("CSS transform-origin (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transformOrigin" ), "transformOrigin supported" );
});

test("CSS transform-style (2d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transformStyle" ), "transformStyle supported" );
});

test("CSS Perspective (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "perspective" ), "perspective supported" );
});

test("CSS perspective-origin (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "perspectiveOrigin" ), "perspectiveOrigin supported" );
});

test("CSS backface-visibility (3d)", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "backfaceVisibility" ), "backfaceVisibility supported" );
});

window.spec = "csstransitions";


test("CSS Transitions", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transition", true ), "transitions supported" );
});

window.spec = "csstransitions-standard";


test("CSS Transitions, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "transition" ), "transitions standard, supported" );
});

window.spec = "cssui";


test("CSS UI text-overflow", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textOverflow", true ), "textOverflow" );
});

test("CSS UI box-sizing", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "boxSizing", true ), "boxSizing" );
});

test("CSS UI Pointer Events", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "pointerEvents", true ), "pointerEvents supported" );
});

window.spec = "cssui-standard";


test("CSS text-overflow, standard", function() {
  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "textOverflow" ), "textOverflow standard, supported" );
});

test("CSS box-sizing, standard", function() {

  var elem = document.createElement("div");

  assert( H.test.cssProp( elem, "boxSizing" ), "boxSizing standard, supported" );

});

// TODO: Add functional tests to determine that content-box, padding-box, and border-box work properly

window.spec = "cssvalues";


test("CSS Values Root EM", function() {

  var fixture,
      origSize = null,
      fontSize = null;

  fixture = document.getElementById("cssvalues");

  origSize = parseInt( getComputedStyle( fixture ).getPropertyValue("font-size"), 10 );


  fixture.style.cssText = "font-size: 1rem";
  fontSize = parseInt( getComputedStyle( fixture ).getPropertyValue("font-size"), 10 );
  // assert( origSize === fontSize, "Root EM origSize === fontSize" );

  fixture.style.cssText = "font-size: 2rem";
  fontSize = parseInt( getComputedStyle( fixture ).getPropertyValue("font-size"), 10 );
  // "Root EM origSize < fontSize"
  assert( origSize < fontSize, "Root EM values supported" );

  fixture.style.cssText = "font-size: 1rem";
  fontSize = parseInt( getComputedStyle( fixture ).getPropertyValue("font-size"), 10 );
  assert( origSize === fontSize, "Root EM restored to expected size" );
});

window.spec = "dataset";


test("Dataset", function() {
  assert( !!document.createElement("div").dataset, "Dataset supported" );
});

test("Dataset Implementation", function() {
  var DOMStringMap = window.DOMStringMap,
      fixture = document.createElement("div"),
      instance, length;

  // Avoid exceptions in Android #278
  if ( !fixture.dataset ) {
    instance = false;
    length = 0;
  } else {
    fixture.dataset.beta = "b";
    instance = (fixture.dataset instanceof DOMStringMap);
    length = Object.keys(fixture.dataset).length;
  }

  assert( instance, "fixture.dataset property is DOMStringMap" );
  assert( length === 1, "fixture.dataset.length expects 1" );
});

test("Dataset Interop with Attributes", function() {
  var fixture = document.createElement("div"),
      attr, value;

  // Avoid exceptions in Android #278
  if ( !fixture.dataset ) {
    attr = "";
    value = "";
  } else {
    fixture.setAttribute( "data-alpha", "a" );
    fixture.dataset.beta = "b";

    attr = fixture.getAttribute("data-beta");
    value = fixture.dataset.alpha;
  }

  assert( attr === "b", "fixture.getAttribute('data-beta') === 'b' (set with dataset)" );
  assert( value === "a", "fixture.dataset.alpha === 'a' (set with setAttribute)" );
});

test("Dataset Get*", function() {
  var fixture = document.createElement("div");

  // Avoid exceptions in Android #278
  if ( !fixture.dataset ) {
    assert( false, "Dataset not supported, not running get* tests" );
  } else {
    fixture.setAttribute( "data-alpha", "a" );
    fixture.dataset.beta = "b";

    assert( fixture.getAttribute("data-beta") === "b", "compatible get with getAttribute" );
    assert( fixture.dataset.alpha === "a", "compatible set with setAttribute" );

    [
      [ "data-foo", "foo" ],
      [ "data-foo-bar", "fooBar" ],
      [ "data--", "-" ],
      [ "data--foo", "Foo" ],
      [ "data---foo", "-Foo" ],
      [ "data-Foo", "foo" ],
      [ "data-", "" ],
      [ "data-\xE0", "\xE0" ]
    ].forEach(function( array, index ) {

      var fixture = document.createElement("div"),
          value = index + "";

      fixture.setAttribute( array[0], value );

      assert( fixture.dataset[ array[1] ] === value, "Expected: " + array.join(" = ") );
    });
  }
});

test("Dataset Enumerable", function() {
  var fixture = document.createElement("div"),
      actuals = [ "hello", "helloWorld", "ohHai" ],
      length = actuals.length,
      prop;

  // Avoid exceptions in Android #278
  if ( !fixture.dataset ) {
    assert( false, "Dataset not supported, not running Enumerable tests" );
  } else {
    fixture.setAttribute( "data-hello", 1 );
    fixture.setAttribute( "data-hello-world", 2 );
    fixture.setAttribute( "data-oh-hai", 2 );

    // This fails b/c Object.propertyIsEnumerable returns false...
    // turns out these properties don't have property descriptors
    // assert( Object.propertyIsEnumerable(fixture.dataset.ohHai) );
    for ( prop in fixture.dataset ) {
      actuals.splice( actuals.indexOf( prop ), 1 );
      length--;
      assert( actuals.length === length, prop );
    }

    assert( !actuals.length, "Expecting length === 0" );
  }
});

window.spec = "dataurl";


asyncTest("Data URL", function( async ) {

  var fixture = document.getElementById("dataurl"),
      clone = document.getElementById("dataurl-data").cloneNode(true);

  fixture.appendChild( clone );

  clone.onload = clone.onerror = function() {
    async.step(function() {
      if ( clone.width === 1 && clone.height === 1 ) {
        assert( true, "Data URL Loading: success" );
      } else {
        assert( false, "Data URL Loading: failed" );
      }

      async.done();
    });
  };
});

// TEMPORARILY BLOCKED
// Need to investigate issue surrounding different
// implementations of toDataURL
// asyncTest("Derived Data URL ", function( async ) {
//   var data = document.getElementById("dataurl-data"),
//       png = document.getElementById("dataurl-png"),
//       context = document.createElement("canvas").getContext("2d");
//
//   context.canvas.width = 1;
//   context.canvas.height= 1;
//
//   png.onload = function() {
//     async.step(function() {
//       context.drawImage( png, 0, 0 );
//       //"context.canvas.toDataURL() === data.src"
//       assert( context.canvas.toDataURL() === data.src, "Data URL supported" );
//
//       async.done();
//     });
//   };
// });

window.spec = "deviceorientation";


test("DeviceOrientationEvent", function() {
  assert( "DeviceOrientationEvent" in window, "DeviceOrientationEvent supported" );
});

test("DeviceMotionEvent", function() {
  assert( "DeviceMotionEvent" in window, "DeviceMotionEvent supported");
});

// test("DeviceOrientationEvent Object", function( async ) {
//   var DeviceOrientationEvent = H.API( window, "DeviceOrientationEvent", true ),
//       event;
//
//   if ( !DeviceOrientationEvent ) {
//     assert( false, "DeviceOrientationEvent not supported, skipping tests" );
//   } else {
//     // WebKit has a DeviceOrientationEvent constructor
//     // Firefox has a DeviceOrientationEvent prototype object
//     event = typeof DeviceOrientationEvent === "function" ?
//             document.createEvent("DeviceOrientationEvent") : DeviceOrientationEvent.prototype;
//
//     assert( "alpha" in event, "event.alpha supported" );
//     assert( "beta" in event, "event.beta supported" );
//     assert( "gamma" in event, "event.gamma supported" );
//   }
// });
//
//
// test("DeviceMotionEvent Object", function( async ) {
//   var DeviceMotionEvent = H.API( window, "DeviceMotionEvent", true ),
//       event;
//
//   if ( !DeviceMotionEvent ) {
//     assert( false, "DeviceMotionEvent not supported, skipping tests" );
//   } else {
//     // WebKit has a DeviceMotionEvent constructor
//     // Firefox has a DeviceMotionEvent prototype object
//     event = typeof DeviceMotionEvent === "function" ?
//             document.createEvent("DeviceMotionEvent") : DeviceMotionEvent.prototype;
//
//     assert( "acceleration" in event, "event.acceleration supported" );
//     assert( "accelerationIncludingGravity" in event, "event.accelerationIncludingGravity supported" );
//     assert( "rotationRate" in event, "event.rotationRate supported" );
//     assert( "interval" in event, "event.interval supported" );
//
//     assert( event.acceleration && "x" in event.acceleration, "event.acceleration.x supported" );
//     assert( event.acceleration && "y" in event.acceleration, "event.acceleration.y supported" );
//     assert( event.acceleration && "x" in event.acceleration, "event.acceleration.z supported" );
//
//     assert( event.rotationRate && "alpha" in event.rotationRate, "event.rotationRate.alpha supported" );
//     assert( event.rotationRate && "beta" in event.rotationRate, "event.rotationRate.beta supported" );
//     assert( event.rotationRate && "gamma" in event.rotationRate, "event.rotationRate.gamma supported" );
//   }
// });
//

// Simulated or Real DeviceOrientationEvent/DeviceMotionEvent will crash Android 4
// Way to go.

// asyncTest("DeviceOrientationEvent In Practice", function( async ) {
//   var iframe, timeout, handler;
//
//   if ( !H.isFunction( window.DeviceOrientationEvent ) ) {
//     assert( false, "DeviceOrientationEvent not supported, skipping tests" );
//     async.done();
//   } else {
//     iframe = document.createElement("iframe");
//     timeout = setTimeout(function() {
//       H.simulate( "devicemotion", iframe.contentWindow );
//     }, 2000);
//
//     iframe.src = "/tests/deviceorientation/iframe.html";
//
//     document.getElementById("deviceorientation").appendChild( iframe );
//
//     handler = function handler( event ) {
//       iframe.contentWindow.removeEventListener("deviceorientation", handler, false );
//       clearTimeout( timeout );
//       async.step(function() {
//         assert( !event.synthetic, "deviceorientation fired" );
//         assert( "alpha" in event, "alpha supported" );
//         assert( "beta" in event, "beta supported" );
//         assert( "gamma" in event, "gamma supported" );
//         // assert( "absolute" in event, "absolute supported" );
//         async.done();
//       });
//     };
//
//     iframe.contentWindow.addEventListener("deviceorientation", handler, false );
//   }
// });
//
// test("DeviceMotionEvent", function() {
//   assert( "DeviceMotionEvent" in window, "DeviceMotionEvent supported");
//   assert( H.isFunction( window.DeviceMotionEvent ), "DeviceMotionEvent is function" );
// });
//
// asyncTest("DeviceMotionEvent In Practice", function( async ) {
//   var timeout, handler;
//
//   if ( !H.isFunction( window.DeviceMotionEvent ) ) {
//     assert( false, "DeviceMotionEvent not supported, skipping tests" );
//     async.done();
//   } else {
//     timeout = setTimeout(function() {
//       H.simulate( "devicemotion", window );
//     }, 2000);
//
//     handler = function handler( event ) {
//       clearTimeout( timeout );
//       window.removeEventListener( "devicemotion", handler, false );
//       async.step(function() {
//         assert( !event.synthetic, "devicemotion fired" );
//
//         assert( "acceleration" in event, "acceleration supported" );
//         assert( "accelerationIncludingGravity" in event, "accelerationIncludingGravity supported" );
//         assert( "rotationRate" in event, "rotationRate supported" );
//         assert( "interval" in event, "interval supported" );
//
//         assert( event.acceleration && "x" in event.acceleration, "acceleration.x supported" );
//         assert( event.acceleration && "y" in event.acceleration, "acceleration.y supported" );
//         assert( event.acceleration && "x" in event.acceleration, "acceleration.z supported" );
//
//         assert( event.rotationRate && "alpha" in event.rotationRate, "rotationRate.alpha supported" );
//         assert( event.rotationRate && "beta" in event.rotationRate, "rotationRate.beta supported" );
//         assert( event.rotationRate && "gamma" in event.rotationRate, "rotationRate.gamma supported" );
//
//         async.done();
//       });
//     };
//     window.addEventListener( "devicemotion", handler, false );
//   }
// });

window.spec = "doctype";


test("Doctype CSS1Compat", function() {
  assert( document.compatMode === "CSS1Compat", "doctype html supported" );
});

window.spec = "filereader";


test("FileReader", function() {
  var FileReader = H.API( window, "FileReader", true );

  assert( FileReader, "FileReader supported" );
});

test("FileReader Events", function() {
  var FileReader = H.API( window, "FileReader", true ),
      reader;

  if ( !FileReader ) {
    assert( false, "FileReader not supported, skipping tests" );
  } else {
    reader = new FileReader();

    [
      "onabort",
      "onerror",
      "onload",
      "onloadend",
      "onloadstart",
      "onprogress"
    ].forEach(function( event ) {
      assert( event in reader, event + " supported" );
    });

  }
});

test("FileReader API", function() {
  var FileReader = H.API( window, "FileReader", true ),
      reader;

  if ( !FileReader ) {
    assert( false, "FileReader not supported, skipping tests" );
  } else {
    reader = new FileReader();

    [
      "readAsText",
      "readAsDataURL",
      "readAsArrayBuffer"
    ].forEach(function( method ) {
      assert( method in reader, method + " supported" );
    });
  }
});

window.spec = "filesaver";


test("FileSaver", function() {
  var FileSaver = H.API( window, "FileSaver", true );

  assert( !!FileSaver, "FileSaver supported" );
});

test("FileSaver Events", function() {
  var FileSaver = H.API( window, "FileSaver", true ),
      saver;

  if ( !FileSaver ) {
    assert( false, "FileSaver not supported, skipping tests" );
  } else {
    saver = new FileSaver();

    [
      "onabort",
      "onerror",
      "onwrite",
      "onwriteend",
      "onwritestart",
      "onprogress"
    ].forEach(function( event ) {
      assert( event in saver, event + " supported" );
    });
  }
});

test("FileSaver API", function() {
  var FileSaver = H.API( window, "FileSaver", true );

  if ( !FileSaver ) {
    assert( false, "FileSaver not supported, skipping tests" );
  } else {
    [
      "write",
      "seek",
      "truncate"
    ].forEach(function( method ) {
      assert( method in FileSaver.prototype, method + " supported" );
    });
  }
});

window.spec = "filesystem";


test("requestFileSystem", function() {
  var requestFileSystem = H.API( window, "requestFileSystem", true );

  assert( requestFileSystem, "requestFileSystem supported" );
});

window.spec = "filewriter";


test("FileWriter", function() {
  var FileWriter = H.API( window, "FileWriter", true );

  assert( FileWriter, "FileWriter supported" );
});

window.spec = "formdata";


test("FormData", function() {
  var FormData = H.API( window, "FormData", true );

  assert( !!FormData, "FormData supported" );
});

asyncTest("FormData Send and Receive", function( async ) {
  var FormData = H.API( window, "FormData", true ),
      formdata, xhr;

  if ( !FormData ) {
    assert( false, "FormData not supported, skipping tests" );
    async.done();
  } else {
    formdata = new FormData();
    xhr = new XMLHttpRequest();

    formdata.append("a", "alpha");
    formdata.append("b", "beta");

    xhr.onreadystatechange = function() {
      var response;

      if ( this.readyState === 4 && this.status === 200 ) {

        response = JSON.parse( this.responseText );
        async.step(function() {

          assert( response.a === "alpha", "Expected value, 'alpha'" );
          assert( response.b === "beta", "Expected value, 'beta'" );

          async.done();
        });
      }
    };

    xhr.open( "POST", "/tests/_server/echo.php" );
    xhr.send( formdata );
  }
});

asyncTest("FormData from HTMLFormElement", function( async ) {
  var FormData = H.API( window, "FormData", true ),
      form = document.getElementById("simpleForm"),
      formdata, xhr;

  if ( !FormData ) {
    assert( false, "FormData not supported, skipping tests" );
    async.done();
  } else {
    formdata = new FormData( form );
    xhr = new XMLHttpRequest();

    formdata.append("d", "delta");

    xhr.onreadystatechange = function() {
      var response;

      if ( this.readyState === 4 && this.status === 200 ) {

        response = JSON.parse( this.responseText );
        async.step(function() {

          assert( response.a === "alpha", "Expected value, 'alpha'" );
          assert( response.b === "beta", "Expected value, 'beta'" );
          assert( response.d === "delta", "Expected value, 'delta'" );

          async.done();
        });
      }
    };

    xhr.open( "POST", "/tests/_server/echo.php" );
    xhr.send( formdata );
  }
});

// TODO: Write a test for handling file uploads.
// Problematic because we can't progmatically set the contents of input type="file"

window.spec = "forms";


// These input type/attribute tests are a reogranized version Modernizr's,
// optimized for organization over sheer performance
// which in turn largely relies on Mike Taylor's original work
// http://miketaylr.com/code/input-type-attr.html
var poker = ":|",
// For each input type, specify whether it has a specced custom ui and whether it supports the checkuseValidity API
types = {
  email: {
    ui: false,
    useValidity: true
  },
  tel: {
    ui: false,
    useValidity: false
  },
  url: {
    ui: false,
    useValidity: true
  },
  search: {
    ui: false,
    useValidity: false
  },
  number: {
    ui: false,
    useValidity: false
  },
  range: {
    ui: true,
    useValidity: true,
    workaround: function( input ) {
      // This workaround is sourced from Modernizr
      // https://github.com/Modernizr/Modernizr/blob/master/modernizr.js#L880
      var docElem, defaultView, applied;

      if ( "WebkitAppearance" in input.style ) {
        docElem = document.documentElement;
        defaultView = document.defaultView;

        docElem.appendChild( input );

        // Safari 2-4 allows the smiley as a value, despite making a slider
        applied =  defaultView.getComputedStyle &&
                   defaultView.getComputedStyle( input, null ).WebkitAppearance !== "textfield" &&
                   // Mobile android web browser has false positive, so must
                   // check the height to see if the widget is actually there.
                   ( input.offsetHeight !== 0 );

        docElem.removeChild( input );

        return applied;
      }
      return input.value !== poker;
    }
  },
  datetime: {
    ui: true,
    useValidity: false
  },
  "datetime-local": {
    ui: true,
    useValidity: false
  },
  date: {
    ui: true,
    useValidity: false
  },
  week: {
    ui: true,
    useValidity: false
  },
  month: {
    ui: true,
    useValidity: false
  },
  color: {
    ui: true,
    useValidity: false
  }
};

for ( var t in types ) {
  (function(config, type) {

    var input = document.createElement("input");

    test("Input Types: <input type='" + type + "'>",   function() {

      var switched = false,
      sanitized = false;

      input.setAttribute( "type", type );

      switched = input.type !== "text";

      if ( switched ) {
        input.value = poker;
        input.style.cssText = "position:absolute;visibility:hidden;";
        if ( config.workaround ) {
          // If there's a specified 'workaround' for a particular input type,
          // use it to satisfy the sanitization question
          sanitized = config.workaround( input );
        } else if ( !config.ui && !config.validity ) {
          // There's no sanitization that the input should be doing, so it de-facto works
          sanitized = true;
        } else if ( config.useValidity ) {
          // If the type supports the validity API and we want to ensure it's properly aplying to ":|"
          sanitized = input.checkValidity && input.checkValidity() === false;
        } else {
          // Otherwise, the value should have been sanitized away
          sanitized = input.value !== poker;
        }
      }

      // If the type was successfuly switched and sanitization was satisfied, the input type supported
      assert( switched && sanitized, "input type='" + type + "' supported");
    });

  }( types[t], t));
}

"autocomplete autofocus list placeholder max maxLength min multiple pattern required step".split(" ").forEach(function(attr) {
  var input = document.createElement("input");

  test( "Input Attributes: <input " + attr.toLowerCase() + ">", function() {
    if ( attr === "list" ) {
      // safari false positives on datalist: webk.it/74252
      assert( !!(document.createElement("datalist") && window.HTMLDataListElement), "input has corresponding property for list attribute" );
    } else {
      assert( attr in input, "input has corresponding property for " + attr.toLowerCase() + " attribute" );
    }
  });
});

test("Input Attributes: :required psuedoselector", function() {
  var control, test;

  if ( !document.querySelectorAll ) {
    assert( false, "querySelectorAll not supported, skipping tests" );
  } else {
    try {
      control = document.querySelectorAll("#requiredtest");
      test = document.querySelectorAll("#requiredtest:required");

      assert( test[0] === control[0], "Search with :required yields proper element" );
    } catch( error ) {
      assert( false, ":required selector throws exception from querySelectorAll" );
    }
  }
});

window.spec = "fullscreen";


test("FullScreen", function() {
  var fixture = document.createElement("div"),
      request = H.API( fixture, "requestFullScreen", true );

  request = request || H.API( fixture, "requestFullscreen", true );

  assert( request, "requestFullScreen supported" );
  assert( H.isFunction( request ), "requestFullScreen or requestFullscreen is a function" );
});


test("FullScreen document", function() {
  var fullscreenElement = H.get.domProp( document, "fullscreenElement", true ) !== false,
      fullscreenEnabled = H.API( document, "fullscreenEnabled", true ),
      exitFullscreen = H.API( document, "exitFullscreen", true );

  assert( fullscreenElement, "fullscreenElement supported" );
  assert( fullscreenEnabled, "fullscreenEnabled supported" );
  assert( H.isFunction( exitFullscreen ), "exitFullscreen is a function" );
});

window.spec = "geolocation";


test("Geolocation exists", function() {
  var geolocation = H.API( navigator, "geolocation", true );

  assert( navigator.geolocation, "navigator.geolocation supported" );
});

test("Geolocation getCurrentPosition exists and is a function", function() {
  var geolocation = H.API( navigator, "geolocation", true ),
      getCurrentPosition;

  if ( !geolocation ) {
    assert( false, "geolocation not supported, skipping tests." );
  }
  else {
    getCurrentPosition = H.API( geolocation, "getCurrentPosition", true );

    assert( H.isFunction( getCurrentPosition ), "getCurrentPosition supported" );
  }
});

test("Geolocation watchPosition exists and is a function", function() {
  var geolocation = H.API( navigator, "geolocation", true ),
      watchPosition;

  if ( !geolocation ) {
    assert( false, "geolocation not supported, skipping tests." );
  }
  else {
    watchPosition = H.API( geolocation, "watchPosition", true );

    assert( H.isFunction( watchPosition ), "watchPosition supported" );
  }
});

test("Geolocation clearWatch exists and is a function", function() {
  var geolocation = H.API( navigator, "geolocation", true ),
      clearWatch;

  if ( !geolocation ) {
    assert( false, "geolocation not supported, skipping tests." );
  }
  else {
    clearWatch = H.API( geolocation, "clearWatch", true );

    assert( H.isFunction( clearWatch ), "clearWatch supported" );
  }
});

window.spec = "hashchange";


test("HashChangeEvent", function() {
  var HashChangeEvent = window.HashChangeEvent;

  assert( !!HashChangeEvent, "HashChangeEvent supported" );
});

test("onhashchange", function() {
  assert( "onhashchange" in window, "onhashchange exists in some form" );
  assert( window.onhashchange == null, "onhashchange is TreatNonCallableAsNull" );
});

// test("HashChangeEvent in Practice", function( async ) {
//   var HashChangeEvent = window.HashChangeEvent,
//       event;
//
//   if ( !HashChangeEvent ) {
//     assert( false, "HashChangeEvent is not implemented" );
//   } else {
//     event = typeof HashChangeEvent === "function" ?
//             document.createEvent("HashChangeEvent") : HashChangeEvent;
//
//     assert( "oldURL" in event, "event.oldURL supported" );
//     assert( "newURL" in event, "event.newURL supported" );
//   }
// });

asyncTest("onhashchange In Practice", function( async ) {
  var iframe = document.getElementById("hashchange").contentWindow,
      isDead = false;

  iframe.onhashchange = function( event ) {
    if ( !isDead ) {
      async.step(function() {
        assert( true, "onhashchange event fired" );
        isDead = true;
        iframe.onhashchange = null;
        async.done();
      });
    }
  };

  // Pre
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "onhashchange event did not fire" );
        isDead = true;
        async.done();
      });
    }
  }, 1000);
});

window.spec = "history";


test("history", function() {
  var history = window.history;
  assert( !!history, "history supported" );
});

test("history.pushState", function() {
  var history = window.history;
  assert( !!history.pushState, "history.pushState supported" );
  assert( typeof history.pushState === "function", "history.pushState is a function" );
});

test("history.replaceState", function() {
  var history = window.history;
  assert( typeof history.replaceState === "function", "history.replaceState is a function" );
});

test("history PopStateEvent", function() {
  var PopStateEvent = window.PopStateEvent,
      event;

  if ( !PopStateEvent ) {
    assert( false, "PopStateEvent not supported, skipping tests" );
  } else {
    event = document.createEvent("PopStateEvent");
    assert( "state" in event, "event.state supported" );
  }
});

// TODO: Move this to run in a pop-up window
// asyncTest("history In Practice", function( async ) {
//   var history = window.history;
//
//   window.onpopstate = function( event ) {
//
//     async.step(function() {
//
//       assert( !!event.state.a, "event.state is as we expected" );
//
//       // Restore
//       history.replaceState({ spec: "history" }, "Spec", "" );
//
//       async.done();
//     });
//     window.onpopstate = null;
//   };
//
//   history.pushState({ a: "alpha" }, "Alpha", "?" + (new Date()).getTime() );
//   history.pushState({ b: "beta" }, "Beta" );
//   // This will push back to "alpha"
//   history.back();
// });

window.spec = "html-media-capture";


test("Input File Capture", function() {
  var input = document.createElement("input");

  input.type = "file";

  assert( "capture" in input, "Input File Capture supported" );
});

// test("MediaFile", function() {
//   var MediaFile = H.API( window, "MediaFile", true );
//
//   assert( !!MediaFile, "MediaFile exists" );
// });
//
//
// test("MediaFileData", function() {
//   var MediaFileData = H.API( window, "MediaFileData", true );
//
//   assert( !!MediaFileData, "MediaFileData exists" );
// });

window.spec = "html5";


([
  {
    "display": "block",
    "names": "article aside details figure figcaption footer header hgroup nav section summary"
  },
  {
    "display": "inline",
    "names": "abbr audio bdi data mark output time video"
  },
  {
    "display": "inline-block",
    "names": "meter progress"
  }
]).forEach(function( set ) {

  set.names.split(" ").forEach(function( name ) {


    test("HTML5: " + name, function() {
      var fixture = document.getElementById("html5"),
          node = fixture.querySelector( name );

      assert( node instanceof HTMLElement, name + " instanceof HTMLElement" );
      assert( node.outerHTML !== "<:" + name + "></:" + name + ">", name + " node created" );
    });


    // test("HTML5: " + name + " (" + set.display + ")", function() {
    //   var fixture = document.getElementById("html5"),
    //       node = fixture.querySelector( name ),
    //       display = getComputedStyle(node).getPropertyValue("display");
    //
    //   assert( display === set.display, name + " display === set.display" );
    // });


  });
});

test("HTML5: bdi dir", function() {
});

test("HTML5: details & summary", function() {
  var fixture = document.getElementById("html5"),
      details = document.createElement("details"),
      summary = document.createElement("summary"),
      height = details.offsetHeight;

  fixture.appendChild( details );

  assert( "open" in details, "details.open supported" );
  assert( details.open === false, "details.open === false" );
  assert( height === 0, "details height === 0" );


  summary.textContent = "Oh HAI!";

  details.appendChild( summary );
  details.open = true;

  assert( height !== details.offsetHeight, "details height as expected" );
});

test("HTML5: mark background", function() {
  var fixture = document.getElementById("html5"),
      node = fixture.querySelector("mark"),
      background = getComputedStyle(node).getPropertyValue("background-color");

  assert( [ "rgb(255, 255, 0)", "yellow", "#ffff00" ].some(function(val) { return background === val; }), "mark background is yellow" );
});

window.spec = "iframe";


test("IFrame", function() {
  var iframe = document.createElement("iframe");

  assert( !!iframe, "iframe supported" );
});

// test("IFrame Seamless", function() {
//   var iframe = document.createElement("iframe");

//   assert( "seamless" in iframe );
// });

test("IFrame Sandbox", function() {
  var iframe = document.createElement("iframe");

  assert( "sandbox" in iframe, "Sandbox iframe supported" );
});

asyncTest("IFrame Sandbox Sanity", function( async ) {
  var regular = document.getElementById("regular"),
      sandbox = document.getElementById("sandbox"),
      iframe = document.createElement("iframe");

  if ( !("sandbox" in iframe) ) {
    assert( false, "Sandbox iframe not support, skipping tests" );
    async.done();
  } else {
    assert( !!regular.contentWindow, "regular iframe is accessible" );
    assert( !sandbox.contentWindow, "sandbox iframe is blocked" );

    async.done();
  }
});

asyncTest("IFrame Sandbox allow-scripts", function( async ) {
  var fixture = document.getElementById("iframe"),
      iframe = document.createElement("iframe"),
      isDead = false;

  function allowScripts( event ) {
    if ( !isDead && event.data.type === "allow-scripts" ) {
      async.step(function() {
        assert( event.data.result === "?allow-scripts", "allowScripts allowed JS to execute in iframe" );

        H.off( window, "message", allowScripts );
        isDead = true;
        async.done();
      });
    }
  }


  if ( !("sandbox" in iframe) ) {
    assert( false, "Sandbox iframe not support, skipping tests" );
    async.done();
  } else {

    H.on( window, "message", allowScripts );

    iframe.sandbox = "allow-scripts";
    iframe.src = "/tests/iframe/allow-scripts.html?allow-scripts";
    fixture.appendChild( iframe );

    // Bailout
    setTimeout(function() {
      if ( !isDead ) {
        async.step(function() {
          assert( false, "allowScripts failed" );

          H.off( window, "message", allowScripts );
          isDead = true;
          async.done();
        });
      }
    }, 1000);
  }
});

asyncTest("IFrame Sandbox allow-scripts allow-forms", function( async ) {
  var fixture = document.getElementById("iframe"),
      iframe = document.createElement("iframe"),
      isDead = false;

  function allowScriptsForms( event ) {
    async.step(function() {
      if ( !isDead && event.data.type === "allow-scripts-forms" ) {
        assert( true, "allowScripts allowed JS to execute in iframe and submit a form" );

        H.off( window, "message", allowScriptsForms );
        isDead = true;
        async.done();
      }
    });
  }

  if ( !("sandbox" in iframe) ) {
    assert( false, "Sandbox iframe not support, skipping tests" );
    async.done();
  } else {

    H.on( window, "message", allowScriptsForms );

    iframe.sandbox = "allow-scripts allow-forms";
    iframe.src = "/tests/iframe/allow-scripts-forms.html?allow-scripts-forms";
    fixture.appendChild( iframe );

    // Bailout
    setTimeout(function() {
      if ( !isDead ) {
        async.step(function() {
          assert( false, "allowScriptsForms failed" );

          H.off( window, "message", allowScriptsForms );
          isDead = true;
          async.done();
        });
      }
    }, 1000);
  }
});

// allow-forms, allow-same-origin, allow-scripts, and allow-top-navigation
//
// allow-same-origin keyword allows the content to be
// treated as being from the same origin instead of
// forcing it into a unique origin,
//
// allow-top-navigation keyword allows the content to
// navigate its top-level browsing context.
//
// allow-forms and allow-scripts keywords re-enable
// forms and scripts respectively
// (though scripts are still prevented from creating popups).

window.spec = "indexeddb";


test("IndexedDB, basic support", function() {
  assert( H.API( window, "indexedDB", true ), "indexedDB supported" );
  assert( H.API( window, "IDBTransaction", true ), "IDBTransaction supported");
  assert( H.API( window, "IDBRequest", true ), "IDBRequest supported");
});

window.spec = "indexeddb-standard";


test("IndexedDB, basic support, standard", function() {
  assert( H.API( window, "indexedDB" ), "indexedDB standard, supported" );
  // assert( H.API( window, "IDBTransaction" ), "IDBTransaction standard, supported");
  // assert( H.API( window, "IDBRequest" ), "IDBRequest standard, supported");
  //
});

window.spec = "json";


var toString = function( thing ) {
  return Object.prototype.toString.call( thing );
};

test( "JSON", function() {

  assert( "JSON" in window, "JSON supported" );
  assert( !!JSON.stringify, "JSON.stringify supported");
  assert( !!JSON.parse, "JSON.parse supported");
});

test( "JSON.parse properly parses a JSON string into an object", function() {

  var obj = { "string":"foo", "bool": true, "num":1, "arr":[ 1, 2, "Three" ] },
      objStr = '{ "string":"foo", "bool": true, "num":1, "arr":[ 1, 2, "Three" ] }';

  assert( JSON.stringify(JSON.parse(objStr)), JSON.stringify(obj), "JSON.parse (functional) supported" );
});

test( "JSON.parse reviver is applied when processing JSON string to object", function() {

  var objStr = '{ "t": "True", "f": "False" }',
      obj = JSON.parse( objStr, function( key, value ) {
        if ( value === "True" ) {
          return true;
        }
        return value;
      });

  assert( obj.t === true, "JSON.parse reviver supported(1)" );
  assert( obj.f === "False", "JSON.parse reviver supported(2)" );
});

test( "JSON.stringify serializes an object, removing functions and 'undefined' ", function() {

  var obj = { t: true, a: [ 1, "Two" ], bar: function() { }, bam: undefined },
      str = '{"t":true,"a":[1,"Two"]}';

  assert( JSON.stringify(obj) === str, "JSON.stringify (functional) supported" );
});

test( "JSON.stringify replacer accepts array of strings to corresponding to keys to include in serialized string", function() {

  var obj = { t: true, a: [ 1, "Two" ] },
      str = '{"t":true}';

  assert( JSON.stringify( obj, ["t"] ) === str, "JSON.stringify replacer supported(1)" );

});

test( "JSON.stringify replacer accepts a function to replace keys as object is being serialized ", function() {

  var obj = { foo: "bar" },
      str = '{"foo":"BAR"}',
      outputStr = JSON.stringify( obj, function( key, value ){
        return typeof value === "string" ? value.toUpperCase() : value;
      });

  assert( outputStr === str, "JSON.stringify replacer supported(2)" );

});

window.spec = "masking";


test("CSS Masks", function() {
  var namespace = "http://www.w3.org/2000/svg",
      elem = document.createElement("div"),
      supported = H.test.cssProp( elem, "maskImage", true ),
      svg, mask;


  if ( !supported ) {
    svg = document.createElementNS( namespace, "svg" );
    mask = document.createElementNS( namespace, "mask" );

    if ( "ownerSVGElement" in svg ) {

      assert( ("maskContentUnits" in mask) && ("maskUnits" in mask), "image masking supported" );

    } else {
      assert( false, "no image masking is supported" );
    }
  } else {
    assert( supported, "image masking supported" );
  }
});

window.spec = "multitouch";


test("Multi Touch Events in Practice", function( async ) {
  var TouchEvent = H.API( window, "TouchEvent", true ),
      event = {};

  if ( !TouchEvent ) {
    assert( false, "TouchEvent not supported, skipping tests" );
  } else {
    // WebKit has a TouchEvent constructor
    // Firefox has a TouchEvent prototype object (untouchable)

    // There seems to be no way to confirm the Firefox implements the required
    // properties without an actual event. This is incredibly frustrating
    if ( window.MozTouchEvent ) {
      // /^\[object (.*)\]$/.exec( TouchEvent.toString() )[ 1 ] == MozTouchEvent
      assert( true, "TouchEvent supported, cannot confirm implementation" );
    } else {
      try {
        event = document.createEvent("TouchEvent");
      } catch(e) {}


      assert( "touches" in event, "event.touches supported" );
      assert( "changedTouches" in event, "event.changedTouches supported" );
      assert( "targetTouches" in event, "event.targetTouches supported" );
    }
  }
});

window.spec = "navigationtiming";


test("performance", function() {
  var performance = H.API( window, "performance", true );

  assert( !!performance, "performance supported" );
});

test("performance navigation", function() {
  var performance = H.API( window, "performance", true ),
      navigation = performance && H.API( performance, "navigation", true );

  if ( !performance || !navigation ) {
    assert( false, "performance not supported, skipping tests" );
  } else {

    navigation = H.API( performance, "navigation", true );
    assert( navigation, "performance.navigation supported" );
  }
});

test("performance navigation instance", function() {
  var performance = H.API( window, "performance", true ),
      navigation = performance && H.API( performance, "navigation", true );


  if ( !performance || !navigation ) {
    assert( false, "performance.navigation not supported, skipping tests" );
  } else {
    [
    "redirectCount",
    "type"
    ].forEach(function( stat ) {
      assert( stat in performance.navigation, "performance.navigation " + stat + " supported" );
      assert( typeof performance.navigation[ stat ] === "number", "performance.navigation " + stat + " is a number" );
    });
  }
});

test("performance navigation sanity", function() {
  var performance = H.API( window, "performance", true );

  // There should be no redirects on this page
  assert( performance && (performance.navigation.redirectCount === 0), "performance.navigation.redirectCount matched expected" );
});

test("performance timing", function() {
  var performance = H.API( window, "performance", true );

  assert( performance && performance.timing, "performance.timing exists in some form" );
});

test("performance timing instance", function() {
  var stats,
      performance = H.API( window, "performance", true ),
      timing = performance && H.API( performance, "timing", true );

  if ( !performance || !timing ) {
    assert( false, "performance.timing not supported, skipping tests" );
  } else {
    [
    "connectEnd", "connectStart",
    "domComplete", "domContentLoadedEventEnd", "domContentLoadedEventStart", "domInteractive", "domLoading",
    "domainLookupEnd", "domainLookupStart",
    "fetchStart",
    "loadEventEnd", "loadEventStart",
    "navigationStart",
    "redirectEnd", "redirectStart",
    "requestStart",
    "responseEnd", "responseStart",
    // "secureConnectionStart",
    "unloadEventEnd", "unloadEventStart"
    ].forEach(function( stat ) {
      assert( stat in timing, "performance.navigation.timing " + stat + " supported" );
      assert( typeof timing[ stat ] === "number", "performance.navigation.timing " + stat + " is a number" );
    });
  }
});

test("performance timing sanity", function() {
  var performance = H.API( window, "performance", true ),
      timing = performance && H.API( performance, "timing", true );

  if ( !performance || !timing ) {
    assert( false, "performance.timing is not supported, skipping tests" );
  } else {
    [
      [ timing.connectEnd >= timing.connectStart, "connectEnd >= connectStart" ],
      [ timing.domainLookupEnd >= timing.domainLookupStart, "domainLookupEnd >= domainLookupStart" ],
      [ timing.loadEventEnd >= timing.loadEventStart, "loadEventEnd >= loadEventStart" ],
      [ timing.unloadEventEnd >= timing.unloadEventStart, "unloadEventEnd >= unloadEventStart" ],
      [ timing.domComplete >= timing.domContentLoadedEventStart, "domComplete >= domContentLoadedEventStart" ],
      [ timing.domComplete >= timing.domContentLoadedEventEnd, "domComplete >= domContentLoadedEventEnd" ],
      [ timing.domContentLoadedEventEnd >= timing.domContentLoadedEventStart, "domContentLoadedEventEnd >= domContentLoadedEventStart" ]
    ].forEach(function( condition ) {
      assert( condition[0], condition[1] );
    });
  }
});

window.spec = "network";


test("Network Connection", function() {
  var connection = H.API( navigator, "connection", true );

  assert( connection, "navigator.connection supported" );
});

test("Network Connection bandwidth", function() {
  var connection = H.API( navigator, "connection", true );

  if ( !connection ) {
    assert( false, "navigator.connection not supported, skipping tests" );
  } else {
    assert( "bandwidth" in connection, "navigator.connection.bandwidth supported" );
  }
});

test("Network Connection metered", function() {
  var connection = H.API( navigator, "connection", true );

  if ( !connection ) {
    assert( false, "navigator.connection not supported, skipping tests" );
  } else {
    assert( "metered" in connection, "navigator.connection.metered supported" );
  }
});

test("Network Connection onchange", function() {
  var connection = H.API( navigator, "connection", true );

  if ( !connection ) {
    assert( false, "navigator.connection not supported, skipping tests" );
  } else {
    assert( "onchange" in connection, "navigator.connection.onchange supported" );
  }
});

window.spec = "notifications";


test("Notifications", function() {
  var Notification = H.API( window, "Notification", true );

  // If no standard, check for previous implementations
  Notification = Notification || H.API( window, "notifications", true );
  assert( Notification, "Notification supported" );
});


//
// Omitted.
//
// test("Notifications API", function() {
//   var Notification = H.API( window, "Notification", true ),
//       notification;

//   if ( !Notification ) {
//     assert( false, "Notifications not supported, skipping tests" );
//   } else {
//     notification = new Notification();

//     [
//       "createHTMLNotification",
//       "checkPermission",
//       "createNotification",
//       "requestPermission"
//     ].forEach(function( prop ) {
//       assert( method in notification, method + " is supported" );
//     });
//   }
// });

// test("Notifications checkPermission", function() {
//   var Notifications = H.API( window, "notifications", true );

//   if ( !Notifications ) {
//     assert( false, "Notifications not supported, skipping tests" );
//   } else {

//     // PERMISSION_ALLOWED = 0;
//     // PERMISSION_NOT_ALLOWED = 1;
//     // PERMISSION_DENIED = 2;

//     assert( Notifications.checkPermission() === 1, "Initial permission not allowed" );
//   }
// });

window.spec = "offline";


test("Online Events, basic support", function() {
  assert( "onLine" in navigator, "navigator.onLine supported" );
  assert( "ononline" in document.body, "document.body.ononline supported" );
  assert( "onoffline" in document.body, "document.body.onoffline supported" );
});

window.spec = "postmessage";


test("postMessage", function() {
  var postMessage = window.postMessage;

  assert( !!postMessage, "postMessage supported" );
});

test("onmessage", function() {
  assert( "onmessage" in window, "onmessage supported" );
});

asyncTest("postMessage/onmessage In Practice", function( async ) {
  // This use of window.onmessage is intentional and must remain intact
  window.onmessage = function( event ) {
    async.step(function() {
      assert( true, "onmessage event fired" );
      assert( event.data === "This is Ground Control", "message content matched expected" );

      window.onmessage = null;
      async.done();
    });
  };

  window.postMessage( "This is Ground Control", "*" );
});

window.spec = "progress";


test("ProgressEvent", function() {
  var ProgressEvent = H.API( window, "ProgressEvent", true );

  assert( ProgressEvent, "A ProgressEvent constructor supported" );
});

asyncTest("ProgressEvent in Practice", function( async ) {
  var ProgressEvent = H.API( window, "ProgressEvent", true ),
      xhr = new XMLHttpRequest();

  if ( !ProgressEvent ) {
    assert( false, "ProgressEvent is not supported, skipping tests" );
    async.done();
  } else {
    xhr.open( "GET", "/tests/_server/echo.php", true );

    xhr.onload = function( event ) {
      if ( this.status === 200 ) {

        async.step(function() {
          // Instance confirmation
          assert( event instanceof ProgressEvent, "XHR onload callback event argument is instanceof ProgressEvent" );

          // Property confirmation
          assert( "lengthComputable" in event, "event.lengthComputable supported" );
          assert( "loaded" in event, "event.loaded supported" );
          assert( "total" in event, "event.total supported" );

          // Property value/type confirmation
          assert( typeof event.lengthComputable === "boolean", "event.lengthComputable is boolean" );
          assert( typeof event.loaded === "number", "event.loaded is number" );
          assert( typeof event.total === "number", "event.total is number" );

          async.done();
        });
      }
    };
    xhr.send();
  }
});

window.spec = "prompts";


test("window.alert is treated as a function", function() {
  assert( H.isFunction( window.alert ), "alert supported" );
});

test("window.confirm is treated as a function", function() {
  assert( H.isFunction( window.confirm ), "confirm supported" );
});

test("window.prompt is treated as a function", function() {
  assert( H.isFunction( window.prompt ), "prompt supported" );
});

window.spec = "ring-0-performance";


asyncTest("Framerate for 10 sprites", function( async ) {
  var isCompleted = false,
      isDead = false;


  function ringZeroPerf( event ) {
    var data = JSON.parse( event.data );

    if ( data.avg && data.avg.fps && !isCompleted && !isDead ) {
      isCompleted = true;
      async.step(function() {

        assert(
          data.avg.fps >= 30,
          "Moving 10 sprites, with 10 frames each (" + data.avg.fps + ")"
        );

        // Shut off and remove this message event handler
        H.off( window, "message", ringZeroPerf );

        // Indicate test completion
        async.done();
      });
    }
    async.done();
  }

  H.on( window, "message", ringZeroPerf );

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      // Shut off and remove this message event handler
      // to prevent leaking test results
      H.off( window, "message", ringZeroPerf );

      async.step(function() {
        assert( false, "Browser failed to complete performance test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});

window.spec = "ring-1-performance";


asyncTest("Framerate for 50 sprites", function( async ) {
  var isCompleted = false,
      isDead = false;


  function ringOnePerf( event ) {
    var data = JSON.parse( event.data );

    if ( data.avg && data.avg.fps && !isCompleted && !isDead ) {
      isCompleted = true;
      async.step(function() {

        assert(
          data.avg.fps >= 30,
          "Moving 50 sprites, with 10 frames each (" + data.avg.fps + ")"
        );

        // Shut off and remove this message event handler
        H.off( window, "message", ringOnePerf );

        // Indicate test completion
        async.done();
      });
    }
    async.done();
  }

  H.on( window, "message", ringOnePerf );

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      // Shut off and remove this message event handler
      // to prevent leaking test results
      H.off( window, "message", ringOnePerf );

      async.step(function() {
        assert( false, "Browser failed to complete performance test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});

window.spec = "ring-2-performance";


asyncTest("Framerate for 100 sprites", function( async ) {
  var isCompleted = false,
      isDead = false;


  function ringTwoPerf( event ) {
    var data = JSON.parse( event.data );

    if ( data.avg && data.avg.fps && !isCompleted && !isDead ) {
      isCompleted = true;
      async.step(function() {

        assert(
          data.avg.fps >= 30,
          "Moving 100 sprites, with 10 frames each (" + data.avg.fps + ")"
        );

        // Shut off and remove this message event handler
        H.off( window, "message", ringTwoPerf );

        // Indicate test completion
        async.done();
      });
    }
    async.done();
  }

  H.on( window, "message", ringTwoPerf );

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      // Shut off and remove this message event handler
      // to prevent leaking test results
      H.off( window, "message", ringTwoPerf );

      async.step(function() {
        assert( false, "Browser failed to complete performance test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});

window.spec = "selector";


// test("getElementsByClassName", function() {
//   var document = window.document;
//
//   assert( "getElementsByClassName" in document, "getElementsByClassName exists in some form" );
//   assert( typeof document.getElementsByClassName === "function", "getElementsByClassName is a function" );
// });
//
// test("getElementsByClassName In Practice", function() {
//   var document = window.document,
//       elements = document.getElementsByClassName("foo");
//
//   assert( !!elements.length, "elements has length" );
//   equal( elements.length, 2, "elements.length is 2, as we expected" );
// });
//
// test("getElementsByClassName with Context", function() {
//   var document = window.document,
//       elements = document.getElementById("context").getElementsByClassName("foo");
//
//   assert( !!elements.length, "elements has length" );
//   equal( elements.length, 1, "elements.length is 1, as we expected" );
// });


test("matchesSelector", function() {
  var body = window.document.body,
      matchesSelector = H.API( document.documentElement, "matchesSelector", true );

  assert( !!matchesSelector, "matchesSelector exists in some form as a property of document.body" );
  assert( typeof matchesSelector, "matchesSelector is a function" );
});

test("matchesSelector In Practice", function() {
  var body = window.document.body,
      matchesSelector = H.API( document.documentElement, "matchesSelector", true );

  assert( matchesSelector.call( body, "body" ), "Expected ( body, 'body' )" );
  assert( matchesSelector.call( body, "html body" ), "Expected ( body, 'html body' )" );
  assert( matchesSelector.call( body, "html > body" ), "Expected ( body, 'html > body' )" );
});


test("querySelector", function() {
  var document = window.document;

  assert( !!document.querySelector, "document.querySelector exists in some form" );
  assert( typeof document.querySelector === "function", "document.querySelector is a function" );
});

test("querySelector In Practice", function() {
  var document = window.document,
      element = document.querySelector("body");

  assert( !!element, "querySelector('body') returns something (element)" );
  assert( element.nodeType === 1, "querySelector('body') returns an element with nodeType === 1" );
});

test("querySelectorAll", function() {
  var document = window.document;

  assert( !!document.querySelectorAll, "querySelectorAll exists in some form" );
  assert( typeof document.querySelectorAll === "function", "querySelectorAll is a function" );
});

test("querySelectorAll In Practice", function() {
  var NodeList = window.NodeList,
      document = window.document,
      list = document.querySelectorAll("body"),
      body = document.body,
      matchesSelector = H.API( document.documentElement, "matchesSelector", true );

  assert( !!list.length, "querySelectorAll('body') returns something with length (list)" );
  assert( list instanceof NodeList, "list instanceof NodeList" );
  assert( matchesSelector.call( list[ 0 ], "body" ), "list[ 0 ].matchesSelector('body')" );
});

window.spec = "sharedworkers";


test("Shared Web Workers", function() {
  var SharedWorker = H.API( window, "SharedWorker", true ),
      shared;

  if ( !SharedWorker ) {
    assert( false, "SharedWorker not supported, skipping tests" );
  } else {
    shared = new SharedWorker("/tests/webworkers/worker.js");
    assert( !!SharedWorker, "SharedWorker supported" );
    assert( shared instanceof SharedWorker, "shared instanceof SharedWorker" );
  }
});

window.spec = "svg";


test("SVG", function() {
  var createElementNS = document.createElementNS;

  assert( !!createElementNS, "SVG createElementNS supported" );
});

test("SVG Element (Namespace)", function() {
  var namespace = "http://www.w3.org/2000/svg",
      svg = document.createElementNS( namespace, "svg" );

  assert( !!svg, "svg supported" );
  assert( !!svg.getCurrentTime, "svg Namespace getCurrentTime" );
  assert( svg.ownerSVGElement === null, "svg Namespace ownerSVGElement supported" );
});

window.spec = "svganimation";


test("SVG Element (Animation)", function() {
  var namespace = "http://www.w3.org/2000/svg",
      animate = document.createElementNS( namespace, "animate" );

  assert( !!animate, "svg animate" );

  // try {
  //   assert( animate.ownerSVGElement == null, "svg Animation ownerSVGElement supported" );
  // } catch( error ) {
  //   assert( false, "Accessing ownerSVGElement throws a " + error.name + " Exception" );
  // }
  // TODO: Improve these tests
});

window.spec = "svginline";


test("SVG Element (Inline)", function() {
  var container = document.createElement("div"),
      svg;

  container.innerHTML = "<svg>";

  svg = container.children[ 0 ];

  assert( !!svg, "svg inline" );
  assert( svg.nodeName === "svg", "svg inline nodeName is correct" );
  assert( !!svg.getCurrentTime, "svg Inline getCurrentTime" );
  assert( svg.ownerSVGElement === null, "svg Inline ownerSVGElement supported" );
});

window.spec = "touchevents";


// test("Touch", function() {
//   var Touch = H.API( window, "Touch", true );

//   assert( !!Touch, "Touch supported" );
// });

test("TouchEvent", function() {
  var TouchEvent = H.API( window, "TouchEvent", true );

  assert( !!TouchEvent, "TouchEvent supported" );
});

// test("TouchList", function() {
//   var TouchList = H.API( window, "TouchList", true );

//   assert( !!TouchList, "TouchList supported" );
// });

// test("DocumentTouch", function() {
//   var DocumentTouch = H.API( window, "DocumentTouch", true );
//
//
//   assert( !!DocumentTouch );
// });

test("createTouch", function() {
  assert( "createTouch" in document, "createTouch supported" );
});


[ "touchstart", "touchend", "touchcancel", "touchmove"/*, "touchleave"*/ ].forEach(function( event ) {
  event = "on" + event;

  test("Touch Events: " + event, function() {
    assert( event in window, event + " supported" );
  });
});

// #444 Disable gesture event tests until further notice
// [ "gesturestart", "gestureend", "gesturechange" ].forEach(function( event ) {
//   event = "on" + event;

//   test("Gesture Events: " + event, function() {
//     assert( event in window, event + " supported" );
//   });
// });

window.spec = "track";


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

window.spec = "url";


test("URL", function() {
  var URL = H.API( window, "URL", true );

  assert( URL, "URL.create supported" );
});

test("URL createObjectURL", function() {
  var URL = H.API( window, "URL", true ),
    createObjectURL;

  if ( URL === undefined ) {
    assert( false, "URL.createObjectURL not supported, skipping tests" );
  }
  else {
    createObjectURL = H.API( URL, "createObjectURL", true );
    assert( URL.createObjectURL, "URL.createObjectURL supported" );
  }
});

window.spec = "vibration";


test("Vibration", function() {
  var vibrate = H.API( navigator, "vibrate", true );

  assert( vibrate, "vibrate supported" );
});

window.spec = "video";


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

window.spec = "viewport";


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

window.spec = "visibilitystate";


test("visibilityState", function() {
  var visibilityState = H.API( document, "visibilityState", true );

  assert( visibilityState, "visibilityState supported" );
});

test("visibilityState visible", function() {
  var visibilityState = H.API( document, "visibilityState", true );

  if ( !visibilityState ) {
    assert( false, "visibilityState not supported, skipping tests" );
  } else {
    assert( visibilityState === "visible", "document is visible" );
  }
});



test("visibilityState hidden", function() {
  // Look in document, for "hidden", allow prefixes, the value will be false
  var hidden = H.API( document, "hidden", true, false );

  // hidden can correctly be true or false
  assert( hidden !== undefined, "hidden supported" );
});



//document.addEventListener("mozvisibilitychange", console.log, false);
//
// asyncTest("Spec Async Test", function( async ) {
//   // asyncTest callback receives "async" object as first argument
//
//
//   // async object
//   // @instance
//   // @type Object
//
//   // step
//   // @method
//   // @memberOf async
//   // @param callback function, wraps async assertions.
//
//   async.step(function() {
//
//     // Assertions
//     assert( true, "This thing is true" );
//
//
//   // done
//   // @method
//   // @memberOf async
//   // @param indicate async test is complete.
//
//     async.done();
//   });
// });

window.spec = "webrtc";


test("WebRTC getUserMedia", function() {
  var gUM = H.API( navigator, "getUserMedia", true );
  assert( gUM, "navigator.getUserMedia supported" );
});

// test("WebRTC getUserMedia practical", function() {
//   var gUM = H.API( navigator, "getUserMedia", true );

//   if ( !gUM ) {
//     assert( false, "navigator.getUserMedia not supported, skipping tests" );
//   }
//   else {
//     // practical testing
//     //
//   }

// });

window.spec = "webstorage";


// Firefox on desktop prevents this tests from running
// without failing.
// sessionStorage is deprecated anyway.
//
// test("sessionStorage", function() {
//   var sessionStorage = window.sessionStorage;
//
//   assert( !!sessionStorage, "sessionStorage supported" );
// });
//
//
// test("sessionStorage In Practice", function() {
//   var sessionStorage = window.sessionStorage,
//       validate = (sessionStorage && sessionStorage.setItem("foo", "bar") /* returns undefined */) ||
//                     sessionStorage.getItem("foo") === "bar";
//
//   assert( validate, "sessionStorage.setItem supported" );
//   assert( validate, "sessionStorage.getItem supported" );
// });


test("localStorage", function() {
  var localStorage = window.localStorage;

  assert( !!localStorage, "localStorage supported" );
});


test("localStorage In Practice", function() {
  var localStorage = window.localStorage,
      validate = (localStorage && localStorage.setItem("foo", "bar") /* returns undefined */) ||
                    localStorage.getItem("foo") === "bar";

  assert( validate, "localStorage.setItem supported" );
  assert( validate, "localStorage.getItem supported" );
});

test("StorageEvent", function() {
  var StorageEvent = H.API( window, "StorageEvent", true );

  assert( StorageEvent, "StorageEvent in window" );
});

test("Storage Events in Practice", function( async ) {
  var StorageEvent = H.API( window, "StorageEvent", true ),
      event;

  if ( !StorageEvent ) {
    assert( false, "StorageEvent not supported, skipping tests" );
  } else {
    // Chrome WebKit has a StorageEvent constructor
    // Mobile Safari WebKit has a StorageEvent object
    //  - that needs to be created
    // Firefox has a StorageEvent prototype object
    event = typeof StorageEvent === "function" ?
            document.createEvent("StorageEvent") : StorageEvent.prototype;

    if ( !("key" in event) && typeof StorageEvent === "object" ) {
      event = document.createEvent("StorageEvent");
    }

    assert( "key" in event, "event.key supported" );
    assert( "oldValue" in event, "event.oldValue supported" );
    assert( "newValue" in event, "event.newValue supported" );
  }
});

window.spec = "webworkers";


// TODO: transferable objects

test("Web Workers", function() {
  var Worker = H.API( window, "Worker", true );

  assert( !!Worker, "Worker supported" );
});

asyncTest("Web Worker navigator", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      worker;


  if ( !Worker ) {
    assert( false, "Workers not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");

    worker.postMessage({
      test: "navigator"
    });

    worker.onmessage = function( event ) {
      async.step(function() {
        var data = event.data,
            pass = false;

        pass = [ "appName", "appVersion", "platform", "userAgent" ].every(function( key ) {
          assert( data[ key ] === navigator[ key ], data[ key ] + " === " + navigator[ key ] );
          return data[ key ] === navigator[ key ];
        });

        assert( pass, "Worker correctly implements navigator" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});

asyncTest("Web Worker location", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      worker;


  if ( !Worker ) {
    assert( false, "Workers not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");


    worker.postMessage({
      test: "location"
    });

    worker.onmessage = function( event ) {
      async.step(function() {
        var data = event.data,
            pass = false;

        pass = Object.keys( data ).every(function( key ) {

          assert( key in location, key + " in location" );
          return key in location;
        });

        assert( pass, "Worker implements location" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});

asyncTest("Web Worker global", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      worker;


  if ( !Worker ) {
    assert( false, "Workers not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");

    worker.postMessage({
      test: "worker"
    });

    worker.onmessage = function( event ) {
      async.step(function() {
        var data = event.data,
            pass = false;

        pass = Object.keys( data ).every(function( key ) {

          assert( key, "WorkerGlobalScope implements " + key );
          return data[ key ];
        });

        assert( pass, "Worker implements global properties" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});

asyncTest("Web Worker data messaging", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      prop, array, data, worker;


  if ( !Worker ) {
    assert( false, "Workers not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");
    array = [];
    data = {
      objectA: {
        a: 1,
        b: null,
        c: [{}],
        d: {
          a: 3.14159,
          b: false,
          c: {
            d: 0,
            f: [[[]]],
            g: {
              j: {
                k: {
                  n: {
                    r: "r",
                    s: [1, 2, 3],
                    u: 0,
                    v: {
                      w: {
                        x: {
                          y: "Yahoo!",
                          z: null
                        }
                      }
                    }
                  },
                  o: 99,
                  q: []
                },
                m: null
              }
            },
            h: "false",
            i: true
          }
        },
        e: String("constructed string"),
        f: {},
        g: "",
        h: "h",
        i: []
      },
      array: [ 1, 2, 3, 4, 5, 6, 7, 8, 9,  [
            1, 2, 3, 4, 5, 6, 7, 8, 9,  [
              1, 2, 3, 4, 5, [
                [6, 7, 8, 9,  [
                  [
                    1, 2, 3, 4, [
                      2, 3, 4, [
                        1, 2, [
                          1, 2, 3, 4, [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, [ 0 ], 1, 2, 3, 4, 5, 6, 7, 8, 9
                          ], 5, 6, 7, 8, 9
                        ], 4, 5, 6, 7, 8, 9
                      ], 5, 6, 7, 8, 9
                    ], 5, 6, 7
                  ]
                ]
              ]
            ]
          ]
        ]
      ],
      string: "this is a standard string",
      bool: true,
      loc: {},
      ua: navigator.userAgent
    };

    for ( prop in data ) {
      array.push( data[ prop ] );
    }

    worker.postMessage({
      test: "messaging",
      args: array
    });

    worker.onmessage = function( event ) {
      async.step(function() {

        assert( JSON.stringify(event.data) === JSON.stringify(data), "Worker supports complex data objects" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});


asyncTest("Web Worker Blob URL", function( async ) {
  var Worker = H.API( window, "Worker", true ),
      URL = H.API( window, "URL", true ),
      Blob = H.API( window, "Blob", true ),
      worker, blob;


  if ( !Worker || !Blob ) {
    assert( false, "Workers or Blob not supported, skipping tests" );
    async.done();
  } else {
    worker = new Worker("/tests/webworkers/worker.js");
    blob = new Blob([ "onmessage = function( event ) { postMessage( event.data ) };" ], { type: "text\/plain" });


    worker = new Worker(
      URL.createObjectURL( blob )
    );

    worker.postMessage("The Blob!");

    worker.onmessage = function( event ) {
      async.step(function() {
        assert( event.data === "The Blob!", "Blob Web Worker" );

        async.done();

        worker.terminate();
        worker = null;
      });
    };
  }
});


// asyncTest("Web Worker Data URL", function( async ) {
//
//   var source = [
//         "data:text/javascript;base64,",
//         window.btoa("onmessage = function( event ) { postMessage( event.data ) };")
//       ].join(""),
//       worker = new Worker(source);
//
//   worker.postMessage("The Data!");
//
//   worker.onmessage = function( event ) {
//     async.step(function() {
//       assert( event.data === "The Data!", "Data Web Worker" );
//
//       async.done();
//
//       worker.terminate();
//       worker = null;
//     });
//   };
// });

window.spec = "webworkers";


var prop,
  array = [],
  data = {
    objectA: {
      a: 1,
      b: null,
      c: [{}],
      d: {
        a: 3.14159,
        b: false,
        c: {
          d: 0,
          f: [[[]]],
          g: {
            j: {
              k: {
                n: {
                  r: "r",
                  s: [1, 2, 3],
                  u: 0,
                  v: {
                    w: {
                      x: {
                        y: "Yahoo!",
                        z: null
                      }
                    }
                  }
                },
                o: 99,
                q: []
              },
              m: null
            }
          },
          h: "false",
          i: true
        }
      },
      e: String("constructed string"),
      f: {},
      g: "",
      h: "h",
      i: []
    },
    array: [ 1, 2, 3, 4, 5, 6, 7, 8, 9,  [
          1, 2, 3, 4, 5, 6, 7, 8, 9,  [
            1, 2, 3, 4, 5, [
              [6, 7, 8, 9,  [
                [
                  1, 2, 3, 4, [
                    2, 3, 4, [
                      1, 2, [
                        1, 2, 3, 4, [
                          1, 2, 3, 4, 5, 6, 7, 8, 9, [ 0 ], 1, 2, 3, 4, 5, 6, 7, 8, 9
                        ], 5, 6, 7, 8, 9
                      ], 4, 5, 6, 7, 8, 9
                    ], 5, 6, 7, 8, 9
                  ], 5, 6, 7
                ]
              ]
            ]
          ]
        ]
      ]
    ],
    string: "this is a standard string",
    bool: true,
    loc: {},
    ua: navigator.userAgent
  };


for ( prop in data ) {
  array.push( data[ prop ] );
}
window.spec = "webworkers";


importScripts( "worker-setup.js" );

var replies = {
  navigator: function() {
    var obj = {};

    [ "appName", "appVersion", "platform", "userAgent" ].forEach(function( prop ) {
      obj[ prop ] = navigator[ prop ];
    });
    return obj;
  },
  location: function() {
    var obj = {};

    [ "hash", "href", "host", "hostname", "pathname", "port", "protocol", "search" ].forEach(function( prop ) {
      obj[ prop ] = location[ prop ];
    });
    return obj;
  },
  worker: function() {
    var obj = {};

    [
      "addEventListener", "removeEventListener", "dispatchEvent",
      "importScripts", "close",
      "location", "navigator", "postMessage",
      "self"
    ].forEach(function( prop ) {
      obj[ prop ] = (prop in self);
    });
    return obj;
  },
  nesting: function() {
    return self.Worker;
  },
  messaging: function( args ) {
    var correct = true;

    args.forEach(function( arg, index ) {
      correct = JSON.stringify( arg ) === JSON.stringify( self.array[ index ] );
    });
    return correct ? self.data : "";
  }
};


self.addEventListener("message", function( event ) {
  var test = event.data.test,
      args = event.data.args;

  self.postMessage(
    test ?
    replies[ test ]( args ) :
    "pass"
  );
}, false);

window.spec = "xhr2";


test("XHR2", function() {
  var xhr = new XMLHttpRequest();

  // Property confirmation
  assert( "upload" in xhr, "xhr.upload is supported" );
});

test("XHR2 Prerequisite: ArrayBuffer", function() {
  var ArrayBuffer = H.API( window, "ArrayBuffer", true );

  assert( ArrayBuffer, "ArrayBuffer supported" );
});

test("XHR2 Prerequisite: Blob", function() {
  var Blob = H.API( window, "Blob", true );

  assert( Blob, "Blob supported" );
});

test("XHR2 Prerequisite: URL", function() {
  var URL = H.API( window, "URL", true );

  assert( !!URL, "URL supported" );
});
//
test("XHR2 Upload", function() {
  var xhr = new XMLHttpRequest();

  if ( !xhr.upload ) {
    assert( false, "xhr.upload not supported, skipping tests" );
  } else {
    [ "onabort", "onerror", "onload", "onloadstart", "onprogress" ].forEach(function( handler ) {

      // Property confirmation
      assert( handler in xhr.upload, "xhr.upload." + handler + " supported" );

      // Property value/type confirmation
      assert( xhr.upload[ handler ] == null, "xhr.upload." + handler + " is TreatNonCallableAsNull" );
    });
  }
});

// TEMPORARY BLOCK - Causing deadstop in Android 4, WebKit
// asyncTest("XHR2 Upload In Practice", function( async ) {
//   var Blob = H.API( window, "Blob", true ),
//       xhr = new XMLHttpRequest(),
//       builder, size;
//
//
//   if ( !Blob ) {
//     assert( false, "Blob not supported, skipping tests" );
//     async.done();
//   } else {
//     builder = new Blob();
//     builder.append("The Future is Cool");
//
//     size = builder.getBlob().size;
//
//     xhr.open( "POST", "/tests/_server/echo.php", true );
//
//     // Firefox Mobile never returns on this?
//     xhr.upload.onprogress = function( event ) {
//       if ( event.lengthComputable ) {
//         async.step(function() {
//           assert( event.total === size, "event.total matches expected size" );
//           async.done();
//         });
//       }
//     };
//
//     // Firefox Mobile will return on this
//     xhr.onload = function( event ) {
//       if ( event.lengthComputable ) {
//         async.step(function() {
//           assert( event.total === size, "event.total matches expected size" );
//           async.done();
//         });
//       }
//     };
//
//     xhr.send( builder.getBlob("text/plain") );
//   }
// });


asyncTest("XHR2 ArrayBuffer Response Type", function( async ) {
  var Blob = H.API( window, "Blob", true ),
      xhr = new XMLHttpRequest(),
      isDead = false;

  if ( !Blob ) {
    assert( false, "Blob not supported, skipping tests" );
    isDead = true;
    async.done();
  } else {

    xhr.open( "GET", "/tests/xhr2/png.png", true );
    xhr.responseType = "arraybuffer";

    xhr.onload = function( event ) {
      var blob,
          data = this;

      if ( !isDead && data.status === 200 ) {

        // WARNING: Without these "step" calls,
        // testharness.js will lose track of async assertions
        async.step(function() {
          // Instance confirmation
          assert( data.response instanceof ArrayBuffer, "ArrayBuffer data.response supported" );

          // Property confirmation
          assert( "byteLength" in data.response, "data.response.byteLength supported" );

          // Property value/type confirmation
          assert( typeof data.response.byteLength === "number", "data.response.byteLength is number" );


          if ( !Blob ) {
            assert( false, "Blob not supported, skipping tests" );
            async.done();
          } else {

            blob = new Blob([ data.response ], { type: "image\/png" });


            // Instance confirmation
            assert( blob instanceof Blob, "blob is an instance of Blob" );

            // Property confirmation
            assert( "size" in blob, "blob.size supported" );
            assert( "type" in blob, "blob.type supported" );

            // Property value/type confirmation
            assert( typeof blob.size === "number", "typeof blob.size is number" );
            assert( blob.size === 23115, "blob.size of fixture png.png is 23115" );

            assert( typeof blob.type === "string", "typeof blob.type is string" );
            assert( blob.type === "image/png", "blob.type of fixture png.png is image/png" );

            // Miscellaneous Confirmation
            assert( {}.toString.call(blob) === "[object Blob]", "Correct Blob type" );

            isDead = true;
            // Finalize async test
            async.done();
          }
        });
      }
    };
    xhr.send();
  }

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "Browser ArrayBuffer Response test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});

asyncTest("XHR2 Text Send/Response Type", function( async ) {
  var xhr = new XMLHttpRequest(),
      isDead = false;

  if ( !("responseType" in xhr) ) {
    assert( false, "xhr.responseType not supported, skipping tests" );
    isDead = true;
    async.done();
  } else {
    xhr.open( "POST", "/tests/_server/data.php", true );
    xhr.responseType = "text";

    xhr.onload = function( event ) {
      var data = this;

      if ( !isDead && data.status === 200 ) {
        async.step(function() {

          assert( typeof data.response === "string", "Text Response supported (strings)" );

          isDead = true;
          async.done();
        });
      }
    };
    xhr.send("Just a string");
  }

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "Browser Text Response test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});

asyncTest("XHR2 Blob Response Type", function( async ) {
  var Blob = H.API( window, "Blob", true ),
      URL = H.API( window, "URL", true ),
      xhr = new XMLHttpRequest(),
      isDead = false;

  if ( !Blob ) {
    assert( false, "Blob not supported, skipping tests" );
    isDead = true;
    async.done();
  } else {

    xhr.open( "GET", "/tests/xhr2/png.png", true );
    xhr.responseType = "blob";

    xhr.onload = function( event ) {
      var data = this;

      if ( !isDead && data.status === 200 ) {
        async.step(function() {

          // console.log( data.response );
          // CURRENTLY UNSUPPORTED IN WEBKIT/CHROME
          // console.log( URL.createObjectURL(data.response) );

          assert( data.response instanceof Blob, "Blob Response supported (images)" );

          isDead = true;
          async.done();
        });
      }
    };
    xhr.send();
  }

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "Browser Blob Response test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});

asyncTest("XHR2 Document Response Type", function( async ) {
  var xhr = new XMLHttpRequest(),
      Document = window.Document,
      isDead = false;

  if ( !("responseType" in xhr) ) {
    assert( false, "xhr.responseType not supported, skipping tests" );
    async.done();
  } else {
    xhr.open( "GET", window.location.href, true );
    xhr.responseType = "document";

    xhr.onload = function( event ) {
      var data = this;

      if ( !isDead && data.status === 200 ) {
        async.step(function() {
          // CURRENTLY UNSUPPORTED IN WEBKIT? CHROME?
          // console.log( data, data.response );
          assert( data.responseXML instanceof Document, "Document Response supported (XML, HTML documents)" );

          isDead = true;
          async.done();
        });
      }
    };
    xhr.send();
  }

  // Bailout
  setTimeout(function() {
    if ( !isDead ) {
      async.step(function() {
        assert( false, "Browser Document Response test in allotted time" );

        isDead = true;
        async.done();
      });
    }
  }, 7000);
});
