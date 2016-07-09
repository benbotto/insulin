'use strict';

require('insulin')
  .factory('timeRouter',
  ['express', 'getTime'],
  function(express, getTime) {
    var router = express.Router();
    router.get('/time', getTime);
    return router;
  });

