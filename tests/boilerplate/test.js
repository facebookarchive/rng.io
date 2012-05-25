test("<%= title %>", function() {
  // Prerequisite Assertions

  assert( true, "Spec supported" );

  // assert tests whether a value is Boolean true or truthy
});


asyncTest("<%= title %> Practical Application", function( async ) {
  // asyncTest callback receives "async" object as first argument

  // Assertion
  assert( true, "This thing is true" );

  // assert tests whether a value is Boolean true or truthy


  // async object
  // @instance
  // @type Object

  // step
  // @method
  // @memberOf async
  // @param callback function, wraps async assertions.

  async.step(function() {

    // Assertion
    assert( true, "This thing is true" );


  // done
  // @method
  // @memberOf async
  // @param indicate async test is complete.

    async.done();
  });
});
