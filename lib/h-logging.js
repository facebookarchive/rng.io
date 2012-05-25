(function( exports, QUnit ) {

  var muted = [
    /* list of logging methods to optionally mute */
    // "testStart", "testDone",
    // "moduleStart", "moduleDone"
  ];


  [ "begin", "log", "done",
    "testStart", "testDone",
    "moduleStart", "moduleDone",
    "featureStart", "featureDone"
  ].filter(function( log ) {
    return !~muted.indexOf( log );
  }).forEach(function( log ) {
    // Define optional QUnit logging function
    QUnit[ log ] = function( data ) {
      //console.log( log, data );
      var type = log;

      if ( log === "log" ) {
        if ( !data.result ) {
          // console.log( "FAIL: ", data.message );
        }
      } else {
        // console.log( log, data )
      }

      Hat.emit( "runner:" + type.replace("module", "ring"), data );
    };
  });

}( this, this.QUnit ));
