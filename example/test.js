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

