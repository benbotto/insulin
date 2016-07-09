'use strict';

class DependencyInjectionContainer {
  /**
   * Init.
   */
  constructor() {
    this._factories = {};
  }

  /**
   * Add a factory.  Blindly replaces if the factory already exists.
   * @param name The name of the factory.
   * @param depends An array of dependency names.  The names should
   *        refer to other factories.
   * @param producer A producer function.
   */
  factory(name, depends, producer) {
    this._factories[name] = {
      producer: producer,
      depends:  depends,
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
    var factory = this._factories[name];

    if (!factory)
      throw new Error('Factory "' + name + '" does not exist.');

    // Producer hasn't yet been called.
    if (!factory.instance) {
      // Call the producer function, passing the dependencies as arguments.
      factory.instance = factory.producer.apply(null,
        factory.depends.map(dep => this.get(dep)));
    }

    // Return the shared instance.
    return factory.instance;
  }

  /**
   * Run func immediately, injecting in depends.  Returns whatever is returned
   * from func.
   * @param depends An array of dependency names.
   * @param func A function to run.
   */
  run(depends, func) {
    return func.apply(null, depends.map(dep => this.get(dep)));
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
    for (var name in this._factories)
      this._factories[name].instance = null;
  }

  /**
   * Create a copy of this DiC suitable for mocking.  All the producer functions
   * and dependencies are copied, and all instances are forgotten.
   */
  mock() {
    var dic = new DependencyInjectionContainer();

    for (var name in this._factories)
      dic.factory(name, this._factories[name].depends.slice(), this._factories[name].producer);

    return dic;
  }
}

module.exports = DependencyInjectionContainer;

