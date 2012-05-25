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
