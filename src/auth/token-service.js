'use strict';

/* @ngInject */
module.exports = function(httpBuffer, $injector, $location, authConfig) {
  var pendingRequest = false;
  var $http;

  return {
    /**
     * @name create
     * @description attempt to create a new token if no token request is pending.
     *  If successful: trigger a retry of all deferred requests.
     *  Otherwise clear all pending requests and redirect to login page.
     */
    create: function() {
      if ( this.isPending() ) {
        return;
      }

      pendingRequest = true;
      $http = $http || $injector.get('$http');

      $http({
        url: authConfig.tokenUrl,
        data: 'client_id=' + authConfig.clientId + '&grant_type=password_assertion',
        method: 'POST',
        headers: {
          'Akamai-Accept': 'akamai/cookie',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(
        function() {
          pendingRequest = false;
          httpBuffer.retryAll();
        }
      ).error(
        function() {
          pendingRequest = false;
          httpBuffer.clear();
          $location.url(authConfig.lunaLogoutUrl);
        }
      );
    },
    /**
     * @name isPending
     * @description Determines if the token service is making a pending auth token request
     * @return {boolean} true if the token service is making a pending auth token request
     */
    isPending: function() {
      return pendingRequest;
    }
  };
};
