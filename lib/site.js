document.addEventListener( "DOMContentLoaded", function() {

  // Initialize the entire Application
  App.init();

  // Derive a sub app initializer
  var sub = location.pathname.replace( /\//g, "" ),
      initializer = sub.length ? sub[0].toUpperCase() + sub.slice(1).toLowerCase() : null;

  if ( initializer && App[ initializer ] && App[ initializer ].init ) {
    App[ initializer ].init();
  }
}, false );

window.onload = function() {
  window.scrollTo( 0, 1 );
};
