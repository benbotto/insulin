'use strict';

require('insulin')
  .factory('timeRouter',
  ['express', 'getTimeString'],
  function(express, getTimeString)
  {
    var router = express.Router();

    router.get('/time', function(req, res)
    {
      try
      {
        // Try to get a string representation of the time in the
        // specified timezone and format.  If the zone is invalid an
        // exception is raised.
        res.json(getTimeString(req.query.zone, req.query.format));
      }
      catch (ex)
      {
        res.status(400).json(ex.message);
      }
    });

    return router;
  });

