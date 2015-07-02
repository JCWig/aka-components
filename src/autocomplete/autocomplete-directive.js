'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function(translate, uuid, $q, $log, $templateCache) {

  var consts = {
    ITEM_TEMPLATE_URL_PARTIAL: './templates/',
    DEFAULT_TEMPLATE_NAME: 'autocomplete-item.tpl.html',
    CUSTOM_CONTENT: 'akam-autocomplete-item',
    SEARCH_MINIMUM: 1
  };

  function setTemplate(transcludeFn, ctrl) {
    var itemContentHtml, itemContent, html,
      c = ctrl,
      contentUrl = consts.ITEM_TEMPLATE_URL_PARTIAL + consts.DEFAULT_TEMPLATE_NAME;

    transcludeFn(function(clone) {
      if (clone.length && clone[1]) {
        itemContent = clone[1];
        html = itemContent.innerHTML.trim();

        if (angular.lowercase(itemContent.tagName) === consts.CUSTOM_CONTENT && html.length) {
          //use this unique file name to avoid same file name conflict in the cache
          contentUrl = consts.ITEM_TEMPLATE_URL_PARTIAL + c.autocompleteId + '.html';
          itemContentHtml = html;
        } else {
          itemContentHtml = require('./templates/autocomplete-item.tpl.html');
        }
      } else {
        itemContentHtml = require('./templates/autocomplete-item.tpl.html');
      }
    });
    $templateCache.put(contentUrl, itemContentHtml);
    c.contentTemplateUrl = contentUrl;
  }

  function buildStaticQuery(ctrl) {
    var itemAsText = 'item';

    if (ctrl.textProperty) {
      itemAsText = 'item.selectedText';
    }
    ctrl.query = 'item as ' + itemAsText + ' for item in ac.searchMatches($viewValue)';
  }

  /* @ngInject */
  function AutocompleteController($scope, $element, $attrs, $transclude) {

    //adjust values for $scope vars
    this.isOpen = false;
    this.autocompleteId = 'akam-autocomplete-' + $scope.$id + '-' + uuid.guid();
    this.searchLength = this.minimumSearch || consts.SEARCH_MINIMUM;
    this.placeholder = this.placeholder || '';

    if (angular.isDefined($attrs.textProperty) && $attrs.textProperty.length > 0) {
      this.textProperties = this.textProperty.split(' ');
    }

    translate.async('components.autocomplete.search-tip')
      .then(function(value) {
        $scope.ac.searchTip = value;
      });

    //$scope methods mapping
    this.searchMatches = searchMatches;
    this.selectItem = selectItem;
    this.clearSelected = clearSelected;

    setTemplate($transclude, this);
    buildStaticQuery(this);

    /**
     * searchMatches a scope method gegts called from typeahead for async searching
     * @param  {String} term User typed character
     * @return {Object} return Promise object
     */
    function searchMatches(term) {
      var ctrl = $scope.ac,
        deferred = $q.defer();

      if (term.length < ctrl.searchLength) {
        return deferred.resolve([]);
      }

      if (!angular.isFunction(ctrl.onSearch) || !$attrs.onSearch) {
        $log.error('onSearch function is required to make asynchronous calls.');
        return deferred.reject();
      }

      return new Promise(function(resolve, reject) {
        var asyncSearch = ctrl.onSearch({
          term: term
        });

        $q.when(asyncSearch)
          .then(function(raw) {
            resolve(angular.bind(ctrl, normalizeData(raw)));
          })
          .catch(function(reason) {
            ctrl.items = [];
            $log.error('onSearch call to the server return error: ' + reason.message);
            reject();
          });
      });
    }

    /**
     * normalizeData a provate function to massage the returned data
     * we could do something about raw data, like filtering, update open class, turn off loading...
     * @param  {Array} rawData data return from server
     * @return {Array} modified data
     */
    function normalizeData(rawData) {
      var data = rawData,
        hasData = false,
        names = [], ctrl = $scope.ac;

      if (angular.isArray(data)) {
        hasData = data.length > 0;
      } else if (angular.isObject(data) || angular.isString(data) && data.length) {
        data = [data];
        hasData = true;
      } else {
        data = [];
      }

      $scope.ac.isOpen = hasData;
      //hide loading

      //add new property to be used as display text
      angular.forEach(data, function(item) {
        angular.forEach(ctrl.textProperties, function(name, i) {
          names.push(item[name]);
          if (ctrl.textProperties.length - 1 === i) {
            item.selectedText = names.join(' ');//to be displayed
            names = [];
          }
        });
      });
      return data;
    }

    /**
     * selectItem a scope method, it will gets call from typeahead,
     * then it will callback to parent in passing selected item
     * @param  {String|Object} item string or object user selected
     * @param  {Object} model object user selected
     * @param  {String} label string user selected and displayed
     */
    function selectItem(item, model, label) {
      $scope.setViewValue(item);

      this.isOpen = false;

      if (angular.isFunction(this.onSelect) && $attrs.onSelect) {
        this.onSelect({
          item: item,
          displayText: label
        });
      }
    }

    /**
     * clearSelected a scope method triggered from user click close icon
     */
    function clearSelected() {
      this.selectedItem = '';
      this.items = [];
      this.isOpen = false;
    }
  }

  /* @ngInject */
  function linkFn(scope, elem, attrs, ngModel) {

    scope.setViewValue = function(value) {
      ngModel.$setViewValue(value);
    };

    ngModel.$render = function() {
      scope.ac.selectedItem = ngModel.$modelValue;
    };
  }

  return {
    restrict: 'E',
    transclude: true,
    require: '^ngModel',
    controller: AutocompleteController,
    controllerAs: 'ac',
    bindToController: {
      items: '=',
      onSelect: '&?',
      onSearch: '&',
      textProperty: '@?',
      placeholder: '@?',
      minimumSearch: '=?',
      isDisabled: '=?'
    },
    scope: {},
    template: require('./templates/autocomplete.tpl.html'),
    link: linkFn
  };
};
