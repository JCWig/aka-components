'use strict';

var utils = require('../utilities');

describe('akamai.components.spinner', function() {
  var scope, self, compile;
  var UP_BUTTON = '.akam-spinner button:first-child';
  var DOWN_BUTTON = '.akam-spinner button:last-child';

  beforeEach(function() { //Will run before each complete block
    self = this;
    angular.mock.module(require('../../src/spinner').name);
    inject(function($rootScope, _$compile_) {
      //Include Services, Factories and Constants
      scope = $rootScope.$new(); //angular service
      compile = _$compile_;
    });
    scope.testData = {
      value: "",
      min: 0,
      max: 50,
      label: 'my spinner',
      disabled: 'disabled'
    };
  });
  afterEach(function() { //Will run after each it block is completed
    removeElement();
  });

  function removeElement() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  }

  function addElement(markup) {
    self.el = compile(markup)(scope);
    scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  };
  describe('when rendering directive without options values', function() {
    var spinnerElem;
    beforeEach(function() { //Will run after the overall beforeEach but before each it statement in this describe block
      var markup = '<akam-spinner ng-model="value"></akam-spinner>';
      scope.value = scope.testData.value;
      addElement(markup);
      spinnerElem = document.querySelector('.akam-spinner');
    });

    afterEach(function() { //Will run after each it block is completed
      removeElement();
    });

    it('should verify initial input element value of 0', function() {
      var inputElem = spinnerElem.querySelector('input');
      expect(inputElem.value).toEqual('0');
    });

    it('should verify initial label element value to be empty', function() {
      var labelElem = spinnerElem.querySelector('label');
      expect(labelElem.textContent).toBe('');
    });

    it('should verify two button elements', function() {
      var buttonListNode = spinnerElem.querySelectorAll('button');
      expect(buttonListNode.length).toEqual(2);
    });

    it('should verify up button icon', function() {
      var buttonListNode = spinnerElem.querySelectorAll('button');
      var buttonElem = buttonListNode[0].querySelector("i");
      expect(buttonElem.classList.contains('luna-arrow_smUp')).toBe(true);
    });

    it('should verify down button icon', function() {
      var buttonListNode = spinnerElem.querySelectorAll('button');
      var buttonElem = buttonListNode[1].querySelector("i");
      expect(buttonElem.classList.contains('luna-arrow_smDown')).toBe(true);
    });

  });

  describe('when rendering directive with options values', function() {
    var spinnerElem;
    beforeEach(function() { //Will run after the overall beforeEach but before each it statement in this describe block
      var markup = '<akam-spinner ng-model="value" min="min" max="max" label="{{label}}" disabled="{{disabled}}"></akam-spinner>';
      scope.value = 2;
      scope.min = scope.testData.min;
      scope.max = scope.testData.max;
      scope.disabled = scope.testData.disabled;
      scope.label = scope.testData.label;

      addElement(markup);
      spinnerElem = document.querySelector('.akam-spinner');
    });

    afterEach(function() { //Will run after each it block is completed
      removeElement();
    });

    it('should verify input element correct value', function() {
      var inputElem = spinnerElem.querySelector('input');
      expect(inputElem.value).toEqual('2');
    });

    it('should verify label element correct value ', function() {
      var labelElem = spinnerElem.querySelector('label');
      expect(labelElem.textContent).toBe('my spinner');
    });
  });

  describe('when rendered', function() {
    var spinnerElem;
    beforeEach(function() { //Will run after the overall beforeEach but before each it statement in this describe block
      var markup = '<akam-spinner ng-model="value"></akam-spinner>';
      scope.value = scope.testData.value;
      addElement(markup);
      spinnerElem = document.querySelector('.akam-spinner');
    });
    afterEach(function() { //Will run after each it block is completed
      removeElement();
    });

    it('should input field take numeric values only', function() {

    });

    it('should input field keydown event up key incremental by 1', function() {

    });

    it('should input field field keydown event down key decremental by 1', function() {

    });

    it('should verify input field change event triggered', function() {

    });

    it('should input field restrained by min value', function() {

    });

    it('should input field restrained by max value', function() {

    });



  });

});
