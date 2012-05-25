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
