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
