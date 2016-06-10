'use strict';

require('insulin')
  .factory('getTimeString',
  ['moment'],
  function(moment)
  {
    /**
     * Get the date and time for a given timezone in the requested format.
     * @param zone The optional timezone name (defaults to 'utc').  If invalid, an
     *        exception is raised.
     * @param format The format to return the time in (defaults to 'MM/DD/YYYY HH:mm:ss').
     */
    return function(zone, format)
    {
      zone   = zone   || 'utc';
      format = format || 'MM/DD/YYYY HH:mm:ss';

      // Make sure the time zone is valid.
      if (!moment.tz.zone(zone))
        throw new Error('Invalid zone ' + zone + '.');

      return moment().tz(zone).format(format);
    };
  });

