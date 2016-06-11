describe('getTime test suite.', function()
{
  'use strict';

  /** Trivial tests with no dependency swapping. **/

  var insulin = require('insulin');
  var getTime, res, req;

  // Set up the DiC.
  require('./getTime');
  insulin.factory('moment', [], () => require('moment-timezone'));

  // Get a reference to the getTime function.
  getTime = insulin.get('getTime');

  beforeEach(function()
  {
    // Mocked request and response objects.
    req = {query: {}};
    res = jasmine.createSpyObj('res', ['status', 'json']);
    res.status.and.returnValue(res);
  });

  // Checks the default zone and format.
  it('checks the default zone and format.', function()
  {
    getTime(req, res);
    expect(res.json.calls.argsFor(0)[0])
      .toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
  });

  // Checks a different format.
  it('checks a different format.', function()
  {
    req.query.format = 'HH';
    getTime(req, res);

    expect(res.json.calls.argsFor(0)[0]).toMatch(/^\d\d$/);
  });

  // Checks an invalid zone.
  it('checks an invalid zone.', function()
  {
    req.query.zone = 'FOO';
    getTime(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith('Invalid zone FOO.');
  });
});

