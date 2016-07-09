describe('timeRouter test suite.', function() {
  'use strict';
  
  // Initialize the DiC.
  require('./timeRouter');
  
  var insulin;
  var express, router;

  beforeEach(function() {
    // Before each test, get a mockable copy of insulin.  All the
    // producers are intact, all the dependencies are copied, and
    // all the instances are cleared.
    insulin = require('insulin').mock();

    // Replace express in the container, with a fake Router implementation.
    express = jasmine.createSpyObj('express', ['Router']);
    router  = jasmine.createSpyObj('router',  ['get']);
    express.Router.and.returnValue(router);
    insulin.factory('express', [], () => express);

    // The getTime method is also mocked.
    insulin.factory('getTime', [], () => 'mocked');
  });

  // Checks that a new router is created and returned.
  it('checks that a new router is created and returned.', function() {
    expect(insulin.get('timeRouter')).toBe(router);
    expect(express.Router).toHaveBeenCalled();
  });

  // Expects the /time route to be defined.
  it('expects the /time route to be defined.', function() {
    insulin.get('timeRouter');
    expect(router.get).toHaveBeenCalledWith('/time', 'mocked');
  });
});

