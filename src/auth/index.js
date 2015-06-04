'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.auth
 *
 * @description Provides an interceptor for failed requests for auth purposes
 *
 */
module.exports = angular.module('akamai.components.auth', [
  require('../utils').name
])
  .factory('akamAuthInterceptor', require('./auth-interceptor'))
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('akamAuthInterceptor');
  }]);