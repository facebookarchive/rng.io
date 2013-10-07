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
