'use strict';

/* @ngInject */
module.exports = function($log, $timeout) {
    return {
        restrict: 'E',
        scope: {
            itemId: '@',
            text: '@',
            status: '@'
        },
        replace: true,
        template: require('./templates/status-message-directive.tpl.html'),
        link: function(scope, element, attrs) {
            var defaultTimeout = 10000;
            var timer = null;
            
            if (scope.status == null || scope.status === "") {
                scope.status = 'success';
            }
            
            element.addClass(scope.status);
            
            scope.timeout = attrs.timeout == null ? defaultTimeout : window.parseInt(attrs.timeout, 10);
            if (isNaN(scope.timeout)) {
                scope.timeout = defaultTimeout;
            }
            
            scope.close = function(){
                scope.closing = true;
                $timeout(function(){
                    element.remove();
                }, 500);
            };
            
            element.on('$destroy', function() {
                scope.$emit('akam-status-message-destroyed', scope.itemId );
            });
            
            function enableTimer() {
                if (scope.timeout > 0) {
                    timer = $timeout(function() {
                        scope.close();
                    }, scope.timeout);
                }
            }
            
            function cancelTimer() {
                if (timer != null) {
                    $timeout.cancel(timer);
                    timer = null;
                }
            }
            
            element.on('mouseenter', function(){
                cancelTimer();
            });
            
            element.on('mouseleave', function(){
                enableTimer();
            });
            
            enableTimer();
        }
    };
};