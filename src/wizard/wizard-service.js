'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($templateCache, $log, $modal, $controller) {

  function initializeScope(options) {
    var wizardScope = options.scope.$new();

    wizardScope.contentScope = options.scope;
    delete options.scope;

    wizardScope.title = options.title;
    wizardScope.previousLabel = options.previousLabel;
    wizardScope.nextLabel = options.nextLabel;
    wizardScope.submitLabel = options.submitLabel;
    wizardScope.successMessage = options.successMessage;
    wizardScope.errorMessage = options.errorMessage;
    wizardScope.stepIndex = 0;
    wizardScope.steps = options.steps;

    $controller(options.controller, {$scope: wizardScope.contentScope});
    delete options.controller;

    return wizardScope;
  }

  return {
    open: function(options) {

      var wizardScope = initializeScope(options);

      for (var i = 0; i < options.steps.length; i++) {
        options.steps[i].template = $templateCache.get(options.steps[i].templateId);
      }

      wizardScope.previousStep = function() {
        if(wizardScope.stepIndex > 0) {
          wizardScope.stepIndex--;
        }
      };

      wizardScope.nextStep = function() {
        if(wizardScope.stepIndex < wizardScope.steps.length - 1) {
          wizardScope.stepIndex++;
        }
      };

      wizardScope.isValid = function() {
        if (angular.isFunction(wizardScope.currentStep.validate)) {
          return wizardScope.currentStep.validate(wizardScope.contentScope);
        } else {
          return true;
        }
      };

      wizardScope.submit = angular.noop;

      wizardScope.$watch('stepIndex', function(stepIndex) {
        wizardScope.currentStep = wizardScope.steps[stepIndex];
      });

      var instance = $modal.open(angular.extend(options, {
        scope: wizardScope,
        template: require('./templates/wizard.tpl.html')
      }));

    }
  };
};
