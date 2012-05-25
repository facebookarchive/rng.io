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
