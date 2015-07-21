/*global angular, inject*/
'use strict';
var util = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

describe('akamai.components.dropdown', function() {
  var $scope, $compile, stateStrings, stateObjects, timeout;
  stateStrings = [
    'Colorado',
    'Connecticut',
    'Maryland',
    'Massachusetts'
  ];
  stateObjects = [
    {name: 'Colorado'},
    {name: 'Connecticut'},
    {name: 'Maryland'},
    {name: 'Massachusetts'}
  ];
  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/dropdown').name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($rootScope, _$compile_, $httpBackend, $timeout) {
      $scope = $rootScope;
      $compile = _$compile_;
 
      $httpBackend.when('GET', util.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', util.CONFIG_PATH).respond({});
      $httpBackend.flush();
      timeout = $timeout;
    });
  });
  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
    var remainingDropdown = document.querySelector('.dropdown-menu');
    if (remainingDropdown) {
      document.body.removeChild(remainingDropdown);
    }
  });
  function addElement(markup) {
    self.el = $compile(markup)($scope);
    $scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  }
  describe('given an empty object bound to the ng-model attribute', function(){
    describe('when the dropdown is rendered', function(){
      beforeEach(function(){
        $scope.selectedState = undefined;
        $scope.stateStrings = stateStrings;
        var dropdownTemplate = '<akam-dropdown ng-model="selectedState" items="stateStrings"></akam-dropdown>';
        addElement(dropdownTemplate);
      });
      it('should rendered with a placeholder string', function(){
        var dropdown = document.querySelector('.selected-option');
        expect(dropdown.textContent).toContain('Select one');
      });
    });
  });
  describe('given an empty object bound to the ng-model attribute', function(){
    describe('when the dropdown is rendered', function(){
      describe('and a string is to the placeholder attribute', function(){
        beforeEach(function(){
          $scope.selectedState = undefined;
          $scope.stateStrings = stateStrings;
          var dropdownTemplate = '<akam-dropdown ng-model="selectedState" placeholder="new placeholder" items="stateStrings"></akam-dropdown>';
          addElement(dropdownTemplate);
        });
        it('should render with a placeholder string', function(){
          var dropdown = document.querySelector('.selected-option');
          expect(dropdown.textContent).toContain('new placeholder');
        });
      });
    });
  });
  describe('given an object bound to the ng-model attribute', function(){
    describe('when the dropdown is rendered', function(){
      beforeEach(function(){
        $scope.selectedState = 'Colorado';
        $scope.stateStrings = stateStrings;
        var dropdownTemplate = '<akam-dropdown ng-model="selectedState" items="stateStrings"></akam-dropdown>';
        addElement(dropdownTemplate);
      });
      it('should render with that value selected', function(){
        var dropdown = document.querySelector('.selected-option');
        expect(dropdown.textContent).toContain('Colorado');
      });
    });
  });
  describe('given an array bound to the items attribute', function(){
    describe('when the dropdown is rendered', function(){
      beforeEach(function(){
        $scope.selectedState = 'Colorado';
        $scope.stateStrings = stateStrings;
        var dropdownTemplate = '<akam-dropdown ng-model="selectedState" items="stateStrings"></akam-dropdown>';
        addElement(dropdownTemplate);
        var dropdownToggle = util.find('.dropdown-toggle');
        util.click(dropdownToggle);
      });
      it('should add the items to the dropdown', function(){
        var dropdownMenu = util.find('.dropdown-menu');
        expect(dropdownMenu.getElementsByTagName('li').length).toBe(stateObjects.length);
      });
    });
  });
  describe('given a string bound to the text-property attribute', function(){
    describe('when the dropdown is rendered', function(){
      beforeEach(function(){
        $scope.selectedStateObj = {name: 'Colorado'};
        var dropdownTemplate = '<akam-dropdown ng-model="selectedStateObj" text-property="name" items="stateObjects"></akam-dropdown>';
        addElement(dropdownTemplate);
      });
      it('should display each items text-property value', function(){
        var dropdown = document.querySelector('.selected-option');
        expect(dropdown.textContent).toContain('Colorado');
      });
    });
  });
  describe('given no filterable attribute', function(){
    describe('when the dropdown is rendered', function(){
      beforeEach(function(){
        $scope.selectedState = 'Colorado';
        $scope.stateStrings = stateStrings;
        var dropdownTemplate = '<akam-dropdown ng-model="selectedState" items="stateStrings"></akam-dropdown>';
        addElement(dropdownTemplate);
      });
      it('should not show a filter box ', function(){
        var filterbox = document.querySelector('.fixed-header');
        expect(filterbox.classList).toContain('ng-hide');
      });
    });
  });
  describe('given a filtearble attribute', function(){
    describe('when the dropdown is rendered', function(){
      beforeEach(function(){
        $scope.selectedStateObj = {name: 'Colorado'};
        $scope.stateStringsObjs = stateObjects;
        var dropdownTemplate = '<akam-dropdown ng-model="selectedStateObj" filterable items="stateStringsObjs"></akam-dropdown>';
        addElement(dropdownTemplate);
      });
      it('should render a filterbox', function(){
        var filterbox = document.querySelector('.fixed-header input');
        expect(filterbox).not.toBe(null);
      });
    });
  });
  describe('given a filtearble attribute', function(){
    describe('and a filter-placeholder attribute is provided', function(){
      describe('when the dropdown is rendered', function(){
        beforeEach(function(){
          $scope.selectedStateObj = {name: 'Colorado'};
          $scope.stateStringsObjs = stateObjects;
          var dropdownTemplate = '<akam-dropdown ng-model="selectedStateObj" filter-placeholder="fplace" '+
            'filterable items="stateStringsObjs"></akam-dropdown>';
          addElement(dropdownTemplate);
        });
        it('should render a placeholder for the filterbox', function(){
          var filterbox = document.querySelector('.fixed-header input');
          expect(filterbox.placeholder).toContain('fplace');
        });
      });
    });
  });
  describe('given a clearable attribute', function(){
    describe('when the dropdown is rendered', function(){
      describe('and some item is selected', function(){
        beforeEach(function(){
          $scope.selectedStateObj = {name: 'Colorado'};
          $scope.stateStringsObjs = stateObjects;
          $scope.onChange = jasmine.createSpy('on-change-spy');
          var dropdownTemplate = '<akam-dropdown ng-model="selectedStateObj" clearable items="stateStringsObjs"></akam-dropdown>';
          addElement(dropdownTemplate);
        });
        it('should present a clear icon', function(){
          var icon = document.querySelector('.luna-small_close_dark_gray');
          expect(icon).not.toBe(null);
        });
      });
    });
  });

  describe('given an append-to-body attribute', function(){
    describe('when the dropdown is rendered', function(){
      beforeEach(function(){
        $scope.selectedStateObj = {name: 'Colorado'};
        $scope.stateStringsObjs = stateObjects;
        $scope.onChange = jasmine.createSpy('on-change-spy');
        var dropdownTemplate = '<akam-dropdown ng-model="selectedStateObj" append-to-body items="stateStringsObjs"></akam-dropdown>';
        addElement(dropdownTemplate);
        timeout.flush();
      });
      it('should append the dropdown to the body', function(){
        var dropdownMenuNormal =  document.querySelector('.dropdown').querySelector('.dropdown-menu');
        expect(dropdownMenuNormal).toBe(null);
        var dropdownMenuBody = util.find('body .dropdown-menu');
        expect(dropdownMenuBody).not.toBe(null);
      });
    });
  });
  describe('given an append-to-body attribute', function(){
    describe('and the dropdown is rendered', function(){
      describe('and a filterable attribute is present', function(){
        describe('and a filter box is clicked', function(){
          beforeEach(function(){
            $scope.selectedStateObj = {name: 'Colorado'};
            $scope.stateStringsObjs = stateObjects;
            $scope.onChange = jasmine.createSpy('on-change-spy');
            var dropdownTemplate = '<akam-dropdown ng-model="selectedStateObj" append-to-body items="stateStringsObjs"></akam-dropdown>';
            addElement(dropdownTemplate);
            timeout.flush();
            var dropdown = util.find('.dropdown');
            util.click('.dropdown-toggle');
            $scope.$digest();
            expect(dropdown.classList).toContain('open');
            var dropdownMenu = util.find('body .dropdown-menu');
            util.click(document.querySelectorAll('.dropdown-menu input')[0]);
            $scope.$digest();
          });
          it('should not close the dropdown', function(){
            var dropdown = util.find('.dropdown');
            expect(dropdown.classList).toContain('open');
          });
        });
      });
    });
  });
  describe('given custom markup in an akam-dropdown-option', function(){
    describe('when the dropdown is rendered', function(){
      beforeEach(function(){
        var featureDropdownTemplate =
          '<akam-dropdown ng-model="selectedState" text-property="name" items="stateObjects" clearable>' +
            '<akam-dropdown-selected>' +
              '<span class="selected-option util-ellipsis">' +
                '<span ng-if="selectedItem" title="{{selectedItem[textProperty]}}">custom: {{selectedItem[textProperty]}}</span>' +
                '<span ng-if="!selectedItem" class="dropdown-placeholder">{{::placeholder}}</span>' +
              '</span>' +
            '</akam-dropdown-selected>' +
            '<akam-dropdown-option>' +
              '<span title="{{item[textProperty]}}">custom: {{item[textProperty]}}</span>' +
            '</akam-dropdown-option>' +
          '</akam-dropdown>';
          $scope.selectedState = {name: 'Colorado'};
          $scope.stateObjects = stateObjects;

          addElement(featureDropdownTemplate);
      });
      it('should compile the markup with the parent scope', function(){
        var option = util.find('ul.dropdown-menu li span[title=Colorado]');
        expect(option.innerHTML).toBe('custom: Colorado');
      });
    });
  });
  describe('given custom markup in an akam-dropdown-selected', function(){
    describe('when the dropdown is rendered', function(){
      beforeEach(function(){
        var featureDropdownTemplate =
          '<akam-dropdown ng-model="selectedState" text-property="name" items="stateObjects" clearable>' +
            '<akam-dropdown-selected>' +
              '<span class="selected-option util-ellipsis">' +
                '<span ng-if="selectedItem" title="{{selectedItem[textProperty]}}">custom: {{selectedItem[textProperty]}}</span>' +
                '<span ng-if="!selectedItem" class="dropdown-placeholder">{{::placeholder}}</span>' +
              '</span>' +
            '</akam-dropdown-selected>' +
            '<akam-dropdown-option>' +
              '<span title="{{item[textProperty]}}">custom: {{item[textProperty]}}</span>' +
            '</akam-dropdown-option>' +
          '</akam-dropdown>';
          $scope.selectedState = {name: 'Colorado'};
          $scope.stateObjects = stateObjects;
          addElement(featureDropdownTemplate);
      });
      it('should compile the markup with the parent scope', function(){
        var selected = util.find('span.selected-option');
        expect(selected.children[0].innerHTML).toBe('custom: Colorado');
      });
    });
  });
  describe('given a callback function bound to the on-change attribute', function(){
    describe('when some item is selected in the dropdown', function(){
      beforeEach(function(){
        $scope.selectedStateObj = {name: 'Colorado'};
        $scope.stateStringsObjs = stateObjects;
        $scope.onChange = jasmine.createSpy('on-change-spy');
        var dropdownTemplate = '<akam-dropdown ng-model="selectedStateObj" on-change="onChange(item)" items="stateStringsObjs"></akam-dropdown>';
        addElement(dropdownTemplate);
        var dropdownToggle = util.find('.dropdown-toggle');
        util.click(dropdownToggle);
        var dropdownMenu = util.find('.dropdown-menu');
        util.click(dropdownMenu.querySelectorAll('li')[3].querySelector('a'));
        $scope.$digest();
      });
      it('should invoke the callback with the bound ngModel as an argument', function(){
        expect($scope.onChange).toHaveBeenCalledWith($scope.stateStringsObjs[3]);
      });
    });
  });
  describe('given a clearable attribute on the akam-dropdown', function(){
    describe('when the dropdown is rendered', function(){
      describe('and some item is selected', function(){
        describe('and the clear icon is clicked', function(){
          beforeEach(function(){
            $scope.selectedStateObj = {name: 'Colorado'};
            $scope.stateStringsObjs = stateObjects;
            $scope.onChange = jasmine.createSpy('on-change-spy');
            var dropdownTemplate = '<akam-dropdown ng-model="selectedStateObj" clearable items="stateStringsObjs"></akam-dropdown>';
            addElement(dropdownTemplate);
            var icon = document.querySelector('.luna-small_close_dark_gray');
            util.click(icon);
            $scope.$digest();
          });
          it('should clear the selected item', function(){
            expect($scope.selectedStateObj).toBe(undefined);
          });
        });
      });
    });
  });
  describe('given no string bound to the filterable attribute', function(){
    describe('when some text is added to the filterbox', function(){
      beforeEach(function(){
        $scope.selectedState = 'Colorado';
        $scope.stateStrings = stateStrings;
        var dropdownTemplate = '<akam-dropdown ng-model="selectedState" filterable items="stateStrings"></akam-dropdown>';
        addElement(dropdownTemplate);
        var filterbox = document.querySelector('.fixed-header').querySelectorAll('input')[0];
        var ngModel = angular.element(filterbox).controller('ngModel');
        ngModel.$setViewValue('Ma');
        $scope.$digest();
      });
      it('should filter the dropdown by strings', function(){
        var dropdownMenu = util.find('.dropdown-menu');
        expect(dropdownMenu.getElementsByTagName('li').length).toBe(2);
      });
    });
  });
  describe('given some string bound to the filterable attribute', function(){
    describe('when some text is added to the filterbox', function(){
      beforeEach(function(){
        $scope.selectedStateObj = {name: 'Colorado'};
        $scope.stateStringsObjs = stateObjects;
        var dropdownTemplate = '<akam-dropdown ng-model="selectedStateObj" filterable items="stateStringsObjs"></akam-dropdown>';
        addElement(dropdownTemplate);
        var filterbox = document.querySelector('.fixed-header').querySelectorAll('input')[0];
        var ngModel = angular.element(filterbox).controller('ngModel');
        ngModel.$setViewValue('Ma');
        $scope.$digest();
      });
      it('should filter the dropdown by given string property value', function(){
        var dropdownMenu = util.find('.dropdown-menu');
        expect(dropdownMenu.getElementsByTagName('li').length).toBe(2);
      });
    });
  });
});








