'use strict';
var debounce = require('lodash/function/debounce');
var angular = require('angular');

/* @ngInject */
module.exports = function($timeout, $compile, $document) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      parentTree: '=',
      changeParent: '='
    },
    link: function(scope, element) {
      var template, parentSelector, triggerElement;

      scope.toggle = function() {
        scope.opened = !scope.opened;
        parentSelector.toggleClass('in', scope.opened);
        if (!scope.opened) {
          triggerElement.removeClass('opened');
          $document.unbind('click', documentClickBind);
        } else {
          triggerElement.addClass('opened');
          $document.bind('click', documentClickBind);
        }
      };
      scope.triggerParentChange = function(parent) {
        scope.toggle();
        scope.changeParent(parent, true);
      };
      scope.isOpen = function() {
        return scope.opened;
      };
      function hasParents() {
        return scope.parentTree.length > 0;
      }
      function documentClickBind(e) {
        if (scope.opened && e.currentTarget !== parentSelector[0]) {
          scope.toggle();
        }
      }
      function setCoords() {
        var triggerElementOffsetLeft = triggerElement[0].offsetLeft;
        var elementOffsetTop = triggerElement[0].offsetTop;
        var triggerElementHeight = triggerElement[0].offsetHeight;
        var arrowHeight = 10;
        var parentSelectorArrowOffset = 21;

        scope.parentSelectorLeft = triggerElementOffsetLeft - parentSelectorArrowOffset + 'px';
        scope.parentSelectorTop = elementOffsetTop + arrowHeight + triggerElementHeight + 'px';
        scope.arrowLeft = parentSelectorArrowOffset + 'px';
        scope.arrowTop = -arrowHeight + 'px';
      }

      scope.opened = false;
      template = require('./templates/tree-view-parent-selector.tpl.html');
      parentSelector = $compile(template)(scope, function(parentSelectorEle) {
        element.after(parentSelectorEle);
      });
      triggerElement = element;
      triggerElement.on('click', function(e) {
        if (hasParents()) {
          e.stopPropagation();
          scope.toggle();
          parentSelector.on('click', function(ev) {
            ev.stopPropagation();
          });
        }
      });
      angular.element(window).on('resize', debounce(setCoords, 200));
      $timeout(function() {
        setCoords();
      }, 0);
    }
  };
};