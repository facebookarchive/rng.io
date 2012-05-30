(function(window, $) {

  var spec, args, keyVal, dir, fixture;

  if ( location.search && location.search.indexOf("spec") ) {
    args = location.search.slice(1).split("&");

    while( args.length ) {
      keyVal = args.pop().split("=");
      if ( keyVal[ 0 ] === "spec" ) {
        spec = keyVal[ 1 ];
      }
    }

    if ( spec ) {

      // Create a Deferred in order to wait to load script until potential fixture HTML is injected
      fixture = $.Deferred();

      dir = "../tests/" + spec + "/";

      // Test for any fixture html
      $.get( dir + "fixture.html" )
      // If it exists, inject it into the fixture area
      .then(function( data ) {

        window.Visual.fixture = data;

        $(document).ready(function() {
          $("#qunit-fixture").html( data );
          fixture.resolve();
        });
      })
      // If it doesn't, just resolve and load the tests
      .fail( fixture.resolve );

      // When the fixture loading process has completed, load the tests
      $.when( fixture ).then(function() {
        var html = $("#qunit-fixture").html();
        module( spec, {
          setup: function() {
            $("#qunit-fixture").html( html );
          }
        });
        $.getScript( dir + "test.js" );

        QUnit.start();
      });
    }
  }
  $(function() {

    function loadSpec( spec ) {
      location.href = location.protocol + "//" + location.host + location.pathname + "?spec=" + spec;
    }
    $("form").on("submit", function( event ) {
      event.preventDefault();
      loadSpec( $("#spec").val() );
    });

    $.getJSON("feature-select.js")
    .then(function( data ) {
      var $frag = $("<select>");

      $frag.append("<option value='no-jump'>Jump to... </option>");

      $.each( data, function( idx, feature ) {
        $frag.append(
          "<option value='" + feature.name + "' " +
          (spec === feature.name ? "selected" : "") +
          ">" +
          feature.name +
          "</option>"
        );
        // console.log( feature );
      });

      $("select").append( $frag.html() ).on("change", function() {
        if ( this.value !== "no-jump" ) {
          loadSpec( this.value );
        }
      }).trigger("focus");
    });
  });

}(this, this.jQuery));
