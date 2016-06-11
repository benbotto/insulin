'use strict';

var insulin = require('insulin');

// Person class.
insulin.factory('Person', [], function() {
  class Person {
    constructor(name) {
      this.name = name;
    }
  }

  return Person;
});

// Person instance.
insulin.factory('ben', ['Person'], (Person) => new Person('Ben'));

// 'ben' requires Person, which is lazy resolve and injected into 'ben.'
// Subsequent retrieval of 'ben' will always yeild the same instance.
console.log(insulin.get('ben').name);

