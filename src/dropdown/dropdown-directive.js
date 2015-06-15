'use strict';

var angular = require('angular');

require('angular-sanitize');

/* @ngInject */
module.exports = function($compile, dropdownTransformer, translate) {

  function updateTemplate(tElem, dropdownTemplate, tagName) {
    var customTemplate, dropdownTemplateElem = angular.element(dropdownTemplate);

    if (tElem.find(tagName).length) {
      customTemplate = tElem.find(tagName);
      dropdownTemplateElem.find(tagName + '-placeholder').html(customTemplate.html());
    }
    return dropdownTemplateElem[0].outerHTML;
  }

  function getCustomMarkup(tElem, tagName) {
    return tElem.find(tagName).remove().html() || undefined;
  }

  function setPlaceholder(placeholderProp, scope, customMarkupScope, value) {
    scope[placeholderProp] = value;
    if (typeof customMarkupScope !== 'undefined') {
      customMarkupScope[placeholderProp] = scope[placeholderProp];
    }
  }

  return {
    restrict: 'E',
    require: '^ngModel',
    scope: {
      items: '=',
      textProperty: '@?',
      onChange: '&?',
      placeholder: '@?',
      filterPlaceholder: '@?'
    },

    template: function(tElem) {
      var dropdownTemplate = require('./templates/dropdown-directive.tpl.html');

      dropdownTemplate = updateTemplate(tElem, dropdownTemplate, 'akam-dropdown-selected');
      dropdownTemplate = updateTemplate(tElem, dropdownTemplate, 'akam-dropdown-option');

      return dropdownTemplate;
    },

    link: function(scope, elem, attrs, ngModel) {
      var selectedScope, selectedContentTemplate, selectedElem,
        menuScope, menuTemplate, menuElem, selectedTemplate, optionTemplate;

      selectedTemplate = getCustomMarkup(elem, 'akam-dropdown-selected-placeholder');
      optionTemplate = getCustomMarkup(elem, 'akam-dropdown-option-placeholder');

      if (typeof selectedTemplate !== 'undefined') {
        selectedScope = scope.$parent.$new();
      }

      if (typeof optionTemplate !== 'undefined') {
        menuScope = scope.$parent.$new();
      }

      scope.hasFilter = typeof attrs.filterable !== 'undefined';
      scope.isClearable = typeof attrs.clearable !== 'undefined';

      scope.filterProperty = attrs.filterable;

      scope.isOpen = false;

      scope.setSelectedItem = function(item) {
        ngModel.$setViewValue(item);
      };

      scope.clearSelectedItem = function($event) {
        $event.stopPropagation();
        ngModel.$setViewValue();
      };

      scope.setOpen = function(isOpen) {
        scope.isOpen = isOpen;
      };

      if (typeof scope.placeholder !== 'string') {
        translate.async('components.dropdown.placeholder.noSelection')
          .then(function(value) {
            setPlaceholder('placeholder', scope, selectedScope, value);
          });
      } else {
        setPlaceholder('placeholder', scope, selectedScope, scope.placeholder);
      }

      if (typeof scope.filterPlaceholder !== 'string') {
        translate.async('components.dropdown.placeholder.filter')
          .then(function(value) {
            setPlaceholder('filterPlaceholder', scope, menuScope, value);
          });
      } else {
        setPlaceholder('filterPlaceholder', scope, menuScope, scope.filterPlaceholder);
      }

      scope.$watch(function() {
        return ngModel.$viewValue;
      }, function(modelValue) {
        scope.selectedItem = modelValue;
        if (typeof selectedScope !== 'undefined') {
          selectedScope.selectedItem = modelValue;
        }
        scope.isOpen = false;
        if (typeof scope.onChange === 'function') {
          scope.onChange();
        }
      });

      selectedContentTemplate = dropdownTransformer.getSelected(selectedTemplate);
      if (typeof selectedTemplate !== 'undefined') {
        selectedScope.selectedItem = scope.selectedItem;
        selectedScope.textProperty = scope.textProperty;
        selectedScope.clearSelectedItem = scope.clearSelectedItem;
        selectedScope.setOpen = scope.setOpen;

        selectedElem = $compile(selectedContentTemplate)(selectedScope);
      } else {
        selectedElem = $compile(selectedContentTemplate)(scope);
      }
      elem.children(0).children(0).append(selectedElem);

      menuTemplate = dropdownTransformer.getMenu(optionTemplate);
      if (typeof optionTemplate !== 'undefined') {
        menuScope.items = scope.items;
        menuScope.textProperty = scope.textProperty;
        menuScope.setSelectedItem = scope.setSelectedItem;
        menuScope.hasFilter = scope.hasFilter;
        menuScope.filterProperty = scope.filterProperty;
        menuScope.setOpen = scope.setOpen;

        menuElem = $compile(menuTemplate)(menuScope);
      } else {
        menuElem = $compile(menuTemplate)(scope);
      }
      elem.children(0).append(menuElem);

    }
  };
};