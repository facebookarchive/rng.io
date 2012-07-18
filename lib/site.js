document.addEventListener( "DOMContentLoaded", function() {

  // Derive a sub app initializer
  var sub = location.pathname.replace( /\//g, "" );

  new Ringmark(
    sub.length ? sub[0].toUpperCase() + sub.slice(1).toLowerCase() : null
  );

}, false );

window.onload = function() {
  window.scrollTo( 0, 1 );
};
