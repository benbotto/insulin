'use strict';

describe('DependencyInjectionContainer suite', function()
{
  var DIC    = require('./DependencyInjectionContainer');
  var Job    = require('./resource/Job');
  var Person = require('./resource/Person');

  // Tries to get a nonexistant factory.
  it('tries to get a nonexistant factory.', function()
  {
    var dic = new DIC();

    expect(function()
    {
      dic.get('NOPE');
    }).toThrowError('Factory "NOPE" does not exist.');
  });

  // Adds a factory.
  it('adds a factory.', function()
  {
    var dic = new DIC();

    dic.factory('Ben', [], function()
    {
      return new Person('Ben');
    });

    var p1 = dic.get('Ben');
    var p2 = dic.get('Ben');

    expect(p1.getName()).toBe('Ben');
    expect(p1).toBe(p2); // Same instance.
    expect(dic.has('Ben')).toBe(true);
    expect(dic.has('Bob')).toBe(false);
  });

  // Checks that a factory can be overwritten.
  it('checks that a factory can be overwritten.', function()
  {
    var dic = new DIC();

    dic.factory('Ben', [], function()
    {
      return new Person('Ben');
    });

    dic.factory('Ben', [], function()
    {
      return new Person('Bob');
    });

    expect(dic.get('Ben').getName()).toBe('Bob');
  });

  // Checks that dependencies can be requested and resolved.
  it('checks that dependencies can be requested and resolved.', function()
  {
    var dic = new DIC();

    dic.factory('Ben', ['plumber'], function(plumber)
    {
      return new Person('Ben', plumber);
    }).factory('plumber', [], function()
    {
      return new Job(50);
    });

    var p = dic.get('Ben');

    expect(p.getName()).toBe('Ben');
    expect(p.getJob().getPay(2)).toBe(100);
  });

  // Checks that the cache can be cleared.
  it('checks that the cache can be cleared.', function()
  {
    var dic = new DIC();

    dic.factory('Ben', [], function()
    {
      return new Person('Ben');
    });

    var p1 = dic.get('Ben');
    dic.forget();
    var p2 = dic.get('Ben');

    expect(p1).not.toBe(p2);
  });

  // Checks the run method.
  it('checks the run method.', function()
  {
    var dic = new DIC();

    dic.factory('Ben', ['plumber'], function(plumber)
    {
      return new Person('Ben', plumber);
    }).factory('plumber', [], function()
    {
      return new Job(50);
    });

    dic.run(['Ben', 'plumber'], function(ben, plumber)
    {
      expect(ben.getName()).toBe('Ben');
      expect(plumber.getPay(1)).toBe(50);
      expect(ben.getJob()).toBe(plumber);
    });
  });
});

