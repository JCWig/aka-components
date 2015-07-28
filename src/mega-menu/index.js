var angular = require('angular'),
  contextModule = require('../context'),
  dataService = require('./mega-menu-data-service'),
  header = require('./mega-menu-header-directive'),
  footer = require('./mega-menu-footer-directive');

function run($window, $location, context, LUNA_GROUP_QUERY_PARAM, LUNA_ASSET_QUERY_PARAM) {
  var qs = $location.search(), assetId;

  if (!context.isOtherContext()) {
    require('./utils/ga');
    context.account = context.getAccountFromCookie();
  }

  if (context.isGroupContext()) {
    if (!qs[LUNA_GROUP_QUERY_PARAM]) {
      throw Error('Required query param "' + LUNA_GROUP_QUERY_PARAM + '" missing from URL');
    } else {
      assetId = $window.parseInt(qs[LUNA_ASSET_QUERY_PARAM], 10);

      // set the property, which will implicitly set the group to the parent property for the group
      // this assumes that a property can only exist in one group. If that is not the case, then
      // the API will have to be adjusted to do lookups by both GID and AID.
      if (assetId) {
        context.property = assetId;
      } else {
        context.group = $window.parseInt(qs[LUNA_GROUP_QUERY_PARAM], 10);
      }
    }
  }
}
run.$inject = ['$window', '$location', 'context',
  'LUNA_GROUP_QUERY_PARAM', 'LUNA_ASSET_QUERY_PARAM'];

/**
 * @ngdoc module
 * @name akamai.components.mega-menu
 * @display Mega Menu
 * @requires akamai.components.context
 * @description a module for the old mega menu.
 */
module.exports = angular.module('akamai.components.mega-menu', [
  contextModule.name
])
/**
 * @ngdoc service
 * @name akamai.components.mega-menu.service:megaMenuData
 * @description Private service. Used to fetch data needed to render the mega menu
 * @private
 */
  .service('megaMenuData', dataService)

/**
 * @ngdoc directive
 * @name akamai.components.mega-menu.directive:akamMenuHeader
 * @restrict E
 * @description Renders the mega menu header
 */
  .directive('akamMenuHeader', header)

/**
 * @ngdoc directive
 * @name akamai.components.mega-menu.directive:akamMenuFooter
 * @restrict E
 * @description Renders the mega menu footer
 */
  .directive('akamMenuFooter', footer)

/**
 * Tries to read the AKALASTMANAGEDACCOUNT cookie and set it as the current account. Also throws
 * an error if this application is group aware but doesn't provide a GID in the route params.
 */
  .run(run);
