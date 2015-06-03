'use strict';

/* @ngInject */
module.exports = function($log, $compile, dropdownTransformer) {

  function updateTemplate(tElem, dropdownTemplate, tagName) {
    var customTemplate;
    if (tElem.find(tagName).length) {
      customTemplate = tElem.find(tagName);
      dropdownTemplate = angular.element(dropdownTemplate).append(customTemplate)[0].outerHTML;
    }
    return dropdownTemplate;
  }

  function getCustomMarkup(tElem, tagName) {
    if (tElem.find(tagName).length) {
      return tElem.find(tagName).remove().html();
    }
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      selectedOption: '=ngModel',
      options: '=',
      optionProperty: '@?',
      onChange: '&?',
      testProp: '@?'
    },

    template: function(tElem, attrs) {
      var selectedTemplate;
      var dropdownTemplate = require('./templates/dropdown-directive.tpl.html');

      dropdownTemplate = updateTemplate(tElem, dropdownTemplate, 'akam-dropdown-selected');
      dropdownTemplate = updateTemplate(tElem, dropdownTemplate, 'akam-dropdown-option');

      return dropdownTemplate;
    },

    link: function(scope, elem) {
      $log.log('elem', elem);
      var selectedScope, selectedContentTemplate, selectedElem,
        menuScope, menuTemplate, menuElem, selectedTemplate, optionTemplate;

      selectedTemplate = getCustomMarkup(elem, 'akam-dropdown-selected');
      optionTemplate = getCustomMarkup(elem, 'akam-dropdown-option');

      scope.setSelectedOption = function(option) {
        scope.selectedOption = option;
      };

      scope.clearSelectedOption = function($event) {
        $event.stopPropagation();
        scope.selectedOption = undefined;
      };

      scope.$watch('selectedOption', function(selectedOption) {
        if (typeof selectedScope !== 'undefined') {
          selectedScope.selectedOption = selectedOption;
        }

        if (typeof scope.onChange === 'function') {
          scope.onChange();
        }
      });

      selectedContentTemplate = dropdownTransformer.getSelected(selectedTemplate);
      if (typeof selectedTemplate !== 'undefined') {
        selectedScope = scope.$parent.$new();
        selectedScope.selectedOption = scope.selectedOption;
        selectedScope.optionProperty = scope.optionProperty;
        selectedScope.clearSelectedOption = scope.clearSelectedOption;

        selectedElem = $compile(selectedContentTemplate)(selectedScope);
      } else {
        selectedElem = $compile(selectedContentTemplate)(scope);
      }
      elem.children(0).children(0).append(selectedElem);

      menuTemplate = dropdownTransformer.getMenu(optionTemplate);
      if (typeof optionTemplate !== 'undefined') {
        menuScope = scope.$parent.$new();
        menuScope.options = scope.options;
        menuScope.setSelectedOption = scope.setSelectedOption;

        menuElem = $compile(menuTemplate)(menuScope);
      } else {
        menuElem = $compile(menuTemplate)(scope);
      }
      elem.children(0).append(menuElem);

    }
  };
};