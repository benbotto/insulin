'use strict';

// insulin is a dependency injection (DI) container using inversion of control
// (IoC).
var insulin = require('insulin');

// Add factories for express and moment.
insulin
  .factory('express', [], () => require('express'))
  .factory('moment',  [], () => require('moment-timezone'));

// Each of these registers itself as a factory.
require('./timeRouter');
require('./getTimeString');

// Initialize the app.
insulin.run(['express', 'timeRouter'], function(express, timeRouter)
{
  var app = express();
  app.use('/api', timeRouter);
  app.listen(3000);
  console.log('Listening on port 3000.');
});

