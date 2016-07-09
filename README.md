# insulin
insulin is a trivial dependency injection container for Node.js that uses the inversion of control (IoC) pattern.  It's based loosely on angular-di (AngularJS's DI); however, it's greatly simplified at less than 100 lines of code, and it's targeted at Node.js instead of a browser.  insulin aims to make replacing dependencies for testing purposes trivial; to reduce the need to pass instances of central components--such as database contexts--throughout the application; and to make it clear exaclty what each component of an application depends upon at a glance.

Like AngularJS, factories can be registered with insulin using the ```factory(name, depends, producer)``` method:

* name The name of the thing that is produced by producer.
* depends An array of dependency names (other things that insulin can produce).
* producer A function that produce something, like an object, constant, or anything else.

For example:

```js
'use strict';

let insulin = require('insulin');

// Job class.
insulin.factory('Job', function() {
  class Job {
    constructor(hourlyRate) {
      this.hourlyRate = hourlyRate;
    }
  }

  return Job;
});

// Person class.
insulin.factory('Person', function() {
  class Person {
    constructor(name, job) {
      this.name = name;
      this.job  = job;
    }

    getPay(hours) {
      return this.job.hourlyRate * hours;
    }
  }

  return Person;
});

// Person instance.
insulin.factory('ben', (Person, Job) => new Person('Ben', new Job(10)));

// 'ben' requires Person and Job, which are lazy resolved and injected.
// Subsequent retrieval of 'ben' will always yeild the same instance.
let dev = insulin.get('ben');
console.log(`${dev.name} is owed ${dev.getPay(3)} bucks.`);
```

A real-world example of using insulin with Express is available in the example directory.  The example application has a single API endpoint: ```GET /api/time```.  By default, this endpoint returns the current time in UTC, in the format MM/DD/YYYY.  ```zone``` and ```format``` URL parameters can optionally be passed in, which allows for retrieving the time in a different timezone and format.  For example, ```/api/time?zone=America/New_York&format=HH:mm:ss```.  For an example of how to mock dependencies in a test suite, take a look at example/timeRouterSpec.js.
