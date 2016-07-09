'use strict';

let getParameterNames = require('@avejidah/get-parameter-names');

class DependencyInjectionContainer {
  /**
   * Init.
   */
  constructor() {
    this._factories = {};
  }

  /**
   * Helper function to get the parameter names for a function.
   * @param depends An array of dependency names, or a function from which
   *        dependency names are derived.
   */
  annotate(depends) {
    return (depends instanceof Function) ? getParameterNames(depends) : depends;
  }

  /**
   * Add a factory.  Blindly replaces if the factory already exists.
   * @param name The name of the factory.
   * @param depends An optional array of dependency names.  The names should
   *        refer to other factories.
   * @param producer A producer function.
   */
  factory(name, depends, producer) {
    this._factories[name] = {
      producer: producer || depends,
      depends:  this.annotate(depends),
      instance: null
    };

    return this;
  }

  /**
   * Get the instance associated with name.  If the instance has not yet been
   * resolved, the producer function is called, passing each dependency as
   * an argument.  If it has been resolved, the instance is returned.
   * @param name The name of the factory.
   */
  get(name) {
    let factory = this._factories[name];

    if (!factory)
      throw new Error(`Factory "${name}" does not exist.`);

    if (!factory.instance) {
      // Call the producer function, passing the dependencies as arguments.
      factory.instance = factory.producer.apply(null,
        factory.depends.map(dep => this.get(dep)));
    }

    return factory.instance;
  }

  /**
   * Run func immediately, injecting in depends.  Returns whatever is returned
   * from func.
   * @param depends An optional array of dependency names.
   * @param func A function to run.
   */
  run(depends, func) {
    func = func || depends;
    return func.apply(null, this.annotate(depends).map(dep => this.get(dep)));
  }

  /**
   * Check, by name, if the DiC has a factory.
   * @param name The name of the factory.
   */
  has(name) {
    return this._factories[name] !== undefined;
  }

  /**
   * Clear all the resolved instances.
   */
  forget() {
    for (let name in this._factories)
      this._factories[name].instance = null;
  }

  /**
   * Create a copy of this DiC suitable for mocking.  All the producer functions
   * and dependencies are copied, and all instances are forgotten.
   */
  mock() {
    let dic = new DependencyInjectionContainer();

    for (let name in this._factories)
      dic.factory(name, this._factories[name].depends.slice(), this._factories[name].producer);

    return dic;
  }
}

module.exports = DependencyInjectionContainer;

