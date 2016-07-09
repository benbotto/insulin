'use strict';

// Job test class.
class Job {
  constructor(hourlyRate) {
    this.hourlyRate = hourlyRate;
  }

  // Get the pay.
  getPay(hours) {
    return this.hourlyRate * hours;
  }
}

module.exports = Job;

