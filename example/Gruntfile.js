module.exports = function(grunt) {
  'use strict';

  grunt.initConfig
  ({
    jasmine_nodejs: {
      options: {
        specNameSuffix: 'Spec.js',
        useHelpers:     false,
        stopOnFailure:  false
      },
      all: {
        specs: ['*Spec.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-nodejs');
  grunt.registerTask('default', ['jasmine_nodejs']);
};

