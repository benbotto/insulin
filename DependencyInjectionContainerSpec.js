'use strict';

describe('DependencyInjectionContainer suite', function() {
  let DIC    = require('./DependencyInjectionContainer');
  let Job    = require('./resource/Job');
  let Person = require('./resource/Person');

  // Tries to get a nonexistant factory.
  it('tries to get a nonexistant factory.', function() {
    let dic = new DIC();

    expect(function() {
      dic.get('NOPE');
    }).toThrowError('Factory "NOPE" does not exist.');
  });

  // Adds a factory.
  it('adds a factory.', function() {
    let dic = new DIC();

    dic.factory('Ben', [], function() {
      return new Person('Ben');
    });

    let p1 = dic.get('Ben');
    let p2 = dic.get('Ben');

    expect(p1.getName()).toBe('Ben');
    expect(p1).toBe(p2); // Same instance.
    expect(dic.has('Ben')).toBe(true);
    expect(dic.has('Bob')).toBe(false);
  });

  // Checks that a factory can be overwritten.
  it('checks that a factory can be overwritten.', function() {
    let dic = new DIC();

    dic.factory('Ben', [], function() {
      return new Person('Ben');
    });

    dic.factory('Ben', [], function() {
      return new Person('Bob');
    });

    expect(dic.get('Ben').getName()).toBe('Bob');
  });

  // Checks that dependencies can be requested and resolved.
  it('checks that dependencies can be requested and resolved.', function() {
    let dic = new DIC();

    dic.factory('Ben', ['plumber'], function(plumber) {
      return new Person('Ben', plumber);
    }).factory('plumber', [], function() {
      return new Job(50);
    });

    let p = dic.get('Ben');

    expect(p.getName()).toBe('Ben');
    expect(p.getJob().getPay(2)).toBe(100);
  });

  // Checks the annotate method.
  it('checks the annotate method.', function()
  {
    let dic = new DIC();
    let depends = ['a', 'b', 'c'];
    expect(dic.annotate(depends)).toEqual(['a', 'b', 'c']);

    depends = function(c, d, e) { return c + d + e; };
    expect(dic.annotate(depends)).toEqual(['c', 'd', 'e']);

    depends = (f, g) => f + g;
    expect(dic.annotate(depends)).toEqual(['f', 'g']);

    depends = h => h;
    expect(dic.annotate(depends)).toEqual(['h']);
  });

  // Checks that dependencies can be derived.
  it('checks that dependencies can be derived.', function()
  {
    let dic = new DIC();

    dic
      .factory('Ben', plumber => new Person('Ben', plumber))
      .factory('plumber', () => new Job(50));

    let p = dic.get('Ben');

    expect(p.getName()).toBe('Ben');
    expect(p.getJob().getPay(2)).toBe(100);
  });

  // Checks that the cache can be cleared.
  it('checks that the cache can be cleared.', function() {
    let dic = new DIC();

    dic.factory('Ben', [], function() {
      return new Person('Ben');
    });

    let p1 = dic.get('Ben');
    dic.forget();
    let p2 = dic.get('Ben');

    expect(p1).not.toBe(p2);
  });

  // Checks the run method.
  it('checks the run method.', function() {
    let dic = new DIC();

    dic.factory('Ben', ['plumber'], function(plumber) {
      return new Person('Ben', plumber);
    }).factory('plumber', [], function() {
      return new Job(50);
    });

    dic.run(['Ben', 'plumber'], function(ben, plumber) {
      expect(ben.getName()).toBe('Ben');
      expect(plumber.getPay(1)).toBe(50);
      expect(ben.getJob()).toBe(plumber);
    });

    // Same, but without explicit dependencies.
    dic.run(function(Ben, plumber) {
      expect(Ben.getName()).toBe('Ben');
      expect(plumber.getPay(1)).toBe(50);
      expect(Ben.getJob()).toBe(plumber);
    });
  });

  // Checks the value returned from run.
  it('checks the value returned from run.', function() {
    let dic = new DIC();

    dic.factory('name', [], function() {
      return 'Ben';
    });

    let lName = dic.run(['name'], function(name) {
      return name.toLowerCase();
    });

    expect(lName).toBe('ben');
  });

  // Checks the mock method.
  it('checks the mock method.', function() {
    let dic = new DIC();
    dic.factory('Ben', [], function() {
      return new Person('Ben');
    });

    let mock = dic.mock();
    mock.factory('Ben', [], function() {
      return new Person('Joe');
    });

    expect(dic.get('Ben').getName()).toBe('Ben');
    expect(mock.get('Ben').getName()).toBe('Joe');
  });
});

