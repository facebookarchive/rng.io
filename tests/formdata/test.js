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
