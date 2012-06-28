test("performance", function() {
  var performance = H.API( window, "performance", true );

  assert( !!performance, "performance supported" );
});

test("performance navigation", function() {
  var performance = H.API( window, "performance", true ),
      performanceNav = H.API( performance, "navigation", true );

  assert( performance && performanceNav, "performance.navigation supported" );
});

test("performance navigation instance", function() {
  var performance = H.API( window, "performance", true ),
      performanceNav = H.API( performance, "navigation", true );


  if ( !performanceNav ) {
    assert( false, "performance.navigation not supported, skipping tests" );
  } else {
    [
    "redirectCount",
    "type"
    ].forEach(function( stat ) {
      assert( stat in performance.navigation, "performance.navigation " + stat + " supported" );
      assert( typeof performance.navigation[ stat ] === "number", "performance.navigation " + stat + " is a number" );
    });
  }
});

test("performance navigation sanity", function() {
  var performance = H.API( window, "performance", true );

  // There should be no redirects on this page
  assert( performance && (performance.navigation.redirectCount === 0), "performance.navigation.redirectCount matched expected" );
});

test("performance timing", function() {
  var performance = H.API( window, "performance", true );

  assert( performance && performance.timing, "performance.timing exists in some form" );
});

test("performance timing instance", function() {
  var stats,
      performance = H.API( window, "performance", true );

  if ( !performance || !performance.timing ) {
    assert( false, "performance.timing not supported, skipping tests" );
  } else {
    [
    "connectEnd", "connectStart",
    "domComplete", "domContentLoadedEventEnd", "domContentLoadedEventStart", "domInteractive", "domLoading",
    "domainLookupEnd", "domainLookupStart",
    "fetchStart",
    "loadEventEnd", "loadEventStart",
    "navigationStart",
    "redirectEnd", "redirectStart",
    "requestStart",
    "responseEnd", "responseStart",
    // "secureConnectionStart",
    "unloadEventEnd", "unloadEventStart"
    ].forEach(function( stat ) {
      assert( stat in performance.timing, "performance.navigation.timing " + stat + " supported" );
      assert( typeof performance.timing[ stat ] === "number", "performance.navigation.timing " + stat + " is a number" );
    });
  }
});

test("performance timing sanity", function() {
  var performance = H.API( window, "performance", true ),
      timing;

  if ( !performance || !performance.timing ) {
    assert( false, "performance.timing is not supported, skipping tests" );
  } else {
    timing = performance.timing;

    [
      [ timing.connectEnd >= timing.connectStart, "connectEnd >= connectStart" ],
      [ timing.domainLookupEnd >= timing.domainLookupStart, "domainLookupEnd >= domainLookupStart" ],
      [ timing.loadEventEnd >= timing.loadEventStart, "loadEventEnd >= loadEventStart" ],
      [ timing.unloadEventEnd >= timing.unloadEventStart, "unloadEventEnd >= unloadEventStart" ],
      [ timing.domComplete >= timing.domContentLoadedEventStart, "domComplete >= domContentLoadedEventStart" ],
      [ timing.domComplete >= timing.domContentLoadedEventEnd, "domComplete >= domContentLoadedEventEnd" ],
      [ timing.domContentLoadedEventEnd >= timing.domContentLoadedEventStart, "domContentLoadedEventEnd >= domContentLoadedEventStart" ]
    ].forEach(function( condition ) {
      assert( condition[0], condition[1] );
    });
  }
});


test("performance memory", function() {
  var stats,
      performance = H.API( window, "performance", true );

   assert( performance && performance.memory, "performance.memory supported" );
});

test("performance memory instance", function() {
  var performance = H.API( window, "performance", true );

  if ( !performance || !performance.memory ) {
    assert( false, "performance.memory is not supported, skipping tests" );
  } else {

    [
    "jsHeapSizeLimit",
    "totalJSHeapSize",
    "usedJSHeapSize"
    ].forEach(function( stat ) {
      assert( stat in performance.memory, "performance.navigation.memory " + stat + " supported" );
      assert( typeof performance.memory[ stat ] === "number", "performance.navigation.memory " + stat + " is a number" );
    });
  }
});
