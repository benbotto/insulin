'use strict';

require('insulin')
  .factory('timeRouter',
  ['express', 'getTimeString'],
  function(express, getTimeString)
  {
    var router = express.Router();

    router .get('/time', function(req, res)
    {
      try
      {
        res.json(getTimeString(req.query.zone, req.query.format));
      }
      catch (ex)
      {
        res.status(400).json(ex.message);
      }
    });

    return router;
  });

