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
