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
