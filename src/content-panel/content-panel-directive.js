'use strict';

/* @ngInject */
module.exports = function($log) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      header: '@',
      isCollapsed: '=?',
      onToggle: '&?'
    },
    template: require('./templates/content-panel.tpl.html'),
    link: function(scope) {
      scope.isCollapsed = !!scope.isCollapsed;
      $log.log("blah");
      scope.$watch('isCollapsed', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          scope.onToggle({value: newValue});
        }
      });
    }
  };
};
