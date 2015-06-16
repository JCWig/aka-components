'use strict';
var angular = require('angular');

require('../../node_modules/angular-ui-utils/modules/highlight/highlight.js');

/**
 * @ngdoc overview
 *
 * @name akamai.components.dropdown
 *
 * @description Provides a directive that creates a Luna- and
 * Pulsar-compatible dropdown control.
 */
module.exports = angular.module('akamai.components.dropdown', [
  require('angular-bootstrap-npm'),
  'ngSanitize',
  'ui.highlight',
  require('../i18n').name
])
  .service('dropdownTransformer', require('./dropdown-transformer'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.dropdown.directive:akamDropdown
 *
 * @description Creates a dropdown control
 *
 * @restrict E
 *
 * @param {Boolean} ngModel The dropdown's state
 *
 * @param {Object[]|String[]} items Option objects for the options displayed
 * in the dropdown's menu box
 *
 * @param {String} [textProperty] If the options param is an array of Objects,
 * this is the property of those objects used in the dropdown menu
 *
 * @param {String} [placeholder=Select one] The placeholder text for the dropdown
 *
 * @param {String} [filterPlaceholder=Filter] The placeholder text for the filter field
 *
 * @param {Function} [onChange] A callback function that is executed when the
 * state of the dopdown changes
 */
  .directive('akamDropdown', require('./dropdown-directive'));