'use strict';

require('insulin')
  .factory('getTime',
  ['moment'],
  function(moment) {
    /**
     * Get the date and time for a given timezone in the requested format.
     * @param req An express request object, which may have these optional
     *        query parameters:
     *        
     *        1) zone The optional timezone name (defaults to 'utc').  If invalid,
     *           a 400 status is returned.
     *        2) format The format to return the time in (defaults to 'MM/DD/YYYY HH:mm:ss').
     *
     * @param res An express response object.
     */
    return function(req, res) {
      var zone   = req.query.zone   || 'utc';
      var format = req.query.format || 'MM/DD/YYYY HH:mm:ss';

      // Make sure the time zone is valid.
      if (!moment.tz.zone(zone))
        res.status(400).json('Invalid zone ' + zone + '.');
      else
        res.json(moment().tz(zone).format(format));
    };
  });

