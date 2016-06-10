'use strict';

// Person test class.
class Person
{
  constructor(name, job)
  {
    this.name = name;
    this.job  = job;
  }

  // Get a person's name.
  getName()
  {
    return this.name;
  }

  // Get a person's job.
  getJob()
  {
    return this.job;
  }
}

module.exports = Person;

