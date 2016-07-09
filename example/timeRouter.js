'use strict';

require('insulin')
  .factory('timeRouter',
  function(express, getTime) {
    var router = express.Router();
    router.get('/time', getTime);
    return router;
  });

